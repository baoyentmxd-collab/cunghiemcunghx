import { createClient } from '@supabase/supabase-js';

// Lấy biến môi trường từ Vite/Vercel, nếu không có sẽ tự động dùng thông tin cấu hình mặc định bạn cung cấp
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://hkrinohkaiaflmkkkfqi.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrcmlub2hrYWlhZmxta2trZnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NDYzOTEsImV4cCI6MjA5ODEyMjM5MX0.4dzVCzhaGnHG6Ti45xTp6aAxyLrDNoecil1i0omB_v4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
