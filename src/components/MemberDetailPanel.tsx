/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FamilyMember } from '../types';

interface MemberDetailPanelProps {
  member: FamilyMember | undefined;
  members: FamilyMember[];
  onSelect: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onAddDescendant: (parentId: string) => void;
}

export default function MemberDetailPanel({
  member,
  members,
  onSelect,
  onEdit,
  onDelete,
  onAddDescendant,
}: MemberDetailPanelProps) {
  if (!member) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-full">
        <svg className="w-12 h-12 text-stone-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p className="text-sm font-bold text-stone-500">Vui lòng chọn một thành viên trong phả phệ để xem chi tiết thông tin hồ sơ.</p>
      </div>
    );
  }

  const spouse = member.spouseId ? members.find((m) => m.id === member.spouseId) : null;
  const parent = member.parentId ? members.find((m) => m.id === member.parentId) : null;
  const children = members.filter((m) => m.parentId === member.id);

  // Lifespan calculation
  let ageString = '';
  if (member.birthYear) {
    const birth = parseInt(member.birthYear);
    if (member.isDeceased && member.deathYear) {
      const death = parseInt(member.deathYear);
      ageString = `Hưởng thọ ${death - birth} tuổi`;
    } else if (!member.isDeceased) {
      const currentYear = new Date().getFullYear();
      ageString = `${currentYear - birth} tuổi`;
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full sticky top-[140px] max-h-[calc(100vh-180px)] overflow-y-auto">
      <div>
        {/* Detail Header & Action shortcuts */}
        <div className="flex items-center justify-between border-b border-stone-150 pb-4 mb-5">
          <h3 className="font-bold text-stone-900 text-sm tracking-wide uppercase">Hồ Sơ Thành Viên</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="px-2.5 py-1 text-xs font-bold text-amber-850 hover:bg-amber-50 rounded-lg border border-amber-200 transition cursor-pointer"
            >
              Sửa
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition cursor-pointer"
            >
              Xóa
            </button>
          </div>
        </div>

        {/* Avatar & Core Title */}
        <div className="flex flex-col items-center text-center my-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner relative overflow-hidden border-2 ${
              member.gender === 'male'
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {member.name.split(' ').pop()?.substring(0, 1)}
            {member.isDeceased && (
              <div className="absolute inset-0 bg-stone-950/45 flex items-center justify-center">
                <span className="text-xs text-amber-200 font-bold tracking-wider">✝</span>
              </div>
            )}
          </div>
          <h2 className="text-lg font-black text-stone-900 mt-3">{member.name}</h2>
          <span className="bg-amber-100/85 text-amber-900 px-3 py-1 rounded-full text-xs font-black mt-2 border border-amber-300/40">
            {member.title || 'Thành viên'}
          </span>
          <p className="text-stone-500 text-xs mt-1 font-bold">
            Thế hệ thứ {member.generation} (Đời F{member.generation})
          </p>
        </div>

        {/* Dossier Grid */}
        <div className="space-y-3.5 my-6 text-sm">
          <div className="flex justify-between items-start border-b border-stone-100 pb-2">
            <span className="text-stone-400 font-bold">Trạng thái:</span>
            <span
              className={`font-black ${member.isDeceased ? 'text-stone-600' : 'text-emerald-600'}`}
            >
              {member.isDeceased ? 'Đã tạ thế (Đã khuất)' : 'Còn sống'}
            </span>
          </div>

          <div className="flex justify-between border-b border-stone-100 pb-2">
            <span className="text-stone-400 font-bold">Năm sinh:</span>
            <span className="font-bold text-stone-800">{member.birthYear || 'Chưa rõ'}</span>
          </div>

          {member.isDeceased && (
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400 font-bold">Năm mất:</span>
              <span className="font-bold text-stone-800">
                {member.deathYear || 'Chưa rõ'}{' '}
                {ageString && <span className="text-stone-500 font-medium">({ageString})</span>}
              </span>
            </div>
          )}

          {!member.isDeceased && ageString && (
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400 font-bold">Tuổi hiện tại:</span>
              <span className="font-bold text-stone-850">{ageString}</span>
            </div>
          )}

          <div className="flex justify-between items-start border-b border-stone-100 pb-2">
            <span className="text-stone-400 font-bold shrink-0">Nơi sinh / Quê quán:</span>
            <span className="font-bold text-stone-800 text-right">{member.birthPlace || '—'}</span>
          </div>

          {member.isDeceased && member.restingPlace && (
            <div className="flex flex-col border-b border-stone-100 pb-2">
              <span className="text-stone-400 font-bold">Nơi an nghỉ:</span>
              <span className="font-bold text-stone-800 text-xs mt-1 leading-relaxed bg-stone-50 p-2 rounded-lg border border-stone-100">
                {member.restingPlace}
              </span>
            </div>
          )}

          {/* Husband / Wife */}
          <div className="flex justify-between items-center border-b border-stone-100 pb-2">
            <span className="text-stone-400 font-bold">Hôn phối (Bạn đời):</span>
            <span className="font-bold text-stone-800">
              {spouse ? (
                <button
                  onClick={() => onSelect(spouse.id)}
                  className="text-rose-900 hover:underline font-black text-xs cursor-pointer"
                >
                  {spouse.name} ({spouse.title || 'Hôn phối'})
                </button>
              ) : (
                <span className="text-stone-400 italic font-normal">Chưa khai báo</span>
              )}
            </span>
          </div>

          {/* Father */}
          {parent && (
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-400 font-bold">Nội thân (Cha):</span>
              <span className="font-bold text-stone-800">
                <button
                  onClick={() => onSelect(parent.id)}
                  className="text-rose-900 hover:underline font-black text-xs cursor-pointer"
                >
                  {parent.name}
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Bio Text */}
        {member.bio && (
          <div className="mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-150">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">
              Ghi Chú Tiểu Sử / Công trạng
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed italic font-bold">
              "{member.bio}"
            </p>
          </div>
        )}

        {/* Descendants List */}
        {children.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-[10px] uppercase tracking-wider text-stone-400">
              Hậu duệ trực hệ (Con cái)
            </h4>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelect(child.id)}
                  className="bg-stone-50 hover:bg-amber-100/50 text-stone-850 text-xs py-1 px-2.5 rounded-lg border border-stone-200 transition font-black cursor-pointer truncate max-w-[150px]"
                >
                  {child.name} ({child.gender === 'male' ? 'Nam' : 'Nữ'})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Descendant Adding Shortcut */}
      <div className="mt-8 pt-4 border-t border-stone-150">
        <button
          onClick={() => onAddDescendant(member.id)}
          className="w-full bg-rose-950 hover:bg-rose-900 text-amber-100 font-black text-xs py-2.5 px-4 rounded-xl shadow-md transition duration-200 cursor-pointer"
        >
          + Thêm Hậu Duệ Trực Hệ
        </button>
      </div>
    </div>
  );
}
