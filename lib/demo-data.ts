import {
  buildRealAuditReport,
  type AuditIssue,
  type AuditReport,
} from '@/lib/real-audit-engine';

export type { AuditIssue, AuditReport };

const demoExtraction = {
  url: 'https://example.com',
  finalUrl: 'https://example.com',
  status: 200,

  title: 'Example Audit',

  description:
    'Example saved audit report used only when no saved reports exist.',

  lang: 'en',

  h1: ['Example Audit'],
  h2: ['Overview'],
  h3: [],

  headings: [
    {
      level: 1,
      text: 'Example Audit',
    },
    {
      level: 2,
      text: 'Overview',
    },
  ],

  links: [
    {
      text: 'Start Free Audit',
      href: 'https://example.com',
      ariaLabel: 'Start Free Audit',
    },
  ],

  buttons: ['Start Free Audit'],

  images: [
    {
      alt: 'Example',
      src: 'https://example.com/example.png',
    },
  ],

  forms: [],

  landmarks: {
    header: 1,
    nav: 1,
    main: 1,
    footer: 1,
    aside: 0,
  },

  text: 'Example audit report for AIUX Insight.',

  wordCount: 7,

  colorPairs: [
    {
      foreground: '#FFFFFF',
      background: '#4F46E5',
      usage: 'Primary button text',
    },
  ],

  // REQUIRED FOR AUDIT ENGINE V2

  ctas: ['Start Free Audit'],

  emptyLinks: 0,

  emptyButtons: 0,

  trustSignals: [
    'support',
    'pricing clarity',
  ],

  hasPricingSignal: true,

  hasContactSignal: true,
};

export const demoReports: AuditReport[] = [
  buildRealAuditReport(
    {
      ...demoExtraction,
      finalUrl: 'https://www.nike.com',
      url: 'https://www.nike.com',
      title: 'Nike',
    },
    'free',
  ),

  buildRealAuditReport(
    {
      ...demoExtraction,
      finalUrl: 'https://www.techstartup.io',
      url: 'https://www.techstartup.io',
      title: 'Tech Startup',
    },
    'pro',
  ),
];