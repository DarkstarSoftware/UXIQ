'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  FileText,
  Gauge,
  GitCompare,
  LogOut,
  Map,
  Settings,
  Users,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/competitors', label: 'Competitors', icon: GitCompare },
  { href: '/roadmaps', label: 'Roadmaps', icon: Map },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <Logo href="/dashboard" />

      <nav className="app-nav" aria-label="Application navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('app-nav-link', active && 'app-nav-link-active')}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <form action="/auth/signout" method="POST" className="mt-8">
        <Button type="submit" variant="secondary" className="w-full">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign Out
        </Button>
      </form>
    </aside>
  );
}
