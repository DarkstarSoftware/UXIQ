import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Darkstar Audit AI | UX, Accessibility & Conversion Audits',
  description:
    'AI-powered UX, accessibility, WCAG, Nielsen Norman, and conversion audit platform for websites.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
