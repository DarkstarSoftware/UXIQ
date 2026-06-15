import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content);
}

function patchRealAuditEngine() {
  const file = 'lib/real-audit-engine.ts';
  let content = read(file);

  if (!content.includes('screenshotUrl?: string;')) {
    content = content.replace(
      '  extraction: ExtractedPage;\n  aiNotes?: string[];',
      '  extraction: ExtractedPage;\n  screenshotUrl?: string;\n  aiNotes?: string[];',
    );
  }

  if (!content.includes('screenshotUrl: row.screenshot_url ?? raw.screenshotUrl ?? undefined,')) {
    content = content.replace(
      '    extraction: { ...fallbackExtraction, ...(raw.extraction ?? {}) },\n    aiNotes: raw.aiNotes ?? [],',
      '    extraction: { ...fallbackExtraction, ...(raw.extraction ?? {}) },\n    screenshotUrl: row.screenshot_url ?? raw.screenshotUrl ?? undefined,\n    aiNotes: raw.aiNotes ?? [],',
    );

    // fallback for older one-line dbReportToAuditReport formatting
    content = content.replace(
      '    extraction: raw.extraction ?? { url: row.url, finalUrl: row.url, status:0, title:\'\', description:\'\', lang:\'\', h1:[], h2:[], h3:[], headings:[], links:[], buttons:[], images:[], forms:[], landmarks:{header:0,nav:0,main:0,footer:0,aside:0}, text:\'\', wordCount:0, colorPairs:[] },\n    aiNotes: raw.aiNotes ?? [],',
      '    extraction: raw.extraction ?? { url: row.url, finalUrl: row.url, status:0, title:\'\', description:\'\', lang:\'\', h1:[], h2:[], h3:[], headings:[], links:[], buttons:[], images:[], forms:[], landmarks:{header:0,nav:0,main:0,footer:0,aside:0}, text:\'\', wordCount:0, colorPairs:[] },\n    screenshotUrl: row.screenshot_url ?? raw.screenshotUrl ?? undefined,\n    aiNotes: raw.aiNotes ?? [],',
    );
  }

  write(file, content);
  console.log('Patched lib/real-audit-engine.ts');
}

function patchReportPage() {
  const file = 'app/reports/[id]/page.tsx';
  let content = read(file);

  if (!content.includes("ReportScreenshotCard")) {
    const importLine = "import { ReportScreenshotCard } from '@/components/reports/report-screenshot-card';";
    const anchor = "import { GenerateRoadmapButton } from './generate-roadmap-button';";

    if (content.includes(anchor)) {
      content = content.replace(anchor, `${anchor}\n${importLine}`);
    } else {
      content = `${importLine}\n${content}`;
    }
  }

  if (!content.includes('<ReportScreenshotCard screenshotUrl={report.screenshotUrl} site={report.site} />')) {
    // Insert immediately after the AppShell opening block closes with >
    const marker = '    >\n      <section className="card app-section">';
    if (content.includes(marker)) {
      content = content.replace(
        marker,
        '    >\n      <ReportScreenshotCard screenshotUrl={report.screenshotUrl} site={report.site} />\n\n      <section className="card app-section">',
      );
    } else {
      // fallback for compact formatting
      const compactMarker = '    >\n';
      content = content.replace(
        compactMarker,
        '    >\n      <ReportScreenshotCard screenshotUrl={report.screenshotUrl} site={report.site} />\n\n',
      );
    }
  }

  write(file, content);
  console.log('Patched app/reports/[id]/page.tsx');
}

patchRealAuditEngine();
patchReportPage();

console.log('Screenshot patches applied.');
