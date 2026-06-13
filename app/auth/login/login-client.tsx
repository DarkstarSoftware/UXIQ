'use client';

import Link from 'next/link';
import { Eye, LockKeyhole, Mail } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="premium-auth-page">
      <section className="premium-auth-card" aria-labelledby="login-title">
        <div className="auth-card-header">
          <Logo href="/" />
          <span className="status-pill">Secure login</span>
        </div>

        <div className="auth-copy">
          <p className="premium-eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to AIUX Insight</h1>
          <p>
            Access your audits, saved reports, billing, competitors, and prioritized UX recommendations.
          </p>
        </div>

        <form onSubmit={handleLogin} className="premium-auth-form">
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
                className="premium-input with-icon with-action"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </label>

          {error ? (
            <p className="premium-error" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer-line">
          <span>Need an account?</span>
          <Link href="/auth/signup">Create one</Link>
        </div>
      </section>

      <aside className="auth-side-panel" aria-label="AIUX Insight product summary">
        <div className="score-dial small">
          <div className="score-dial-inner">72</div>
        </div>
        <h2>UX audits that turn issues into action.</h2>
        <p>
          Get AI-assisted UX, accessibility, and conversion insights with prioritized fixes your team can actually ship.
        </p>
      </aside>
    </main>
  );
}
