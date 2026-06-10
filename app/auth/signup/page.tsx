import { Suspense } from 'react';
import SignupClient from './signup-client';

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-ui-bg" />}>
      <SignupClient />
    </Suspense>
  );
}
