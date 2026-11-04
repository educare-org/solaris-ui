import { Component, input, signal } from '@angular/core';

import { SolarisSliderComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-slider-example',
  imports: [SolarisSliderComponent],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
})
export class BasicSliderExample {
  readonly label = input('Volume');
  readonly volume = signal(50);
}
