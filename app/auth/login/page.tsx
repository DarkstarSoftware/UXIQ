import { Suspense } from 'react';
import LoginClient from './login-client';

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="premium-auth-page"><div className="premium-auth-card">Loading...</div></main>}>
      <LoginClient />
    </Suspense>
  );
}
