import { Component, signal } from '@angular/core';

import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-readonly-example',
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe],
  templateUrl: './readonly.component.html',
})
export class SegmentedReadonlyExample {
  readonly value = signal<unknown>('a');
}
