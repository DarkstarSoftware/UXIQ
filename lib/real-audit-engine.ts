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
  url: string;
  finalUrl: string;
  status: number;
  title: string;
  description: string;
  lang: string;
  h1: string[];
  h2: string[];
  h3: string[];
  headings: Array<{ level: number; text: string }>;
  links: Array<{ text: string; href: string; ariaLabel?: string }>;
  buttons: string[];
  images: Array<{ alt: string; src: string }>;
  forms: Array<{ inputs: Array<{ type: string; name: string; id: string; placeholder: string; label: string; ariaLabel?: string }> }>;
  landmarks: { header: number; nav: number; main: number; footer: number; aside: number };
  text: string;
  wordCount: number;
  colorPairs: Array<{ foreground: string; background: string; usage: string }>;
  ctas: string[];
  emptyLinks: number;
  emptyButtons: number;
  trustSignals: string[];
  hasPricingSignal: boolean;
  hasContactSignal: boolean;
};

export type AuditReport = {
  id: string;
  site: string;
  url: string;
  score: number;
  date: string;
  plan: 'free' | 'pro';
  auditMode: 'free' | 'pro';
  summary: string;
  metrics: {
    usability: number;
    accessibility: number;
    conversion: number;
    visualDesign: number;
    wcag: number;
    heuristics: number;
  };
  issues: AuditIssue[];
  recommendations: string[];
  contrastChecks: Array<{
    foreground: string;
    background: string;
    ratio: number;
    passesAA: boolean;
    usage: string;
    recommendation: string;
  }>;
  wcagChecks: Array<{ criterion: string; status: 'pass' | 'warning' | 'fail'; note: string }>;
  heuristicChecks: Array<{ heuristic: string; status: 'pass' | 'warning' | 'fail'; note: string }>;
  extraction: ExtractedPage;
  screenshotUrl?: string;
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
    return first
      .split(/[-_]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  } catch {
    return 'Website';
  }
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(html: string) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(tag: string, name: string) {
  return tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1]?.trim() ?? '';
}

function tags(html: string, name: string) {
  const re = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'gi');
  return Array.from(html.matchAll(re)).map((match) => ({
    full: match[0],
    inner: match[1] ?? '',
  }));
}

function openTags(html: string, name: string) {
  return Array.from(html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))).map((match) => match[0]);
}

function normalizeHex(hexValue: string) {
  const clean = hexValue.replace('#', '').trim();
  if (clean.length === 3) {
    return `#${clean.split('').map((char) => `${char}${char}`).join('')}`.toUpperCase();
  }
  return `#${clean.slice(0, 6)}`.toUpperCase();
}

export function getContrastRatio(foreground: string, background: string) {
  function luminance(hexColor: string) {
    const clean = normalizeHex(hexColor).replace('#', '');
    const rgb = [0, 2, 4].map((index) => parseInt(clean.slice(index, index + 2), 16) / 255);
    const linear = rgb.map((value) =>
      value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4),
    );
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

function extractColorPairs(html: string) {
  const pairs: Array<{ foreground: string; background: string; usage: string }> = [];

  for (const match of html.matchAll(/style\s*=\s*["']([^"']+)["']/gi)) {
    const style = match[1] ?? '';
    const color = style.match(/(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3,6})/i)?.[1];
    const background =
      style.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i)?.[1] ??
      style.match(/(?:^|;)\s*background\s*:\s*(#[0-9a-fA-F]{3,6})/i)?.[1];

    if (color && background) {
      pairs.push({
        foreground: normalizeHex(color),
        background: normalizeHex(background),
        usage: 'Inline styled text',
      });
    }
  }

  const tokenColors = Array.from(html.matchAll(/--[a-zA-Z0-9-_]+\s*:\s*(#[0-9a-fA-F]{3,6})/g))
    .map((match) => normalizeHex(match[1]))
    .filter(Boolean);

  const uniqueTokens = Array.from(new Set(tokenColors));
  if (pairs.length < 3 && uniqueTokens.length >= 2) {
    pairs.push({
      foreground: uniqueTokens[0],
      background: uniqueTokens[1],
      usage: 'Detected CSS token pair',
    });
  }

  pairs.push({ foreground: '#FFFFFF', background: '#4F46E5', usage: 'Primary CTA reference' });
  pairs.push({ foreground: '#94A3B8', background: '#111827', usage: 'Muted text on dark surface reference' });

  return pairs.slice(0, 10);
}

function headingSkip(headings: Array<{ level: number; text: string }>) {
  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index].level - headings[index - 1].level > 1) return true;
  }
  return false;
}

function clampScore(value: number) {
  return Math.max(20, Math.min(98, Math.round(value)));
}

function detectCtas(links: ExtractedPage['links'], buttons: string[]) {
  const pattern = /(start|get|try|book|buy|sign|subscribe|demo|audit|contact|download|compare|upgrade|create|request|schedule|learn|join|pricing|checkout|analyze|score)/i;
  return [
    ...buttons.filter((button) => pattern.test(button)),
    ...links.filter((link) => pattern.test(`${link.text} ${link.ariaLabel ?? ''}`)).map((link) => link.text || link.ariaLabel || link.href),
  ].filter(Boolean).slice(0, 12);
}

function detectTrustSignals(text: string) {
  const signals: Array<[string, RegExp]> = [
    ['testimonial', /testimonial|review|rated|stars|customer story/i],
    ['security', /secure|security|privacy|encrypted|compliance|gdpr|soc 2|hipaa/i],
    ['social proof', /trusted by|customers|teams|companies|users|clients/i],
    ['support', /support|help center|documentation|contact us|chat/i],
    ['guarantee', /guarantee|refund|cancel anytime|no risk/i],
    ['pricing clarity', /pricing|plans|subscription|monthly|annually|free trial/i],
  ];

  return signals
    .filter(([, regex]) => regex.test(text))
    .map(([label]) => label);
}

function status(pass: boolean, fail = false): 'pass' | 'warning' | 'fail' {
  if (pass) return 'pass';
  return fail ? 'fail' : 'warning';
}

function severityFromCount(count: number, highAt: number): 'HIGH' | 'MED' | 'LOW' {
  if (count >= highAt) return 'HIGH';
  if (count > 0) return 'MED';
  return 'LOW';
}

export async function crawlWebsite(url: string): Promise<ExtractedPage> {
  const normalized = normalizeAuditUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(normalized, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'AIUXInsightBot/2.0 (+https://www.aiuxinsight.com)',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    const html = await response.text();
    const finalUrl = response.url || normalized;
    const title = stripTags(tags(html, 'title')[0]?.inner ?? '');
    const description =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1]?.trim() ??
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1]?.trim() ??
      '';
    const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1]?.trim() ?? '';

    const headings = Array.from(html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi))
      .map((match) => ({
        level: Number(match[1]),
        text: stripTags(match[2] ?? '').slice(0, 180),
      }))
      .filter((heading) => heading.text);

    const links = tags(html, 'a')
      .map((tag) => ({
        text: stripTags(tag.inner).slice(0, 140),
        href: attr(tag.full, 'href'),
        ariaLabel: attr(tag.full, 'aria-label'),
      }))
      .filter((link) => link.href || link.text || link.ariaLabel)
      .slice(0, 120);

    const rawButtons = [
      ...tags(html, 'button').map((tag) => stripTags(tag.inner) || attr(tag.full, 'aria-label') || attr(tag.full, 'title')),
      ...openTags(html, 'input')
        .filter((tag) => ['submit', 'button', 'reset'].includes(attr(tag, 'type').toLowerCase()))
        .map((tag) => attr(tag, 'value') || attr(tag, 'aria-label') || attr(tag, 'title')),
      ...openTags(html, 'a')
        .filter((tag) => /role\s*=\s*["']button["']/i.test(tag))
        .map((tag) => attr(tag, 'aria-label') || attr(tag, 'title')),
    ];

    const buttons = rawButtons.filter(Boolean).slice(0, 60);
    const emptyButtons = rawButtons.filter((button) => !button || !button.trim()).length;

    const labelMap = new Map<string, string>();
    tags(html, 'label').forEach((tag) => {
      const forId = attr(tag.full, 'for');
      const text = stripTags(tag.inner);
      if (forId && text) labelMap.set(forId, text);
    });

    const forms = tags(html, 'form').map((form) => {
      const inputTags = [
        ...openTags(form.full, 'input'),
        ...tags(form.full, 'textarea').map((tag) => tag.full),
        ...tags(form.full, 'select').map((tag) => tag.full),
      ];

      return {
        inputs: inputTags.map((tag) => {
          const id = attr(tag, 'id');
          const tagName = tag.match(/^<textarea/i) ? 'textarea' : tag.match(/^<select/i) ? 'select' : 'input';
          return {
            type: attr(tag, 'type') || tagName,
            name: attr(tag, 'name'),
            id,
            placeholder: attr(tag, 'placeholder'),
            label: id ? labelMap.get(id) ?? '' : '',
            ariaLabel: attr(tag, 'aria-label'),
          };
        }),
      };
    });

    const images = openTags(html, 'img')
      .map((tag) => ({
        alt: attr(tag, 'alt'),
        src: attr(tag, 'src'),
      }))
      .slice(0, 150);

    const text = stripTags(html);
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const emptyLinks = links.filter((link) => !link.text && !link.ariaLabel).length;
    const ctas = detectCtas(links, buttons);
    const trustSignals = detectTrustSignals(text);

    return {
      url: normalized,
      finalUrl,
      status: response.status,
      title,
      description,
      lang,
      h1: headings.filter((heading) => heading.level === 1).map((heading) => heading.text),
      h2: headings.filter((heading) => heading.level === 2).map((heading) => heading.text),
      h3: headings.filter((heading) => heading.level === 3).map((heading) => heading.text),
      headings,
      links,
      buttons,
      images,
      forms,
      landmarks: {
        header: openTags(html, 'header').length,
        nav: openTags(html, 'nav').length,
        main: openTags(html, 'main').length,
        footer: openTags(html, 'footer').length,
        aside: openTags(html, 'aside').length,
      },
      text,
      wordCount,
      colorPairs: extractColorPairs(html),
      ctas,
      emptyLinks,
      emptyButtons,
      trustSignals,
      hasPricingSignal: /pricing|plans|subscription|monthly|annually|free trial/i.test(text),
      hasContactSignal: /contact|support|help|schedule|demo|talk to/i.test(text),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function buildRealAuditReport(ex: ExtractedPage, plan: 'free' | 'pro' = 'free'): AuditReport {
  const site = siteNameFromUrl(ex.finalUrl || ex.url);
  const id = slugFromUrl(ex.finalUrl || ex.url);

  const missingAlt = ex.images.filter((image) => !image.alt).length;
  const totalInputs = ex.forms.reduce((sum, form) => sum + form.inputs.length, 0);
  const unlabeledInputs = ex.forms.reduce(
    (sum, form) =>
      sum +
      form.inputs.filter((input) => {
        const type = input.type.toLowerCase();
        return type !== 'hidden' && !input.label && !input.placeholder && !input.ariaLabel;
      }).length,
    0,
  );

  const hasH1 = ex.h1.length === 1;
  const multipleH1 = ex.h1.length > 1;
  const skippedHeadings = headingSkip(ex.headings);
  const vagueLinks = ex.links.filter((link) => /^(click here|learn more|read more|more|here)$/i.test(link.text.trim())).length;
  const contrastChecks = ex.colorPairs.map((pair) => {
    const ratio = getContrastRatio(pair.foreground, pair.background);
    return {
      foreground: pair.foreground,
      background: pair.background,
      usage: pair.usage,
      ratio,
      passesAA: ratio >= 4.5,
      recommendation:
        ratio >= 4.5
          ? 'This detected color pair appears to meet WCAG AA contrast.'
          : 'Increase text/background contrast to at least 4.5:1 for normal text.',
    };
  });
  const contrastFailures = contrastChecks.filter((check) => !check.passesAA).length;

  const hasMain = ex.landmarks.main > 0;
  const hasNav = ex.landmarks.nav > 0;
  const hasFooter = ex.landmarks.footer > 0;
  const hasCta = ex.ctas.length > 0;
  const hasTrust = ex.trustSignals.length > 0;
  const titleTooLong = ex.title.length > 65;
  const descriptionWeak = !ex.description || ex.description.length < 80;
  const lowContent = ex.wordCount < 120;
  const textHeavy = ex.wordCount > 2200;
  const formFriction = totalInputs > 7;

  const accessibility = clampScore(
    94
      - (!ex.lang ? 8 : 0)
      - (!hasH1 ? 10 : 0)
      - (multipleH1 ? 7 : 0)
      - (skippedHeadings ? 7 : 0)
      - (!hasMain ? 6 : 0)
      - Math.min(20, missingAlt * 3)
      - Math.min(20, unlabeledInputs * 5)
      - Math.min(12, ex.emptyLinks * 2)
      - Math.min(10, ex.emptyButtons * 3)
      - Math.min(14, contrastFailures * 4),
  );

  const usability = clampScore(
    92
      - (!ex.title ? 8 : 0)
      - (titleTooLong ? 4 : 0)
      - (descriptionWeak ? 5 : 0)
      - (!hasNav ? 6 : 0)
      - (!hasMain ? 5 : 0)
      - (!hasCta ? 12 : 0)
      - (lowContent ? 8 : 0)
      - (textHeavy ? 6 : 0)
      - Math.min(12, vagueLinks * 3),
  );

  const conversion = clampScore(
    90
      - (!hasCta ? 18 : 0)
      - (ex.ctas.length > 7 ? 5 : 0)
      - (descriptionWeak ? 6 : 0)
      - (!hasTrust ? 8 : 0)
      - (!ex.hasContactSignal ? 4 : 0)
      - (formFriction ? 9 : 0)
      - Math.min(12, unlabeledInputs * 3),
  );

  const visualDesign = clampScore(
    86
      - Math.min(12, contrastFailures * 4)
      - (ex.headings.length < 3 ? 5 : 0)
      - (textHeavy ? 8 : 0)
      - (ex.images.length === 0 ? 4 : 0)
      - (!hasCta ? 5 : 0),
  );

  const wcag = clampScore(
    94
      - (!ex.lang ? 9 : 0)
      - (!hasH1 ? 10 : 0)
      - (multipleH1 ? 7 : 0)
      - (skippedHeadings ? 8 : 0)
      - (!hasMain ? 6 : 0)
      - Math.min(22, missingAlt * 3)
      - Math.min(22, unlabeledInputs * 5)
      - Math.min(14, contrastFailures * 5)
      - Math.min(8, ex.emptyLinks * 2)
      - Math.min(8, ex.emptyButtons * 2),
  );

  const heuristics = clampScore(
    92
      - (!hasCta ? 10 : 0)
      - (descriptionWeak ? 6 : 0)
      - Math.min(10, vagueLinks * 2)
      - (formFriction ? 7 : 0)
      - (!hasNav ? 6 : 0)
      - (!hasFooter ? 4 : 0)
      - (textHeavy ? 5 : 0),
  );

  const score = clampScore((accessibility + usability + conversion + visualDesign + wcag + heuristics) / 6 + (plan === 'pro' ? 2 : 0));

  const wcagChecks: AuditReport['wcagChecks'] = [
    {
      criterion: 'WCAG 2.4.2 Page Titled',
      status: status(Boolean(ex.title), true),
      note: ex.title ? `Page title found: ${ex.title}.` : 'No page title was detected.',
    },
    {
      criterion: 'WCAG 3.1.1 Language of Page',
      status: status(Boolean(ex.lang), true),
      note: ex.lang ? `HTML language is set to ${ex.lang}.` : 'The html lang attribute was not detected.',
    },
    {
      criterion: 'WCAG 1.3.1 Info and Relationships',
      status: hasH1 && !multipleH1 && !skippedHeadings ? 'pass' : 'warning',
      note: hasH1 && !skippedHeadings
        ? 'A single H1 and reasonable heading structure were detected.'
        : `Detected ${ex.h1.length} H1 heading(s). Heading skip detected: ${skippedHeadings ? 'yes' : 'no'}.`,
    },
    {
      criterion: 'WCAG 1.1.1 Non-text Content',
      status: missingAlt === 0 ? 'pass' : missingAlt > 4 ? 'fail' : 'warning',
      note: `${missingAlt} of ${ex.images.length} image(s) appear to be missing alt text.`,
    },
    {
      criterion: 'WCAG 3.3.2 Labels or Instructions',
      status: unlabeledInputs === 0 ? 'pass' : unlabeledInputs > 2 ? 'fail' : 'warning',
      note: `${unlabeledInputs} of ${totalInputs} detected form field(s) may be missing labels or instructions.`,
    },
    {
      criterion: 'WCAG 1.4.3 Contrast Minimum',
      status: contrastFailures === 0 ? 'pass' : 'warning',
      note: `${contrastFailures} detected color pair(s) may not meet 4.5:1 contrast. Browser-rendered testing is recommended for complete coverage.`,
    },
    {
      criterion: 'WCAG 2.4.4 Link Purpose',
      status: ex.emptyLinks === 0 && vagueLinks < 3 ? 'pass' : 'warning',
      note: `${ex.emptyLinks} empty link(s) and ${vagueLinks} vague link label(s) detected.`,
    },
    {
      criterion: 'WCAG 4.1.2 Name, Role, Value',
      status: ex.emptyButtons === 0 ? 'pass' : 'warning',
      note: `${ex.emptyButtons} button(s) may be missing accessible text.`,
    },
    {
      criterion: 'Landmark Structure',
      status: hasMain && hasNav ? 'pass' : 'warning',
      note: `Detected landmarks: main ${ex.landmarks.main}, nav ${ex.landmarks.nav}, header ${ex.landmarks.header}, footer ${ex.landmarks.footer}.`,
    },
  ];

  const heuristicChecks: AuditReport['heuristicChecks'] = [
    {
      heuristic: 'Visibility of system status',
      status: hasCta ? 'pass' : 'warning',
      note: hasCta ? `Detected ${ex.ctas.length} likely CTA(s).` : 'No clear primary CTA was detected.',
    },
    {
      heuristic: 'Match between system and the real world',
      status: !descriptionWeak && ex.h1.length > 0 ? 'pass' : 'warning',
      note: descriptionWeak ? 'The value proposition/meta description is weak or missing.' : 'Page language provides a detectable summary and heading.',
    },
    {
      heuristic: 'User control and freedom',
      status: ex.hasContactSignal || hasNav ? 'pass' : 'warning',
      note: ex.hasContactSignal ? 'Contact/support path was detected.' : 'Make support, contact, or escape paths easier to find.',
    },
    {
      heuristic: 'Consistency and standards',
      status: hasNav && hasMain && hasFooter ? 'pass' : 'warning',
      note: hasNav && hasMain && hasFooter ? 'Core page landmarks were detected.' : 'Navigation, main, or footer landmarks should be strengthened.',
    },
    {
      heuristic: 'Error prevention',
      status: totalInputs <= 7 && unlabeledInputs === 0 ? 'pass' : 'warning',
      note: totalInputs ? `Detected ${totalInputs} form input(s), with ${unlabeledInputs} likely missing labels/instructions.` : 'No forms were detected.',
    },
    {
      heuristic: 'Recognition rather than recall',
      status: vagueLinks < 3 ? 'pass' : 'warning',
      note: vagueLinks ? `${vagueLinks} vague link label(s) were detected.` : 'Link labels appear reasonably descriptive.',
    },
    {
      heuristic: 'Aesthetic and minimalist design',
      status: !textHeavy ? 'pass' : 'warning',
      note: textHeavy ? 'The page may be text-heavy and difficult to scan.' : 'Text volume appears reasonably scannable.',
    },
    {
      heuristic: 'Help and documentation',
      status: ex.hasContactSignal || ex.trustSignals.includes('support') ? 'pass' : 'warning',
      note: ex.hasContactSignal ? 'Help/contact language was detected.' : 'Add clearer support, help, or documentation paths.',
    },
  ];

  const issues: AuditIssue[] = [];

  if (!hasCta) {
    issues.push({
      severity: 'HIGH',
      title: 'No clear primary call-to-action detected',
      detail: 'The audit did not detect a clear action-oriented button or link.',
      recommendation: 'Add a visually dominant primary CTA above the fold and repeat it after major content sections.',
      impact: 'High',
      effort: 'Low',
      heuristic: 'Visibility of system status',
      category: 'Conversion',
    });
  }

  if (!hasH1 || multipleH1 || skippedHeadings) {
    issues.push({
      severity: 'HIGH',
      title: 'Heading hierarchy needs accessibility review',
      detail: `Detected ${ex.h1.length} H1 heading(s). Heading skip detected: ${skippedHeadings ? 'yes' : 'no'}.`,
      recommendation: 'Use one descriptive H1, then structure content with logical H2 and H3 sections.',
      impact: 'High',
      effort: 'Low',
      wcag: 'WCAG 1.3.1 Info and Relationships; WCAG 2.4.6 Headings and Labels',
      category: 'WCAG',
    });
  }

  if (missingAlt > 0) {
    issues.push({
      severity: severityFromCount(missingAlt, 5),
      title: 'Images missing alt text',
      detail: `${missingAlt} image(s) appear to be missing alt text.`,
      recommendation: 'Add meaningful alt text for informative images and empty alt text for decorative images.',
      impact: 'High',
      effort: 'Medium',
      wcag: 'WCAG 1.1.1 Non-text Content',
      category: 'WCAG',
    });
  }

  if (unlabeledInputs > 0) {
    issues.push({
      severity: 'HIGH',
      title: 'Form fields may be missing labels',
      detail: `${unlabeledInputs} detected form field(s) appear to lack a visible label, placeholder, or aria-label.`,
      recommendation: 'Add persistent visible labels and accessible help/error text for each form field.',
      impact: 'High',
      effort: 'Medium',
      wcag: 'WCAG 3.3.2 Labels or Instructions',
      heuristic: 'Error prevention',
      category: 'WCAG',
    });
  }

  if (contrastFailures > 0) {
    issues.push({
      severity: 'MED',
      title: 'Detected color contrast needs review',
      detail: `${contrastFailures} detected color pair(s) may not meet WCAG AA contrast.`,
      recommendation: 'Increase text/background contrast to at least 4.5:1 for normal text and verify with browser-rendered testing.',
      impact: 'High',
      effort: 'Low',
      wcag: 'WCAG 1.4.3 Contrast Minimum',
      category: 'WCAG',
    });
  }

  if (descriptionWeak) {
    issues.push({
      severity: 'MED',
      title: 'Value proposition is weak or missing',
      detail: ex.description ? `Meta description is short: ${ex.description}` : 'No meta description was detected.',
      recommendation: 'Add a concise, benefit-led page description that explains who the site is for and why users should act.',
      impact: 'Medium',
      effort: 'Low',
      heuristic: 'Match between system and the real world',
      category: 'Nielsen Norman',
    });
  }

  if (!hasTrust) {
    issues.push({
      severity: 'MED',
      title: 'Trust signals are limited',
      detail: 'The audit did not detect strong trust indicators such as testimonials, security language, customer proof, or support language.',
      recommendation: 'Add trust-building elements near decision points, including customer proof, reviews, security/privacy language, or clear support options.',
      impact: 'High',
      effort: 'Medium',
      category: 'Conversion',
    });
  }

  if (formFriction) {
    issues.push({
      severity: 'MED',
      title: 'Forms may create conversion friction',
      detail: `Detected ${totalInputs} form fields on the audited page.`,
      recommendation: 'Reduce unnecessary fields, group related fields, and clarify required inputs to lower completion friction.',
      impact: 'Medium',
      effort: 'Medium',
      heuristic: 'Error prevention',
      category: 'Conversion',
    });
  }

  if (ex.emptyLinks > 0 || ex.emptyButtons > 0) {
    issues.push({
      severity: 'MED',
      title: 'Interactive elements may lack accessible names',
      detail: `Detected ${ex.emptyLinks} empty link(s) and ${ex.emptyButtons} button(s) with limited accessible text.`,
      recommendation: 'Ensure every link and button has descriptive visible text or an aria-label.',
      impact: 'High',
      effort: 'Low',
      wcag: 'WCAG 2.4.4 Link Purpose; WCAG 4.1.2 Name, Role, Value',
      category: 'WCAG',
    });
  }

  if (issues.length === 0) {
    issues.push({
      severity: 'LOW',
      title: 'No critical first-pass issues detected',
      detail: 'The audit did not detect major structural, accessibility, CTA, trust, or conversion problems in the HTML crawl.',
      recommendation: 'Run browser-rendered testing next to validate dynamic content, keyboard behavior, responsive states, and full CSS contrast.',
      impact: 'Medium',
      effort: 'Medium',
      category: 'Nielsen Norman',
    });
  }

  if (plan === 'pro') {
    issues.push({
      severity: 'MED',
      title: 'AI opportunity: prioritize fixes by conversion impact',
      detail: 'The audit can be translated into an experiment-backed optimization backlog.',
      recommendation: 'Test CTA copy, hero hierarchy, trust placement, form friction, and accessibility fixes as separate experiments.',
      impact: 'High',
      effort: 'Medium',
      category: 'AI',
    });
  }

  return {
    id,
    site,
    url: ex.finalUrl || ex.url,
    score,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    plan,
    auditMode: plan,
    summary:
      score >= 82
        ? `${site} shows a strong UX foundation with targeted opportunities to improve accessibility, trust, and conversion performance.`
        : score >= 66
          ? `${site} has a usable foundation, but the audit found opportunities in accessibility, structure, CTA clarity, trust, or conversion hierarchy.`
          : `${site} has several high-priority UX, accessibility, and conversion issues that should be addressed before relying on the page for growth.`,
    metrics: { usability, accessibility, conversion, visualDesign, wcag, heuristics },
    issues,
    recommendations: issues.map((issue) => issue.recommendation),
    contrastChecks,
    wcagChecks,
    heuristicChecks,
    extraction: ex,
  };
}

export function dbReportToAuditReport(row: any): AuditReport {
  const raw = row.raw_audit ?? {};
  const fallbackExtraction: ExtractedPage = {
    url: row.url,
    finalUrl: row.url,
    status: 0,
    title: '',
    description: '',
    lang: '',
    h1: [],
    h2: [],
    h3: [],
    headings: [],
    links: [],
    buttons: [],
    images: [],
    forms: [],
    landmarks: { header: 0, nav: 0, main: 0, footer: 0, aside: 0 },
    text: '',
    wordCount: 0,
    colorPairs: [],
    ctas: [],
    emptyLinks: 0,
    emptyButtons: 0,
    trustSignals: [],
    hasPricingSignal: false,
    hasContactSignal: false,
  };

  return {
    id: row.id,
    site: row.site_name,
    url: row.url,
    score: row.score,
    date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    plan: row.plan === 'pro' ? 'pro' : 'free',
    auditMode: row.audit_mode === 'pro' ? 'pro' : 'free',
    summary: row.summary ?? '',
    metrics: row.metrics ?? {},
    issues: row.issues ?? [],
    recommendations: row.recommendations ?? [],
    contrastChecks: row.contrast_checks ?? [],
    wcagChecks: row.wcag_checks ?? [],
    heuristicChecks: row.heuristic_checks ?? [],
    extraction: { ...fallbackExtraction, ...(raw.extraction ?? {}) },
    screenshotUrl: row.screenshot_url ?? raw.screenshotUrl ?? undefined,
    aiNotes: raw.aiNotes ?? [],
  };
}
