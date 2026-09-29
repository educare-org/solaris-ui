import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-full-width-button-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './full-width.component.html',
})
export class FullWidthButtonExample {}
