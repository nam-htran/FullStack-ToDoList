// app/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Kiểm tra token từ cookie hoặc header
  const token = req.cookies.get('token') || req.headers.get('authorization')?.split(' ')[1];

  // Nếu không có token, chuyển hướng đến trang login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Nếu có token hợp lệ, tiếp tục yêu cầu
  return NextResponse.next();
}

// Cấu hình matcher để bảo vệ các route cần thiết (trừ _next/*)
export const config = {
  matcher: [
    '/((?!auth/login|auth/signup|_next/|auth/forgot-password).*)',  // Bảo vệ tất cả các route trừ auth/login, auth/signup và _next
  ],
};
