import { NextResponse } from 'next/server';

import { normalizeAuditUrl, slugFromUrl } from '@/lib/audit-engine';
import { runRealAudit } from '@/lib/real-audit-runner';
import { captureWebsiteWithPlaywright } from '@/lib/playwright-crawler';
import { uploadAuditScreenshot } from '@/lib/screenshot-storage';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

async function readUrl(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null);
    return typeof body?.url === 'string' ? body.url : '';
  }

  const formData = await request.formData().catch(() => null);
  const url = formData?.get('url');
  return typeof url === 'string' ? url : '';
}

async function maybeCaptureScreenshot(url: string) {
  if (process.env.ENABLE_PLAYWRIGHT !== 'true') return null;

  try {
    const capture = await captureWebsiteWithPlaywright(url);
    return capture.screenshot;
  } catch (error) {
    console.error('Playwright screenshot capture failed:', error);
    return null;
  }
}

export async function POST(request: Request) {
  const rawUrl = await readUrl(request);
  const url = normalizeAuditUrl(rawUrl);

  if (!url) return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'You must be signed in to run an audit.', redirectTo: '/auth/login?redirect=/dashboard' },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, audits_this_month')
    .eq('id', user.id)
    .single();

  const isPro =
    profile?.plan === 'pro' ||
    profile?.plan === 'pro_lifetime' ||
    profile?.subscription_status === 'lifetime' ||
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing';

  const plan = isPro ? 'pro' : 'free';
  const screenshot = await maybeCaptureScreenshot(url);

  let audit;
  try {
    audit = await runRealAudit(url, plan);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? `Unable to crawl this website: ${error.message}` : 'Unable to crawl this website.' },
      { status: 502 },
    );
  }

  const { data: savedReport, error } = await supabase
    .from('audit_reports')
    .insert({
      user_id: user.id,
      url: audit.url,
      site_name: audit.site,
      slug: slugFromUrl(audit.url),
      plan,
      audit_mode: audit.auditMode,
      score: audit.score,
      summary: audit.summary,
      metrics: audit.metrics,
      issues: audit.issues,
      recommendations: audit.recommendations,
      contrast_checks: audit.contrastChecks,
      wcag_checks: audit.wcagChecks,
      heuristic_checks: audit.heuristicChecks,
      raw_audit: audit,
    })
    .select('id')
    .single();

  if (error || !savedReport) {
    return NextResponse.json({ error: error?.message || 'Unable to save audit report.' }, { status: 500 });
  }

  let screenshotUrl: string | null = null;

  if (screenshot) {
    screenshotUrl = await uploadAuditScreenshot({
      userId: user.id,
      reportId: savedReport.id,
      url: audit.url,
      screenshot,
    });

    if (screenshotUrl) {
      await supabase
        .from('audit_reports')
        .update({ screenshot_url: screenshotUrl })
        .eq('id', savedReport.id)
        .eq('user_id', user.id);
    }
  }

  await supabase
    .from('profiles')
    .update({ audits_this_month: (profile?.audits_this_month ?? 0) + 1 })
    .eq('id', user.id);

  const redirectTo = `/reports/${savedReport.id}`;
  const accept = request.headers.get('accept') || '';

  if (accept.includes('text/html')) return NextResponse.redirect(new URL(redirectTo, request.url), 303);

  return NextResponse.json({
    ok: true,
    reportId: savedReport.id,
    url: audit.url,
    plan,
    auditMode: audit.auditMode,
    screenshotUrl,
    redirectTo,
  });
}
