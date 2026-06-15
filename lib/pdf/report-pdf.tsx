import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { type AuditReport } from '@/lib/audit-engine';
import { formatDate, limitForPlan, safeText, scoreLabel } from '@/lib/pdf/pdf-utils';

type RoadmapView = {
  title?: string;
  summary?: string;
  quickWins?: any[];
  thirtyDay?: any[];
  sixtyDay?: any[];
  ninetyDay?: any[];
  nextPhase?: any[];
  strategicInitiatives?: any[];
} | null;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  coverPage: {
    padding: 48,
    fontFamily: 'Helvetica',
    backgroundColor: '#0B1020',
    color: '#FFFFFF',
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    color: '#A5B4FC',
    marginBottom: 96,
  },
  coverTitle: {
    fontSize: 38,
    lineHeight: 1.1,
    fontWeight: 700,
    marginBottom: 18,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 1.5,
    marginBottom: 36,
  },
  coverMeta: {
    borderTop: '1 solid #334155',
    paddingTop: 18,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 12,
    marginBottom: 20,
  },
  headerBrand: {
    color: '#4F46E5',
    fontWeight: 700,
    fontSize: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
    color: '#111827',
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.45,
  },
  scoreGrid: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  scoreCard: {
    flex: 1,
    border: '1 solid #E5E7EB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F9FAFB',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
  },
  badge: {
    fontSize: 8,
    fontWeight: 700,
    padding: '4 6',
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  high: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  med: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  low: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  issue: {
    border: '1 solid #E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4,
  },
  issueMeta: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 5,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1 solid #E5E7EB',
    paddingVertical: 7,
  },
  tableLeft: {
    width: '34%',
    fontSize: 9,
    fontWeight: 700,
    color: '#111827',
  },
  tableRight: {
    width: '66%',
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.35,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: '1 solid #E5E7EB',
    paddingTop: 8,
    fontSize: 8,
    color: '#9CA3AF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upgradeNotice: {
    border: '1 solid #C7D2FE',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    color: '#3730A3',
    fontSize: 10,
    lineHeight: 1.4,
  },
});

function SeverityBadge({ severity }: { severity?: string }) {
  const badgeStyle =
    severity === 'HIGH'
      ? styles.high
      : severity === 'MED'
        ? styles.med
        : styles.low;

  return <Text style={[styles.badge, badgeStyle]}>{severity ?? 'LOW'}</Text>;
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.headerBrand}>AIUX Insight</Text>
      <Text style={styles.subtitle}>{title}{subtitle ? ` · ${subtitle}` : ''}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>AIUX Insight UX Audit Report</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function ScoreCard({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.scoreCard}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={styles.scoreValue}>{value ?? '—'}</Text>
    </View>
  );
}

function RoadmapGroup({ title, items }: { title: string; items?: any[] }) {
  if (!items?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.slice(0, 8).map((item, index) => (
        <View key={`${title}-${index}`} style={styles.issue}>
          <Text style={styles.issueTitle}>{item.title ?? item.recommendation ?? 'Roadmap item'}</Text>
          <Text style={styles.paragraph}>{item.description ?? item.detail ?? ''}</Text>
          {item.successMetric ? <Text style={styles.issueMeta}>Success metric: {item.successMetric}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export function ReportPdfDocument({
  report,
  roadmap,
  isPro,
}: {
  report: AuditReport;
  roadmap: RoadmapView;
  isPro: boolean;
}) {
  const issues = limitForPlan(report.issues ?? [], isPro, 5);
  const wcagChecks = limitForPlan(report.wcagChecks ?? [], isPro, 6);
  const heuristicChecks = limitForPlan(report.heuristicChecks ?? [], isPro, 6);
  const contrastChecks = limitForPlan(report.contrastChecks ?? [], isPro, 4);

  return (
    <Document
      title={`${report.site} UX Audit Report`}
      author="AIUX Insight"
      subject="UX, accessibility, WCAG, heuristic, and conversion audit"
    >
      <Page size="LETTER" style={styles.coverPage}>
        <Text style={styles.brand}>AIUX Insight</Text>
        <Text style={styles.coverTitle}>UX Audit Report</Text>
        <Text style={styles.coverSubtitle}>
          A client-ready analysis of usability, accessibility, conversion friction, WCAG checks, Nielsen Norman heuristics, and prioritized recommendations.
        </Text>
        <View style={styles.coverMeta}>
          <Text>Website: {report.url}</Text>
          <Text>Site: {report.site}</Text>
          <Text>Generated: {formatDate()}</Text>
          <Text>Plan: {isPro ? 'Pro Export' : 'Free Export'}</Text>
        </View>
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Header title={report.site} subtitle={report.url} />

        <View style={styles.section}>
          <Text style={styles.title}>Executive Summary</Text>
          <Text style={styles.paragraph}>{safeText(report.summary)}</Text>
          <Text style={[styles.paragraph, { marginTop: 8 }]}>
            Overall result: {scoreLabel(report.score)}. This report highlights the highest-impact UX, WCAG, heuristic, and conversion opportunities detected by AIUX Insight.
          </Text>
        </View>

        <View style={styles.scoreGrid}>
          <ScoreCard label="Overall" value={report.score} />
          <ScoreCard label="Accessibility" value={report.metrics?.accessibility} />
          <ScoreCard label="Usability" value={report.metrics?.usability} />
          <ScoreCard label="Conversion" value={report.metrics?.conversion} />
        </View>

        <View style={styles.scoreGrid}>
          <ScoreCard label="Visual" value={report.metrics?.visualDesign} />
          <ScoreCard label="WCAG" value={report.metrics?.wcag} />
          <ScoreCard label="Heuristics" value={report.metrics?.heuristics} />
          <ScoreCard label="Issues" value={report.issues?.length ?? 0} />
        </View>

        <Footer />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Header title="Issues and Recommendations" subtitle={report.site} />

        <View style={styles.section}>
          <Text style={styles.title}>{isPro ? 'All Priority Issues' : 'Top 5 Priority Issues'}</Text>
          {issues.map((issue, index) => (
            <View key={`${issue.title}-${index}`} style={styles.issue} wrap={false}>
              <SeverityBadge severity={issue.severity} />
              <Text style={styles.issueTitle}>{issue.title}</Text>
              <Text style={styles.paragraph}>{issue.detail}</Text>
              <Text style={[styles.paragraph, { marginTop: 5 }]}>Recommendation: {issue.recommendation}</Text>
              <Text style={styles.issueMeta}>
                Category: {issue.category} · Impact: {issue.impact} · Effort: {issue.effort}
              </Text>
              {issue.wcag ? <Text style={styles.issueMeta}>WCAG: {issue.wcag}</Text> : null}
              {issue.heuristic ? <Text style={styles.issueMeta}>Heuristic: {issue.heuristic}</Text> : null}
            </View>
          ))}
        </View>

        {!isPro ? (
          <View style={styles.upgradeNotice}>
            <Text>
              Free exports include the executive summary, scores, and top issues. Upgrade to Pro for full issue detail, complete WCAG checks, heuristic checks, roadmap export, and client-ready deliverables.
            </Text>
          </View>
        ) : null}

        <Footer />
      </Page>

      {isPro ? (
        <Page size="LETTER" style={styles.page}>
          <Header title="Accessibility and Heuristic Checks" subtitle={report.site} />

          <View style={styles.section}>
            <Text style={styles.title}>WCAG Checks</Text>
            {wcagChecks.map((check, index) => (
              <View key={`${check.criterion}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableLeft}>{check.criterion}</Text>
                <Text style={styles.tableRight}>{check.status.toUpperCase()} — {check.note}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Nielsen Norman Heuristic Checks</Text>
            {heuristicChecks.map((check, index) => (
              <View key={`${check.heuristic}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableLeft}>{check.heuristic}</Text>
                <Text style={styles.tableRight}>{check.status.toUpperCase()} — {check.note}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Color Contrast Checks</Text>
            {contrastChecks.map((check, index) => (
              <View key={`${check.foreground}-${check.background}-${index}`} style={styles.tableRow}>
                <Text style={styles.tableLeft}>{check.ratio}:1</Text>
                <Text style={styles.tableRight}>
                  {check.foreground} on {check.background}. {check.passesAA ? 'Passes AA.' : 'Needs review.'} {check.recommendation}
                </Text>
              </View>
            ))}
          </View>

          <Footer />
        </Page>
      ) : null}

      {isPro && roadmap ? (
        <Page size="LETTER" style={styles.page}>
          <Header title="Roadmap" subtitle={report.site} />
          <View style={styles.section}>
            <Text style={styles.title}>{roadmap.title ?? `${report.site} UX Roadmap`}</Text>
            <Text style={styles.paragraph}>{roadmap.summary ?? 'Prioritized roadmap generated from this report.'}</Text>
          </View>

          <RoadmapGroup title="Quick Wins" items={roadmap.quickWins} />
          <RoadmapGroup title="30 Days" items={roadmap.thirtyDay} />
          <RoadmapGroup title="60 Days" items={roadmap.sixtyDay} />
          <RoadmapGroup title="90 Days" items={roadmap.ninetyDay ?? roadmap.strategicInitiatives} />

          <Footer />
        </Page>
      ) : null}
    </Document>
  );
}
