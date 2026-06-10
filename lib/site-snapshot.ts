import { load } from 'cheerio';

export type SiteSnapshot = {
  url: string;
  normalizedUrl: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  buttonCount: number;
  formCount: number;
  inputCount: number;
  imageCount: number;
  linkCount: number;
  missingAltCount: number;
  textExcerpt: string;
  htmlExcerpt: string;
};

const FETCH_TIMEOUT_MS = 8000;

export function normalizeUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) throw new Error('URL is required.');
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export async function fetchSiteSnapshot(rawUrl: string): Promise<SiteSnapshot> {
  const normalizedUrl = normalizeUrl(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 UX Audit Bot',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) throw new Error(`Website returned ${response.status}.`);

    const html = await response.text();
    const $ = load(html);
    $('script, style, noscript, svg').remove();

    const text = $('body').text().replace(/\s+/g, ' ').trim();
    const h1 = $('h1').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get().filter(Boolean).slice(0, 6);
    const h2 = $('h2').map((_, el) => $(el).text().replace(/\s+/g, ' ').trim()).get().filter(Boolean).slice(0, 8);
    const imageCount = $('img').length;
    const missingAltCount = $('img').filter((_, el) => !($(el).attr('alt') || '').trim()).length;

    return {
      url: rawUrl,
      normalizedUrl,
      title: $('title').first().text().trim(),
      metaDescription: $('meta[name="description"]').attr('content') || '',
      h1,
      h2,
      buttonCount: $('button, a[role="button"], input[type="button"], input[type="submit"]').length,
      formCount: $('form').length,
      inputCount: $('input, textarea, select').length,
      imageCount,
      linkCount: $('a').length,
      missingAltCount,
      textExcerpt: text.slice(0, 2200),
      htmlExcerpt: html.replace(/\s+/g, ' ').slice(0, 3000),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Website fetch timed out.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
