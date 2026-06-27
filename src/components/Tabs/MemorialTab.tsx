/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FamilyMember, TributeMessage } from '../../types';

interface MemorialTabProps {
  members: FamilyMember[];
  litCandles: { [key: string]: boolean };
  onToggleCandle: (id: string) => void;
  tributes: TributeMessage[];
  onAddTribute: (name: string, relation: string, message: string) => void;
}

export default function MemorialTab({
  members,
  litCandles,
  onToggleCandle,
  tributes,
  onAddTribute,
}: MemorialTabProps) {
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const deceasedMembers = members.filter((m) => m.isDeceased);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;
    onAddTribute(newName, newRelation || 'Hậu duệ', newMessage);
    setNewName('');
    setNewRelation('');
    setNewMessage('');
  };

  return (
    <div className="p-6 bg-stone-950 text-stone-100 h-full overflow-y-auto flex flex-col justify-between">
      <div>
        <div className="text-center mb-6">
          <span className="text-xs text-amber-500 uppercase tracking-widest font-black">
            Thành Kính Tri Ân Tổ Tiên
          </span>
          <h2 className="text-2xl font-black text-amber-100 mt-1">VIRTUAL ANCESTOR ALTAR & ROOM</h2>
          <p className="text-stone-400 text-xs max-w-xl mx-auto mt-2 font-bold leading-relaxed">
            Phòng tưởng nhớ trang nghiêm là nơi con cháu muôn đời thắp nến tri ân, dâng nén tâm hương và ghi lại những lời tưởng niệm xúc động kính dâng tổ tiên dòng tộc Nghiêm Gia.
          </p>
        </div>

        {/* Ancestors Candle Space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto my-6">
          {deceasedMembers.map((m) => {
            const isLit = litCandles[m.id];
            return (
              <div
                key={m.id}
                className={`border rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all duration-500 bg-stone-900 ${
                  isLit
                    ? 'border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.25)] bg-amber-950/10'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Avatar & Candle frame */}
                <div className="relative flex flex-col items-center justify-center mb-4 h-24 w-full">
                  {/* Candle Flame Animation overlay */}
                  {isLit && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                      {/* Fire Flame */}
                      <div className="w-3.5 h-7 bg-amber-400 rounded-full blur-[1px] animate-pulse relative shadow-[0_0_15px_rgba(245,158,11,0.7)]">
                        <div className="absolute bottom-1 left-1 w-2 h-3 bg-orange-600 rounded-full" />
                      </div>
                      {/* Candle body */}
                      <div className="w-1.5 h-5 bg-amber-200 border border-amber-300 rounded-t" />
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-stone-300 text-2xl font-bold relative overflow-hidden mt-6">
                    {m.name.split(' ').pop()?.substring(0, 1)}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-amber-100">{m.name}</h4>
                  <span className="text-xs text-amber-600 font-bold">{m.title}</span>
                  <p className="text-stone-400 text-xs mt-1 font-bold">
                    Năm sinh: {m.birthYear} - Năm mất: {m.deathYear}
                  </p>
                  {m.bio && (
                    <p className="text-stone-500 text-[10px] mt-2 italic px-2 font-bold leading-relaxed line-clamp-3">
                      "{m.bio}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onToggleCandle(m.id)}
                  className={`mt-4 w-full py-1.5 px-4 rounded-xl text-xs tracking-wider cursor-pointer transition font-bold ${
                    isLit
                      ? 'bg-amber-600 hover:bg-amber-700 text-stone-950'
                      : 'bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700'
                  }`}
                >
                  {isLit ? 'Đã dâng nến • Nhấn tắt' : 'Thắp Nến Tri Ân'}
                </button>
              </div>
            );
          })}
        </div>

        {/* TRIBUTE LEDGER BOOK (SỔ LƯU NIỆM TRI ÂN) */}
        <div className="max-w-5xl mx-auto border-t border-stone-800 mt-12 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tribute Messages Feed */}
          <div className="space-y-4">
            <h3 className="font-bold text-amber-100 text-sm flex items-center gap-2 border-b border-stone-800 pb-2">
              <span>📖 Sổ Lưu Niệm Tri Ân Dòng Họ</span>
              <span className="text-xs text-stone-500 font-medium">({tributes.length} lời)</span>
            </h3>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-800">
              {tributes.map((t) => (
                <div
                  key={t.id}
                  className="bg-stone-900 border border-stone-800/80 p-3.5 rounded-xl space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-400">{t.memberName}</span>
                    <span className="text-stone-500 font-bold">{t.relation}</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-bold">"{t.message}"</p>
                  <div className="text-[10px] text-stone-600 text-right font-medium">
                    {new Date(t.timestamp).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}
              {tributes.length === 0 && (
                <p className="text-stone-500 text-xs italic py-4 text-center">
                  Chưa có lời tri ân nào được ghi lại. Hãy là người đầu tiên ghi lời tri ân tổ tông!
                </p>
              )}
            </div>
          </div>

          {/* Form to add Tribute */}
          <div>
            <h3 className="font-bold text-amber-100 text-sm border-b border-stone-800 pb-2 mb-4">
              🖋️ Dâng Lời Tri Ân Của Con Cháu
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 bg-stone-900/50 p-5 rounded-2xl border border-stone-850">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Họ và tên con cháu *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Nghiêm Đình Mạnh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-bold text-amber-100 placeholder-stone-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Quan hệ vai vế / Chi ngành
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cháu trưởng chi cả đời 4"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-bold text-amber-100 placeholder-stone-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Lời muốn kính dâng tôn kính *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Kính dâng tổ tiên lời nguyện cầu..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none font-bold text-amber-100 placeholder-stone-600 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs py-2 px-4 rounded-xl transition duration-200 shadow-md cursor-pointer uppercase tracking-wider"
              >
                Dâng Kính Tổ Tiên ➔
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* solemn smoke decoration */}
      <div className="border-t border-stone-900 pt-6 mt-12 text-center text-[11px] text-stone-500 flex flex-col items-center gap-2 font-bold">
        <div className="flex gap-1 justify-center">
          <div className="w-1 h-6 bg-gradient-to-t from-stone-800 to-transparent blur-xs animate-pulse" />
          <div className="w-1 h-12 bg-gradient-to-t from-stone-800 to-transparent blur-xs animate-pulse delay-75" />
          <div className="w-1 h-8 bg-gradient-to-t from-stone-800 to-transparent blur-xs animate-pulse delay-150" />
        </div>
        <span>Hương khói phảng phất hương thơm bay • Lòng thành dâng kính muôn thuở nhớ</span>
      </div>
    </div>
  );
}
