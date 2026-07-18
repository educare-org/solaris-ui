import { Component } from '@angular/core';

import {
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-appearances-example',
  imports: [
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './appearances.component.html',
  styleUrls: ['./appearances.component.scss'],
  host: { class: 'appearances-example' },
})
export class SegmentedAppearancesExample {}
