import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { SolarisIconComponent } from '../../../icon';

import {
  addSolarisMonths,
  compareSolarisDates,
  formatSolarisDate,
  getCalendarDays,
  todaySolarisDate,
} from '../model/date.utils';
import type {
  SolarisCalendarMonth,
  SolarisDateRange,
  SolarisDateValue,
} from '../model/date.types';

@Component({
  selector: 'solaris-date-calendar',
  standalone: true,
  imports: [SolarisIconComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisDateCalendarComponent {
  readonly month = input.required<SolarisCalendarMonth>();
  readonly locale = input.required<string>();
  readonly previousMonthLabel = input.required<string>();
  readonly nextMonthLabel = input.required<string>();
  readonly selected = input<SolarisDateValue | null>(null);
  readonly range = input<SolarisDateRange | null>(null);
  readonly min = input<SolarisDateValue>();
  readonly max = input<SolarisDateValue>();
  readonly disabledDates = input<readonly SolarisDateValue[]>([]);

  readonly selectedChange = output<SolarisDateValue>();
  readonly monthChange = output<SolarisCalendarMonth>();

  protected readonly weekdays = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      weekday: 'short',
      timeZone: 'UTC',
    });
    const sunday = new Date(Date.UTC(2023, 0, 1));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sunday);
      date.setUTCDate(sunday.getUTCDate() + index);
      return formatter.format(date);
    });
  });

  protected readonly monthLabel = computed(() => {
    return new Intl.DateTimeFormat(this.locale(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(this.month().year, this.month().month, 1)));
  });

  protected readonly days = computed(() => getCalendarDays(this.month(), 0));
  protected readonly monthSelectionOpen = signal(false);
  protected readonly monthOptions = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      month: 'short',
      timeZone: 'UTC',
    });

    return Array.from({ length: 12 }, (_, month) => ({
      month,
      label: formatter.format(new Date(Date.UTC(this.month().year, month, 1))),
    }));
  });

  protected previousMonth(): void {
    this.monthChange.emit(
      addSolarisMonths(this.month(), this.monthSelectionOpen() ? -12 : -1),
    );
  }

  protected nextMonth(): void {
    this.monthChange.emit(
      addSolarisMonths(this.month(), this.monthSelectionOpen() ? 12 : 1),
    );
  }

  protected toggleMonthSelection(): void {
    this.monthSelectionOpen.update((open) => !open);
  }

  protected selectMonth(month: number): void {
    this.monthChange.emit({ year: this.month().year, month });
    this.monthSelectionOpen.set(false);
  }

  protected selectDay(value: SolarisDateValue): void {
    if (!this.isDisabled(value)) {
      this.selectedChange.emit(value);
    }
  }

  protected isDisabled(value: SolarisDateValue): boolean {
    return (
      this.disabledDates().includes(value) ||
      (!!this.min() && compareSolarisDates(value, this.min()!) < 0) ||
      (!!this.max() && compareSolarisDates(value, this.max()!) > 0)
    );
  }

  protected isSelected(value: SolarisDateValue): boolean {
    return this.selected() === value;
  }

  protected isRangeStart(value: SolarisDateValue): boolean {
    return this.range()?.start === value;
  }

  protected isRangeEnd(value: SolarisDateValue): boolean {
    return this.range()?.end === value;
  }

  protected isInRange(value: SolarisDateValue): boolean {
    const range = this.range();
    return (
      !!range?.start &&
      !!range.end &&
      compareSolarisDates(value, range.start) > 0 &&
      compareSolarisDates(value, range.end) < 0
    );
  }

  protected isToday(value: SolarisDateValue): boolean {
    return value === todaySolarisDate();
  }

  protected dayLabel(value: SolarisDateValue): string {
    return formatSolarisDate(value, this.locale());
  }
}
