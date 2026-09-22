import { Component, Input, OnChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProgressService } from '../../core/progress.service';
import { TopicGroup } from '../../core/models';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './topic-detail.component.html',
  styleUrl: './topic-detail.component.css',
})
export class TopicDetailComponent implements OnChanges {
  @Input() categoryId = '';
  @Input() topicId = '';

  topic = signal<TopicGroup | undefined>(undefined);

  constructor(readonly data: DataService, readonly progress: ProgressService) {}

  ngOnChanges(): void {
    this.topic.set(this.data.getTopic(this.categoryId, this.topicId));
  }

  readonly pct = computed(() => {
    const t = this.topic();
    return t ? this.progress.topicPct(t) : 0;
  });

  readonly status = computed(() => {
    const t = this.topic();
    return t ? this.progress.topicStatus(t) : 'not-started';
  });

  readonly practiceItems = computed(() => {
    const t = this.topic();
    if (!t) return [];
    return t.items.filter((i) => /practice|mock|hands-on/i.test(i.title));
  });

  readonly prerequisiteTopics = computed(() => {
    const t = this.topic();
    if (!t) return [];
    return t.prerequisites
      .map((key) => {
        const [c, id] = key.split('/');
        return this.data.getTopic(c, id);
      })
      .filter((x): x is TopicGroup => !!x);
  });

  noteValue(): string {
    const t = this.topic();
    return t ? this.progress.getNote(t.key) : '';
  }

  onNoteChange(value: string): void {
    const t = this.topic();
    if (t) this.progress.setNote(t.key, value);
  }

  toggle(id: string): void {
    this.progress.toggle(id);
  }

  isChecked(id: string): boolean {
    return this.progress.isChecked(id);
  }

  markComplete(): void {
    const t = this.topic();
    if (t) this.progress.markTopicComplete(t);
  }

  resetProgress(): void {
    const t = this.topic();
    if (t) this.progress.resetTopicProgress(t);
  }

  subjectClass(categoryId: string): string {
    return 'subject-' + categoryId;
  }
}
