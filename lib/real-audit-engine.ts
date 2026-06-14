export type AuditIssue = {
  severity: 'HIGH' | 'MED' | 'LOW';
  title: string;
  detail: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  wcag?: string;
  heuristic?: string;
  category: 'WCAG' | 'Nielsen Norman' | 'Conversion' | 'AI';
};

export type ExtractedPage = {
  url: string; finalUrl: string; status: number;
  title: string; description: string; lang: string;
  h1: string[]; h2: string[]; h3: string[];
  headings: Array<{ level: number; text: string }>;
  links: Array<{ text: string; href: string }>;
  buttons: string[];
  images: Array<{ alt: string; src: string }>;
  forms: Array<{ inputs: Array<{ type: string; name: string; id: string; placeholder: string; label: string }> }>;
  landmarks: { header: number; nav: number; main: number; footer: number; aside: number };
  text: string; wordCount: number;
  colorPairs: Array<{ foreground: string; background: string; usage: string }>;
};

export type AuditReport = {
  id: string; site: string; url: string; score: number; date: string;
  plan: 'free' | 'pro'; auditMode: 'free' | 'pro'; summary: string;
  metrics: { usability: number; accessibility: number; conversion: number; visualDesign: number; wcag: number; heuristics: number };
  issues: AuditIssue[];
  recommendations: string[];
  contrastChecks: Array<{ foreground: string; background: string; ratio: number; passesAA: boolean; usage: string; recommendation: string }>;
  wcagChecks: Array<{ criterion: string; status: 'pass' | 'warning' | 'fail'; note: string }>;
  heuristicChecks: Array<{ heuristic: string; status: 'pass' | 'warning' | 'fail'; note: string }>;
  extraction: ExtractedPage;
  aiNotes?: string[];
};

export function normalizeAuditUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
}

export function slugFromUrl(url: string) {
  try {
    const parsed = new URL(normalizeAuditUrl(url));
    return parsed.hostname.replace(/^www\./, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'audit-report';
  } catch {
    return url.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'audit-report';
  }
}

export function siteNameFromUrl(url: string) {
  try {
    const parsed = new URL(normalizeAuditUrl(url));
    const first = parsed.hostname.replace(/^www\./, '').split('.')[0] || 'Website';
    return first.split(/[-_]/g).filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  } catch { return 'Website'; }
}

function stripTags(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
}

function attr(tag: string, name: string) {
  return tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? '';
}

function tags(html: string, name: string) {
  const re = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'gi');
  return Array.from(html.matchAll(re)).map((m) => ({ full: m[0], inner: m[1] ?? '' }));
}

function openTags(html: string, name: string) {
  return Array.from(html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))).map((m) => m[0]);
}

function hex(h: string) {
  const c = h.replace('#', '');
  return c.length === 3 ? `#${c.split('').map((x) => x + x).join('')}`.toUpperCase() : `#${c}`.toUpperCase();
}

export function getContrastRatio(a: string, b: string) {
  function lum(h: string) {
    const c = hex(h).replace('#', '');
    const rgb = [0,2,4].map((i) => parseInt(c.slice(i, i+2), 16) / 255);
    const linear = rgb.map((v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }
  const l1 = lum(a), l2 = lum(b);
  return Math.round(((Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05)) * 100) / 100;
}

function colorPairs(html: string) {
  const pairs: Array<{ foreground: string; background: string; usage: string }> = [];
  for (const m of html.matchAll(/style\s*=\s*["']([^"']+)["']/gi)) {
    const s = m[1] ?? '';
    const color = s.match(/(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3,6})/i)?.[1];
    const bg = s.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i)?.[1];
    if (color && bg) pairs.push({ foreground: hex(color), background: hex(bg), usage: 'Inline styled text' });
  }
  pairs.push({ foreground: '#FFFFFF', background: '#4F46E5', usage: 'Recommended primary CTA baseline' });
  pairs.push({ foreground: '#94A3B8', background: '#1F2937', usage: 'Muted text on dark card baseline' });
  return pairs.slice(0, 8);
}

function headingSkip(headings: Array<{ level: number; text: string }>) {
  for (let i = 1; i < headings.length; i++) if (headings[i].level - headings[i-1].level > 1) return true;
  return false;
}

const clamp = (n: number) => Math.max(38, Math.min(94, Math.round(n)));

export async function crawlWebsite(url: string): Promise<ExtractedPage> {
  const normalized = normalizeAuditUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(normalized, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'AIUXInsightBot/1.0 (+https://www.aiuxinsight.com)', accept: 'text/html,application/xhtml+xml' },
    });
    const html = await res.text();
    const finalUrl = res.url || normalized;
    const title = stripTags(tags(html, 'title')[0]?.inner ?? '');
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1]?.trim() ?? '';
    const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1]?.trim() ?? '';
    const headings = Array.from(html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)).map((m) => ({ level: Number(m[1]), text: stripTags(m[2] ?? '').slice(0, 180) })).filter((h) => h.text);
    const links = tags(html, 'a').map((t) => ({ text: stripTags(t.inner).slice(0, 120), href: attr(t.full, 'href') })).filter((l) => l.href).slice(0, 80);
    const buttons = [...tags(html, 'button').map((t) => stripTags(t.inner)), ...openTags(html, 'input').filter((t) => ['submit','button'].includes(attr(t,'type').toLowerCase())).map((t) => attr(t,'value') || attr(t,'aria-label'))].filter(Boolean).slice(0,40);
    const labels = new Map<string,string>();
    tags(html,'label').forEach((t) => { const f = attr(t.full,'for'); const text = stripTags(t.inner); if (f && text) labels.set(f,text); });
    const forms = tags(html, 'form').map((f) => {
      const inputTags = [...openTags(f.full,'input'), ...tags(f.full,'textarea').map((t)=>t.full), ...tags(f.full,'select').map((t)=>t.full)];
      return { inputs: inputTags.map((t) => { const id = attr(t,'id'); return { type: attr(t,'type') || 'text', name: attr(t,'name'), id, placeholder: attr(t,'placeholder'), label: id ? labels.get(id) ?? '' : '' }; }) };
    });
    const images = openTags(html, 'img').map((t) => ({ alt: attr(t,'alt'), src: attr(t,'src') })).slice(0,120);
    const text = stripTags(html);
    return {
      url: normalized, finalUrl, status: res.status, title, description, lang,
      h1: headings.filter((h)=>h.level===1).map((h)=>h.text),
      h2: headings.filter((h)=>h.level===2).map((h)=>h.text),
      h3: headings.filter((h)=>h.level===3).map((h)=>h.text),
      headings, links, buttons, images, forms,
      landmarks: { header: openTags(html,'header').length, nav: openTags(html,'nav').length, main: openTags(html,'main').length, footer: openTags(html,'footer').length, aside: openTags(html,'aside').length },
      text, wordCount: text ? text.split(/\s+/).length : 0, colorPairs: colorPairs(html),
    };
  } finally { clearTimeout(timeout); }
}

export function buildRealAuditReport(ex: ExtractedPage, plan: 'free' | 'pro' = 'free'): AuditReport {
  const site = siteNameFromUrl(ex.finalUrl || ex.url);
  const id = slugFromUrl(ex.finalUrl || ex.url);
  const missingAlt = ex.images.filter((i) => !i.alt).length;
  const totalInputs = ex.forms.reduce((s, f) => s + f.inputs.length, 0);
  const unlabeledInputs = ex.forms.reduce((s, f) => s + f.inputs.filter((i) => !i.label && !i.placeholder && i.type !== 'hidden').length, 0);
  const vagueLinks = ex.links.filter((l) => /^(click here|learn more|read more|more|here)$/i.test(l.text.trim())).length;
  const hasH1 = ex.h1.length === 1, multipleH1 = ex.h1.length > 1, skipped = headingSkip(ex.headings);
  const hasCta = ex.buttons.length > 0 || ex.links.some((l) => /start|get|try|book|buy|sign|subscribe|demo|audit|contact|alert|score/i.test(l.text));
  const checks = ex.colorPairs.map((p) => { const ratio = getContrastRatio(p.foreground, p.background); return { ...p, ratio, passesAA: ratio >= 4.5, recommendation: ratio >= 4.5 ? 'This detected pair appears to meet WCAG AA contrast.' : 'Increase contrast to at least 4.5:1 for normal text.' }; });
  const contrastFailures = checks.filter((c) => !c.passesAA).length;
  const accessibility = clamp(92 - (!ex.lang ? 8 : 0) - (!hasH1 ? 10 : 0) - (multipleH1 ? 6 : 0) - (skipped ? 7 : 0) - Math.min(18, missingAlt*3) - Math.min(18, unlabeledInputs*5) - Math.min(12, contrastFailures*4));
  const usability = clamp(90 - (!ex.title ? 8 : 0) - (!ex.description ? 5 : 0) - (!hasCta ? 14 : 0) - (ex.wordCount < 120 ? 8 : 0) - Math.min(12, vagueLinks*3));
  const conversion = clamp(88 - (!hasCta ? 18 : 0) - (ex.buttons.length === 0 ? 8 : 0) - (ex.description.length < 80 ? 5 : 0) - Math.min(10, totalInputs > 6 ? (totalInputs-6)*2 : 0));
  const visualDesign = clamp(84 - Math.min(10, contrastFailures*4) - (ex.headings.length < 3 ? 5 : 0) - (ex.images.length === 0 ? 4 : 0));
  const wcag = clamp(92 - (!ex.lang ? 9 : 0) - (!hasH1 ? 10 : 0) - (skipped ? 8 : 0) - Math.min(20, missingAlt*3) - Math.min(20, unlabeledInputs*5) - Math.min(15, contrastFailures*5));
  const heuristics = clamp(90 - (!hasCta ? 10 : 0) - (!ex.description ? 6 : 0) - Math.min(10, vagueLinks*2) - (totalInputs > 8 ? 7 : 0));
  const score = clamp((accessibility + usability + conversion + visualDesign + wcag + heuristics) / 6 + (plan === 'pro' ? 2 : 0));

  const wcagChecks: AuditReport['wcagChecks'] = [
    { criterion: 'WCAG 2.4.2 Page Titled', status: ex.title ? 'pass' : 'warning', note: ex.title ? `Page title found: ${ex.title.slice(0,100)}.` : 'No page title was found.' },
    { criterion: 'WCAG 3.1.1 Language of Page', status: ex.lang ? 'pass' : 'warning', note: ex.lang ? `HTML language is set to ${ex.lang}.` : 'The html lang attribute was not detected.' },
    { criterion: 'WCAG 1.3.1 Info and Relationships', status: hasH1 && !skipped ? 'pass' : 'warning', note: hasH1 ? (skipped ? 'A primary H1 exists, but heading levels appear to skip.' : 'A single primary H1 and heading structure were detected.') : (multipleH1 ? 'Multiple H1 headings were detected.' : 'No H1 heading was detected.') },
    { criterion: 'WCAG 1.1.1 Non-text Content', status: missingAlt === 0 ? 'pass' : missingAlt > 4 ? 'fail' : 'warning', note: `${missingAlt} of ${ex.images.length} images appear to be missing alt text.` },
    { criterion: 'WCAG 3.3.2 Labels or Instructions', status: unlabeledInputs === 0 ? 'pass' : unlabeledInputs > 2 ? 'fail' : 'warning', note: `${unlabeledInputs} of ${totalInputs} detected form fields appear to be missing an associated label or placeholder.` },
    { criterion: 'WCAG 1.4.3 Contrast Minimum', status: contrastFailures === 0 ? 'pass' : 'warning', note: `${contrastFailures} detected color pair(s) may not meet 4.5:1 contrast. Browser rendering is recommended for full CSS coverage.` },
  ];

  const heuristicChecks: AuditReport['heuristicChecks'] = [
    { heuristic: 'Visibility of system status', status: hasCta ? 'pass' : 'warning', note: hasCta ? 'Primary action cues were detected.' : 'No obvious primary action was detected in links or buttons.' },
    { heuristic: 'Match between system and real world', status: ex.h1.length || ex.description ? 'pass' : 'warning', note: ex.h1[0] || ex.description || 'The page needs clearer language to explain what users can do.' },
    { heuristic: 'Consistency and standards', status: ex.landmarks.nav && ex.landmarks.main ? 'pass' : 'warning', note: ex.landmarks.nav && ex.landmarks.main ? 'Navigation and main landmarks were detected.' : 'Navigation/main landmarks should be strengthened.' },
    { heuristic: 'Recognition rather than recall', status: vagueLinks < 3 ? 'pass' : 'warning', note: vagueLinks ? `${vagueLinks} vague link labels were detected.` : 'Link labels appear reasonably descriptive.' },
    { heuristic: 'Error prevention', status: totalInputs <= 6 && unlabeledInputs === 0 ? 'pass' : 'warning', note: totalInputs ? `Detected ${totalInputs} form input(s), with ${unlabeledInputs} likely missing labels/instructions.` : 'No forms were detected on the audited page.' },
  ];

  const issues: AuditIssue[] = [];
  if (!hasCta) issues.push({ severity:'HIGH', title:'No obvious primary call-to-action detected', detail:'The crawler did not find a clear action-oriented button or link.', recommendation:'Add a visually dominant primary CTA above the fold and repeat it after key proof sections.', impact:'High', effort:'Low', heuristic:'Visibility of system status', category:'Nielsen Norman' });
  if (!hasH1 || multipleH1 || skipped) issues.push({ severity:'HIGH', title:'Heading hierarchy needs accessibility review', detail:`Detected ${ex.h1.length} H1 heading(s). Heading skip detected: ${skipped ? 'yes' : 'no'}.`, recommendation:'Use one descriptive H1, then structure content with logical H2 and H3 sections.', impact:'High', effort:'Low', wcag:'WCAG 1.3.1; WCAG 2.4.6', category:'WCAG' });
  if (missingAlt > 0) issues.push({ severity: missingAlt > 4 ? 'HIGH':'MED', title:'Images missing alt text', detail:`${missingAlt} image(s) appear to be missing alt text.`, recommendation:'Add meaningful alt text for informative images and empty alt text for decorative images.', impact:'High', effort:'Medium', wcag:'WCAG 1.1.1', category:'WCAG' });
  if (unlabeledInputs > 0) issues.push({ severity:'HIGH', title:'Form fields may be missing labels', detail:`${unlabeledInputs} detected form field(s) appear to lack a visible or programmatic label.`, recommendation:'Add persistent visible labels and accessible error/help text for each input.', impact:'High', effort:'Medium', wcag:'WCAG 3.3.2', heuristic:'Error prevention', category:'WCAG' });
  if (contrastFailures > 0) issues.push({ severity:'MED', title:'Color contrast needs review', detail:`${contrastFailures} detected color pair(s) may not meet WCAG AA contrast.`, recommendation:'Increase text/background contrast to at least 4.5:1 for normal text and avoid relying on color alone.', impact:'High', effort:'Low', wcag:'WCAG 1.4.3', category:'WCAG' });
  if (!ex.description || ex.description.length < 80) issues.push({ severity:'MED', title:'Meta/value summary is weak or missing', detail: ex.description ? `Meta description is short: ${ex.description}` : 'No meta description was detected.', recommendation:'Add a concise, benefit-led page description explaining who the site is for and what action users should take.', impact:'Medium', effort:'Low', heuristic:'Match between system and real world', category:'Nielsen Norman' });
  if (plan === 'pro') issues.push({ severity:'MED', title:'AI opportunity: prioritize fixes by conversion impact', detail:'The audit can be converted into a measurable optimization backlog.', recommendation:'Test primary CTA copy, contrast, hero hierarchy, trust placement, form length, and pricing page hierarchy as separate experiments.', impact:'High', effort:'Medium', category:'AI' });
  if (issues.length === 0) issues.push({ severity:'LOW', title:'No critical structural issues detected in first-pass crawl', detail:'The crawler did not detect major title, heading, image alt, form label, CTA, or contrast issues.', recommendation:'Run a deeper browser-rendered audit next to validate dynamic content, responsive states, keyboard behavior, and full CSS contrast.', impact:'Medium', effort:'Medium', category:'Nielsen Norman' });

  return {
    id, site, url: ex.finalUrl || ex.url, score,
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    plan, auditMode: plan,
    summary: score >= 80 ? `${site} has a strong first-pass UX and accessibility foundation.` : score >= 65 ? `${site} has a usable foundation, but the crawl found issues in structure, accessibility, clarity, or conversion hierarchy.` : `${site} has several high-priority UX/accessibility issues detected from the live page crawl.`,
    metrics: { usability, accessibility, conversion, visualDesign, wcag, heuristics },
    issues, recommendations: issues.map((i)=>i.recommendation), contrastChecks: checks, wcagChecks, heuristicChecks, extraction: ex,
  };
}

export function dbReportToAuditReport(row: any): AuditReport {
  const raw = row.raw_audit ?? {};
  return {
    id: row.id, site: row.site_name, url: row.url, score: row.score,
    date: new Date(row.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    plan: row.plan === 'pro' ? 'pro':'free', auditMode: row.audit_mode === 'pro' ? 'pro':'free',
    summary: row.summary ?? '', metrics: row.metrics ?? {}, issues: row.issues ?? [], recommendations: row.recommendations ?? [],
    contrastChecks: row.contrast_checks ?? [], wcagChecks: row.wcag_checks ?? [], heuristicChecks: row.heuristic_checks ?? [],
    extraction: raw.extraction ?? { url: row.url, finalUrl: row.url, status:0, title:'', description:'', lang:'', h1:[], h2:[], h3:[], headings:[], links:[], buttons:[], images:[], forms:[], landmarks:{header:0,nav:0,main:0,footer:0,aside:0}, text:'', wordCount:0, colorPairs:[] },
    aiNotes: raw.aiNotes ?? [],
  };
}
