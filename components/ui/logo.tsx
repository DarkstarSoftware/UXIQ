import Link from 'next/link';

export function Logo({ href = '/dashboard' }: { href?: string }) {
  return (
    <Link href={href} aria-label="AIUX Insight" className="aiux-logo">
      <span className="aiux-logo-mark" aria-hidden="true">UX</span>
      <span>
        <span className="aiux-logo-title">AIUX Insight</span>
        <span className="aiux-logo-subtitle">Audit AI</span>
      </span>
    </Link>
  );
}
