import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisMultiSelectComponent,
  SolarisOptionComponent,
  SolarisOptionGroupComponent,
  SolarisOptionLeadingDirective,
  SolarisOptionTrailingDirective,
  SolarisBadgeComponent,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisMultiSelectComponent,
    SolarisOptionComponent,
    SolarisOptionGroupComponent,
    SolarisOptionLeadingDirective,
    SolarisOptionTrailingDirective,
    SolarisBadgeComponent,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './multi-select-showcase.html',
  styleUrls: ['./multi-select-showcase.scss'],
})
export class MultiSelectShowcasePage {
  protected basicControl = new FormControl<string[]>([]);
  protected searchableControl = new FormControl<string[]>([]);
  protected clearableControl = new FormControl<string[]>(['br']);
  protected autoControl = new FormControl<string[]>(['br', 'us', 'pt', 'ar']);
  protected autoSearchControl = new FormControl<string[]>(['br', 'us']);
  protected chipsControl = new FormControl<string[]>(['br', 'us', 'pt']);
  protected summaryControl = new FormControl<string[]>(['br', 'us']);
  protected commaControl = new FormControl<string[]>(['br', 'us']);
  protected overflowControl = new FormControl<string[]>([
    'br',
    'us',
    'pt',
    'ar',
    'jp',
  ]);
  protected selectAllControl = new FormControl<string[]>([]);
  protected groupControl = new FormControl<string[]>([]);
  protected minMaxControl = new FormControl<string[]>([]);
  protected readonlyControl = new FormControl<string[]>(['br', 'us']);
  protected disabledControl = new FormControl({
    value: ['br'],
    disabled: true,
  });
  protected formFieldControl = new FormControl<string[]>([]);
  protected richControl = new FormControl<string[]>([]);
  protected invalidControl = new FormControl<string[] | null>(null, [
    Validators.required,
  ]);
  protected loading = false;

  protected get invalidError(): string {
    if (this.invalidControl.hasError('required')) {
      return 'This field is required.';
    }
    return '';
  }

  protected toggleLoading(): void {
    this.loading = !this.loading;
  }
}
