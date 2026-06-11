import { load } from 'cheerio';

export type SiteSnapshot = {
  requestedUrl: string;
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
  textExcerpt: string;
  htmlExcerpt: string;
};

const FETCH_TIMEOUT_MS = 9000;

export function normalizeUrl(rawUrl: string) {
  const value = rawUrl.trim();

  if (!value) {
    throw new Error('A website URL is required.');
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `https://${value}`;
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 Darkstar Audit AI',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Website responded with status ${response.status}.`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchSiteSnapshot(normalizedUrl: string): Promise<SiteSnapshot> {
  const html = await fetchWithTimeout(normalizedUrl);
  const $ = load(html);

  $('script, style, noscript, svg').remove();

  const title = $('title').first().text().trim();
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';

  const h1 = $('h1')
    .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
    .get()
    .filter(Boolean)
    .slice(0, 6);

  const h2 = $('h2')
    .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
    .get()
    .filter(Boolean)
    .slice(0, 10);

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  return {
    requestedUrl: normalizedUrl,
    normalizedUrl,
    title,
    metaDescription,
    h1,
    h2,
    buttonCount: $('button, a[role="button"], input[type="submit"]').length,
    formCount: $('form').length,
    inputCount: $('input, textarea, select').length,
    imageCount: $('img').length,
    linkCount: $('a').length,
    textExcerpt: bodyText.slice(0, 3500),
    htmlExcerpt: html.replace(/\s+/g, ' ').slice(0, 3500),
  };
}
