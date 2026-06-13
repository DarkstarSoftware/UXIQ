import { Suspense } from 'react';
import SignupClient from './signup-client';

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="premium-auth-page"><div className="premium-auth-card">Loading...</div></main>}>
      <SignupClient />
    </Suspense>
  );
}
