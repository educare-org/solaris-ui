import { Component, input, signal } from '@angular/core';

import { SolarisRangeSliderComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-three-range-slider-example',
  imports: [SolarisRangeSliderComponent],
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss'],
})
export class ThreeRangeSliderExample {
  readonly label = input('Segments');
  readonly segments = signal([10, 50, 90]);
}
