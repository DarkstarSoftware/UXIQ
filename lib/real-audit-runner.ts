import { buildRealAuditReport, crawlWebsite, type AuditReport } from '@/lib/real-audit-engine';

async function getAiRecommendations(report: AuditReport) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return [];

  const prompt = `Return JSON only: {"recommendations":["..."]}. Give 4 concise UX/accessibility/conversion recommendations for this real crawl:
Website: ${report.site}
URL: ${report.url}
Title: ${report.extraction.title}
Description: ${report.extraction.description}
H1: ${report.extraction.h1.join(' | ')}
Buttons: ${report.extraction.buttons.join(' | ')}
Forms: ${report.extraction.forms.length}
Images missing alt: ${report.extraction.images.filter((i) => !i.alt).length}
Issues: ${report.issues.map((i) => i.title).join(' | ')}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [{ role: 'system', content: 'Return valid JSON only.' }, { role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) return [];
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 4) : [];
  } catch {
    return [];
  }
}

export async function runRealAudit(url: string, plan: 'free' | 'pro') {
  const extraction = await crawlWebsite(url);
  let report = buildRealAuditReport(extraction, plan);

  if (plan === 'pro') {
    const aiRecommendations = await getAiRecommendations(report);
    if (aiRecommendations.length) {
      report = {
        ...report,
        aiNotes: aiRecommendations,
        recommendations: [...report.recommendations, ...aiRecommendations],
        issues: [
          ...report.issues,
          ...aiRecommendations.slice(0, 2).map((recommendation: string, index: number) => ({
            severity: index === 0 ? 'HIGH' as const : 'MED' as const,
            title: `AI recommendation: ${recommendation.slice(0, 64)}${recommendation.length > 64 ? '...' : ''}`,
            detail: recommendation,
            recommendation,
            impact: 'High' as const,
            effort: 'Medium' as const,
            category: 'AI' as const,
          })),
        ],
      };
    }
  }

  return report;
}
