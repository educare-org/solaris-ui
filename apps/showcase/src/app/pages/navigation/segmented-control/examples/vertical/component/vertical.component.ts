import { Component, signal } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-vertical-example',
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './vertical.component.html',
})
export class SegmentedVerticalExample {
  readonly value = signal<unknown>('general');
}
