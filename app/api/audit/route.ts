import { NextResponse } from 'next/server';

import type { AuditResult } from '@/lib/audit';
import { generateBasicAudit } from '@/lib/basic-audit';
import { generateAuditWithOpenAI } from '@/lib/openai-audit';
import { normalizePlan } from '@/lib/plan';
import { fetchSiteSnapshot, normalizeUrl } from '@/lib/site-snapshot';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function saveReport(userId: string, report: AuditResult) {
  const supabase = await createClient();

  await supabase.from('audit_reports').insert({
    user_id: userId,
    url: report.url,
    normalized_url: report.normalizedUrl,
    score: report.score,
    summary: report.summary,
    source: report.source,
    plan: report.plan,
    report,
  });

  await supabase.rpc('increment_audits_this_month');
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must sign in before running an audit.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, audits_this_month')
      .eq('id', user.id)
      .single();

    const plan = normalizePlan(profile?.plan);

    if (plan === 'free' && (profile?.audits_this_month ?? 0) >= 10) {
      return NextResponse.json({ error: 'Free audit limit reached. Upgrade to Pro for more audits.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const rawUrl = typeof body?.url === 'string' ? body.url : '';

    if (!rawUrl.trim()) {
      return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(rawUrl);
    const snapshot = await fetchSiteSnapshot(normalizedUrl);

    let report: AuditResult;

    if (plan === 'pro') {
      try {
        report = await generateAuditWithOpenAI(snapshot);
      } catch (error) {
        report = generateBasicAudit(snapshot);
        report.source = 'fallback';
        report.plan = 'pro';
        report.note = error instanceof Error ? error.message : 'AI audit failed.';
      }
    } else {
      report = generateBasicAudit(snapshot);
    }

    report.plan = plan;
    await saveReport(user.id, report);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Audit failed.' }, { status: 500 });
  }
}
