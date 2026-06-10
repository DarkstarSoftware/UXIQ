'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FileText, Gauge, Settings, Swords } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/competitors', label: 'Competitors', icon: Swords },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-ui-border bg-ui-sidebar px-4 py-5 lg:flex lg:flex-col">
      <Logo />
      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition', active ? 'bg-white/8 text-white' : 'text-ui-muted hover:bg-white/5 hover:text-white')}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white"><BarChart3 className="h-4 w-4 text-brand-300" /> Pro unlock</div>
        <p className="mt-2 text-xs text-ui-muted">Full AI analysis, competitor insights, and deeper recommendations.</p>
      </div>
    </aside>
  );
}
