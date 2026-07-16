import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisRadioComponent,
  SolarisRadioGroupComponent,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

interface Plan {
  id: number;
  name: string;
}

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisRadioComponent,
    SolarisRadioGroupComponent,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './radio-group-showcase.html',
  styleUrls: ['./radio-group-showcase.scss'],
})
export class RadioGroupShowcasePage {
  protected readonly basicControl = new FormControl<string>('basic');
  protected readonly horizontalControl = new FormControl<string>('yes');
  protected readonly gridControl = new FormControl<string>('a');
  protected readonly disabledControl = new FormControl<string>('basic');
  protected readonly readonlyControl = new FormControl<string>('basic');
  protected readonly formFieldControl = new FormControl<string>('pro');

  protected readonly basicPlan: Plan = { id: 1, name: 'Basic' };
  protected readonly proPlan: Plan = { id: 2, name: 'Pro' };
  protected readonly enterprisePlan: Plan = { id: 3, name: 'Enterprise' };

  protected readonly complexFormControl = new FormControl<Plan>(this.basicPlan);

  protected comparePlan(a: unknown, b: unknown): boolean {
    return (a as Plan).id === (b as Plan).id;
  }
}
