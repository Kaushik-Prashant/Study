import { Injectable, computed, signal } from '@angular/core';
import learningDataJson from '../../assets/learning-data.json';
import {
  CategoryGroup,
  CategoryId,
  DayGroup,
  LearningData,
  LearningItem,
  TopicGroup,
  WeekGroup,
} from './models';

const DATA = learningDataJson as unknown as LearningData;

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly items: LearningItem[] = DATA.items;
  readonly totalItems = this.items.length;
  readonly totalDays = 100;
  readonly totalWeeks = Math.ceil(this.totalDays / 6);

  private readonly itemsById = new Map(this.items.map((i) => [i.id, i]));

  readonly days: DayGroup[] = this.buildDays();
  readonly weeks: WeekGroup[] = this.buildWeeks(this.days);
  readonly categories: CategoryGroup[] = this.buildCategories();

  private readonly topicsByKey = new Map(
    this.categories.flatMap((c) => c.topics.map((t) => [t.key, t] as const))
  );

  getItem(id: string): LearningItem | undefined {
    return this.itemsById.get(id);
  }

  getDay(day: number): DayGroup | undefined {
    return this.days.find((d) => d.day === day);
  }

  getTopic(categoryId: string, topicId: string): TopicGroup | undefined {
    return this.topicsByKey.get(`${categoryId}/${topicId}`);
  }

  getCategory(categoryId: string): CategoryGroup | undefined {
    return this.categories.find((c) => c.categoryId === categoryId);
  }

  private buildDays(): DayGroup[] {
    const map = new Map<number, LearningItem[]>();
    for (const item of this.items) {
      if (!map.has(item.day)) map.set(item.day, []);
      map.get(item.day)!.push(item);
    }
    const subjectOrder: Record<string, number> = {
      azure: 0,
      dsa: 1,
      python: 2,
      sql: 3,
      dotnet: 4,
      docker: 4,
      kubernetes: 4,
      devops: 4,
      agentic: 5,
    };
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([day, items]) => ({
        day,
        week: Math.ceil(day / 6),
        items: items.slice().sort((a, b) => (subjectOrder[a.categoryId] ?? 9) - (subjectOrder[b.categoryId] ?? 9)),
      }));
  }

  private buildWeeks(days: DayGroup[]): WeekGroup[] {
    const map = new Map<number, DayGroup[]>();
    for (const d of days) {
      if (!map.has(d.week)) map.set(d.week, []);
      map.get(d.week)!.push(d);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([week, ds]) => ({ week, days: ds }));
  }

  private buildCategories(): CategoryGroup[] {
    const byCat = new Map<CategoryId, Map<string, LearningItem[]>>();
    for (const item of this.items) {
      if (!byCat.has(item.categoryId)) byCat.set(item.categoryId, new Map());
      const topicMap = byCat.get(item.categoryId)!;
      if (!topicMap.has(item.topicId)) topicMap.set(item.topicId, []);
      topicMap.get(item.topicId)!.push(item);
    }

    const categoryOrder: CategoryId[] = [
      'azure',
      'agentic',
      'python',
      'dotnet',
      'dsa',
      'sql',
      'docker',
      'kubernetes',
      'devops',
    ];

    return categoryOrder
      .filter((id) => byCat.has(id))
      .map((categoryId) => {
        const meta = DATA.categories[categoryId];
        const topicMap = byCat.get(categoryId)!;
        const topics: TopicGroup[] = Array.from(topicMap.entries())
          .map(([topicId, items]) => {
            const key = `${categoryId}/${topicId}`;
            const sorted = items.slice().sort((a, b) => a.order - b.order);
            const extra = DATA.topicExtras[key];
            return {
              categoryId,
              categoryName: meta.name,
              topicId,
              topicName: sorted[0].topicName,
              key,
              items: sorted,
              prerequisites: DATA.prerequisites[key] ?? [],
              questions: extra?.questions ?? [],
              resources: extra?.resources ?? [],
            };
          })
          .sort((a, b) => a.items[0].order - b.items[0].order);
        return { categoryId, categoryName: meta.name, color: meta.color, topics };
      });
  }
}
