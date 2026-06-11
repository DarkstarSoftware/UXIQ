import { NextResponse } from 'next/server';

import { generateCompetitorReport } from '@/lib/competitor-analysis';
import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must sign in.' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (normalizePlan(profile?.plan) !== 'pro') {
      return NextResponse.json(
        { error: 'Competitor analysis is available on Pro.' },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));

    const primaryUrl = typeof body.primaryUrl === 'string' ? body.primaryUrl : '';
    const competitors = Array.isArray(body.competitors)
      ? body.competitors.filter((item: unknown) => typeof item === 'string')
      : [];

    if (!primaryUrl || competitors.length === 0) {
      return NextResponse.json(
        { error: 'Primary URL and at least one competitor are required.' },
        { status: 400 },
      );
    }

    const report = await generateCompetitorReport(primaryUrl, competitors);

    await supabase.from('competitor_reports').insert({
      user_id: user.id,
      primary_url: report.primaryUrl,
      competitor_urls: report.competitors,
      score: report.score,
      summary: report.summary,
      report,
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Competitor analysis failed.' },
      { status: 500 },
    );
  }
}
