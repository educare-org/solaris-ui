import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import {
  SolarisSelectComponent,
  SolarisOptionComponent,
  SolarisOptionGroupComponent,
  SolarisFormFieldComponent,
  SolarisBadgeComponent,
  SolarisTranslatePipe,
  SolarisOptionLeadingDirective,
  SolarisOptionTrailingDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisOptionGroupComponent,
    SolarisFormFieldComponent,
    SolarisBadgeComponent,
    SolarisTranslatePipe,
    SolarisOptionLeadingDirective,
    SolarisOptionTrailingDirective,
  ],
  templateUrl: './select-showcase.html',
  styleUrls: ['./select-showcase.scss'],
})
export class SelectShowcasePage {
  protected placeholderControl = new FormControl<string | null>(null);
  protected searchableControl = new FormControl<string | null>(null);
  protected groupedControl = new FormControl<string | null>(null);
  protected readonlyControl = new FormControl('readonly-value');
  protected disabledControl = new FormControl({
    value: 'admin',
    disabled: true,
  });
  protected clearableControl = new FormControl('active');
  protected basicControl = new FormControl('admin');

  protected searchableDisabledControl = new FormControl<string | null>({
    value: null,
    disabled: true,
  });

  protected invalidControl = new FormControl<string | null>(null, [
    Validators.required,
  ]);

  protected formFieldControl = new FormControl<string | null>(null, [
    Validators.required,
  ]);

  protected objectControl = new FormControl<{
    id: number;
    name: string;
  } | null>(null);
  protected loading = false;

  protected basicPlan = { id: 1, name: 'Basic' };
  protected proPlan = { id: 2, name: 'Pro' };
  protected enterprisePlan = { id: 3, name: 'Enterprise' };

  protected comparePlan(a: unknown, b: unknown): boolean {
    if (!a || !b) return a === b;
    return (a as { id: number }).id === (b as { id: number }).id;
  }

  protected displayPlan(value: unknown): string | undefined {
    if (!value) return undefined;
    return (value as { name: string }).name;
  }

  protected get invalidError(): string {
    if (this.invalidControl.hasError('required')) {
      return 'This field is required.';
    }
    return '';
  }

  protected get formFieldError(): string {
    if (this.formFieldControl.hasError('required')) {
      return 'Select is required.';
    }
    return '';
  }

  protected toggleLoading(): void {
    this.loading = !this.loading;
  }
}
