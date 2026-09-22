import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProgressService } from '../../core/progress.service';
import { computeMilestones } from '../../core/milestones';
import { TopicGroup } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly allTopics: TopicGroup[];
  readonly totalTopics: number;
  readonly ai200Topic: TopicGroup | undefined;
  readonly az900Topic: TopicGroup | undefined;

  constructor(readonly data: DataService, readonly progress: ProgressService) {
    this.allTopics = data.categories.flatMap((c) => c.topics);
    this.totalTopics = this.allTopics.length;
    this.ai200Topic = data.getTopic('azure', 'ai200');
    this.az900Topic = data.getTopic('azure', 'az900');
  }

  readonly currentDay = computed(() => this.progress.currentDay());
  readonly currentWeek = computed(() => Math.ceil(this.currentDay() / 6));
  readonly currentDayGroup = computed(() => this.data.getDay(this.currentDay()));

  readonly overallPct = computed(() =>
    Math.round((this.progress.doneCount() / this.data.totalItems) * 100)
  );

  readonly currentDayDoneCount = computed(() => this.progress.dayDoneCount(this.currentDay()));
  readonly currentDayTotalCount = computed(() => this.currentDayGroup()?.items.length ?? 0);
  readonly currentDayPct = computed(() =>
    this.currentDayTotalCount() ? Math.round((this.currentDayDoneCount() / this.currentDayTotalCount()) * 100) : 0
  );

  readonly daysCompleted = computed(() => this.currentDay() - 1);

  readonly completedTopicsCount = computed(
    () => this.allTopics.filter((t) => this.progress.topicStatus(t) === 'completed').length
  );

  readonly milestones = computed(() => computeMilestones(this.data, this.progress));

  readonly upcomingMilestone = computed(() => this.milestones().find((m) => !m.achieved));

  readonly weeklyChart = computed(() => {
    const c = this.progress.checked();
    return this.data.weeks.map((w) => {
      const items = w.days.flatMap((d) => d.items);
      const done = items.filter((i) => c[i.id]).length;
      return { week: w.week, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
    });
  });

  isChecked(id: string): boolean {
    return this.progress.isChecked(id);
  }

  toggle(id: string): void {
    this.progress.toggle(id);
  }

  subjectClass(categoryId: string): string {
    return 'subject-' + categoryId;
  }
}
