import { NextResponse } from 'next/server';
import { signToken, setAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { password } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  }
  const token = await signToken();
  await setAuthCookie(token);
  return NextResponse.json({ success: true });
}
