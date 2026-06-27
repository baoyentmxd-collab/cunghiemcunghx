/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { FamilyMember } from '../../types';

interface StatisticsTabProps {
  members: FamilyMember[];
  litCandles: { [key: string]: boolean };
}

export default function StatisticsTab({ members, litCandles }: StatisticsTabProps) {
  const stats = useMemo(() => {
    const total = members.length;
    const maleCount = members.filter((m) => m.gender === 'male').length;
    const femaleCount = members.filter((m) => m.gender === 'female').length;
    const livingCount = members.filter((m) => !m.isDeceased).length;
    const deceasedCount = total - livingCount;

    // Average lifespan of deceased members
    const deceasedWithAge = members.filter((m) => m.isDeceased && m.birthYear && m.deathYear);
    const averageLifespan =
      deceasedWithAge.length > 0
        ? Math.round(
            deceasedWithAge.reduce(
              (acc, curr) => acc + (parseInt(curr.deathYear!) - parseInt(curr.birthYear)),
              0
            ) / deceasedWithAge.length
          )
        : 'Chưa rõ';

    // Count per generation
    const genCounts: { [key: number]: number } = {};
    members.forEach((m) => {
      genCounts[m.generation] = (genCounts[m.generation] || 0) + 1;
    });

    // Count per birth place / province
    const locationCounts: { [key: string]: number } = {};
    members.forEach((m) => {
      if (m.birthPlace) {
        // Extract the main province (usually the last word or after a comma)
        const parts = m.birthPlace.split(',');
        const province = parts[parts.length - 1].trim();
        if (province) {
          locationCounts[province] = (locationCounts[province] || 0) + 1;
        }
      }
    });

    const locations = Object.entries(locationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 locations

    return {
      total,
      maleCount,
      femaleCount,
      livingCount,
      deceasedCount,
      averageLifespan,
      genCounts,
      locations,
    };
  }, [members]);

  return (
    <div className="p-6 overflow-y-auto print:overflow-visible">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-rose-950">BÁO CÁO THỐNG KÊ DÒNG TỘC</h2>
        <p className="text-xs text-stone-500 font-bold">
          Phân tích chuyên sâu dữ liệu cơ cấu, thế hệ và mật độ địa lý của dòng họ Nghiêm Gia
        </p>
      </div>

      {/* Stats Numerical Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-2xl">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block mb-1">
            Tuổi Thọ Trung Bình
          </span>
          <span className="text-2xl font-black text-rose-950 block">
            {stats.averageLifespan} {typeof stats.averageLifespan === 'number' ? 'Tuổi' : ''}
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block font-bold">
            Khảo sát trên các bậc tổ tiên đã tạ thế
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-1">
            Cơ cấu Nam / Nữ
          </span>
          <span className="text-2xl font-black text-emerald-950 block">
            {stats.maleCount} Nam / {stats.femaleCount} Nữ
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block font-bold">
            Tỷ lệ tương ứng {stats.total > 0 ? Math.round((stats.maleCount / stats.total) * 100) : 0}% và{' '}
            {stats.total > 0 ? Math.round((stats.femaleCount / stats.total) * 100) : 0}%
          </span>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-2xl">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wide block mb-1">
            Thế Hệ Phát Triển
          </span>
          <span className="text-2xl font-black text-blue-950 block">
            4 Thế Hệ (I - IV)
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block font-bold">
            Bắt đầu từ Cố Nghiêm Đình Bách (1895)
          </span>
        </div>

        <div className="bg-gradient-to-br from-stone-100 to-stone-200 border border-stone-300 p-5 rounded-2xl">
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wide block mb-1">
            Nến Tưởng Niệm Đang Sáng
          </span>
          <span className="text-2xl font-black text-stone-950 block">
            {Object.values(litCandles).filter(Boolean).length} Ngọn nến
          </span>
          <span className="text-[10px] text-stone-500 mt-1 block font-bold">
            Đang dâng lên thành kính các tiên tổ
          </span>
        </div>
      </div>

      {/* Graphic charts via Styled Divs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Chart 1: Members Count per Generation */}
        <div className="border border-stone-200 p-5 rounded-2xl bg-stone-50">
          <h4 className="font-bold text-stone-800 text-sm mb-4">Mật Độ Thành Viên Các Đời</h4>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((gen) => {
              const count = stats.genCounts[gen] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={gen} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Thế Hệ Đời Thứ {gen}</span>
                    <span className="text-stone-500">
                      {count} người ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-900 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Living vs Deceased breakdown */}
        <div className="border border-stone-200 p-5 rounded-2xl bg-stone-50 flex flex-col justify-between">
          <h4 className="font-bold text-stone-800 text-sm mb-4">Cơ Cấu Sinh Mệnh Dòng Họ</h4>

          <div className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600">{stats.livingCount}</div>
              <span className="text-xs font-bold text-stone-500 uppercase">Còn sống</span>
            </div>
            <div className="h-12 w-px bg-stone-300" />
            <div className="text-center">
              <div className="text-2xl font-black text-stone-600">{stats.deceasedCount}</div>
              <span className="text-xs font-bold text-stone-500 uppercase">Đã mất</span>
            </div>
          </div>

          <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-1000"
              style={{
                width: `${stats.total > 0 ? (stats.livingCount / stats.total) * 100 : 0}%`,
              }}
              title="Còn Sống"
            />
            <div
              className="bg-stone-500 h-full transition-all duration-1000"
              style={{
                width: `${stats.total > 0 ? (stats.deceasedCount / stats.total) * 100 : 0}%`,
              }}
              title="Đã Tạ Thế"
            />
          </div>

          <div className="flex justify-between text-[10px] text-stone-500 mt-2 font-bold">
            <span>Xanh lục: Đang sinh sống & cống hiến ({stats.total > 0 ? Math.round((stats.livingCount / stats.total) * 100) : 0}%)</span>
            <span>Xám tro: Đã tạ thế ({stats.total > 0 ? Math.round((stats.deceasedCount / stats.total) * 100) : 0}%)</span>
          </div>
        </div>
      </div>

      {/* Section 3: Geographic Distribution (Quê Quán) */}
      <div className="border border-stone-200 p-5 rounded-2xl bg-stone-50">
        <h4 className="font-bold text-stone-800 text-sm mb-4">Mật Độ Phân Bố Quê Quán / Nơi Sinh (Top 5 địa danh)</h4>
        {stats.locations.length === 0 ? (
          <p className="text-xs text-stone-400 italic">Chưa có đủ thông tin quê quán / nơi sinh của thành viên.</p>
        ) : (
          <div className="space-y-3.5">
            {stats.locations.map((loc, idx) => {
              const maxCount = stats.locations[0].count;
              const barWidth = maxCount > 0 ? (loc.count / maxCount) * 100 : 0;
              return (
                <div key={idx} className="flex items-center space-x-4">
                  <span className="w-24 text-xs font-bold text-stone-700 truncate">{loc.name}</span>
                  <div className="flex-grow h-3 bg-stone-200 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-lg"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="w-12 text-xs font-bold text-stone-500 text-right">
                    {loc.count} người
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
