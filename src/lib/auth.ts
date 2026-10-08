import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
const cookieName = 'studio_session';
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32)
    throw new Error('AUTH_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(value);
}
export async function createSession(id: string) {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime('8h')
    .setIssuer('navonixx-studio')
    .setAudience('admin')
    .sign(secret());
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 60 * 60,
  });
}
export async function getAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !process.env.DATABASE_URL || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ['HS256'],
      issuer: 'navonixx-studio',
      audience: 'admin',
    });
    if (payload.role !== 'admin' || !payload.sub) return null;
    return await db().admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });
  } catch {
    return null;
  }
}
export async function clearSession() {
  (await cookies()).delete(cookieName);
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}
