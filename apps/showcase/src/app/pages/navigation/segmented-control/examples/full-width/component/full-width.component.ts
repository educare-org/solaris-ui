import { Component, signal } from '@angular/core';

import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-full-width-example',
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe],
  templateUrl: './full-width.component.html',
})
export class SegmentedFullWidthExample {
  readonly value = signal<unknown>('a');
}
