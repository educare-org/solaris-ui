import { Component } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-invalid-example',
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './invalid.component.html',
})
export class SegmentedInvalidExample {}
