import { redirect } from 'next/navigation';
import { BillingCard } from '@/components/billing/billing-card';
import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';
export default async function BillingPage(){const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user){redirect('/auth/login?redirect=/billing')} const {data:profile}=await supabase.from('profiles').select('plan, subscription_status, subscription_current_period_end').eq('id', user.id).single(); return <AppShell title="Billing" subtitle="Manage your AI UX Insight subscription"><div className="max-w-2xl"><BillingCard plan={profile?.plan} status={profile?.subscription_status} periodEnd={profile?.subscription_current_period_end}/></div></AppShell>}
