'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="ai-auth-page">
      <section className="card ai-auth-card" aria-labelledby="login-title">
        <Logo />
        <h1 id="login-title" className="mt-8 text-3xl font-bold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-ui-muted">Access your dashboard, reports, billing, and audits.</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Email</span>
            <input className="ai-input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Password</span>
            <input className="ai-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          {error ? <p className="rounded-xl border border-red-300 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</p> : null}

          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>

        <p className="mt-6 text-sm text-ui-muted">
          Need an account? <Link className="font-semibold text-brand-300" href="/auth/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
}
