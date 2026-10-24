import { Component } from '@angular/core';

import { SolarisInputDirective } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-input-example',
  imports: [SolarisInputDirective],
  templateUrl: './basic.component.html',
})
export class BasicInputExample {}
