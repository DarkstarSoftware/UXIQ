import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI is not configured.' }, { status: 500 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
        { error: 'AI report questions are available on Pro.' },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const reportId = typeof body.reportId === 'string' ? body.reportId : '';
    const question = typeof body.question === 'string' ? body.question : '';

    if (!reportId || !question) {
      return NextResponse.json({ error: 'Report and question are required.' }, { status: 400 });
    }

    const { data: reportRow } = await supabase
      .from('audit_reports')
      .select('report, normalized_url')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single();

    if (!reportRow) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You are Darkstar Audit AI, a senior UX, accessibility, WCAG, and conversion audit assistant. Give concise, practical answers.',
        },
        {
          role: 'user',
          content: `Website: ${reportRow.normalized_url}

Saved audit JSON:
${JSON.stringify(reportRow.report).slice(0, 12000)}

Question:
${question}`,
        },
      ],
    });

    return NextResponse.json({
      answer: completion.choices[0]?.message?.content || 'No answer generated.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to answer question.' },
      { status: 500 },
    );
  }
}
