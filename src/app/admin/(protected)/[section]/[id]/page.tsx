import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getEntries } from '@/lib/content';
import { kinds, type Kind } from '@/types';
import { ContentEditor } from '@/components/admin/content-editor';
import { blankData } from '@/data/content';
export default async function EditPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  await requireAdmin();
  const { section, id } = await params;
  if (!kinds.includes(section as Kind)) notFound();
  const entry =
    id === 'new' ? undefined : (await getEntries(section as Kind, true)).find((e) => e.id === id);
  if (id !== 'new' && !entry) notFound();
  return (
    <>
      <h1>
        {entry ? 'Edit' : 'Create'} {section === 'blog' ? 'article' : section.slice(0, -1)}
      </h1>
      <p>Keep content accurate, links current, and sample labels honest.</p>
      <ContentEditor kind={section as Kind} entry={entry} blankData={blankData} />
    </>
  );
}
