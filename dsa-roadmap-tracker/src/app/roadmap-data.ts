export type Subject = 'AZ-900' | 'AI-200' | 'DSA' | 'Python' | 'SQL' | '.NET';

export interface RoadmapItem {
  id: string;
  subject: Subject;
  topic: string;
  minutes: number;
}

export interface RoadmapDay {
  day: number;
  week: number;
  items: RoadmapItem[];
}
