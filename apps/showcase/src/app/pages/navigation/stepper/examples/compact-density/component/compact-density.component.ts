import { Component, signal } from '@angular/core';
import {
  SolarisStepperComponent,
  SolarisStepComponent,
  SolarisButtonDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-compact-density-stepper-example',
  imports: [
    SolarisStepperComponent,
    SolarisStepComponent,
    SolarisButtonDirective,
  ],
  templateUrl: './compact-density.component.html',
  styleUrls: ['./compact-density.component.scss'],
})
export class CompactDensityStepperExample {
  readonly density = signal<'compact' | 'comfortable'>('comfortable');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
}
