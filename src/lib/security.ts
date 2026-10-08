import { createHash } from 'node:crypto';
import { db } from '@/lib/db';
export function validOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}
export async function rateLimit(key: string, limit: number, seconds: number) {
  const hashed = createHash('sha256').update(key).digest('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + seconds * 1000);
  const rows = await db().$queryRaw<
    { count: number }[]
  >`INSERT INTO "RateLimit" ("key", "count", "expiresAt") VALUES (${hashed}, 1, ${expiresAt}) ON CONFLICT ("key") DO UPDATE SET "count" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN 1 ELSE "RateLimit"."count" + 1 END, "expiresAt" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN ${expiresAt} ELSE "RateLimit"."expiresAt" END RETURNING "count"`;
  return rows[0].count <= limit;
}
export function clientKey(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
export async function readJson(request: Request, max = 150000) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > max) {
      await reader.cancel();
      throw new Error('Body too large');
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}
