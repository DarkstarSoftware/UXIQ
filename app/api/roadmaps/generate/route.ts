import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import type { RoadmapResult } from '@/lib/roadmap';
import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

function parseJson(content: string): RoadmapResult {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI did not return valid JSON.');
  }

  return JSON.parse(content.slice(start, end + 1)) as RoadmapResult;
}

function fallbackRoadmap(report: any): RoadmapResult {
  return {
    title: `UX Roadmap for ${report?.normalizedUrl || 'Website'}`,
    summary: 'A prioritized UX roadmap based on audit findings.',
    phases: [
      {
        name: 'Phase 1: Immediate Fixes',
        goal: 'Address the highest-friction issues first.',
        tasks: [
          {
            title: 'Clarify the primary call to action',
            why: 'A clear primary action improves scanability and conversion confidence.',
            impact: 'High',
            effort: 'Medium',
            owner: 'Design / Marketing',
            timeframe: 'Week 1',
          },
          {
            title: 'Review heading structure',
            why: 'Logical headings improve usability, accessibility, and content comprehension.',
            impact: 'Medium',
            effort: 'Low',
            owner: 'Design / Content',
            timeframe: 'Week 1',
          },
        ],
      },
      {
        name: 'Phase 2: Accessibility Improvements',
        goal: 'Reduce accessibility barriers and improve WCAG readiness.',
        tasks: [
          {
            title: 'Audit form labels and error states',
            why: 'Accessible forms reduce user friction and support assistive technology.',
            impact: 'High',
            effort: 'Medium',
            owner: 'Design / Engineering',
            timeframe: 'Weeks 2-3',
          },
        ],
      },
      {
        name: 'Phase 3: Conversion Optimization',
        goal: 'Improve trust, flow, and completion rates.',
        tasks: [
          {
            title: 'Strengthen trust and proof elements',
            why: 'Trust signals help users feel confident taking action.',
            impact: 'Medium',
            effort: 'Medium',
            owner: 'Marketing / Design',
            timeframe: 'Weeks 3-4',
          },
        ],
      },
    ],
    executiveNotes: [
      'Prioritize high-impact, low-effort improvements first.',
      'Use the audit score as a baseline and retest after changes.',
      'Upgrade accessibility review before scaling paid traffic.',
    ],
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

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
        { error: 'AI roadmaps are available on Pro.' },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const reportId = typeof body.reportId === 'string' ? body.reportId : '';

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required.' }, { status: 400 });
    }

    const { data: reportRow } = await supabase
      .from('audit_reports')
      .select('id, normalized_url, report')
      .eq('id', reportId)
      .eq('user_id', user.id)
      .single();

    if (!reportRow) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    let roadmap: RoadmapResult;

    if (!apiKey) {
      roadmap = fallbackRoadmap(reportRow.report);
    } else {
      const client = new OpenAI({ apiKey });

      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        temperature: 0.25,
        messages: [
          {
            role: 'system',
            content:
              'You are Darkstar Audit AI. Create practical UX, accessibility, WCAG, and conversion improvement roadmaps. Return only valid JSON.',
          },
          {
            role: 'user',
            content: `Create a stakeholder-ready UX roadmap from this audit.

Return this exact JSON shape:
{
  "title": string,
  "summary": string,
  "phases": [
    {
      "name": string,
      "goal": string,
      "tasks": [
        {
          "title": string,
          "why": string,
          "impact": "High|Medium|Low",
          "effort": "High|Medium|Low",
          "owner": string,
          "timeframe": string
        }
      ]
    }
  ],
  "executiveNotes": [string]
}

Rules:
- Create 3 phases.
- Include 2-4 tasks per phase.
- Make recommendations specific to the audit.
- Focus on business value, accessibility, and conversion.
- No markdown.

Website: ${reportRow.normalized_url}

Audit JSON:
${JSON.stringify(reportRow.report).slice(0, 12000)}`,
          },
        ],
      });

      roadmap = parseJson(completion.choices[0]?.message?.content || '');
    }

    const { data, error } = await supabase
      .from('roadmaps')
      .insert({
        user_id: user.id,
        report_id: reportRow.id,
        title: roadmap.title,
        summary: roadmap.summary,
        roadmap,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ roadmap, id: data.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to generate roadmap.' },
      { status: 500 },
    );
  }
}
