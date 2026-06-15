import { chromium } from 'playwright';

export type PlaywrightCaptureResult = {
  title: string;
  html: string;
  screenshot: Buffer;
};

export async function captureWebsiteWithPlaywright(url: string): Promise<PlaywrightCaptureResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const title = await page.title();
    const html = await page.content();
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png',
    });

    return { title, html, screenshot };
  } finally {
    await browser.close();
  }
}
