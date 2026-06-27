/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FamilyMember } from '../../types';

interface DirectoryTabProps {
  members: FamilyMember[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  generationFilter: string;
  setGenerationFilter: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onViewInTree: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DirectoryTab({
  members,
  selectedId,
  onSelect,
  searchQuery,
  generationFilter,
  setGenerationFilter,
  genderFilter,
  setGenderFilter,
  statusFilter,
  setStatusFilter,
  onViewInTree,
  onEdit,
  onDelete,
}: DirectoryTabProps) {
  // Compute directory filtered list
  const filteredList = members.filter((m) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(query) ||
      m.title.toLowerCase().includes(query) ||
      (m.birthPlace && m.birthPlace.toLowerCase().includes(query));

    const matchesGen = generationFilter === 'all' ? true : m.generation === parseInt(generationFilter);
    const matchesGender = genderFilter === 'all' ? true : m.gender === genderFilter;
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'living'
          ? !m.isDeceased
          : m.isDeceased;

    return matchesSearch && matchesGen && matchesGender && matchesStatus;
  });

  return (
    <div className="p-6 flex flex-col h-full overflow-y-auto print:overflow-visible">
      {/* Directory Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-stone-100 p-4 rounded-xl border border-stone-200 print:hidden">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">Thế Hệ</label>
          <select
            value={generationFilter}
            onChange={(e) => setGenerationFilter(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-rose-900 focus:outline-none font-bold"
          >
            <option value="all">Tất Cả Các Đời (I - IV)</option>
            <option value="1">Thế Hệ I (Thủy Tổ)</option>
            <option value="2">Thế Hệ II (Các Chi Ngành)</option>
            <option value="3">Thế Hệ III (Đời Con)</option>
            <option value="4">Thế Hệ IV (Đời Cháu Chắt)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">Giới Tính</label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-rose-900 focus:outline-none font-bold"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="male">Nam (Nội tộc)</option>
            <option value="female">Nữ (Dâu / Con gái)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">Trạng Thái</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-rose-900 focus:outline-none font-bold"
          >
            <option value="all">Mọi trạng thái</option>
            <option value="living">Còn sống</option>
            <option value="deceased">Đã tạ thế (Đã khuất)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setGenerationFilter('all');
              setGenderFilter('all');
              setStatusFilter('all');
            }}
            className="w-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs py-2 px-4 rounded-lg transition duration-200 border border-stone-300 cursor-pointer"
          >
            Xóa Bộ Lọc
          </button>
        </div>
      </div>

      {/* Table Data list */}
      <div className="flex-grow overflow-x-auto print:overflow-visible">
        <table className="min-w-full divide-y divide-stone-200 print:border-collapse print:w-full">
          <thead className="bg-stone-50 print:bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider print:border print:border-stone-800 print:text-black">
                Họ & Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider print:border print:border-stone-800 print:text-black">
                Thế Hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider print:border print:border-stone-800 print:text-black">
                Vai Vế / Danh Xưng
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider print:border print:border-stone-800 print:text-black">
                Sinh / Mất
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider print:border print:border-stone-800 print:text-black">
                Quê Quán / Nơi Sinh
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-stone-500 uppercase tracking-wider print:hidden">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-150 print:divide-stone-800">
            {filteredList.map((member) => (
              <tr
                key={member.id}
                className={`hover:bg-amber-50/40 cursor-pointer transition ${
                  selectedId === member.id ? 'bg-amber-50/70' : ''
                }`}
                onClick={() => onSelect(member.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap print:border print:border-stone-800">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-lg print:hidden ${
                        member.gender === 'male' ? 'text-sky-600' : 'text-rose-500'
                      }`}
                    >
                      {member.gender === 'male' ? '♂' : '♀'}
                    </span>
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-1.5 print:text-black">
                      {member.name}
                      {member.isDeceased && (
                        <span className="bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider print:border print:border-stone-800 print:bg-white print:text-black">
                          Đã khuất
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-bold print:border print:border-stone-800 print:text-black">
                  Đời Thứ {member.generation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900 font-black print:border print:border-stone-800 print:text-black">
                  {member.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-bold print:border print:border-stone-800 print:text-black">
                  {member.birthYear || '?'} – {member.isDeceased ? member.deathYear || 'Chưa rõ' : 'Nay'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 font-bold print:border print:border-stone-800 print:text-black">
                  {member.birthPlace || '—'}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2 print:hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onViewInTree(member.id)}
                    className="text-rose-900 hover:text-rose-800 font-bold cursor-pointer"
                  >
                    Xem Cây
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    onClick={() => onEdit(member.id)}
                    className="text-amber-800 hover:text-amber-700 font-bold cursor-pointer"
                  >
                    Sửa
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    onClick={() => onDelete(member.id)}
                    className="text-red-600 hover:text-red-500 font-bold cursor-pointer"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-stone-500 font-bold print:border print:border-stone-800"
                >
                  Không tìm thấy thành viên nào phù hợp với bộ lọc tìm kiếm hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
