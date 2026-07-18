import { Component, signal } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-equal-width-example',
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './equal-width.component.html',
})
export class SegmentedEqualWidthExample {
  readonly value = signal<unknown>('a');
}
