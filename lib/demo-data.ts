import { buildAuditReportFromUrl, slugFromUrl, type AuditIssue, type AuditReport } from '@/lib/audit-engine';

export type { AuditIssue, AuditReport };

export const demoReports: AuditReport[] = [
  buildAuditReportFromUrl('https://www.nike.com', 'free'),
  buildAuditReportFromUrl('https://www.acmecorp.com', 'free'),
  buildAuditReportFromUrl('https://www.techstartup.io', 'pro'),
  buildAuditReportFromUrl('https://www.shopflow.com', 'free'),
];

export function getReportById(id: string, url?: string) {
  if (url) return buildAuditReportFromUrl(url, 'free');

  return (
    demoReports.find((report) => report.id === id) ??
    buildAuditReportFromUrl(`https://${id.replace(/-/g, '.')}`, 'free')
  );
}

export { buildAuditReportFromUrl, slugFromUrl };
