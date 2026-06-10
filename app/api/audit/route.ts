import { NextResponse } from 'next/server';
import { getUserAndPlan } from '@/lib/supabase-server';
import { generateBasicAudit } from '@/lib/basic-audit';
import { generateAuditWithOpenAI } from '@/lib/openai-audit';
import { fetchSiteSnapshot, normalizeUrl } from '@/lib/site-snapshot';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { user, plan } = await getUserAndPlan();
    if (!user) return NextResponse.json({ error: 'You must sign in before analyzing a website.' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const rawUrl = typeof body?.url === 'string' ? body.url : '';
    if (!rawUrl.trim()) return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 });

    const normalizedUrl = normalizeUrl(rawUrl);
    const snapshot = await fetchSiteSnapshot(normalizedUrl);

    if (plan === 'free') {
      return NextResponse.json(generateBasicAudit(snapshot, plan));
    }

    try {
      const audit = await generateAuditWithOpenAI(snapshot, plan);
      return NextResponse.json(audit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI audit failed.';
      const fallback = generateBasicAudit(snapshot, plan);
      return NextResponse.json({ ...fallback, source: 'fallback', note: message });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected audit error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
