import { buildAuditReportFromUrl, slugFromUrl, type AuditIssue, type AuditReport } from '@/lib/audit-engine';

export type { AuditIssue, AuditReport };

export const demoReports: AuditReport[] = [
  buildAuditReportFromUrl('https://www.nike.com'),
  buildAuditReportFromUrl('https://www.acmecorp.com'),
  buildAuditReportFromUrl('https://www.techstartup.io'),
  buildAuditReportFromUrl('https://www.shopflow.com'),
];

export function getReportById(id: string, url?: string) {
  if (url) return buildAuditReportFromUrl(url);

  return (
    demoReports.find((report) => report.id === id) ??
    buildAuditReportFromUrl(`https://${id.replace(/-/g, '.')}`)
  );
}

export { buildAuditReportFromUrl, slugFromUrl };
