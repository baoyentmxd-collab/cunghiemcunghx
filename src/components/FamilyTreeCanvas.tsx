/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FamilyMember } from '../types';
import MemberNodeCard from './MemberNodeCard';

interface FamilyTreeCanvasProps {
  members: FamilyMember[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  litCandles: { [key: string]: boolean };
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export default function FamilyTreeCanvas({
  members,
  selectedId,
  onSelect,
  searchQuery,
  litCandles,
  zoom,
  setZoom,
  pan,
  setPan,
}: FamilyTreeCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when clicking on a card or button
    if ((e.target as HTMLElement).closest('.member-card') || (e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.8));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Helper to check if a member matches the search query
  const isSearchMatch = (m: FamilyMember): boolean => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.title.toLowerCase().includes(query) ||
      (m.birthPlace && m.birthPlace.toLowerCase().includes(query)) ||
      false
    );
  };

  // Find root members of the tree (those who do not have a parentId in the system)
  // Or if their parentId is not in the list of members
  const rootMembers = members.filter((m) => {
    // Root descendant is someone who is a blood member (usually gender === 'male' for traditional patrilineal tree,
    // or simply has no parentId)
    const hasParentInList = m.parentId && members.some((p) => p.id === m.parentId);
    return !hasParentInList && m.generation === 1;
  });

  // If there are no members at generation 1, fall back to any member with no parentId
  const finalRoots = rootMembers.length > 0 
    ? rootMembers 
    : members.filter(m => !m.parentId || !members.some(p => p.id === m.parentId));

  // Recursive component to render a family node (blood descendant + spouse + children)
  const FamilyTreeNode = ({ memberId }: { memberId: string }) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return null;

    // Find spouse (if any)
    const spouse = member.spouseId ? members.find((m) => m.id === member.spouseId) : null;

    // Find children of this member
    // Traditional: children link to the blood parent's ID via parentId
    const children = members.filter((m) => m.parentId === member.id);

    return (
      <div className="flex flex-col items-center">
        {/* The Couple / Individual Node */}
        <div className="flex items-center justify-center relative">
          {spouse ? (
            <div className="flex items-center bg-stone-100/80 p-3 rounded-2xl border border-stone-200 shadow-xs">
              <MemberNodeCard
                member={member}
                isSelected={selectedId === member.id}
                isSearchMatch={isSearchMatch(member)}
                onSelect={onSelect}
                isLit={!!litCandles[member.id]}
              />
              <div className="w-6 h-0.5 bg-rose-900/60 flex items-center justify-center relative">
                <span className="text-[10px] text-rose-800 absolute -top-1.5 font-bold">♥</span>
              </div>
              <MemberNodeCard
                member={spouse}
                isSelected={selectedId === spouse.id}
                isSearchMatch={isSearchMatch(spouse)}
                onSelect={onSelect}
                isLit={!!litCandles[spouse.id]}
              />
            </div>
          ) : (
            <MemberNodeCard
              member={member}
              isSelected={selectedId === member.id}
              isSearchMatch={isSearchMatch(member)}
              onSelect={onSelect}
              isLit={!!litCandles[member.id]}
            />
          )}
        </div>

        {/* Children Render Branch */}
        {children.length > 0 && (
          <div className="flex flex-col items-center w-full">
            {/* Downward line from parents */}
            <div className="w-0.5 h-8 bg-stone-300"></div>

            {/* Horizontal spanning bar for multiple children */}
            <div className="flex gap-x-8 relative">
              {children.map((child, index) => {
                const isFirst = index === 0;
                const isLast = index === children.length - 1;

                return (
                  <div key={child.id} className="relative pt-8">
                    {/* Horizontal connection lines */}
                    {children.length > 1 && (
                      <div
                        className={`absolute top-0 h-0.5 bg-stone-300 ${
                          isFirst ? 'left-1/2 right-0' : isLast ? 'left-0 right-1/2' : 'left-0 right-0'
                        }`}
                      ></div>
                    )}
                    {/* Downward line into child */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-stone-300"></div>

                    {/* Recursive render */}
                    <FamilyTreeNode memberId={child.id} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex-grow flex flex-col relative bg-stone-50 select-none overflow-hidden min-h-[600px] h-full border border-stone-200 rounded-2xl print:bg-white print:overflow-visible print:border-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur border border-stone-200 p-2 rounded-xl shadow-lg flex items-center space-x-2 print:hidden">
        <button
          onClick={zoomIn}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 font-bold transition cursor-pointer"
          title="Phóng To"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 font-bold transition cursor-pointer"
          title="Thu Nhỏ"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={resetZoom}
          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-700 font-bold transition cursor-pointer text-xs"
        >
          Khôi Phục
        </button>
        <div className="h-5 w-px bg-stone-200 mx-1" />
        <span className="text-xs font-bold text-stone-500">
          Thu phóng: {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Manual Helper Info */}
      <div className="absolute top-4 right-4 z-10 bg-stone-900/80 text-amber-100 text-[10px] sm:text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 print:hidden">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-bold">Nhấn giữ chuột để dịch chuyển phả đồ • Chọn thành viên xem hồ sơ</span>
      </div>

      {/* Scalable Container */}
      <div className="flex-grow flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden relative print:overflow-visible print:block">
        <div
          className="absolute origin-center ease-out transition-transform duration-75 print:relative print:transform-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <div className="flex gap-x-20 py-12 px-16 items-start">
            {finalRoots.map((root) => (
              <div key={root.id} className="flex flex-col items-center">
                <span className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-4 bg-stone-200 px-3 py-1 rounded-full border border-stone-300">
                  Nhánh Khởi Tổ
                </span>
                <FamilyTreeNode memberId={root.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
