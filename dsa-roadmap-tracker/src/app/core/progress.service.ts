import { Injectable, computed, signal } from '@angular/core';
import { DataService } from './data.service';
import { ItemStatus, TopicGroup } from './models';

const CHECKED_KEY = 'ld-checked-v1';
const LOG_KEY = 'ld-completion-log-v1';
const NOTES_KEY = 'ld-notes-v1';
const CURRENT_DAY_KEY = 'ld-current-day-v1';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly checked = signal<Record<string, boolean>>(this.loadJson(CHECKED_KEY, {}));
  /** id -> ISO date (yyyy-mm-dd) the item was marked complete, for streaks/revision */
  readonly completionLog = signal<Record<string, string>>(this.loadJson(LOG_KEY, {}));
  /** topicKey (`${categoryId}/${topicId}`) -> free-text notes */
  readonly notes = signal<Record<string, string>>(this.loadJson(NOTES_KEY, {}));

  /**
   * The "Current Study Day" — NOT tied to the calendar. Starts at 1 and only
   * advances once every task scheduled for that day is checked off. All 100
   * days stay visible/clickable regardless of this value (no lock/unlock);
   * this only drives which day the Dashboard highlights as "Current".
   */
  readonly currentDay = signal<number>(this.loadJson(CURRENT_DAY_KEY, 1));

  readonly doneCount = computed(() => Object.values(this.checked()).filter(Boolean).length);

  constructor(private readonly data: DataService) {
    this.advanceCurrentDayIfComplete();
  }

  isChecked(id: string): boolean {
    return !!this.checked()[id];
  }

  toggle(id: string): void {
    const c = { ...this.checked() };
    const nowChecked = !c[id];
    c[id] = nowChecked;
    this.checked.set(c);
    this.saveJson(CHECKED_KEY, c);

    const log = { ...this.completionLog() };
    if (nowChecked) {
      log[id] = this.todayIso();
    } else {
      delete log[id];
    }
    this.completionLog.set(log);
    this.saveJson(LOG_KEY, log);

    this.advanceCurrentDayIfComplete();
  }

  setChecked(id: string, value: boolean): void {
    if (this.isChecked(id) !== value) this.toggle(id);
  }

  markTopicComplete(topic: TopicGroup): void {
    const c = { ...this.checked() };
    const log = { ...this.completionLog() };
    const today = this.todayIso();
    for (const item of topic.items) {
      c[item.id] = true;
      log[item.id] = log[item.id] ?? today;
    }
    this.checked.set(c);
    this.completionLog.set(log);
    this.saveJson(CHECKED_KEY, c);
    this.saveJson(LOG_KEY, log);

    this.advanceCurrentDayIfComplete();
  }

  resetTopicProgress(topic: TopicGroup): void {
    const c = { ...this.checked() };
    const log = { ...this.completionLog() };
    for (const item of topic.items) {
      delete c[item.id];
      delete log[item.id];
    }
    this.checked.set(c);
    this.completionLog.set(log);
    this.saveJson(CHECKED_KEY, c);
    this.saveJson(LOG_KEY, log);
  }

  resetAll(): void {
    this.checked.set({});
    this.completionLog.set({});
    this.currentDay.set(1);
    this.saveJson(CHECKED_KEY, {});
    this.saveJson(LOG_KEY, {});
    this.saveJson(CURRENT_DAY_KEY, 1);
  }

  getNote(topicKey: string): string {
    return this.notes()[topicKey] ?? '';
  }

  setNote(topicKey: string, value: string): void {
    const n = { ...this.notes(), [topicKey]: value };
    this.notes.set(n);
    this.saveJson(NOTES_KEY, n);
  }

  topicDoneCount(topic: TopicGroup): number {
    const c = this.checked();
    return topic.items.filter((i) => c[i.id]).length;
  }

  topicPct(topic: TopicGroup): number {
    if (topic.items.length === 0) return 0;
    return Math.round((this.topicDoneCount(topic) / topic.items.length) * 100);
  }

  topicStatus(topic: TopicGroup): ItemStatus {
    const done = this.topicDoneCount(topic);
    if (done === 0) return 'not-started';
    if (done === topic.items.length) return 'completed';
    return 'in-progress';
  }

  categoryDoneCount(topics: TopicGroup[]): number {
    return topics.reduce((sum, t) => sum + this.topicDoneCount(t), 0);
  }

  categoryTotalCount(topics: TopicGroup[]): number {
    return topics.reduce((sum, t) => sum + t.items.length, 0);
  }

  categoryPct(topics: TopicGroup[]): number {
    const total = this.categoryTotalCount(topics);
    if (total === 0) return 0;
    return Math.round((this.categoryDoneCount(topics) / total) * 100);
  }

  dayDoneCount(day: number): number {
    const c = this.checked();
    const group = this.data.getDay(day);
    if (!group) return 0;
    return group.items.filter((i) => c[i.id]).length;
  }

  isDayComplete(day: number): boolean {
    const group = this.data.getDay(day);
    if (!group || group.items.length === 0) return false;
    return this.dayDoneCount(day) === group.items.length;
  }

  /** Total hours logged across all completed items. */
  readonly studyHours = computed(() => {
    const c = this.checked();
    const minutes = this.data.items.filter((i) => c[i.id]).reduce((sum, i) => sum + i.minutes, 0);
    return Math.round((minutes / 60) * 10) / 10;
  });

  /** Consecutive real-world days (ending today or yesterday) with at least one completed item. */
  readonly studyStreak = computed(() => {
    const log = this.completionLog();
    const dates = new Set(Object.values(log));
    if (dates.size === 0) return 0;

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // if nothing done today, start counting from yesterday instead
    if (!dates.has(this.isoOf(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
      if (!dates.has(this.isoOf(cursor))) return 0;
    }

    while (dates.has(this.isoOf(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  });

  /**
   * Advances currentDay past any fully-completed day(s), starting from the
   * present currentDay and moving forward one day at a time. Never jumps
   * ahead based on future days being complete, and never moves backward.
   */
  private advanceCurrentDayIfComplete(): void {
    let day = this.currentDay();
    while (day < this.data.totalDays && this.isDayComplete(day)) {
      day += 1;
    }
    if (day !== this.currentDay()) {
      this.currentDay.set(day);
      this.saveJson(CURRENT_DAY_KEY, day);
    }
  }

  private isoOf(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private todayIso(): string {
    return this.isoOf(new Date());
  }

  private loadJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private saveJson(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }
}
