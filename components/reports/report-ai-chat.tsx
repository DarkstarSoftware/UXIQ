'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ReportAiChat({ reportId }: { reportId: string }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function askQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch('/api/reports/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, question }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Unable to answer question.');
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to answer question.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="section-title">Ask AI about this report</h2>
      <p className="mt-2 text-sm text-ui-muted">
        Ask follow-up questions about UX findings, WCAG concerns, or conversion opportunities.
      </p>

      <form onSubmit={askQuestion} className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Example: What should I fix first?"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask AI'}
        </Button>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {answer ? (
        <div className="mt-5 rounded-xl border border-ui-border bg-ui-surface/60 p-4 text-sm leading-6 text-ui-muted">
          {answer}
        </div>
      ) : null}
    </div>
  );
}
