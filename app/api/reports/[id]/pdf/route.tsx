import { NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';

import { dbReportToAuditReport } from '@/lib/audit-engine';
import { ReportPdfDocument } from '@/lib/pdf/report-pdf';
import { dbRoadmapToView } from '@/lib/roadmap-engine';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function filenameFor(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'aiux-report';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login?redirect=/reports', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxinsight.com'));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status')
    .eq('id', user.id)
    .single();

  const isPro =
    profile?.plan === 'pro' ||
    profile?.plan === 'pro_lifetime' ||
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing' ||
    profile?.subscription_status === 'lifetime';

  const { data: reportRow, error } = await supabase
    .from('audit_reports')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !reportRow) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }

  const report = dbReportToAuditReport(reportRow);

  const { data: roadmapRow } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('audit_report_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const roadmap = roadmapRow ? dbRoadmapToView(roadmapRow) : null;

  const blob = await pdf(
    <ReportPdfDocument report={report} roadmap={roadmap} isPro={Boolean(isPro)} />,
  ).toBlob();

  const arrayBuffer = await blob.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filenameFor(report.site)}-ux-audit.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
