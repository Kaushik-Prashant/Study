export type CategoryId =
  | 'azure'
  | 'python'
  | 'dotnet'
  | 'dsa'
  | 'sql'
  | 'docker'
  | 'kubernetes'
  | 'devops'
  | 'agentic';

/** One atomic, checkable unit of study. This is the single source of truth —
 * both the weekly roadmap and the Topic Library render views over the same
 * LearningItem records, and both read/write progress via the same id. */
export interface LearningItem {
  id: string;
  day: number;
  week: number;
  categoryId: CategoryId;
  categoryName: string;
  topicId: string;
  topicName: string;
  title: string;
  minutes: number;
  order: number;
}

export interface CategoryMeta {
  name: string;
  color: string;
}

export interface TopicExtra {
  questions: string[];
  resources: string[];
}

export interface LearningData {
  categories: Record<CategoryId, CategoryMeta>;
  prerequisites: Record<string, string[]>;
  topicExtras: Record<string, TopicExtra>;
  items: LearningItem[];
}

export interface DayGroup {
  day: number;
  week: number;
  items: LearningItem[];
}

export interface WeekGroup {
  week: number;
  days: DayGroup[];
}

export interface TopicGroup {
  categoryId: CategoryId;
  categoryName: string;
  topicId: string;
  topicName: string;
  key: string; // `${categoryId}/${topicId}`
  items: LearningItem[];
  prerequisites: string[];
  questions: string[];
  resources: string[];
}

export interface CategoryGroup {
  categoryId: CategoryId;
  categoryName: string;
  color: string;
  topics: TopicGroup[];
}

export type ItemStatus = 'not-started' | 'in-progress' | 'completed';
