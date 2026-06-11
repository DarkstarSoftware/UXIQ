import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpgradeLock({
  title = 'Unlock full AI report intelligence',
  body = 'Upgrade to Pro to access AI follow-up questions, detailed recommendations, competitor insights, and export-ready reports.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-brand-500/20 p-3">
          <Lock className="h-5 w-5 text-brand-200" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-ui-muted">{body}</p>
          <Link href="/pricing">
            <Button className="mt-5">Upgrade to Pro</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
