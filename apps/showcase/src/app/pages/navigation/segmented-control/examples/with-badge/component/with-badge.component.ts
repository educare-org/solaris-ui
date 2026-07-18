import { Component, signal } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisBadgeComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-with-badge-example',
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisBadgeComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './with-badge.component.html',
})
export class SegmentedWithBadgeExample {
  readonly filter = signal<unknown>('all');
}
