import { NextResponse } from 'next/server';

import { buildAuditReportFromUrl, normalizeAuditUrl, slugFromUrl } from '@/lib/audit-engine';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

async function readUrl(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null);
    return typeof body?.url === 'string' ? body.url : '';
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData().catch(() => null);
    const url = formData?.get('url');
    return typeof url === 'string' ? url : '';
  }

  const formData = await request.formData().catch(() => null);
  const url = formData?.get('url');
  return typeof url === 'string' ? url : '';
}

export async function POST(request: Request) {
  const rawUrl = await readUrl(request);
  const url = normalizeAuditUrl(rawUrl);

  if (!url) {
    return NextResponse.json({ error: 'A website URL is required.' }, { status: 400 });
  }

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
    profile?.subscription_status === 'lifetime' ||
    profile?.subscription_status === 'active';

  const plan = isPro ? 'pro' : 'free';
  const audit = buildAuditReportFromUrl(url, plan);
  const slug = slugFromUrl(url);

  const { data: savedReport, error } = await supabase
    .from('audit_reports')
    .insert({
      user_id: user.id,
      url: audit.url,
      site_name: audit.site,
      slug,
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
    return NextResponse.json(
      { error: error?.message || 'Unable to save audit report.' },
      { status: 500 },
    );
  }

  await supabase
    .from('profiles')
    .update({ audits_this_month: (profile?.audits_this_month ?? 0) + 1 })
    .eq('id', user.id);

  const redirectTo = `/reports/${savedReport.id}`;

  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  return NextResponse.json({
    ok: true,
    reportId: savedReport.id,
    url: audit.url,
    plan,
    auditMode: audit.auditMode,
    redirectTo,
  });
}
