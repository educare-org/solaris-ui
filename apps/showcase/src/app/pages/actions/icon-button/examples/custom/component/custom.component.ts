import { Component } from '@angular/core';

import {
  SolarisIconButtonDirective,
  SolarisIconComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-custom-icon-button-example',
  imports: [SolarisIconButtonDirective, SolarisIconComponent],
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss'],
})
export class CustomIconButtonExample {}
