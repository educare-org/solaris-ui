import { Component } from '@angular/core';

import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-radius-example',
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe],
  templateUrl: './radius.component.html',
  styleUrls: ['./radius.component.scss'],
  host: { class: 'radius-example' },
})
export class SegmentedRadiusExample {}
