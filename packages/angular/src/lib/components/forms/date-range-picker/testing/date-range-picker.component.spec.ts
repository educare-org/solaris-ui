import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisDateRangePickerComponent } from '../component/date-range-picker.component';

describe('SolarisDateRangePickerComponent', () => {
  let fixture: ComponentFixture<SolarisDateRangePickerComponent>;

  const createFixture = (): HTMLElement => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisDateRangePickerComponent);
    fixture.componentRef.setInput('label', 'Reporting period');
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('has default radius sm', () => {
    createFixture();
    expect(fixture.componentInstance.radius()).toBe('sm');
  });

  it('uses a read-only trigger to display the applied date range', () => {
    const element = createFixture();
    fixture.componentInstance.writeValue({
      start: '2025-01-12',
      end: '2025-01-16',
    });
    fixture.detectChanges();

    const trigger = element.querySelector(
      '.solaris-date-range-picker__trigger',
    ) as HTMLButtonElement;

    expect(trigger).toBeTruthy();
    expect(trigger.textContent?.trim()).toBe('01/12/2025 - 01/16/2025');
  });

  it('renders preset shortcuts in the popover', async () => {
    const element = createFixture();
    fixture.componentRef.setInput('presets', [
      {
        id: 'today',
        label: 'Today',
        range: { start: '2025-01-16', end: '2025-01-16' },
      },
    ]);
    fixture.detectChanges();

    (
      element.querySelector(
        '.solaris-date-range-picker__trigger',
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();

    expect(
      document.querySelector('.solaris-date-range-picker__preset')?.textContent,
    ).toContain('Today');
    expect(
      document.querySelectorAll('.solaris-date-range-picker__preset'),
    ).toHaveLength(2);

    (
      document.querySelector(
        '.solaris-date-range-picker__preset',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(
      document.querySelector('.solaris-date-calendar__month')?.textContent,
    ).toContain('January 2025');
  });

  it('keeps the applied preset active when the popover reopens', async () => {
    const element = createFixture();
    fixture.componentRef.setInput('presets', [
      {
        id: 'today',
        label: 'Today',
        range: { start: '2025-01-16', end: '2025-01-16' },
      },
    ]);
    fixture.detectChanges();

    const trigger = element.querySelector(
      '.solaris-date-range-picker__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    await fixture.whenStable();

    (
      document.querySelector(
        '.solaris-date-range-picker__preset',
      ) as HTMLButtonElement
    ).click();
    (
      document.querySelector(
        '.solaris-date-range-picker__actions button:last-child',
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();

    trigger.click();
    await fixture.whenStable();

    expect(
      document.querySelector('.solaris-date-range-picker__preset[data-active]')
        ?.textContent,
    ).toContain('Today');
  });
});
