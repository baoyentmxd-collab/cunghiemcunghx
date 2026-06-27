-- --------------------------------------------------
-- SQL SCHEMA FOR PHẢ ĐỒ NGHIÊM GIA ĐẠI TỘC
-- Sao chép toàn bộ mã này và dán vào Supabase SQL Editor để chạy.
-- --------------------------------------------------

-- 1. Tạo bảng Thành viên gia đình (members)
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    generation INTEGER NOT NULL,
    birth_year TEXT NOT NULL, -- dùng birth_year thay vì birthYear để chuẩn PostgreSQL
    death_year TEXT,
    is_deceased BOOLEAN NOT NULL DEFAULT false,
    spouse_id TEXT,
    parent_id TEXT,
    children_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    title TEXT NOT NULL,
    birth_place TEXT,
    resting_place TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Thêm khóa ngoại tự tham chiếu (Tùy chọn, bỏ qua để dễ nhập liệu lúc đầu)
-- ALTER TABLE public.members ADD CONSTRAINT fk_spouse FOREIGN KEY (spouse_id) REFERENCES public.members(id) ON DELETE SET NULL;
-- ALTER TABLE public.members ADD CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES public.members(id) ON DELETE SET NULL;

-- 2. Tạo bảng Lời tri ân (tributes)
CREATE TABLE IF NOT EXISTS public.tributes (
    id TEXT PRIMARY KEY,
    member_name TEXT NOT NULL,
    relation TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tạo bảng Nến tưởng nhớ (lit_candles)
CREATE TABLE IF NOT EXISTS public.lit_candles (
    member_id TEXT PRIMARY KEY,
    lit BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tạo bảng Cấu hình Quản trị (admin_settings)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Cấu hình Row Level Security (RLS) để cho phép đọc ghi từ Client SPA
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lit_candles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings DISABLE ROW LEVEL SECURITY;

-- Nhập dữ liệu quản trị mặc định ban đầu (username: admin, password: 123)
INSERT INTO public.admin_settings (key, value)
VALUES ('admin_creds', '{"username": "admin", "password": "123"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
