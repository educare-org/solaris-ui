import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisDatePickerComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisIconButtonDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

const toSolarisDate = (date: Date): string =>
  [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

@Component({
  standalone: true,
  selector: 'app-suffix-action-date-picker-example',
  imports: [
    ReactiveFormsModule,
    SolarisDatePickerComponent,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './suffix-action.component.html',
})
export class SuffixActionDatePickerExample {
  protected readonly dateControl = new FormControl(toSolarisDate(new Date()));

  protected clearDate(): void {
    this.dateControl.setValue(null);
  }
}
