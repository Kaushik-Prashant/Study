import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProgressService } from '../../core/progress.service';
import { TopicGroup } from '../../core/models';

@Component({
  selector: 'app-revision',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './revision.component.html',
  styleUrl: './revision.component.css',
})
export class RevisionComponent {
  private readonly allTopics: TopicGroup[];
  readonly revisionCheckpoints: TopicGroup[];

  constructor(readonly data: DataService, readonly progress: ProgressService) {
    this.allTopics = data.categories.flatMap((c) => c.topics);
    this.revisionCheckpoints = this.allTopics.filter((t) => t.topicId === 'revision');
  }

  readonly completedTopics = computed(() => {
    const withDate = this.allTopics
      .filter((t) => this.progress.topicStatus(t) === 'completed')
      .map((t) => ({ topic: t, lastDate: this.lastCompletionDate(t) }));
    return withDate.sort((a, b) => (b.lastDate ?? '').localeCompare(a.lastDate ?? ''));
  });

  /** Completed topics whose most recent check-off was 7+ days ago — due for a refresh. */
  readonly dueForRevision = computed(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffIso = cutoff.toISOString().slice(0, 10);
    return this.completedTopics().filter((x) => x.lastDate && x.lastDate <= cutoffIso);
  });

  readonly interviewQuestions = computed(() => {
    const out: { topic: TopicGroup; question: string }[] = [];
    for (const { topic } of this.completedTopics()) {
      for (const q of topic.questions) out.push({ topic, question: q });
    }
    return out;
  });

  private lastCompletionDate(topic: TopicGroup): string | undefined {
    const log = this.progress.completionLog();
    const dates = topic.items.map((i) => log[i.id]).filter(Boolean) as string[];
    if (dates.length === 0) return undefined;
    return dates.sort().at(-1);
  }

  subjectClass(categoryId: string): string {
    return 'subject-' + categoryId;
  }
}
