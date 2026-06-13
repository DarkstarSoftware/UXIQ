import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
export default async function ClientDetailPage({params}:{params:Promise<{id:string}>}){ const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); const {id}=await params; if(!user) redirect(`/auth/login?redirect=/clients/${id}`); const name=id==='nr'?'Northstar Retail':id==='ss'?'Summit SaaS':'BluePeak Studio'; return <AppShell title={name} subtitle="Client workspace, reports, and roadmap activity" actions={<Link href="/dashboard"><Button>Run Client Audit</Button></Link>}><section className="card app-section"><div className="app-grid-3"><div className="score-metric-card"><span>Reports</span><strong>3</strong></div><div className="score-metric-card"><span>Average Score</span><strong>72</strong></div><div className="score-metric-card"><span>Open Fixes</span><strong>8</strong></div></div></section></AppShell>; }
