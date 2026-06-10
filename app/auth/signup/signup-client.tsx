'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/client';

export default function SignupClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccessMessage('Account created. Check your email to confirm your account.');
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-ui-bg px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-400">
            Create Account
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Start auditing websites
          </h1>

          <p className="mt-3 text-sm text-ui-muted">
            Create an account to unlock UXIQ audits.
          </p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {errorMessage ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {successMessage}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ui-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-300 hover:text-brand-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}