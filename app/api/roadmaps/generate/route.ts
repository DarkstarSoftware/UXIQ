import { NextResponse } from 'next/server';

import { dbReportToAuditReport } from '@/lib/audit-engine';
import { buildRoadmapFromReport } from '@/lib/roadmap-engine';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

async function readReportId(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null);
    return typeof body?.reportId === 'string' ? body.reportId : '';
  }
  const formData = await request.formData().catch(() => null);
  const reportId = formData?.get('reportId');
  return typeof reportId === 'string' ? reportId : '';
}

function wantsHtml(request: Request) {
  return (request.headers.get('accept') || '').includes('text/html');
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxinsight.com').replace(/\/$/, '');

  if (!user) {
    const redirectTo = `${siteUrl}/auth/login?redirect=/reports`;
    if (wantsHtml(request)) return NextResponse.redirect(redirectTo, 303);
    return NextResponse.json({ error: 'You must be signed in.', redirectTo }, { status: 401 });
  }

  const reportId = await readReportId(request);
  if (!reportId) {
    const redirectTo = `${siteUrl}/reports`;
    if (wantsHtml(request)) return NextResponse.redirect(redirectTo, 303);
    return NextResponse.json({ error: 'A report ID is required.', redirectTo }, { status: 400 });
  }

  const { data: reportRow } = await supabase
    .from('audit_reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', user.id)
    .single();

  if (!reportRow) {
    const redirectTo = `${siteUrl}/reports`;
    if (wantsHtml(request)) return NextResponse.redirect(redirectTo, 303);
    return NextResponse.json({ error: 'Report not found.', redirectTo }, { status: 404 });
  }

  const report = dbReportToAuditReport(reportRow);
  const roadmap = buildRoadmapFromReport(report);

  const { data: savedRoadmap, error } = await supabase
    .from('roadmaps')
    .insert({
      user_id: user.id,
      audit_report_id: reportId,
      title: roadmap.title,
      site_name: roadmap.site_name,
      url: roadmap.url,
      summary: roadmap.summary,
      items: roadmap.items,
      quick_wins: roadmap.quick_wins,
      next_phase: roadmap.next_phase,
      strategic_initiatives: roadmap.strategic_initiatives,
    })
    .select('id')
    .single();

  if (error || !savedRoadmap) {
    return NextResponse.json({ error: error?.message || 'Unable to create roadmap.' }, { status: 500 });
  }

  const redirectTo = `${siteUrl}/roadmaps/${savedRoadmap.id}`;
  if (wantsHtml(request)) return NextResponse.redirect(redirectTo, 303);

  return NextResponse.json({ ok: true, roadmapId: savedRoadmap.id, redirectTo: `/roadmaps/${savedRoadmap.id}` });
}
