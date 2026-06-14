import { NextResponse } from 'next/server';

import { runCompetitorComparison } from '@/lib/competitor-engine';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxinsight.com').replace(/\/$/, '');

  if (!user) return NextResponse.redirect(`${siteUrl}/auth/login?redirect=/competitors`, 303);

  const formData = await request.formData();
  const primaryUrl = formData.get('primaryUrl')?.toString() || '';
  const competitorUrls = [
    formData.get('competitorOne')?.toString() || '',
    formData.get('competitorTwo')?.toString() || '',
    formData.get('competitorThree')?.toString() || '',
  ].filter(Boolean);

  if (!primaryUrl || competitorUrls.length === 0) return NextResponse.redirect(`${siteUrl}/competitors/new?error=missing`, 303);

  let comparison;
  try {
    comparison = await runCompetitorComparison(primaryUrl, competitorUrls);
  } catch {
    return NextResponse.redirect(`${siteUrl}/competitors/new?error=crawl`, 303);
  }

  const { data, error } = await supabase
    .from('competitor_comparisons')
    .insert({
      user_id: user.id,
      name: `${comparison.primary.site} Competitor Analysis`,
      primary_url: comparison.primary.url,
      competitor_urls: competitorUrls,
      results: comparison,
    })
    .select('id')
    .single();

  if (error || !data) return NextResponse.redirect(`${siteUrl}/competitors/new?error=save`, 303);

  return NextResponse.redirect(`${siteUrl}/competitors/${data.id}`, 303);
}
