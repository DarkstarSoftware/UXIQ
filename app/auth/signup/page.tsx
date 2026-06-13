import { Suspense } from 'react';
import SignupClient from './signup-client';

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="ai-auth-page"><div className="card ai-auth-card">Loading...</div></main>}>
      <SignupClient />
    </Suspense>
  );
}
