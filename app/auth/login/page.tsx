import { Suspense } from 'react';
import LoginClient from './login-client';

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="ai-auth-page"><div className="card ai-auth-card">Loading...</div></main>}>
      <LoginClient />
    </Suspense>
  );
}
