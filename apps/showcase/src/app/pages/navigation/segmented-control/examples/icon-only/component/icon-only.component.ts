import { Component, signal } from '@angular/core';

import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-icon-only-example',
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe],
  templateUrl: './icon-only.component.html',
})
export class SegmentedIconOnlyExample {
  readonly value = signal<unknown>('list');
}
