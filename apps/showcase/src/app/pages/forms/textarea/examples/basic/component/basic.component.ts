import { Component } from '@angular/core';

import { SolarisTextareaDirective } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-textarea-example',
  imports: [SolarisTextareaDirective],
  templateUrl: './basic.component.html',
})
export class BasicTextareaExample {}
