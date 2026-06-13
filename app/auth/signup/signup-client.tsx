'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setMessage('Account created. Check your email if confirmation is required, then sign in.');
    setLoading(false);
    router.refresh();
  }

  return (
    <main className="ai-auth-page">
      <section className="card ai-auth-card" aria-labelledby="signup-title">
        <Logo />

        <h1 id="signup-title" className="mt-8 text-3xl font-bold text-white">
          Create account
        </h1>
        <p className="mt-2 text-sm text-ui-muted">
          Start with a free audit, then upgrade when you need full AI intelligence.
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Email</span>
            <input
              className="ai-field"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Password</span>
            <input
              className="ai-field"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-300 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-xl border border-brand-500 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
              {message}
            </p>
          ) : null}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-ui-muted">
          Already have an account? <Link className="font-semibold text-brand-300" href="/auth/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
