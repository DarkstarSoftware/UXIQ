import { createClient } from '@/lib/supabase/server';

function safeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'website';
}

export async function uploadAuditScreenshot({
  userId,
  reportId,
  url,
  screenshot,
}: {
  userId: string;
  reportId: string;
  url: string;
  screenshot: Buffer;
}) {
  const supabase = await createClient();
  const path = `${userId}/${reportId}/${safeFileName(url)}.png`;

  const { error } = await supabase.storage
    .from('audit-screenshots')
    .upload(path, screenshot, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    console.error('Screenshot upload failed:', error.message);
    return null;
  }

  const { data } = supabase.storage.from('audit-screenshots').getPublicUrl(path);
  return data.publicUrl;
}
