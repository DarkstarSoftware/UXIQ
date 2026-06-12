'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ClientForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function createClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, website, contactEmail, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create client.');
      }

      setName('');
      setWebsite('');
      setContactEmail('');
      setNotes('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create client.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="section-title">Add Client</h2>
      <p className="mt-2 text-sm text-ui-muted">
        Create client profiles for agency reporting and future white-label workflows.
      </p>

      <form onSubmit={createClient} className="mt-5 space-y-3">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Client name"
          required
        />

        <Input
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="Website, e.g. example.com"
        />

        <Input
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          placeholder="Client contact email"
        />

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Notes"
          className="min-h-28 w-full rounded-xl border border-ui-border bg-ui-surface px-4 py-3 text-sm text-white outline-none placeholder:text-ui-muted"
        />

        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Client'}
        </Button>
      </form>
    </div>
  );
}
