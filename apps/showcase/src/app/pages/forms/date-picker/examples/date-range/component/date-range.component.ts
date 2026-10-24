import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisDateRangePickerComponent,
  SolarisTranslatePipe,
  type SolarisDatePreset,
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
  selector: 'app-date-range-example',
  imports: [
    ReactiveFormsModule,
    SolarisDateRangePickerComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeExample {
  protected readonly rangeControl = new FormControl({
    start: toSolarisDate(addDays(today, -4)),
    end: toSolarisDate(today),
  });

  protected readonly presets: readonly SolarisDatePreset[] = [
    {
      id: 'today',
      labelKey: 'date-picker.range.preset.today',
      range: { start: toSolarisDate(today), end: toSolarisDate(today) },
    },
    {
      id: 'last-7-days',
      labelKey: 'date-picker.range.preset.last-7-days',
      range: {
        start: toSolarisDate(addDays(today, -6)),
        end: toSolarisDate(today),
      },
    },
    {
      id: 'this-month',
      labelKey: 'date-picker.range.preset.this-month',
      range: {
        start: toSolarisDate(
          new Date(today.getFullYear(), today.getMonth(), 1),
        ),
        end: toSolarisDate(today),
      },
    },
  ];
}
