/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminCredentials } from '../../types';

interface AdminModalsProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showChangeCredsModal: boolean;
  setShowChangeCredsModal: (show: boolean) => void;
  adminCreds: AdminCredentials;
  onLoginSubmit: (user: string, pass: string) => boolean;
  onChangeCredsSubmit: (currentPass: string, newUser: string, newPass: string) => boolean | Promise<boolean>;
}

export function AdminModals({
  showLoginModal,
  setShowLoginModal,
  showChangeCredsModal,
  setShowChangeCredsModal,
  adminCreds,
  onLoginSubmit,
  onChangeCredsSubmit,
}: AdminModalsProps) {
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [currentPass, setCurrentPass] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleLoginSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLoginSubmit(loginUser, loginPass);
    if (success) {
      setLoginUser('');
      setLoginPass('');
    }
  };

  const handleChangeCredsForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onChangeCredsSubmit(currentPass, newUser, newPass);
    if (success) {
      setCurrentPass('');
      setNewUser('');
      setNewPass('');
    }
  };

  return (
    <>
      {/* --- ADMIN LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-amber-500/30">
            <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 p-5 text-amber-100 flex flex-col items-center">
              <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-full mb-2">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-center">ĐĂNG NHẬP BAN QUẢN TRỊ</h3>
              <p className="text-[10px] text-stone-300 mt-1 font-bold">Chế độ thêm, sửa dữ liệu và cấu trúc phả hệ</p>
            </div>

            <form onSubmit={handleLoginSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tên Đăng Nhập</label>
                <input
                  required
                  type="text"
                  placeholder="Tài khoản quản trị..."
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Mật Khẩu</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[10px] text-amber-900 flex items-start space-x-1.5 leading-relaxed font-bold">
                <span>💡</span>
                <span>
                  Tài khoản mặc định ban đầu là: <strong className="font-black text-rose-900">admin</strong> và mật khẩu:{' '}
                  <strong className="font-black text-rose-900">123</strong>. Có thể thay đổi sau khi đăng nhập.
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-150">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="bg-rose-950 hover:bg-rose-900 text-amber-100 font-bold text-xs py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  Đăng Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIGURATION / CREDENTIALS MANAGEMENT MODAL --- */}
      {showChangeCredsModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-amber-500/30">
            <div className="bg-gradient-to-r from-amber-950 to-amber-900 p-5 text-amber-100 flex flex-col items-center">
              <h3 className="font-bold text-lg">Cấu Hình Quản Trị Hệ Thống</h3>
              <p className="text-[10px] text-stone-300 mt-1 font-bold">Thay đổi thông tin đăng nhập ban quản lý phả tộc</p>
            </div>

            <form onSubmit={handleChangeCredsForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tài khoản quản trị mới</label>
                <input
                  required
                  type="text"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>

              <div className="h-px bg-stone-250 my-2" />

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Mật khẩu mới</label>
                <input
                  required
                  type="password"
                  placeholder="Mật khẩu mới..."
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
                  Mật khẩu hiện tại (Để xác thực) *
                </label>
                <input
                  required
                  type="password"
                  placeholder="Xác nhận mật khẩu cũ..."
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold focus:ring-1 focus:ring-rose-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-150">
                <button
                  type="button"
                  onClick={() => setShowChangeCredsModal(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
