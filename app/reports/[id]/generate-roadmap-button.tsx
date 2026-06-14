import { Map } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function GenerateRoadmapButton({ reportId }: { reportId: string }) {
  return (
    <form action="/api/roadmaps/generate" method="POST">
      <input type="hidden" name="reportId" value={reportId} />
      <Button type="submit">
        <Map className="h-4 w-4" /> Generate Roadmap
      </Button>
    </form>
  );
}
