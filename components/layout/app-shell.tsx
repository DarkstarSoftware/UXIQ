import { Sidebar } from '@/components/layout/sidebar';

export function AppShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <header className="app-page-header">
          <div>
            <h1 className="app-page-title">{title}</h1>
            {subtitle ? <p className="app-page-subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
        {children}
      </main>
    </div>
  );
}
