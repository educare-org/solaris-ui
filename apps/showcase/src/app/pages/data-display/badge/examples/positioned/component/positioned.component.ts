import { Component, input } from '@angular/core';

import { SolarisBadgeComponent } from '@solaris-ui/angular';
import type { SolarisBadgePlacement } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-positioned-badge-example',
  imports: [SolarisBadgeComponent],
  templateUrl: './positioned.component.html',
  styleUrls: ['./positioned.component.scss'],
})
export class PositionedBadgeExample {
  readonly placement = input<SolarisBadgePlacement>('top-right');
}
