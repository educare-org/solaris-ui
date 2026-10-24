import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisDateCalendarComponent } from '../component/calendar.component';

describe('SolarisDateCalendarComponent', () => {
  let fixture: ComponentFixture<SolarisDateCalendarComponent>;

  const createFixture = (): HTMLElement => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisDateCalendarComponent);
    fixture.componentRef.setInput('month', { year: 2025, month: 6 });
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('previousMonthLabel', 'Previous month');
    fixture.componentRef.setInput('nextMonthLabel', 'Next month');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('shows month options when the month heading is selected', () => {
    const element = createFixture();

    (
      element.querySelector(
        '.solaris-date-calendar__month',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(
      element.querySelectorAll('.solaris-date-calendar__month-option'),
    ).toHaveLength(12);
    expect(
      element.querySelector('.solaris-date-calendar__month-icon'),
    ).toBeTruthy();
    expect(
      element
        .querySelector('.solaris-date-calendar__month')
        ?.getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('navigates by year while selecting a month', () => {
    const element = createFixture();
    let emittedMonth: { year: number; month: number } | undefined;
    fixture.componentRef.instance.monthChange.subscribe((month) => {
      emittedMonth = month;
    });

    (
      element.querySelector(
        '.solaris-date-calendar__month',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    (
      element.querySelectorAll(
        '.solaris-date-calendar__navigation',
      )[1] as HTMLButtonElement
    ).click();

    expect(emittedMonth).toEqual({ year: 2026, month: 6 });
  });

  it('selects a month and returns to the day grid', () => {
    const element = createFixture();
    let emittedMonth: { year: number; month: number } | undefined;
    fixture.componentRef.instance.monthChange.subscribe((month) => {
      emittedMonth = month;
    });

    (
      element.querySelector(
        '.solaris-date-calendar__month',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    (
      element.querySelectorAll(
        '.solaris-date-calendar__month-option',
      )[0] as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(emittedMonth).toEqual({ year: 2025, month: 0 });
    expect(element.querySelector('.solaris-date-calendar__days')).toBeTruthy();
  });

  describe('weekStartsOn / disablePast / disableFuture (P5 B/C)', () => {
    const weekdayLabels = (): string[] => {
      return Array.from(
        fixture.nativeElement.querySelectorAll(
          '.solaris-date-calendar__weekdays [role="columnheader"]',
        ),
      ).map((el) => (el as HTMLElement).textContent?.trim() ?? '');
    };

    const dayButton = (value: string): HTMLButtonElement | null => {
      const buttons = Array.from(
        fixture.nativeElement.querySelectorAll(
          'button.solaris-date-calendar__day',
        ),
      ) as HTMLButtonElement[];
      return (
        buttons.find((button) =>
          button.getAttribute('aria-label')?.includes(value),
        ) ?? null
      );
    };

    it('starts the week on Sunday by default and on Monday when requested', () => {
      createFixture();
      const sundayFirst = weekdayLabels()[0];
      fixture.componentRef.setInput('weekStartsOn', 1);
      fixture.detectChanges();
      const mondayFirst = weekdayLabels()[0];
      expect(sundayFirst).not.toBe(mondayFirst);
      expect(mondayFirst).toBe('Mon');
    });

    it('disables past dates when disablePast is set', () => {
      createFixture();
      const today = new Date();
      const yesterday = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      );
      const label = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(yesterday);
      fixture.componentRef.setInput('month', {
        year: yesterday.getUTCFullYear(),
        month: yesterday.getUTCMonth(),
      });
      fixture.componentRef.setInput('disablePast', true);
      fixture.detectChanges();
      expect(dayButton(label)?.disabled).toBe(true);
    });

    it('disables future dates when disableFuture is set', () => {
      createFixture();
      const today = new Date();
      const tomorrow = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      );
      const label = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(tomorrow);
      fixture.componentRef.setInput('month', {
        year: tomorrow.getUTCFullYear(),
        month: tomorrow.getUTCMonth(),
      });
      fixture.componentRef.setInput('disableFuture', true);
      fixture.detectChanges();
      expect(dayButton(label)?.disabled).toBe(true);
    });
  });
});
