import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { TopicsComponent } from './pages/topics/topics.component';
import { TopicDetailComponent } from './pages/topic-detail/topic-detail.component';
import { RevisionComponent } from './pages/revision/revision.component';
import { MilestonesComponent } from './pages/milestones/milestones.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'Dashboard' },
  { path: 'roadmap', component: RoadmapComponent, title: 'Roadmap' },
  { path: 'topics', component: TopicsComponent, title: 'Topic Library' },
  { path: 'topics/:categoryId/:topicId', component: TopicDetailComponent, title: 'Topic' },
  { path: 'revision', component: RevisionComponent, title: 'Revision' },
  { path: 'milestones', component: MilestonesComponent, title: 'Milestones' },
  { path: '**', redirectTo: '' },
];
