import { Component } from '@angular/core';

import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-segmented-sizes-example',
  imports: [SolarisSegmentedControlComponent, SolarisSegmentedItemComponent, SolarisTranslatePipe],
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss'],
  host: { class: 'sizes-example' },
})
export class SegmentedSizesExample {}
