/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FamilyMember } from '../types';

interface MemberNodeCardProps {
  member: FamilyMember;
  isSelected: boolean;
  isSearchMatch: boolean;
  onSelect: (id: string) => void;
  isLit: boolean;
}

export default function MemberNodeCard({
  member,
  isSelected,
  isSearchMatch,
  onSelect,
  isLit,
}: MemberNodeCardProps) {
  if (!member) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(member.id);
      }}
      className={`member-card w-40 shrink-0 p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative select-none print:border-stone-800 print:bg-white print:text-black print:break-inside-avoid ${
        isSelected
          ? 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-500 shadow-[0_6px_20px_rgba(245,158,11,0.3)] scale-105 z-10 print:border-black print:shadow-none'
          : isSearchMatch
            ? 'bg-rose-50 border-rose-400 shadow-[0_0_12px_rgba(159,18,57,0.2)] animate-pulse'
            : member.gender === 'male'
              ? 'bg-white hover:bg-sky-50/50 border-sky-100 hover:border-sky-300 shadow-sm'
              : 'bg-white hover:bg-rose-50/50 border-rose-100 hover:border-rose-300 shadow-sm'
      }`}
    >
      {/* Candle Flame animation indicator overlay */}
      {isLit && member.isDeceased && (
        <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse shadow-sm font-bold print:hidden flex items-center gap-0.5">
          🕯️ Nến sáng
        </span>
      )}

      {/* Avatar node layout */}
      <div className="flex items-center space-x-2.5">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold print:border print:border-stone-800 print:bg-white print:text-black ${
            member.gender === 'male' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
          } shrink-0 overflow-hidden relative`}
        >
          {member.name.split(' ').pop()?.substring(0, 1)}
          {member.isDeceased && (
            <div className="absolute inset-0 bg-stone-900/40 print:bg-transparent print:text-black flex items-center justify-center text-[10px] text-amber-200">
              ✝
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-black text-stone-900 print:text-black truncate">
            {member.name}
          </h4>
          <span className="text-[10px] text-stone-500 print:text-stone-800 font-bold truncate block">
            {member.title || 'Thành viên'}
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-stone-100 print:border-stone-800 flex items-center justify-between text-[10px] text-stone-400 print:text-stone-800 font-bold">
        <span>Đời F{member.generation}</span>
        <span className="text-stone-500 print:text-stone-800">
          {member.birthYear || '?'}-{member.isDeceased ? (member.deathYear || '✝') : 'Nay'}
        </span>
      </div>
    </div>
  );
}
