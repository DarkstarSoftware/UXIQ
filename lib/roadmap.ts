export type RoadmapTask = {
  title: string;
  why: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  owner: string;
  timeframe: string;
};

export type RoadmapPhase = {
  name: string;
  goal: string;
  tasks: RoadmapTask[];
};

export type RoadmapResult = {
  title: string;
  summary: string;
  phases: RoadmapPhase[];
  executiveNotes: string[];
};
