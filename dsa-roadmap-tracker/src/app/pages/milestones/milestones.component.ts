import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/data.service';
import { ProgressService } from '../../core/progress.service';
import { computeMilestones } from '../../core/milestones';

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './milestones.component.html',
  styleUrl: './milestones.component.css',
})
export class MilestonesComponent {
  constructor(readonly data: DataService, readonly progress: ProgressService) {}

  readonly milestones = computed(() => computeMilestones(this.data, this.progress));

  readonly achievedCount = computed(() => this.milestones().filter((m) => m.achieved).length);
}
