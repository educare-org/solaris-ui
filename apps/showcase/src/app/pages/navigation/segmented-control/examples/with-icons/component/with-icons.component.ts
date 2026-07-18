import { Component, signal } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-with-icons-example',
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './with-icons.component.html',
})
export class SegmentedWithIconsExample {
  readonly viewMode = signal<unknown>('list');
}
