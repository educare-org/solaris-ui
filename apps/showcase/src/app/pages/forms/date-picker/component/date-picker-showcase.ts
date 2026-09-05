import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  SolarisDatePickerComponent,
  SolarisDateRangePickerComponent,
  SolarisTranslatePipe,
  type SolarisDatePreset,
} from '@solaris-ui/angular';

const toSolarisDate = (date: Date): string =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) =>
      index === 0
        ? String(part).padStart(4, '0')
        : String(part).padStart(2, '0'),
    )
    .join('-');

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const today = new Date();
today.setHours(0, 0, 0, 0);
const weekStart = addDays(today, -today.getDay());
const lastWeekStart = addDays(weekStart, -7);
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const minSelectableDate = toSolarisDate(addDays(today, -7));
const maxSelectableDate = toSolarisDate(addDays(today, 21));
const unavailableDates = [
  toSolarisDate(addDays(today, 2)),
  toSolarisDate(addDays(today, 5)),
];

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisDatePickerComponent,
    SolarisDateRangePickerComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './date-picker-showcase.html',
  styleUrls: ['./date-picker-showcase.scss'],
})
export class DatePickerShowcasePage {
  protected readonly dateControl = new FormControl(toSolarisDate(today));
  protected readonly rangeControl = new FormControl({
    start: toSolarisDate(addDays(today, -4)),
    end: toSolarisDate(today),
  });
  protected readonly limitedDateControl = new FormControl(toSolarisDate(today));
  protected readonly limitedRangeControl = new FormControl({
    start: toSolarisDate(today),
    end: toSolarisDate(addDays(today, 7)),
  });
  protected readonly requiredDateControl = new FormControl<string | null>(null);
  protected readonly readonlyDateControl = new FormControl(
    toSolarisDate(addDays(today, -2)),
  );
  protected readonly disabledDateControl = new FormControl(
    toSolarisDate(addDays(today, 10)),
  );
  protected readonly minSelectableDate = minSelectableDate;
  protected readonly maxSelectableDate = maxSelectableDate;
  protected readonly unavailableDates = unavailableDates;
  protected readonly presets: readonly SolarisDatePreset[] = [
    {
      id: 'today',
      label: 'Hoje',
      range: { start: toSolarisDate(today), end: toSolarisDate(today) },
    },
    {
      id: 'yesterday',
      label: 'Ontem',
      range: {
        start: toSolarisDate(addDays(today, -1)),
        end: toSolarisDate(addDays(today, -1)),
      },
    },
    {
      id: 'this-week',
      label: 'Esta semana',
      range: {
        start: toSolarisDate(weekStart),
        end: toSolarisDate(addDays(weekStart, 6)),
      },
    },
    {
      id: 'last-week',
      label: 'Semana passada',
      range: {
        start: toSolarisDate(lastWeekStart),
        end: toSolarisDate(addDays(lastWeekStart, 6)),
      },
    },
    {
      id: 'this-month',
      label: 'Este mês',
      range: { start: toSolarisDate(monthStart), end: toSolarisDate(monthEnd) },
    },
  ];
}
