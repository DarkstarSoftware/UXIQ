import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-brand-500 to-indigo-500 shadow-lg shadow-sky-500/20">
        <span className="text-lg font-black text-white">✦</span>
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold tracking-tight text-white">Darkstar</p>
        <p className="-mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-sky-300">
          Audit AI
        </p>
      </div>
    </Link>
  );
}
