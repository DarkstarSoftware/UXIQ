'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function GenerateRoadmapButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generateRoadmap() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate roadmap.');
      }

      router.push(`/roadmaps/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate roadmap.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button type="button" onClick={generateRoadmap} disabled={loading}>
        <Sparkles className="mr-2 h-4 w-4" />
        {loading ? 'Generating Roadmap...' : 'Generate AI Roadmap'}
      </Button>

      {error ? (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
