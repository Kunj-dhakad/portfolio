import 'dotenv/config';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '../src/lib/db';
async function main() {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(14).max(128), secret: z.string().min(32) })
    .safeParse({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      secret: process.env.AUTH_SECRET,
    });
  if (!parsed.success)
    throw new Error(
      'Set ADMIN_EMAIL, ADMIN_PASSWORD (14+ characters), and AUTH_SECRET (32+ characters).',
    );
  const email = parsed.data.email.toLowerCase();
  const exists = await db().admin.findUnique({ where: { email } });
  if (exists) throw new Error('Admin already exists. This command does not overwrite credentials.');
  await db().admin.create({ data: { email, passwordHash: await hash(parsed.data.password, 12) } });
  console.log('Admin created. Remove ADMIN_PASSWORD from the environment after setup.');
}
main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Admin creation failed.');
    process.exitCode = 1;
  })
  .finally(async () => {
    if (process.env.DATABASE_URL) await db().$disconnect();
  });
