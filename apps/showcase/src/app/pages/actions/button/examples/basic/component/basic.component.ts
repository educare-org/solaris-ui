import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-button-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicButtonExample {}
