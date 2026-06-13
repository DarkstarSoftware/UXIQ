'use client';

import Link from 'next/link';
import { LockKeyhole, Mail } from 'lucide-react';
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
    <main className="premium-auth-page">
      <section className="premium-auth-card" aria-labelledby="signup-title">
        <div className="auth-card-header">
          <Logo href="/" />
          <span className="status-pill">Free audit</span>
        </div>

        <div className="auth-copy">
          <p className="premium-eyebrow">Start analyzing</p>
          <h1 id="signup-title">Create your AIUX account</h1>
          <p>
            Run your first UX audit and uncover accessibility, usability, and conversion opportunities.
          </p>
        </div>

        <form onSubmit={handleSignup} className="premium-auth-form">
          <label>
            <span>Email</span>
            <div className="auth-input-wrap">
              <Mail className="auth-input-icon" aria-hidden="true" />
              <input
                className="premium-input with-icon"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="auth-input-wrap">
              <LockKeyhole className="auth-input-icon" aria-hidden="true" />
              <input
                className="premium-input with-icon"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </label>

          {error ? <p className="premium-error" role="alert">{error}</p> : null}
          {message ? <p className="premium-success" role="status">{message}</p> : null}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer-line">
          <span>Already have an account?</span>
          <Link href="/auth/login">Sign in</Link>
        </div>
      </section>

      <aside className="auth-side-panel" aria-label="AIUX Insight product summary">
        <div className="score-dial small">
          <div className="score-dial-inner">AI</div>
        </div>
        <h2>Designed for founders, teams, and agencies.</h2>
        <p>
          Turn usability friction, WCAG gaps, and conversion blockers into a clear action plan.
        </p>
      </aside>
    </main>
  );
}
