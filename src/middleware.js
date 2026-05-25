import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'admin123');

async function isAdmin(request) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 需要登录的页面
  if (
    pathname === '/posts/new' ||
    pathname.match(/^\/posts\/\d+\/edit$/)
  ) {
    if (!(await isAdmin(request))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 需要登录的 API
  if (
    (pathname === '/api/posts' && request.method !== 'GET') ||
    (pathname.match(/^\/api\/posts\/\d+$/) && ['PUT', 'DELETE'].includes(request.method)) ||
    (pathname === '/api/photos' && request.method === 'POST')
  ) {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/posts/:path*', '/api/posts/:path*', '/api/photos/:path*'],
};
