/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { FamilyMember, TimelineEvent } from '../../types';

interface TimelineTabProps {
  members: FamilyMember[];
  onSelectMember: (id: string) => void;
  onViewInTree: (id: string) => void;
}

export default function TimelineTab({ members, onSelectMember, onViewInTree }: TimelineTabProps) {
  // Compute timeline events sorting chronologically
  const sortedEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    members.forEach((m) => {
      if (m.birthYear) {
        events.push({
          year: parseInt(m.birthYear),
          member: m,
          type: 'birth',
          text: `Cụ/Ông/Bà/Anh/Chị ${m.name} (${m.title || 'Thành viên'}) cất tiếng khóc chào đời tại ${
            m.birthPlace || 'đất mẹ dòng họ'
          }.`,
        });
      }
      if (m.isDeceased && m.deathYear) {
        events.push({
          year: parseInt(m.deathYear),
          member: m,
          type: 'death',
          text: `Cụ/Ông/Bà ${m.name} tạ thế về cõi vĩnh hằng, an táng tại ${
            m.restingPlace || 'Nghĩa trang dòng họ'
          }.`,
        });
      }
    });
    return events.sort((a, b) => a.year - b.year);
  }, [members]);

  return (
    <div className="p-6 overflow-y-auto max-h-[700px] print:overflow-visible">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-rose-950">BIÊN NIÊN SỬ GIA TỘC NGHIÊM GIA</h2>
        <p className="text-xs text-stone-500 mt-1 font-bold">
          Lịch trình ghi nhận sự kiện sinh tử của dòng họ được cập nhật tự động trường tồn
        </p>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 text-stone-400 font-bold">
          Không có dữ liệu biên niên sử để hiển thị. Vui lòng cập nhật năm sinh/năm mất của các thành viên.
        </div>
      ) : (
        /* Vertical timeline line */
        <div className="relative border-l-2 border-amber-600/40 ml-4 md:ml-32 py-4 space-y-8">
          {sortedEvents.map((ev, index) => (
            <div key={`${ev.member.id}-${ev.type}-${index}`} className="relative group">
              {/* Date badge on the left side of the vertical timeline */}
              <div className="absolute -left-[5.5rem] md:-left-[9rem] top-1.5 bg-rose-950 text-amber-100 text-xs font-bold px-3 py-1 rounded-lg border border-amber-500 shadow-md">
                Năm {ev.year}
              </div>

              {/* Bullet Node marker on line */}
              <div
                className={`absolute -left-2.5 top-2.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                  ev.type === 'birth' ? 'bg-emerald-500' : 'bg-stone-600'
                }`}
              >
                <span className="text-[9px] text-white font-bold">{ev.type === 'birth' ? '★' : '✝'}</span>
              </div>

              {/* Card content */}
              <div className="ml-6 md:ml-10 bg-stone-50 border border-stone-200 hover:border-amber-300 p-4 rounded-xl shadow-xs hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    {ev.member.name}
                    <span className="text-xs text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full font-black border border-amber-200">
                      {ev.member.title}
                    </span>
                  </h4>
                  <span className="text-xs text-stone-400 font-bold">Đời Thứ {ev.member.generation}</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed font-bold">{ev.text}</p>

                <div className="flex space-x-3 mt-3 pt-2 border-t border-stone-150">
                  <button
                    onClick={() => onSelectMember(ev.member.id)}
                    className="text-xs text-rose-900 hover:text-rose-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    Xem chi tiết →
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    onClick={() => onViewInTree(ev.member.id)}
                    className="text-xs text-stone-500 hover:text-stone-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    Xem trên phả hệ ➔
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
