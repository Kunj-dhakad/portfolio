import { getAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { contentSchema, settingsSchema } from '@/lib/validations';
import { validOrigin, readJson } from '@/lib/security';
import { z } from 'zod';
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  if (!validOrigin(request))
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await getAdmin())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  const { resource } = await params;
  try {
    const raw = await readJson(request);
    if (resource === 'settings') {
      const parsed = settingsSchema.safeParse(raw);
      if (!parsed.success)
        return Response.json(
          { error: parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') },
          { status: 400 },
        );
      await db().settings.upsert({
        where: { id: 'site' },
        create: { id: 'site', data: parsed.data },
        update: { data: parsed.data },
      });
      return Response.json({ ok: true });
    }
    if (resource === 'enquiries') {
      const input = z
        .object({
          id: z.string().min(1),
          status: z.enum(['New', 'Reviewed', 'Contacted', 'Archived']),
        })
        .safeParse(raw);
      if (!input.success)
        return Response.json({ error: 'Invalid enquiry update.' }, { status: 400 });
      await db().enquiry.update({
        where: { id: input.data.id },
        data: { status: input.data.status },
      });
      return Response.json({ ok: true });
    }
    if (resource !== 'content')
      return Response.json({ error: 'Unknown resource.' }, { status: 404 });
    const object = z.object({ id: z.string().optional(), entry: contentSchema }).safeParse(raw);
    if (!object.success)
      return Response.json(
        { error: object.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ') },
        { status: 400 },
      );
    const { id, entry } = object.data;
    const saved = id
      ? await db().content.update({ where: { id }, data: entry })
      : await db().content.create({ data: entry });
    return Response.json({ ok: true, id: saved.id });
  } catch (error) {
    const conflict =
      typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
    return Response.json(
      {
        error: conflict
          ? 'That slug already exists in this section.'
          : 'Unable to save. Check the database connection and try again.',
      },
      { status: conflict ? 409 : 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  if (!validOrigin(request))
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!(await getAdmin())) return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  const { resource } = await params;
  try {
    const parsed = z
      .object({ id: z.string().min(1).max(200) })
      .safeParse(await readJson(request, 1000));
    if (!parsed.success) return Response.json({ error: 'Missing record ID.' }, { status: 400 });
    if (resource === 'content') await db().content.delete({ where: { id: parsed.data.id } });
    else if (resource === 'enquiries') await db().enquiry.delete({ where: { id: parsed.data.id } });
    else return Response.json({ error: 'Unknown resource.' }, { status: 404 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Could not delete this record.' }, { status: 500 });
  }
}
