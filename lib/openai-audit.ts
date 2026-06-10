import OpenAI from 'openai';
import type { AuditResult, CategoryScore, Fix, Issue, Plan } from '@/lib/audit';
import type { SiteSnapshot } from '@/lib/site-snapshot';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const OPENAI_TIMEOUT_MS = 15000;

type ParsedCategory = { name?: unknown; score?: unknown; insight?: unknown };
type ParsedIssue = { severity?: unknown; title?: unknown; body?: unknown };
type ParsedFix = { title?: unknown; impact?: unknown; effort?: unknown; description?: unknown };
type ParsedAudit = { score?: unknown; summary?: unknown; categories?: ParsedCategory[]; issues?: ParsedIssue[]; fixes?: ParsedFix[] };

function clampScore(value: unknown, fallback = 60) {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function normalizeCategoryName(value: unknown): CategoryScore['name'] {
  const name = String(value || '').toLowerCase();
  if (name.includes('access')) return 'Accessibility';
  if (name.includes('conversion')) return 'Conversion';
  if (name.includes('visual') || name.includes('design')) return 'Visual Design';
  return 'Usability';
}

function normalizeSeverity(value: unknown): Issue['severity'] {
  const str = String(value || '').toLowerCase();
  if (str.includes('high')) return 'High';
  if (str.includes('low')) return 'Low';
  return 'Medium';
}

function parseJsonObject(content: string): ParsedAudit {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('Model did not return JSON.');
  return JSON.parse(content.slice(start, end + 1)) as ParsedAudit;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then((value) => { clearTimeout(id); resolve(value); }).catch((err) => { clearTimeout(id); reject(err); });
  });
}

export async function generateAuditWithOpenAI(snapshot: SiteSnapshot, plan: Plan): Promise<AuditResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set.');

  const client = new OpenAI({ apiKey });
  const prompt = `You are an expert senior UX auditor. Analyze this website snapshot using Nielsen Norman-inspired usability principles, WCAG-aware accessibility thinking, conversion best practices, and visual consistency. Return ONLY valid JSON.

Required JSON shape:
{
  "score": number,
  "summary": string,
  "categories": [
    {"name":"Usability","score": number,"insight": string},
    {"name":"Accessibility","score": number,"insight": string},
    {"name":"Conversion","score": number,"insight": string},
    {"name":"Visual Design","score": number,"insight": string}
  ],
  "issues": [
    {"severity":"High|Medium|Low","title": string,"body": string}
  ],
  "fixes": [
    {"title": string,"impact":"High|Medium|Low","effort":"Low|Medium|High","description": string}
  ]
}

Rules:
- Be concrete and specific to the snapshot.
- Mention probable issues only when supported by the snapshot.
- Keep summary under 110 characters.
- Return exactly 4 categories, 4 issues, and 3 fixes.
- Scores should feel realistic for the evidence.
- Do not include markdown fences.

Website URL: ${snapshot.normalizedUrl}
Title: ${snapshot.title || 'N/A'}
Meta description: ${snapshot.metaDescription || 'N/A'}
H1: ${snapshot.h1.join(' | ') || 'N/A'}
H2: ${snapshot.h2.join(' | ') || 'N/A'}
Counts:
- Buttons: ${snapshot.buttonCount}
- Forms: ${snapshot.formCount}
- Inputs: ${snapshot.inputCount}
- Images: ${snapshot.imageCount}
- Images missing alt: ${snapshot.missingAltCount}
- Links: ${snapshot.linkCount}

Visible text excerpt:
${snapshot.textExcerpt}

HTML excerpt:
${snapshot.htmlExcerpt}`;

  const response = await withTimeout(
    client.chat.completions.create({
      model: DEFAULT_MODEL,
      temperature: 0.3,
      messages: [
        { role: 'system', content: 'You are a precise UX auditor who outputs only JSON.' },
        { role: 'user', content: prompt },
      ],
    }),
    OPENAI_TIMEOUT_MS,
    'OpenAI request',
  );

  const raw = response.choices[0]?.message?.content ?? '';
  const parsed = parseJsonObject(raw);

  const categories: CategoryScore[] = (Array.isArray(parsed.categories) ? parsed.categories : []).slice(0, 4).map((item) => ({
    name: normalizeCategoryName(item.name),
    score: clampScore(item.score),
    insight: String(item.insight || ''),
  }));

  const issues: Issue[] = (Array.isArray(parsed.issues) ? parsed.issues : []).slice(0, 4).map((item) => ({
    severity: normalizeSeverity(item.severity),
    title: String(item.title || 'Issue'),
    body: String(item.body || ''),
  }));

  const fixes: Fix[] = (Array.isArray(parsed.fixes) ? parsed.fixes : []).slice(0, 3).map((item) => ({
    title: String(item.title || 'Recommended fix'),
    impact: normalizeSeverity(item.impact),
    effort: normalizeSeverity(item.effort),
    description: String(item.description || ''),
  }));

  return {
    url: snapshot.url,
    normalizedUrl: snapshot.normalizedUrl,
    score: clampScore(parsed.score),
    summary: String(parsed.summary || 'AI audit complete.'),
    categories,
    issues,
    fixes,
    source: 'openai',
    plan,
    snapshot: {
      title: snapshot.title,
      metaDescription: snapshot.metaDescription,
      h1: snapshot.h1,
      h2: snapshot.h2,
      buttonCount: snapshot.buttonCount,
      formCount: snapshot.formCount,
      inputCount: snapshot.inputCount,
      imageCount: snapshot.imageCount,
      missingAltCount: snapshot.missingAltCount,
      linkCount: snapshot.linkCount,
    },
  };
}
