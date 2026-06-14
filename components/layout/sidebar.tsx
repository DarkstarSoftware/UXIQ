import Link from 'next/link';
import {
  BarChart3,
  CreditCard,
  FileText,
  GitCompare,
  LogOut,
  Map,
  Settings,
} from 'lucide-react';

import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/roadmaps', label: 'Roadmaps', icon: Map },
  { href: '/competitors', label: 'Competitors', icon: GitCompare },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('plan, subscription_status, full_name')
        .eq('id', user.id)
        .single()
    : { data: null };

  const isLifetime =
    profile?.subscription_status === 'lifetime' ||
    profile?.plan === 'pro_lifetime';

  const isPro =
    isLifetime ||
    profile?.plan === 'pro' ||
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing';

  const initials =
    profile?.full_name?.slice(0, 1).toUpperCase() ||
    user?.email?.slice(0, 1).toUpperCase() ||
    'U';

  return (
    <aside className="app-sidebar sidebar">
      <div className="sidebar-top">
        <Logo href="/dashboard" />

        <nav className="app-nav" aria-label="Application navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="app-nav-link">
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="profile-avatar">{initials}</div>

          <div>
            <p className="sidebar-user-name">
              {profile?.full_name || user?.email || 'Account'}
            </p>

            <span className={isPro ? 'badge badge-pro' : 'badge badge-low'}>
              {isLifetime ? 'Pro Lifetime' : isPro ? 'Pro' : 'Free'}
            </span>
          </div>
        </div>

        <form action="/auth/signout" method="POST">
          <Button type="submit" variant="secondary" className="w-full">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </form>
      </div>
    </aside>
  );
}