import Link from 'next/link';
import { CreditCard, HelpCircle, LogOut, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function ProfileMenu({ email }: { email?: string | null }) {
  const initials = email?.slice(0, 1).toUpperCase() || 'U';

  return (
    <details className="profile-menu">
      <summary className="profile-menu-trigger" aria-label="Open profile menu">
        <span className="profile-avatar">{initials}</span>
      </summary>

      <div className="profile-menu-panel">
        <div className="profile-menu-header">
          <span className="profile-avatar large">{initials}</span>
          <div>
            <p className="issue-row-title">Account</p>
            <p className="issue-row-copy">{email}</p>
          </div>
        </div>

        <Link href="/settings" className="profile-menu-item">
          <Settings className="h-4 w-4" /> Settings
        </Link>
        <Link href="/billing" className="profile-menu-item">
          <CreditCard className="h-4 w-4" /> Billing
        </Link>
        <Link href="/help" className="profile-menu-item">
          <HelpCircle className="h-4 w-4" /> Help
        </Link>

        <form action="/auth/signout" method="POST" className="mt-2">
          <Button type="submit" variant="secondary" className="w-full">
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </form>
      </div>
    </details>
  );
}
