import { ReactNode } from 'react';

import { Sidebar } from '@/components/layout/sidebar';
import { ProfileMenu } from '@/components/layout/profile-menu';
import { createClient } from '@/lib/supabase/server';

export async function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <header className="app-page-header">
          <div>
            <h1 className="app-page-title">{title}</h1>
            {subtitle ? <p className="app-page-subtitle">{subtitle}</p> : null}
          </div>

          <div className="app-toolbar-actions">
            {actions}
            <ProfileMenu email={user?.email} />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
