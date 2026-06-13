import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/server';

const freeFeatures = ['Basic UX score','Top usability findings','Basic WCAG-aware observations','One quick audit summary'];
const proFeatures = ['Full AI-powered UX audit','WCAG 2.2 AA-oriented accessibility review','Conversion recommendations','Impact and effort ratings','Saved audit history','Competitor comparison','Roadmap generator','Client-ready report views'];

export default async function PricingPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('plan, subscription_status').eq('id', user.id).single();
    if (profile?.plan === 'pro' || profile?.subscription_status === 'lifetime') redirect('/billing');
  }
  return (
    <main className="premium-page">
      <header className="premium-nav"><div className="premium-shell premium-nav-inner"><Logo href="/" /><nav className="premium-nav-links" aria-label="Pricing navigation"><Link href="/dashboard"><Button variant="secondary">Dashboard</Button></Link></nav></div></header>
      <section className="premium-shell premium-section">
        <div className="premium-section-heading centered"><p className="premium-eyebrow">Pricing</p><h1 className="text-5xl font-semibold tracking-tight text-white">Start free. Upgrade when you need full AI intelligence.</h1><p>Free users get basic UX and WCAG-aware findings. Pro users unlock the full AIUX Insight engine.</p></div>
        <div className="premium-plan-grid">
          <article className="premium-plan-card"><p className="mini-label">Free</p><h3>$0</h3><p>Basic audit insights for quick validation.</p><ul>{freeFeatures.map((feature)=><li key={feature}><CheckCircle2 aria-hidden="true" /> {feature}</li>)}</ul><Link href="/auth/signup"><Button variant="secondary" className="w-full">Get Started Free</Button></Link></article>
          <article className="premium-plan-card featured"><div className="plan-card-topline"><p className="mini-label">Pro</p><span className="status-pill">Best value</span></div><h3>$29/mo</h3><p>Full AI-powered UX, accessibility, and conversion reports.</p><ul>{proFeatures.map((feature)=><li key={feature}><CheckCircle2 aria-hidden="true" /> {feature}</li>)}</ul><UpgradeButton label="Start Pro Checkout" /></article>
        </div>
      </section>
    </main>
  );
}
