import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapDay } from './roadmap-data';
import roadmapJson from '../assets/roadmap-data.json';

const PROGRESS_KEY = 'roadmap-progress-v1';
const START_KEY = 'roadmap-start-date-v1';

interface WeekGroup {
  week: number;
  days: RoadmapDay[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly roadmap: RoadmapDay[] = roadmapJson as RoadmapDay[];
  readonly totalItems: number = this.roadmap.reduce((sum, d) => sum + d.items.length, 0);
  readonly weeks: WeekGroup[] = this.groupByWeek(this.roadmap);

  readonly startDateStr: string = this.loadStartDate();
  readonly todayDay: number = this.computeTodayDay(this.startDateStr);

  checked = signal<Record<string, boolean>>(this.loadProgress());
  expandedWeek = signal<number>(Math.min(Math.ceil(this.todayDay / 6) || 1, this.weeks.length));
  showResetConfirm = signal(false);

  doneCount = computed(() => Object.values(this.checked()).filter(Boolean).length);
  progressPct = computed(() =>
    this.totalItems === 0 ? 0 : Math.round((this.doneCount() / this.totalItems) * 100)
  );

  dayDoneCount(day: RoadmapDay): number {
    const c = this.checked();
    return day.items.filter((it) => c[it.id]).length;
  }

  isDayComplete(day: RoadmapDay): boolean {
    return this.dayDoneCount(day) === day.items.length;
  }

  weekDoneCount(w: WeekGroup): number {
    return w.days.reduce((sum, d) => sum + this.dayDoneCount(d), 0);
  }

  weekTotalCount(w: WeekGroup): number {
    return w.days.reduce((sum, d) => sum + d.items.length, 0);
  }

  toggleItem(id: string): void {
    const c = { ...this.checked() };
    c[id] = !c[id];
    this.checked.set(c);
    this.saveProgress(c);
  }

  isChecked(id: string): boolean {
    return !!this.checked()[id];
  }

  toggleWeek(week: number): void {
    this.expandedWeek.set(this.expandedWeek() === week ? -1 : week);
  }

  isWeekExpanded(week: number): boolean {
    return this.expandedWeek() === week;
  }

  jumpToToday(): void {
    const week = Math.min(Math.ceil(this.todayDay / 6) || 1, this.weeks.length);
    this.expandedWeek.set(week);
    setTimeout(() => {
      try {
        document.getElementById('day-' + this.todayDay)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {
        /* ignore */
      }
    }, 0);
  }

  requestReset(): void {
    this.showResetConfirm.set(true);
  }

  cancelReset(): void {
    this.showResetConfirm.set(false);
  }

  confirmReset(): void {
    this.checked.set({});
    this.saveProgress({});
    this.showResetConfirm.set(false);
  }

  subjectClass(subject: string): string {
    return 'subject-' + subject.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private groupByWeek(roadmap: RoadmapDay[]): WeekGroup[] {
    const map = new Map<number, RoadmapDay[]>();
    for (const d of roadmap) {
      if (!map.has(d.week)) map.set(d.week, []);
      map.get(d.week)!.push(d);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([week, days]) => ({ week, days }));
  }

  private loadProgress(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveProgress(data: Record<string, boolean>): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }

  private loadStartDate(): string {
    try {
      let d = localStorage.getItem(START_KEY);
      if (!d) {
        d = new Date().toISOString().slice(0, 10);
        localStorage.setItem(START_KEY, d);
      }
      return d;
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  }

  private computeTodayDay(startDateStr: string): number {
    const start = new Date(startDateStr);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return Math.min(Math.max(diffDays + 1, 1), 90);
  }
}
