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

  it('has default size md (P4 Lote C)', () => {
    const element = createFixture();
    expect(fixture.componentInstance.size()).toBe('md');
    expect(element.getAttribute('data-size')).toBe('md');
  });

  it('reflects density on the host and forwards size/density to the field (P4 Lote C)', () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisDateRangePickerComponent);
    fixture.componentRef.setInput('label', 'Reporting period');
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.getAttribute('data-size')).toBe('lg');
    expect(element.getAttribute('data-density')).toBe('compact');
    const field = element.querySelector('solaris-form-field') as HTMLElement;
    expect(field.getAttribute('data-size')).toBe('lg');
    expect(field.getAttribute('data-density')).toBe('compact');
  });

  it('forwards loading as overlay without layout shift (P4 Lote C)', () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisDateRangePickerComponent);
    fixture.componentRef.setInput('label', 'Reporting period');
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const field = fixture.nativeElement.querySelector(
      'solaris-form-field',
    ) as HTMLElement;
    expect(field.hasAttribute('data-loading')).toBe(true);
    expect(field.querySelector('.solaris-form-field__loading')).toBeTruthy();
  });

  it('renders the calendar trigger as a suffix action (P4 Lote C)', () => {
    const element = createFixture();
    const trigger = element.querySelector(
      '.solaris-date-range-picker__calendar-trigger',
    ) as HTMLElement;
    expect(trigger).toBeTruthy();
    expect(trigger.hasAttribute('solaris-form-suffix-action')).toBe(true);
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

  describe('clearable + dates parity (P5 B/C)', () => {
    it('renders a trigger clear button and clears the applied range', () => {
      const element = createFixture();
      let cleared = 0;
      fixture.componentInstance.cleared.subscribe(() => {
        cleared += 1;
      });
      fixture.componentRef.setInput('clearable', true);
      fixture.componentInstance.writeValue({
        start: '2025-01-12',
        end: '2025-01-16',
      });
      fixture.detectChanges();

      const button = element.querySelector(
        '.solaris-date-range-picker__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Clear');
      button.click();
      fixture.detectChanges();

      expect((fixture.componentInstance as any).value()).toEqual({
        start: null,
        end: null,
      });
      expect(cleared).toBe(1);
      expect(
        element.querySelector('.solaris-date-range-picker__clear'),
      ).toBeNull();
    });

    it('hides the trigger clear button without value', () => {
      const element = createFixture();
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();
      expect(
        element.querySelector('.solaris-date-range-picker__clear'),
      ).toBeNull();
    });

    it('keeps the footer clear action translated (P5 B/C rename)', () => {
      const element = createFixture();
      expect((fixture.componentInstance as any).clearButtonLabel()).toBe(
        'Clear',
      );
      expect(element).toBeTruthy();
    });
  });
});
