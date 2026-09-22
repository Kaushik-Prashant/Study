import { Component, HostListener, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from './core/data.service';
import { ProgressService } from './core/progress.service';

interface SearchResult {
  kind: 'topic' | 'week';
  label: string;
  sublabel: string;
  link: unknown[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly navItems = [
    { path: '/', label: 'Dashboard', icon: '⌂' },
    { path: '/roadmap', label: 'Roadmap', icon: '\u{1F5D3}' },
    { path: '/topics', label: 'Topic Library', icon: '\u{1F4DA}' },
    { path: '/revision', label: 'Revision', icon: '\u{1F504}' },
    { path: '/milestones', label: 'Milestones', icon: '\u{1F3C1}' },
  ];

  sidebarOpen = signal(false);
  searchOpen = signal(false);
  query = signal('');

  results = computed<SearchResult[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (q.length < 2) return [];
    const out: SearchResult[] = [];

    for (const cat of this.data.categories) {
      for (const topic of cat.topics) {
        const hay = (topic.topicName + ' ' + cat.categoryName + ' ' + topic.items.map((i) => i.title).join(' ')).toLowerCase();
        if (hay.includes(q)) {
          out.push({
            kind: 'topic',
            label: topic.topicName,
            sublabel: cat.categoryName,
            link: ['/topics', topic.categoryId, topic.topicId],
          });
        }
        if (out.length >= 12) return out;
      }
    }

    for (const w of this.data.weeks) {
      const hay = `week ${w.week}`;
      if (hay.includes(q)) {
        out.push({ kind: 'week', label: `Week ${w.week}`, sublabel: `Day ${w.days[0].day}-${w.days[w.days.length - 1].day}`, link: ['/roadmap'] });
      }
    }

    return out.slice(0, 12);
  });

  constructor(readonly data: DataService, readonly progress: ProgressService, private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  openSearch(): void {
    this.searchOpen.set(true);
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.query.set('');
  }

  goTo(link: unknown[]): void {
    this.router.navigate(link as any[]);
    this.closeSearch();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.searchOpen.set(true);
    } else if (e.key === 'Escape') {
      this.closeSearch();
    }
  }
}
