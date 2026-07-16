import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  SolarisCheckboxComponent,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxComponent,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './checkbox-showcase.html',
  styleUrls: ['./checkbox-showcase.scss'],
})
export class CheckboxShowcasePage {
  protected readonly basicChecked = signal(false);
  protected readonly allSelected = signal(false);
  protected readonly someSelected = signal(true);
  protected readonly termsControl = new FormControl(
    false,
    Validators.requiredTrue,
  );
  protected readonly acceptControl = new FormControl(false);

  protected toggleAllSelected(): void {
    this.allSelected.set(!this.allSelected());
    this.someSelected.set(false);
  }
}
