import { Component, input, signal } from '@angular/core';

import { SolarisSliderComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-vertical-slider-example',
  imports: [SolarisSliderComponent],
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
})
export class VerticalSliderExample {
  readonly label = input('Balance');
  readonly balance = signal(30);
}
