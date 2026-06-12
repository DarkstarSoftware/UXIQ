import { GenerateRoadmapButton } from '@/components/roadmaps/generate-roadmap-button';

export function RoadmapCallout({ reportId }: { reportId: string }) {
  return (
    <div className="card p-6">
      <h2 className="section-title">Turn this report into a roadmap</h2>
      <p className="mt-2 text-sm leading-6 text-ui-muted">
        Generate a prioritized UX, WCAG, accessibility, and conversion action plan from this audit.
      </p>
      <div className="mt-5">
        <GenerateRoadmapButton reportId={reportId} />
      </div>
    </div>
  );
}
