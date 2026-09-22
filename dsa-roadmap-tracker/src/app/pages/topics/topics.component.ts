import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProgressService } from '../../core/progress.service';
import { CategoryGroup } from '../../core/models';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css',
})
export class TopicsComponent {
  readonly categories: CategoryGroup[];
  expanded: WritableSignal<Set<string>>;
  expandedTopics: WritableSignal<Set<string>>;

  constructor(readonly data: DataService, readonly progress: ProgressService) {
    this.categories = data.categories;
    this.expanded = signal<Set<string>>(new Set(this.categories.map((c) => c.categoryId)));
    this.expandedTopics = signal<Set<string>>(new Set());
  }

  isExpanded(categoryId: string): boolean {
    return this.expanded().has(categoryId);
  }

  toggleCategory(categoryId: string): void {
    const s = new Set(this.expanded());
    if (s.has(categoryId)) s.delete(categoryId);
    else s.add(categoryId);
    this.expanded.set(s);
  }

  isTopicExpanded(topicKey: string): boolean {
    return this.expandedTopics().has(topicKey);
  }

  toggleTopic(topicKey: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const s = new Set(this.expandedTopics());
    if (s.has(topicKey)) s.delete(topicKey);
    else s.add(topicKey);
    this.expandedTopics.set(s);
  }

  subjectClass(categoryId: string): string {
    return 'subject-' + categoryId;
  }
}
