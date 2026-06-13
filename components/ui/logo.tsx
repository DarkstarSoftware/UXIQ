import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/dashboard"
      aria-label="Go to AI UX Insight dashboard"
      className="flex items-center gap-3"
    >
      <div
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500"
      >
        <span className="text-lg font-black text-white">✦</span>
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold tracking-tight text-white">AI UX Insight</p>
        <p className="-mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
          Audit AI
        </p>
      </div>
    </Link>
  );
}
