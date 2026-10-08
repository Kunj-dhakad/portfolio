import { enquirySchema } from '@/lib/validations';
import { db } from '@/lib/db';
import { clientKey, rateLimit, validOrigin, readJson } from '@/lib/security';
export async function POST(request: Request) {
  if (!validOrigin(request))
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!process.env.DATABASE_URL)
    return Response.json(
      {
        error:
          'Enquiries are not enabled yet. Please try again once the site owner has configured the database.',
      },
      { status: 503 },
    );
  try {
    const parsed = enquirySchema.safeParse(await readJson(request, 16000));
    if (!parsed.success)
      return Response.json(
        { error: 'Please check your form details.', fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    if (!(await rateLimit(`enquiry:${clientKey(request)}`, 5, 3600)))
      return Response.json(
        { error: 'Too many submissions. Please try again in an hour.' },
        { status: 429 },
      );
    if (parsed.data.honeypot) return Response.json({ ok: true });
    const { honeypot, ...data } = parsed.data;
    void honeypot;
    const enquiry = await db().enquiry.create({ data });
    if (
      process.env.RESEND_API_KEY &&
      process.env.NOTIFICATION_FROM &&
      process.env.NOTIFICATION_TO
    ) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `enquiry-${enquiry.id}`,
          },
          body: JSON.stringify({
            from: process.env.NOTIFICATION_FROM,
            to: [process.env.NOTIFICATION_TO],
            subject: 'New project enquiry',
            text: `From: ${data.name} <${data.email}>\nType: ${data.projectType}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\n${data.description}`,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) console.error('Enquiry saved; email notification failed.');
      } catch {
        console.error('Enquiry saved; email notification unavailable.');
      }
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    console.error('Enquiry submission failed.');
    return Response.json(
      { error: 'Your enquiry could not be saved. Please try again later.' },
      { status: 503 },
    );
  }
}
