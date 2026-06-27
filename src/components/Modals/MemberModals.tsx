/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { FamilyMember } from '../../types';

interface MemberModalsProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedMember: FamilyMember | undefined;
  members: FamilyMember[];
  onAddSubmit: (newMember: Omit<FamilyMember, 'id' | 'childrenIds'>) => void;
  onEditSubmit: (updatedMember: FamilyMember) => void;
  prefilledParentId: string;
}

export function MemberModals({
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  selectedMember,
  members,
  onAddSubmit,
  onEditSubmit,
  prefilledParentId,
}: MemberModalsProps) {
  // Add Member form state
  const [addName, setAddName] = useState('');
  const [addGender, setAddGender] = useState<'male' | 'female'>('male');
  const [addGeneration, setAddGeneration] = useState(4);
  const [addTitle, setAddTitle] = useState('');
  const [addBirthYear, setAddBirthYear] = useState('');
  const [addIsDeceased, setAddIsDeceased] = useState(false);
  const [addDeathYear, setAddDeathYear] = useState('');
  const [addBirthPlace, setAddBirthPlace] = useState('');
  const [addRestingPlace, setAddRestingPlace] = useState('');
  const [addParentId, setAddParentId] = useState('');
  const [addSpouseId, setAddSpouseId] = useState('');
  const [addBio, setAddBio] = useState('');

  // Edit Member form state
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female'>('male');
  const [editGeneration, setEditGeneration] = useState(4);
  const [editTitle, setEditTitle] = useState('');
  const [editBirthYear, setEditBirthYear] = useState('');
  const [editIsDeceased, setEditIsDeceased] = useState(false);
  const [editDeathYear, setEditDeathYear] = useState('');
  const [editBirthPlace, setEditBirthPlace] = useState('');
  const [editRestingPlace, setEditRestingPlace] = useState('');
  const [editParentId, setEditParentId] = useState('');
  const [editSpouseId, setEditSpouseId] = useState('');
  const [editBio, setEditBio] = useState('');

  // Reset Add state when prefilledParentId changes or modal opens
  useEffect(() => {
    if (showAddModal) {
      setAddName('');
      setAddGender('male');
      setAddTitle('');
      setAddBirthYear('');
      setAddIsDeceased(false);
      setAddDeathYear('');
      setAddBirthPlace('');
      setAddRestingPlace('');
      setAddBio('');
      setAddSpouseId('');
      
      if (prefilledParentId) {
        setAddParentId(prefilledParentId);
        // Automatically determine descendant generation based on parent
        const parentNode = members.find((m) => m.id === prefilledParentId);
        if (parentNode) {
          setAddGeneration(Math.min(parentNode.generation + 1, 4));
        }
      } else {
        setAddParentId('');
        setAddGeneration(4);
      }
    }
  }, [showAddModal, prefilledParentId, members]);

  // Sync edit state with currently selected member when edit modal opens
  useEffect(() => {
    if (showEditModal && selectedMember) {
      setEditName(selectedMember.name || '');
      setEditGender(selectedMember.gender || 'male');
      setEditGeneration(selectedMember.generation || 4);
      setEditTitle(selectedMember.title || '');
      setEditBirthYear(selectedMember.birthYear || '');
      setEditIsDeceased(selectedMember.isDeceased || false);
      setEditDeathYear(selectedMember.deathYear || '');
      setEditBirthPlace(selectedMember.birthPlace || '');
      setEditRestingPlace(selectedMember.restingPlace || '');
      setEditParentId(selectedMember.parentId || '');
      setEditSpouseId(selectedMember.spouseId || '');
      setEditBio(selectedMember.bio || '');
    }
  }, [showEditModal, selectedMember]);

  const handleAddSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    onAddSubmit({
      name: addName,
      gender: addGender,
      generation: addGeneration,
      title: addTitle || 'Thành viên',
      birthYear: addBirthYear,
      isDeceased: addIsDeceased,
      deathYear: addIsDeceased ? addDeathYear : '',
      birthPlace: addBirthPlace,
      restingPlace: addIsDeceased ? addRestingPlace : '',
      parentId: addParentId || undefined,
      spouseId: addSpouseId || undefined,
      bio: addBio,
    });
    setShowAddModal(false);
  };

  const handleEditSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !editName.trim()) return;

    onEditSubmit({
      ...selectedMember,
      name: editName,
      gender: editGender,
      generation: editGeneration,
      title: editTitle || 'Thành viên',
      birthYear: editBirthYear,
      isDeceased: editIsDeceased,
      deathYear: editIsDeceased ? editDeathYear : '',
      birthPlace: editBirthPlace,
      restingPlace: editIsDeceased ? editRestingPlace : '',
      parentId: editParentId || undefined,
      spouseId: editSpouseId || undefined,
      bio: editBio,
    });
    setShowEditModal(false);
  };

  return (
    <>
      {/* --- ADD NEW MEMBER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-amber-500/20 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-rose-950 to-rose-900 p-5 text-amber-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg">Khai Báo Thành Viên Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-amber-200 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmitForm} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Họ & Tên *</label>
                  <input
                    required
                    type="text"
                    placeholder="Nghiêm Đình..."
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Giới Tính *</label>
                  <select
                    value={addGender}
                    onChange={(e) => setAddGender(e.target.value as 'male' | 'female')}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-white"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                    Thế Hệ (F1 - F4) *
                  </label>
                  <select
                    value={addGeneration}
                    onChange={(e) => setAddGeneration(parseInt(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-white"
                  >
                    <option value={1}>Đời I (Cố / Tổ)</option>
                    <option value={2}>Đời II (Ông bà)</option>
                    <option value={3}>Đời III (Bố mẹ)</option>
                    <option value={4}>Đời IV (Con cháu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                    Vai Vế / Danh Xưng
                  </label>
                  <input
                    type="text"
                    placeholder="Trưởng nam, dâu thứ, cháu nội..."
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Năm Sinh</label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 1985"
                    value={addBirthYear}
                    onChange={(e) => setAddBirthYear(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Trạng thái sống</label>
                  <select
                    value={addIsDeceased ? 'true' : 'false'}
                    onChange={(e) => setAddIsDeceased(e.target.value === 'true')}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-white"
                  >
                    <option value="false">Còn sống</option>
                    <option value="true">Đã tạ thế (Đã khuất)</option>
                  </select>
                </div>
              </div>

              {addIsDeceased && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Năm Mất</label>
                    <input
                      type="number"
                      placeholder="Ví dụ: 2021"
                      value={addDeathYear}
                      onChange={(e) => setAddDeathYear(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nơi An Nghỉ</label>
                    <input
                      type="text"
                      placeholder="Nghĩa trang, Phú Thọ..."
                      value={addRestingPlace}
                      onChange={(e) => setAddRestingPlace(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nơi Sinh / Quê Quán</label>
                <input
                  type="text"
                  placeholder="Quận, Tỉnh/Thành phố..."
                  value={addBirthPlace}
                  onChange={(e) => setAddBirthPlace(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Chọn Cha (Nội Thân)</label>
                  <select
                    value={addParentId}
                    onChange={(e) => setAddParentId(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-stone-50"
                  >
                    <option value="">Không rõ hoặc nhánh ngoài</option>
                    {members
                      .filter((m) => m.gender === 'male')
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (Đời {m.generation})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Hôn Phối (Bạn Đời)</label>
                  <select
                    value={addSpouseId}
                    onChange={(e) => setAddSpouseId(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-stone-50"
                  >
                    <option value="">Chưa có / Chưa khai báo</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (Đời {m.generation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tiểu Sử / Công trạng</label>
                <textarea
                  rows={3}
                  placeholder="Học vị, cống hiến, huân chương, tính cách..."
                  value={addBio}
                  onChange={(e) => setAddBio(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-750 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  Lưu Thành Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MEMBER MODAL --- */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-amber-500/20 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-amber-950 to-amber-900 p-5 text-amber-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg">Cập Nhật Thông Tin Thành Viên</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-amber-200 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmitForm} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Họ & Tên *</label>
                  <input
                    required
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Giới Tính *</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as 'male' | 'female')}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-white"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                    Thế Hệ (F1 - F4) *
                  </label>
                  <select
                    value={editGeneration}
                    onChange={(e) => setEditGeneration(parseInt(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-white"
                  >
                    <option value={1}>Đời I (Cố / Tổ)</option>
                    <option value={2}>Đời II (Ông bà)</option>
                    <option value={3}>Đời III (Bố mẹ)</option>
                    <option value={4}>Đời IV (Con cháu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                    Vai Vế / Danh Xưng
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Năm Sinh</label>
                  <input
                    type="number"
                    value={editBirthYear}
                    onChange={(e) => setEditBirthYear(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Trạng thái sống</label>
                  <select
                    value={editIsDeceased ? 'true' : 'false'}
                    onChange={(e) => setEditIsDeceased(e.target.value === 'true')}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-white"
                  >
                    <option value="false">Còn sống</option>
                    <option value="true">Đã tạ thế (Đã khuất)</option>
                  </select>
                </div>
              </div>

              {editIsDeceased && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Năm Mất</label>
                    <input
                      type="number"
                      placeholder="Năm tạ thế..."
                      value={editDeathYear}
                      onChange={(e) => setEditDeathYear(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nơi An Nghỉ</label>
                    <input
                      type="text"
                      placeholder="An táng tại..."
                      value={editRestingPlace}
                      onChange={(e) => setEditRestingPlace(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nơi Sinh / Quê Quán</label>
                <input
                  type="text"
                  value={editBirthPlace}
                  onChange={(e) => setEditBirthPlace(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Chọn Cha (Nội Thân)</label>
                  <select
                    value={editParentId}
                    onChange={(e) => setEditParentId(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-stone-50"
                  >
                    <option value="">Không rõ hoặc nhánh ngoài</option>
                    {members
                      .filter((m) => m.gender === 'male' && m.id !== selectedMember.id)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (Đời {m.generation})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Hôn Phối (Bạn Đời)</label>
                  <select
                    value={editSpouseId}
                    onChange={(e) => setEditSpouseId(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none bg-stone-50"
                  >
                    <option value="">Chưa có / Chưa khai báo</option>
                    {members
                      .filter((m) => m.id !== selectedMember.id)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (Đời {m.generation})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tiểu Sử / Công trạng</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-150 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-750 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
