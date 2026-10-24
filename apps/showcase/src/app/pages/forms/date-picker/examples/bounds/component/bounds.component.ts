import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisDatePickerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

const toSolarisDate = (date: Date): string =>
  [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

@Component({
  standalone: true,
  selector: 'app-bounds-date-picker-example',
  imports: [
    ReactiveFormsModule,
    SolarisDatePickerComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './bounds.component.html',
})
export class BoundsDatePickerExample {
  protected readonly limitedDateControl = new FormControl(toSolarisDate(today));
  protected readonly minSelectableDate = toSolarisDate(addDays(today, -7));
  protected readonly maxSelectableDate = toSolarisDate(addDays(today, 21));
  protected readonly unavailableDates = [
    toSolarisDate(addDays(today, 2)),
    toSolarisDate(addDays(today, 5)),
  ];
}
