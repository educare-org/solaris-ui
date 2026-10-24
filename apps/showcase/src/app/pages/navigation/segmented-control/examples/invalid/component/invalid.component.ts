import { Component, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-invalid-example',
  imports: [
    SolarisButtonDirective,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './invalid.component.html',
  styleUrls: ['./invalid.component.scss'],
})
export class SegmentedInvalidExample {
  protected readonly showError = signal(false);

  protected validate(): void {
    this.showError.set(true);
  }
}
