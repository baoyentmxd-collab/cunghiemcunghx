/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { FamilyMember, TributeMessage, AdminCredentials } from './types';
import { INITIAL_MEMBERS, INITIAL_TRIBUTES } from './data/initialData';
import { supabase } from './lib/supabaseClient';

// Modular component imports
import FamilyTreeCanvas from './components/FamilyTreeCanvas';
import MemberDetailPanel from './components/MemberDetailPanel';
import DirectoryTab from './components/Tabs/DirectoryTab';
import TimelineTab from './components/Tabs/TimelineTab';
import MemorialTab from './components/Tabs/MemorialTab';
import StatisticsTab from './components/Tabs/StatisticsTab';
import { MemberModals } from './components/Modals/MemberModals';
import { AdminModals } from './components/Modals/AdminModals';

// --- DATA TRANSFORM CONVERTERS FOR SUPABASE (snake_case to camelCase) ---
function dbRowToMember(row: any): FamilyMember {
  return {
    id: row.id,
    name: row.name,
    gender: row.gender,
    generation: row.generation,
    birthYear: row.birth_year,
    deathYear: row.death_year || undefined,
    isDeceased: row.is_deceased,
    spouseId: row.spouse_id || undefined,
    parentId: row.parent_id || undefined,
    childrenIds: Array.isArray(row.children_ids) ? row.children_ids : [],
    title: row.title,
    birthPlace: row.birth_place || undefined,
    restingPlace: row.resting_place || undefined,
    bio: row.bio || undefined,
  };
}

function memberToDbRow(member: FamilyMember) {
  return {
    id: member.id,
    name: member.name,
    gender: member.gender,
    generation: member.generation,
    birth_year: member.birthYear,
    death_year: member.deathYear || null,
    is_deceased: member.isDeceased,
    spouse_id: member.spouseId || null,
    parent_id: member.parentId || null,
    children_ids: member.childrenIds || [],
    title: member.title,
    birth_place: member.birthPlace || null,
    resting_place: member.restingPlace || null,
    bio: member.bio || null,
  };
}

function dbRowToTribute(row: any): TributeMessage {
  return {
    id: row.id,
    memberName: row.member_name,
    relation: row.relation,
    message: row.message,
    timestamp: row.timestamp || new Date().toISOString(),
  };
}

function tributeToDbRow(tribute: TributeMessage) {
  return {
    id: tribute.id,
    member_name: tribute.memberName,
    relation: tribute.relation,
    message: tribute.message,
    timestamp: tribute.timestamp,
  };
}

export default function App() {
  // --- DATABASE AND STATE ENGAGEMENT ---
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [tributes, setTributes] = useState<TributeMessage[]>([]);
  const [litCandles, setLitCandles] = useState<{ [key: string]: boolean }>({});
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>({ username: 'admin', password: '123' });
  const [selectedId, setSelectedId] = useState<string>('g1-p1');

  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseErrorMsg, setSupabaseErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>('tree'); // 'tree' | 'directory' | 'statistics' | 'timeline' | 'memorial'
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering lists state for Directory Tab
  const [generationFilter, setGenerationFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Zoomable & Pannable Tree Canvas state
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // --- ADMINISTRATION & AUTHENTICATION STATE ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const sessionActive = sessionStorage.getItem('is_admin_active_v2');
    return sessionActive === 'true';
  });

  // Modal triggers
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangeCredsModal, setShowChangeCredsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Parent ID pre-filling state when clicking "Add Descendant"
  const [prefilledParentId, setPrefilledParentId] = useState('');

  // Global toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);

  // --- INITIAL DATABASE LOAD AND SYNC FLOW ---
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 1. Fetch Members
        const { data: dbMembers, error: membersError } = await supabase
          .from('members')
          .select('*')
          .order('generation', { ascending: true });

        if (membersError) {
          throw membersError;
        }

        let loadedMembers: FamilyMember[] = [];
        if (dbMembers && dbMembers.length > 0) {
          loadedMembers = dbMembers.map(dbRowToMember);
        } else {
          // Empty DB, DO NOT auto-seed. Display only what's in database.
          loadedMembers = [];
        }

        // 2. Fetch Tributes
        const { data: dbTributes } = await supabase
          .from('tributes')
          .select('*')
          .order('timestamp', { ascending: false });

        let loadedTributes: TributeMessage[] = [];
        if (dbTributes && dbTributes.length > 0) {
          loadedTributes = dbTributes.map(dbRowToTribute);
        } else {
          loadedTributes = [];
        }

        // 3. Fetch Lit Candles
        const { data: dbCandles } = await supabase
          .from('lit_candles')
          .select('*');

        const loadedCandles: { [key: string]: boolean } = {};
        if (dbCandles) {
          dbCandles.forEach((row: any) => {
            loadedCandles[row.member_id] = row.lit;
          });
        }

        // 4. Fetch Admin Credentials
        const { data: adminSettings } = await supabase
          .from('admin_settings')
          .select('*')
          .eq('key', 'admin_creds')
          .maybeSingle();

        if (adminSettings && adminSettings.value) {
          setAdminCreds(adminSettings.value);
        } else {
          // Seed default admin creds
          const defaultCreds = { username: 'admin', password: '123' };
          await supabase.from('admin_settings').upsert({ key: 'admin_creds', value: defaultCreds });
          setAdminCreds(defaultCreds);
        }

        // Commit to state
        setMembers(loadedMembers);
        setTributes(loadedTributes);
        setLitCandles(loadedCandles);
        setIsSupabaseConnected(true);
        setSupabaseErrorMsg(null);

        // Set selectedId to Thủy Tổ or first member
        if (loadedMembers.length > 0) {
          const root = loadedMembers.find(m => m.id === 'g1-p1') || loadedMembers[0];
          setSelectedId(root.id);
        }

      } catch (error: any) {
        console.warn("Supabase connection failed, falling back to LocalStorage:", error);
        setIsSupabaseConnected(false);
        setSupabaseErrorMsg(error?.message || "Lỗi cấu hình / Chưa có bảng");

        // Fallback to LocalStorage
        const savedMembers = localStorage.getItem('gia_pha_data_v2');
        const fallbackMembers = savedMembers ? JSON.parse(savedMembers) : INITIAL_MEMBERS;
        setMembers(fallbackMembers);

        const savedTributes = localStorage.getItem('gia_pha_tributes');
        setTributes(savedTributes ? JSON.parse(savedTributes) : INITIAL_TRIBUTES);

        const savedCandles = localStorage.getItem('lit_candles_v2');
        setLitCandles(savedCandles ? JSON.parse(savedCandles) : {});

        const savedCreds = localStorage.getItem('gia_pha_admin_creds_v2');
        setAdminCreds(savedCreds ? JSON.parse(savedCreds) : { username: 'admin', password: '123' });

        if (fallbackMembers.length > 0) {
          const root = fallbackMembers.find((m: any) => m.id === 'g1-p1') || fallbackMembers[0];
          setSelectedId(root.id);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // --- MANUAL SEED FUNCTION ---
  const handleSeedSampleData = async () => {
    if (!checkAdminPermission("khởi tạo dữ liệu mẫu")) return;
    setIsLoading(true);
    try {
      if (isSupabaseConnected) {
        showNotification("Đang dọn dẹp bảng cũ...", "info");
        await supabase.from('members').delete().neq('id', 'dummy_non_existent');
        await supabase.from('tributes').delete().neq('id', 'dummy_non_existent');
        await supabase.from('lit_candles').delete().neq('member_id', 'dummy_non_existent');

        showNotification("Đang khởi tạo 19 thành viên lên Supabase...", "info");
        const dbRows = INITIAL_MEMBERS.map(memberToDbRow);
        const { error: seedError } = await supabase.from('members').insert(dbRows);
        if (seedError) throw seedError;

        showNotification("Đang khởi tạo lời tri ân mẫu lên Supabase...", "info");
        const tributeRows = INITIAL_TRIBUTES.map(tributeToDbRow);
        const { error: tributeError } = await supabase.from('tributes').insert(tributeRows);
        if (tributeError) throw tributeError;

        setMembers(INITIAL_MEMBERS);
        setTributes(INITIAL_TRIBUTES);
        setLitCandles({});
        setSelectedId('g1-p1');
        showNotification("Khởi tạo phả hệ Nghiêm Gia thành công lên Supabase!", "success");
      } else {
        setMembers(INITIAL_MEMBERS);
        setTributes(INITIAL_TRIBUTES);
        setLitCandles({});
        setSelectedId('g1-p1');
        showNotification("Khởi tạo phả hệ Nghiêm Gia offline thành công!", "success");
      }
    } catch (err: any) {
      console.error(err);
      showNotification("Lỗi khởi tạo dữ liệu mẫu: " + (err.message || err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOCAL CACHE SYNCS ---
  useEffect(() => {
    if (members.length > 0) {
      localStorage.setItem('gia_pha_data_v2', JSON.stringify(members));
    }
  }, [members]);

  useEffect(() => {
    if (tributes.length > 0) {
      localStorage.setItem('gia_pha_tributes', JSON.stringify(tributes));
    }
  }, [tributes]);

  useEffect(() => {
    localStorage.setItem('lit_candles_v2', JSON.stringify(litCandles));
  }, [litCandles]);

  useEffect(() => {
    localStorage.setItem('gia_pha_admin_creds_v2', JSON.stringify(adminCreds));
  }, [adminCreds]);

  const showNotification = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedId);
  }, [members, selectedId]);

  // Check admin guard helper before allowing edits
  const checkAdminPermission = (actionText = "thực hiện hành động này"): boolean => {
    if (!isAdminLoggedIn) {
      showNotification(`Yêu cầu quyền Quản Trị Viên để ${actionText}!`, 'warning');
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // --- EXPORT / IMPORT PROCEDURES ---
  const handleExportData = () => {
    if (!checkAdminPermission("xuất dữ liệu phả phệ")) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "gia_pha_nghiem_gia_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("Đã xuất bản sao lưu gia phả (.json) thành công!");
  };

  const handleExportWord = () => {
    if (!checkAdminPermission("xuất văn bản gia phả")) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Gia phả Nghiêm Gia</title><style>table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', serif; } th, td { border: 1px solid #000; padding: 10px; text-align: left; vertical-align: top; } th { background-color: #f5f5f5; }</style></head><body><h2 style='text-align: center; font-family: \"Times New Roman\", serif;'>DANH SÁCH THÀNH VIÊN GIA PHẢ NGHIÊM GIA</h2><p style='text-align: center;'>Ngày xuất bản: " + new Date().toLocaleDateString('vi-VN') + "</p>";
    const footer = "</body></html>";
    let tableHtml = "<table><tr><th>Họ và Tên</th><th>Thế hệ</th><th>Giới tính</th><th>Trạng thái</th><th>Năm sinh - Năm mất</th><th>Danh xưng / Vai vế</th><th>Tiểu sử / Ghi chú</th></tr>";

    members.forEach((m) => {
      tableHtml += `<tr><td><strong>${m.name}</strong></td><td>Đời thứ ${m.generation}</td><td>${m.gender === 'male' ? 'Nam' : 'Nữ'}</td><td>${m.isDeceased ? 'Đã mất' : 'Còn sống'}</td><td>${m.birthYear || '?'} - ${m.isDeceased ? m.deathYear || 'Chưa rõ' : 'Nay'}</td><td>${m.title}</td><td>${m.bio || ''}</td></tr>`;
    });

    tableHtml += "</table>";
    const sourceHTML = header + tableHtml + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'Gia_Pha_Nghiem_Gia.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);

    showNotification("Đã xuất tệp Word (.doc) thành công!");
    setShowExportMenu(false);
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAdminPermission("nhập dữ liệu phả phệ")) {
      e.target.value = '';
      return;
    }
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
          
          if (isSupabaseConnected) {
            showNotification("Đang dọn dẹp dữ liệu cũ trên Supabase...", "info");
            
            // Delete all old members
            const { error: clearError } = await supabase.from('members').delete().neq('id', 'dummy_nonexistent_id');
            if (clearError) {
              showNotification("Lỗi dọn dẹp dữ liệu cũ trên Supabase!", "error");
              console.error(clearError);
              return;
            }

            // Insert new ones
            showNotification("Đang tải dữ liệu gia phả mới lên Supabase...", "info");
            const dbRows = parsed.map(memberToDbRow);
            const { error: insertError } = await supabase.from('members').insert(dbRows);
            if (insertError) {
              showNotification("Lỗi đồng bộ dữ liệu nhập khẩu lên Supabase!", "error");
              console.error(insertError);
              return;
            }
          }

          setMembers(parsed);
          if (parsed.length > 0) {
            setSelectedId(parsed[0].id);
          }
          showNotification("Nhập dữ liệu gia phả thành công!", "success");
        } else {
          showNotification("Tệp tin sao lưu không đúng định dạng!", "error");
        }
      } catch (err) {
        showNotification("Có lỗi xảy ra khi phân tích tệp sao lưu!", "error");
      }
    };
    fileReader.readAsText(files[0]);
    e.target.value = '';
  };

  // --- CORE DATABASE UPDATE MUTATIONS ---
  const handleAddMember = async (newMemberData: Omit<FamilyMember, 'id' | 'childrenIds'>) => {
    const newId = `member-${Date.now()}`;
    const newMemberObj: FamilyMember = {
      ...newMemberData,
      id: newId,
      childrenIds: [],
    };

    let updatedList = [...members, newMemberObj];

    // Parent cascading update
    if (newMemberObj.parentId) {
      updatedList = updatedList.map((m) => {
        if (m.id === newMemberObj.parentId) {
          return { ...m, childrenIds: [...(m.childrenIds || []), newId] };
        }
        return m;
      });
    }

    // Spouse cascading update
    if (newMemberObj.spouseId) {
      updatedList = updatedList.map((m) => {
        if (m.id === newMemberObj.spouseId) {
          return { ...m, spouseId: newId };
        }
        return m;
      });
    }

    if (isSupabaseConnected) {
      const recordsToUpsert = [newMemberObj];
      if (newMemberObj.parentId) {
        const p = updatedList.find(m => m.id === newMemberObj.parentId);
        if (p) recordsToUpsert.push(p);
      }
      if (newMemberObj.spouseId) {
        const s = updatedList.find(m => m.id === newMemberObj.spouseId);
        if (s) recordsToUpsert.push(s);
      }

      try {
        const dbRows = recordsToUpsert.map(memberToDbRow);
        const { error } = await supabase.from('members').upsert(dbRows);
        if (error) {
          showNotification("Lỗi đồng bộ thành viên mới lên Supabase!", "error");
          console.error(error);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setMembers(updatedList);
    setSelectedId(newId);
    showNotification(`Đã khai báo thành công thành viên: ${newMemberObj.name}`);
  };

  const handleEditMember = async (updatedMember: FamilyMember) => {
    const oldMember = members.find(m => m.id === updatedMember.id);
    let updatedList = members.map((m) => (m.id === updatedMember.id ? updatedMember : m));

    const affectedIds = new Set<string>([updatedMember.id]);

    // Handle relations adjustments
    if (oldMember && oldMember.parentId !== updatedMember.parentId) {
      if (oldMember.parentId) {
        affectedIds.add(oldMember.parentId);
        updatedList = updatedList.map((m) => {
          if (m.id === oldMember.parentId) {
            return { ...m, childrenIds: (m.childrenIds || []).filter(cid => cid !== updatedMember.id) };
          }
          return m;
        });
      }
      if (updatedMember.parentId) {
        affectedIds.add(updatedMember.parentId);
        updatedList = updatedList.map((m) => {
          if (m.id === updatedMember.parentId) {
            return { ...m, childrenIds: [...(m.childrenIds || []), updatedMember.id] };
          }
          return m;
        });
      }
    }

    // If spouse was changed, handle reciprocation
    if (oldMember && oldMember.spouseId !== updatedMember.spouseId) {
      // Clear old spouse
      if (oldMember.spouseId) {
        affectedIds.add(oldMember.spouseId);
        updatedList = updatedList.map((m) => {
          if (m.id === oldMember.spouseId) {
            return { ...m, spouseId: undefined };
          }
          return m;
        });
      }
      // Associate new spouse
      if (updatedMember.spouseId) {
        affectedIds.add(updatedMember.spouseId);
        updatedList = updatedList.map((m) => {
          if (m.id === updatedMember.spouseId) {
            return { ...m, spouseId: updatedMember.id };
          }
          return m;
        });
      }
    }

    if (isSupabaseConnected) {
      const recordsToUpsert = updatedList.filter(m => affectedIds.has(m.id));
      try {
        const dbRows = recordsToUpsert.map(memberToDbRow);
        const { error } = await supabase.from('members').upsert(dbRows);
        if (error) {
          showNotification("Lỗi đồng bộ hồ sơ lên Supabase!", "error");
          console.error(error);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setMembers(updatedList);
    showNotification(`Đã cập nhật hồ sơ thành công cho: ${updatedMember.name}`);
  };

  const handleDeleteMember = async (id: string) => {
    if (!checkAdminPermission("xóa thành viên ra khỏi phả phệ")) return;

    if (id === 'g1-p1' || id === 'g1-p2') {
      showNotification("Không thể xóa Thủy Tổ cốt lõi của dòng họ!", "error");
      return;
    }

    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thành viên này và hủy bỏ các mối quan hệ liên kết liên quan?");
    if (!confirmDelete) return;

    let updatedList = members.filter((m) => m.id !== id);
    const affectedIds = new Set<string>();

    // Clean relations reference
    updatedList = updatedList.map((m) => {
      let changed = false;
      let newSpouseId = m.spouseId;
      let newParentId = m.parentId;
      let newChildrenIds = m.childrenIds || [];

      if (m.spouseId === id) {
        newSpouseId = undefined;
        changed = true;
      }
      if (m.parentId === id) {
        newParentId = undefined;
        changed = true;
      }
      if (newChildrenIds.includes(id)) {
        newChildrenIds = newChildrenIds.filter((cid) => cid !== id);
        changed = true;
      }

      if (changed) {
        affectedIds.add(m.id);
        return { ...m, spouseId: newSpouseId, parentId: newParentId, childrenIds: newChildrenIds };
      }
      return m;
    });

    if (isSupabaseConnected) {
      try {
        // Delete member row
        const { error: deleteError } = await supabase.from('members').delete().eq('id', id);
        if (deleteError) {
          showNotification("Lỗi xóa thành viên khỏi Supabase!", "error");
          console.error(deleteError);
          return;
        }

        // Delete from lit_candles if any
        await supabase.from('lit_candles').delete().eq('member_id', id);

        // Update affected relations
        if (affectedIds.size > 0) {
          const recordsToUpsert = updatedList.filter(m => affectedIds.has(m.id));
          const dbRows = recordsToUpsert.map(memberToDbRow);
          await supabase.from('members').upsert(dbRows);
        }
      } catch (err) {
        console.error(err);
      }
    }

    setMembers(updatedList);
    if (updatedList.length > 0) {
      setSelectedId(updatedList[0].id);
    }
    showNotification("Đã xóa thành viên ra khỏi hệ thống.", "warning");
  };

  // --- MEMORIAL HALL LIGHT TRIBUTES ---
  const handleToggleCandle = async (id: string) => {
    const isCurrentlyLit = !litCandles[id];
    setLitCandles((prev) => ({ ...prev, [id]: isCurrentlyLit }));
    
    if (isCurrentlyLit) {
      showNotification("Đã thắp nến thành kính kính viếng anh linh tiên tổ.", "success");
    }

    if (isSupabaseConnected) {
      try {
        await supabase
          .from('lit_candles')
          .upsert({ member_id: id, lit: isCurrentlyLit, updated_at: new Date().toISOString() });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddTribute = async (name: string, relation: string, message: string) => {
    const newTribute: TributeMessage = {
      id: `tribute-${Date.now()}`,
      memberName: name,
      relation: relation,
      message: message,
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConnected) {
      try {
        const { error } = await supabase.from('tributes').insert(tributeToDbRow(newTribute));
        if (error) {
          showNotification("Lỗi lưu lời tri ân lên Supabase!", "error");
          console.error(error);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setTributes((prev) => [newTribute, ...prev]);
    showNotification("Kính dâng lời tri ân thành công!", "success");
  };

  // --- AUTH ADMINISTRATION ACTIONS ---
  const handleAdminLogin = (user: string, pass: string): boolean => {
    if (user === adminCreds.username && pass === adminCreds.password) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('is_admin_active_v2', 'true');
      setShowLoginModal(false);
      showNotification("Đăng nhập quyền Quản trị viên thành công!", "success");
      return true;
    } else {
      showNotification("Sai tài khoản hoặc mật khẩu quản trị!", "error");
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('is_admin_active_v2');
    showNotification("Đã thoát chế độ Quản trị viên.", "info");
  };

  const handleChangeCreds = async (currentPass: string, newUser: string, newPass: string): Promise<boolean> => {
    if (currentPass !== adminCreds.password) {
      showNotification("Mật khẩu hiện tại không chính xác!", "error");
      return false;
    }
    if (!newUser.trim() || !newPass.trim()) {
      showNotification("Tên tài khoản hoặc mật khẩu mới không hợp lệ!", "error");
      return false;
    }
    
    const newCreds = { username: newUser, password: newPass };
    
    if (isSupabaseConnected) {
      try {
        const { error } = await supabase
          .from('admin_settings')
          .upsert({ key: 'admin_creds', value: newCreds, updated_at: new Date().toISOString() });
        if (error) {
          showNotification("Lỗi lưu mật khẩu mới lên Supabase!", "error");
          console.error(error);
          return false;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setAdminCreds(newCreds);
    setShowChangeCredsModal(false);
    showNotification("Đã thay đổi cấu hình đăng nhập hệ thống thành công!", "success");
    return true;
  };


  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-stone-50 z-50 flex flex-col items-center justify-center p-6 text-stone-850 select-none">
          <style>{`
            :root, body {
              font-family: "Times New Roman", Times, serif !important;
            }
          `}</style>
          <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl border border-amber-600/25 shadow-2xl space-y-6">
            <div className="relative flex justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-100 border-t-rose-900 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl">⛩️</span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase tracking-wider text-rose-950">PHẢ ĐỒ NGHIÊM GIA ĐẠI TỘC</h2>
              <p className="text-xs italic text-stone-500">"Mộc hữu bản, thủy hữu nguyên • Nhân hữu tổ, vạn vật tôn kính nguồn cội"</p>
            </div>
            <div className="pt-2 flex flex-col items-center space-y-2">
              <span className="text-xs text-stone-650 font-bold flex items-center space-x-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-850 animate-ping" />
                <span>Đang kết nối đồng bộ cơ sở dữ liệu dòng họ...</span>
              </span>
              <p className="text-[10px] text-stone-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col selection:bg-rose-900 selection:text-amber-100 print:bg-white print:text-black">
      {/* Global CSS configuration */}
      <style>{`
        :root, body, button, input, select, textarea, span, p, h1, h2, h3, h4, h5, h6, td, th {
          font-family: "Times New Roman", Times, serif !important;
        }

        @media print {
          @page { margin: 1.2cm; size: auto; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:overflow-visible { overflow: visible !important; }
        }
      `}</style>

      {/* --- NOTIFICATION TOAST BAR --- */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 transition-all duration-300 transform border print:hidden ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : toast.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : toast.type === 'info'
                  ? 'bg-blue-50 text-blue-900 border-blue-200'
                  : 'bg-rose-50 text-rose-950 border-rose-200'
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full animate-ping bg-current" />
          <span className="font-bold text-sm leading-none">{toast.message}</span>
        </div>
      )}

      {/* --- HEADER FOR PRINTING ONLY --- */}
      <div className="hidden print:block text-center pt-8 pb-4">
        <h1 className="text-3xl font-black uppercase tracking-wider mb-2">PHẢ ĐỒ GIA TỘC NGHIÊM GIA</h1>
        <p className="text-md italic text-stone-700">MỘC HỮU BẢN, THỦY HỮU NGUYÊN</p>
        <p className="text-xs text-stone-500">Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      {/* --- PREMIUM ROYAL HEADER --- */}
      <header className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-amber-100 shadow-xl border-b-2 border-amber-600/40 sticky top-0 z-30 print:hidden shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-amber-500/10 border-2 border-amber-500/60 rounded-xl shadow-inner flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                PHẢ ĐỒ NGHIÊM GIA ĐẠI TỘC
              </h1>
              <p className="text-[10px] sm:text-xs text-stone-300 font-bold">
                Hệ thống Số hóa & Lưu giữ Phả hệ Gia tộc Khoa học & Trường tồn
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Supabase connection status badge */}
            <div className="flex items-center space-x-2 mr-1">
              {isSupabaseConnected ? (
                <div className="flex items-center space-x-1.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Supabase Trực Tuyến</span>
                </div>
              ) : (
                <div 
                  className="flex items-center space-x-1.5 bg-amber-950/40 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-help"
                  title={`Đang chạy ngoại tuyến (LocalStorage). Bạn chưa chạy mã SQL trên Supabase hoặc lỗi cấu hình: ${supabaseErrorMsg || 'Không có bảng'}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Chế độ Ngoại Tuyến</span>
                </div>
              )}
            </div>

            {/* Admin status tag */}
            <div className="flex items-center space-x-2 mr-1">
              {isAdminLoggedIn ? (
                <div className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Quyền Quản Trị</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 bg-stone-900/40 text-stone-400 border border-stone-850 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <span>Chế độ: Xem và Đọc</span>
                </div>
              )}
            </div>

            {/* Export options */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!checkAdminPermission('xuất dữ liệu gia phả')) return;
                  setShowExportMenu(!showExportMenu);
                }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition border shadow-xs cursor-pointer ${
                  isAdminLoggedIn
                    ? 'bg-amber-600 hover:bg-amber-700 text-stone-950 border-amber-500/50'
                    : 'bg-stone-850 text-stone-500 border-stone-800 cursor-not-allowed'
                }`}
              >
                <span>Xuất Dữ Liệu</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showExportMenu && isAdminLoggedIn && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 py-1 overflow-hidden">
                    <button
                      onClick={handleExportWord}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-100 font-bold flex items-center gap-2"
                    >
                      <span>Xuất Văn Bản (.doc)</span>
                    </button>
                    <button
                      onClick={() => {
                        window.print();
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-100 font-bold flex items-center gap-2"
                    >
                      <span>In / Lưu PDF (.pdf)</span>
                    </button>
                    <div className="border-t border-stone-200 my-1"></div>
                    <button
                      onClick={handleExportData}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-100 font-bold flex items-center gap-2"
                    >
                      <span>Tải Bản Sao Lưu (.json)</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Import JSON Backup */}
            <label
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition border cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-stone-850 hover:bg-stone-800 text-amber-200 border-stone-750'
                  : 'bg-stone-900/40 text-stone-600 border-stone-900 cursor-not-allowed'
              }`}
            >
              <span>Nhập Bản Sao</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                disabled={!isAdminLoggedIn}
              />
            </label>

            {/* Admin control block */}
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowChangeCredsModal(true)}
                  className="p-1.5 bg-stone-850 hover:bg-stone-800 border border-stone-750 text-amber-200 rounded-lg transition"
                  title="Cấu hình đăng nhập"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-2.5 py-1.5 bg-rose-900 hover:bg-rose-850 text-white rounded-lg transition text-[11px] font-black uppercase tracking-wide border border-rose-800 cursor-pointer"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-stone-950 rounded-lg transition text-[11px] font-black uppercase tracking-wide border border-amber-400 cursor-pointer flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Quản Trị</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- QUICK ACTION SEARCH & TABS BAR --- */}
      <section className="bg-white border-b border-stone-200 shadow-xs sticky top-[62px] z-20 print:hidden shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <nav className="flex space-x-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'tree', label: 'Cây Gia Phả', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
              { id: 'directory', label: 'Thành Viên', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
              { id: 'timeline', label: 'Biên Niên Sử', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'memorial', label: 'Tưởng Nhớ & Thắp Hương', icon: 'M11.25 11.25a9 9 0 111.5 1.5' },
              { id: 'statistics', label: 'Thống Kê Dòng Họ', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-rose-900 text-amber-100 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-2 w-full lg:w-96 shrink-0">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên, vai vế, quê quán..."
                className="block w-full pl-9 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs bg-stone-50 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-900 font-bold"
              />
            </div>

            <button
              onClick={() => {
                if (!checkAdminPermission('thêm thành viên mới')) return;
                setPrefilledParentId('');
                setShowAddModal(true);
              }}
              className="flex items-center space-x-1 bg-rose-900 hover:bg-rose-800 text-white font-black text-xs py-2 px-3 rounded-lg border border-amber-600/30 shadow-sm cursor-pointer transition whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm Mới</span>
            </button>
          </div>
        </div>
      </section>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-grow max-w-[1500px] w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col xl:flex-row gap-6 items-stretch print:p-0 print:m-0 print:w-full print:block overflow-hidden">
        {/* LEFT WORKSPACE CARD VIEWPORTS */}
        <div className="flex-grow bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[500px] xl:min-h-[700px] print:shadow-none print:border-none print:min-h-0 print:block print:overflow-visible overflow-y-auto">
          {members.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-stone-50/30">
              <div className="max-w-md w-full p-8 bg-white border border-amber-600/20 rounded-2xl shadow-xl space-y-6">
                <div className="w-20 h-20 bg-amber-50 rounded-full border-2 border-amber-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner select-none">
                  ⛩️
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-rose-950 uppercase tracking-wide">CƠ SỞ DỮ LIỆU ĐANG TRỐNG</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isSupabaseConnected 
                      ? "Hệ thống đã kết nối trực tuyến thành công với Supabase, nhưng hiện chưa có thành viên nào trong cơ sở dữ liệu."
                      : "Không tìm thấy dữ liệu gia phả cục bộ."}
                  </p>
                  <p className="text-[11px] italic text-amber-800 bg-amber-50/50 border border-amber-200/50 px-3 py-2 rounded-lg font-medium leading-relaxed">
                    "Mộc hữu bản, thủy hữu nguyên • Nhân hữu tổ, vạn vật tôn kính nguồn cội"
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (!checkAdminPermission('thêm thành viên đầu tiên')) return;
                      setPrefilledParentId('');
                      setShowAddModal(true);
                    }}
                    className="w-full py-2.5 px-4 bg-rose-900 hover:bg-rose-800 text-white font-black text-xs rounded-lg transition shadow-md cursor-pointer flex items-center justify-center space-x-2 border border-rose-800"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Thêm Thành Viên Đầu Tiên</span>
                  </button>

                  <button
                    onClick={handleSeedSampleData}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-stone-950 font-black text-xs rounded-lg transition shadow-md cursor-pointer flex items-center justify-center space-x-2 border border-amber-500"
                  >
                    <svg className="w-4 h-4 text-stone-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Khởi Tạo Dữ Liệu Mẫu Nghiêm Gia</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'tree' && (
                <FamilyTreeCanvas
                  members={members}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  searchQuery={searchQuery}
                  litCandles={litCandles}
                  zoom={zoom}
                  setZoom={setZoom}
                  pan={pan}
                  setPan={setPan}
                />
              )}

              {activeTab === 'directory' && (
                <DirectoryTab
                  members={members}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  searchQuery={searchQuery}
                  generationFilter={generationFilter}
                  setGenerationFilter={setGenerationFilter}
                  genderFilter={genderFilter}
                  setGenderFilter={setGenderFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onViewInTree={(id) => {
                    setSelectedId(id);
                    setActiveTab('tree');
                  }}
                  onEdit={(id) => {
                    setSelectedId(id);
                    if (checkAdminPermission('sửa thông tin')) {
                      setShowEditModal(true);
                    }
                  }}
                  onDelete={handleDeleteMember}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineTab
                  members={members}
                  onSelectMember={setSelectedId}
                  onViewInTree={(id) => {
                    setSelectedId(id);
                    setActiveTab('tree');
                  }}
                />
              )}

              {activeTab === 'memorial' && (
                <MemorialTab
                  members={members}
                  litCandles={litCandles}
                  onToggleCandle={handleToggleCandle}
                  tributes={tributes}
                  onAddTribute={handleAddTribute}
                />
              )}

              {activeTab === 'statistics' && <StatisticsTab members={members} litCandles={litCandles} />}
            </>
          )}
        </div>

        {/* --- RIGHT SIDEBAR: MEMBER DETAILED PANEL --- */}
        {members.length > 0 && (
          <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-6 print:hidden">
            <MemberDetailPanel
              member={selectedMember}
              members={members}
              onSelect={setSelectedId}
              onEdit={() => {
                if (checkAdminPermission('sửa đổi hồ sơ')) {
                  setShowEditModal(true);
                }
              }}
              onDelete={handleDeleteMember}
              onAddDescendant={(parentId) => {
                if (checkAdminPermission('thêm hậu duệ')) {
                  setPrefilledParentId(parentId);
                  setShowAddModal(true);
                }
              }}
            />
          </aside>
        )}
      </main>

      {/* --- ALL FORM MODALS COMPONENT GATES --- */}
      <MemberModals
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedMember={selectedMember}
        members={members}
        onAddSubmit={handleAddMember}
        onEditSubmit={handleEditMember}
        prefilledParentId={prefilledParentId}
      />

      <AdminModals
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        showChangeCredsModal={showChangeCredsModal}
        setShowChangeCredsModal={setShowChangeCredsModal}
        adminCreds={adminCreds}
        onLoginSubmit={handleAdminLogin}
        onChangeCredsSubmit={handleChangeCreds}
      />

      {/* --- FOOTER GENERAL BRANDING --- */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t-2 border-amber-600/30 print:hidden shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="font-bold text-stone-300">
            "Mộc hữu bản, thủy hữu nguyên • Nhân hữu tổ, vạn vật tôn kính nguồn cội"
          </p>
          <p className="font-bold text-[11px]">
            © 2026 Nghiêm Gia Đại Tộc • Hệ thống Số hóa Phả hệ & Lưu truyền Ký ức Dòng họ Trường tồn • Thiết kế sang trọng chuyên nghiệp
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}
