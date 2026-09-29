import { Component, input } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-custom-button-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss'],
})
export class CustomButtonExample {
  readonly variant = input<'violet' | 'amber'>('violet');
}
