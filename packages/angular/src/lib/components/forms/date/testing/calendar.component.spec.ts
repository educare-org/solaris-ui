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
});
