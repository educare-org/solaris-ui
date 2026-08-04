import { Component } from '@angular/core';

import {
  SolarisSpinnerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisSpinnerComponent, SolarisTranslatePipe],
  templateUrl: './spinner-showcase.html',
  styleUrls: ['./spinner-showcase.scss'],
})
export class SpinnerShowcasePage {
  showBackdrop = false;
}
