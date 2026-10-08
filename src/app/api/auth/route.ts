import { compare } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createSession, clearSession } from '@/lib/auth';
import { clientKey, rateLimit, validOrigin, readJson } from '@/lib/security';
export async function POST(request: Request) {
  if (!validOrigin(request))
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)
    return Response.json(
      { error: 'Admin access requires database and authentication configuration.' },
      { status: 503 },
    );
  try {
    const input = z
      .object({ email: z.email().max(254), password: z.string().min(1).max(128) })
      .safeParse(await readJson(request, 2000));
    if (!input.success)
      return Response.json({ error: 'Enter a valid email and password.' }, { status: 400 });
    const allowed = await rateLimit(`login-ip:${clientKey(request)}`, 10, 900);
    const accountAllowed = await rateLimit(
      `login-account:${input.data.email.toLowerCase()}`,
      10,
      900,
    );
    if (!allowed || !accountAllowed)
      return Response.json(
        { error: 'Too many attempts. Try again in 15 minutes.' },
        { status: 429 },
      );
    const user = await db().admin.findUnique({ where: { email: input.data.email.toLowerCase() } });
    const valid = await compare(
      input.data.password,
      user?.passwordHash || '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxwhufG60tpjAIzCV.jGKH8ugmS',
    );
    if (!user || !valid)
      return Response.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    await createSession(user.id);
    return Response.json({ ok: true });
  } catch {
    console.error('Admin login failed.');
    return Response.json(
      { error: 'Login is unavailable. Please try again later.' },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!validOrigin(request)) return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  await clearSession();
  return Response.json({ ok: true });
}
