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

  it('has default radius md', () => {
    createFixture();
    expect(fixture.componentInstance.radius()).toBe('md');
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

  describe('form-control contract + CVA bridge', () => {
    it('exposes focused/disabled/readonly/invalid/required getters', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      expect(fixture.componentInstance.focused).toBe(false);
      expect(fixture.componentInstance.disabled).toBe(false);
      expect(fixture.componentInstance.readonly).toBe(false);
      expect(fixture.componentInstance.required).toBe(false);
      expect(fixture.componentInstance.invalid).toBe(false);

      instance.onFocus();
      expect(fixture.componentInstance.focused).toBe(true);

      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('readonly', true);
      fixture.componentRef.setInput('required', true);
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.disabled).toBe(true);
      expect(fixture.componentInstance.readonly).toBe(true);
      expect(fixture.componentInstance.required).toBe(true);
      expect(fixture.componentInstance.invalid).toBe(true);
    });

    it('reflects programmatic disabled state via setDisabledState', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.setDisabledState(true);
      fixture.detectChanges();
      expect(fixture.componentInstance.disabled).toBe(true);
      instance.setDisabledState(false);
      fixture.detectChanges();
      expect(fixture.componentInstance.disabled).toBe(false);
    });

    it('focuses the trigger button via focus()', () => {
      const element = createFixture();
      (fixture.componentInstance as any).focus();
      const trigger = element.querySelector(
        '.solaris-date-range-picker__trigger',
      ) as HTMLButtonElement;
      expect(document.activeElement).toBe(trigger);
    });

    it('propagates value changes via registerOnChange', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      const seen: unknown[] = [];
      instance.registerOnChange((value: unknown) => {
        seen.push(value);
      });
      instance.writeValue({ start: '2025-01-12', end: '2025-01-16' });
      instance.clearPending();
      // Apply the cleared pending range so onChange fires deterministically.
      instance.apply();
      expect(seen).toHaveLength(1);
      expect(seen[0]).toEqual({ start: null, end: null });
    });

    it('notifies touch once via registerOnTouched + onBlur', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      let touches = 0;
      instance.registerOnTouched(() => {
        touches += 1;
      });
      instance.onBlur();
      instance.onBlur();
      expect(touches).toBe(1);
      expect((instance.touched as () => boolean)()).toBe(true);
    });

    it('marks required empty range invalid only after touch', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(fixture.componentInstance.invalid).toBe(false);
      instance.onBlur();
      fixture.detectChanges();
      expect(fixture.componentInstance.invalid).toBe(true);
    });
  });

  describe('manual input parsing (onInput) + selectability', () => {
    const inputEvent = (value: string): Event =>
      ({ target: { value } }) as unknown as Event;

    it('applies a valid start input and marks the preset custom', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onInput('start', inputEvent('01/12/2025'));
      expect(instance.parseError()).toBe(false);
      expect(instance.pending().start).toBe('2025-01-12');
      expect(instance.activePresetId()).toBe('custom');
      expect(instance.startDisplay()).toBe('01/12/2025');
    });

    it('applies a valid end input after a start', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onInput('start', inputEvent('01/12/2025'));
      instance.onInput('end', inputEvent('01/16/2025'));
      expect(instance.parseError()).toBe(false);
      expect(instance.pending()).toEqual({
        start: '2025-01-12',
        end: '2025-01-16',
      });
    });

    it('clears the pending part on empty input without parse error', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onInput('start', inputEvent('01/12/2025'));
      instance.onInput('start', inputEvent('   '));
      expect(instance.pending().start).toBeNull();
      expect(instance.parseError()).toBe(false);
    });

    it('flags unparseable text as a parse error', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onInput('start', inputEvent('not-a-date'));
      expect(instance.parseError()).toBe(true);
    });

    it('flags out-of-order manual ranges as a parse error', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onInput('start', inputEvent('01/16/2025'));
      instance.onInput('end', inputEvent('01/12/2025'));
      expect(instance.parseError()).toBe(true);
    });

    it('rejects dates below min via isSelectable', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('min', '2025-01-15');
      fixture.detectChanges();
      instance.onInput('start', inputEvent('01/12/2025'));
      expect(instance.parseError()).toBe(true);
    });

    it('rejects dates above max via isSelectable', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('max', '2025-01-10');
      fixture.detectChanges();
      instance.onInput('start', inputEvent('01/12/2025'));
      expect(instance.parseError()).toBe(true);
    });

    it('rejects disabled dates via isSelectable', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('disabledDates', ['2025-01-12']);
      fixture.detectChanges();
      instance.onInput('start', inputEvent('01/12/2025'));
      expect(instance.parseError()).toBe(true);
    });

    it('rejects future dates when disableFuture is set', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('disableFuture', true);
      fixture.detectChanges();
      instance.onInput('start', inputEvent('01/12/2999'));
      expect(instance.parseError()).toBe(true);
    });

    it('rejects past dates when disablePast is set', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('disablePast', true);
      fixture.detectChanges();
      instance.onInput('start', inputEvent('01/12/2000'));
      expect(instance.parseError()).toBe(true);
    });

    it('masks continuous digits following the locale order', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      const target = {
        value: '01122025',
        selectionStart: 8,
        setSelectionRange: () => undefined,
      };
      instance.onInput('start', { target } as unknown as Event);
      expect(target.value).toBe('01/12/2025');
      expect(instance.parseError()).toBe(false);
      expect(instance.pending().start).toBe('2025-01-12');
    });
  });

  describe('focus, keyboard and panel inputs', () => {
    it('toggles focused state on onFocus/onBlur', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onFocus();
      expect(instance.focusedState()).toBe(true);
      instance.onBlur();
      expect(instance.focusedState()).toBe(false);
    });

    it('stops propagation on input click', () => {
      createFixture();
      let stopped = 0;
      const event = {
        stopPropagation: (): void => {
          stopped += 1;
        },
      } as unknown as MouseEvent;
      (fixture.componentInstance as any).onInputClick(event);
      expect(stopped).toBe(1);
    });

    it('ignores non-Alt+ArrowDown keys on trigger keydown', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      const event = {
        altKey: false,
        key: 'Enter',
        preventDefault: (): void => {
          throw new Error('should not prevent default');
        },
      } as unknown as KeyboardEvent;
      instance.onInputKeydown(event);
      expect(instance.panelOpen()).toBe(false);
    });

    it('handles Alt+ArrowDown on the trigger without throwing', () => {
      createFixture();
      let prevented = 0;
      const event = {
        altKey: true,
        key: 'ArrowDown',
        preventDefault: (): void => {
          prevented += 1;
        },
      } as unknown as KeyboardEvent;
      (fixture.componentInstance as any).onInputKeydown(event);
      expect(prevented).toBe(1);
    });

    it('resets panel inputs and parse error on Escape', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.onInput('start', {
        target: { value: 'not-a-date' },
      } as unknown as Event);
      expect(instance.parseError()).toBe(true);
      let prevented = 0;
      (fixture.componentInstance as any).onPanelInputKeydown({
        key: 'Escape',
        preventDefault: (): void => {
          prevented += 1;
        },
      } as unknown as KeyboardEvent);
      expect(prevented).toBe(1);
      expect(instance.parseError()).toBe(false);
    });

    it('ignores non-Escape keys in panel inputs', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.parseError.set(true);
      (fixture.componentInstance as any).onPanelInputKeydown({
        key: 'Enter',
        preventDefault: (): void => {
          throw new Error('should not prevent default');
        },
      } as unknown as KeyboardEvent);
      expect(instance.parseError()).toBe(true);
    });
  });

  describe('calendar selection and panel actions', () => {
    it('starts a new pending range on first selectDate', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.selectDate('2025-01-12');
      expect(instance.pending()).toEqual({
        start: '2025-01-12',
        end: null,
      });
      expect(instance.activePresetId()).toBe('custom');
    });

    it('completes the range in order on second selectDate', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.selectDate('2025-01-12');
      instance.selectDate('2025-01-16');
      expect(instance.pending()).toEqual({
        start: '2025-01-12',
        end: '2025-01-16',
      });
    });

    it('swaps reversed calendar picks so start stays first', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.selectDate('2025-01-16');
      instance.selectDate('2025-01-12');
      expect(instance.pending()).toEqual({
        start: '2025-01-12',
        end: '2025-01-16',
      });
    });

    it('restarts the range when picking with a complete pending range', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.selectDate('2025-01-12');
      instance.selectDate('2025-01-16');
      instance.selectDate('2025-02-01');
      expect(instance.pending()).toEqual({
        start: '2025-02-01',
        end: null,
      });
    });

    it('updates the displayed month via setDisplayedMonth', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.setDisplayedMonth({ year: 2025, month: 5 });
      expect(instance.displayedMonth()).toEqual({ year: 2025, month: 5 });
    });

    it('marks custom active via selectCustom', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.activePresetId.set('today');
      instance.selectCustom();
      expect(instance.activePresetId()).toBe('custom');
    });

    it('clears the pending range via clearPending', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.selectDate('2025-01-12');
      instance.clearPending();
      expect(instance.pending()).toEqual({ start: null, end: null });
      expect(instance.parseError()).toBe(false);
      expect(instance.activePresetId()).toBe('custom');
    });

    it('restores the applied value via cancel', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.writeValue({ start: '2025-01-12', end: '2025-01-16' });
      instance.selectDate('2025-02-01');
      expect(instance.pending().start).toBe('2025-02-01');
      instance.cancel();
      expect(instance.pending()).toEqual({
        start: '2025-01-12',
        end: '2025-01-16',
      });
    });
  });

  describe('labels and error text branches', () => {
    it('prefers explicit error and errorKey text', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('error', 'Boom');
      fixture.detectChanges();
      expect(instance.errorText()).toBe('Boom');
      fixture.componentRef.setInput('error', undefined);
      fixture.componentRef.setInput(
        'errorKey',
        'solaris.date-picker.open-calendar',
      );
      fixture.detectChanges();
      expect(instance.errorText()).toBeTruthy();
    });

    it('reports the invalid-range message on parse error', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      instance.parseError.set(true);
      fixture.detectChanges();
      expect(instance.errorText()).toBeTruthy();
    });

    it('reports the required message when required without parse error', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(instance.errorText()).toBeTruthy();
    });

    it('resolves the clear aria label from key, text, then default', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      expect(instance.clearAriaLabel()).toBe('Clear');
      fixture.componentRef.setInput('clearLabel', 'Limpar');
      fixture.detectChanges();
      expect(instance.clearAriaLabel()).toBe('Limpar');
      fixture.componentRef.setInput(
        'clearLabelKey',
        'solaris.date-picker.open-calendar',
      );
      fixture.detectChanges();
      expect(instance.clearAriaLabel()).toBeTruthy();
    });
  });

  describe('inline panel mode', () => {
    it('highlights the preset matching the written value', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('inline', true);
      fixture.componentRef.setInput('presets', [
        {
          id: 'week',
          label: '7 days',
          range: { start: '2026-01-01', end: '2026-01-07' },
        },
      ]);
      fixture.detectChanges();
      fixture.componentInstance.writeValue({
        start: '2026-01-01',
        end: '2026-01-07',
      });
      expect(instance.activePresetId()).toBe('week');
    });
    it('renders the panel without opening a popover', () => {
      const element = createFixture();
      fixture.componentRef.setInput('inline', true);
      fixture.componentInstance.writeValue({
        start: '2026-04-28',
        end: '2026-05-04',
      });
      fixture.detectChanges();
      expect(
        element.querySelector(':scope > .solaris-date-range-picker__panel'),
      ).toBeTruthy();
      expect(element.querySelector('solaris-form-field')).toBeNull();
    });

    it('emits cancelled without a popover trigger', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      let cancelled = 0;
      fixture.componentInstance.cancelled.subscribe(() => {
        cancelled += 1;
      });
      fixture.componentRef.setInput('inline', true);
      fixture.detectChanges();
      instance.cancel();
      expect(cancelled).toBe(1);
    });
  });

  describe('per-side locks', () => {
    it('keeps the end when the end side is disabled', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('endDisabled', true);
      fixture.componentInstance.writeValue({
        start: '2026-04-28',
        end: '2026-05-04',
      });
      fixture.detectChanges();
      instance.selectDate('2026-05-01');
      expect(instance.pending()).toEqual({
        start: '2026-05-01',
        end: '2026-05-04',
      });
    });

    it('applies a start-only range when the end side is disabled', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      const seen: unknown[] = [];
      fixture.componentInstance.valueChange.subscribe((value) =>
        seen.push(value),
      );
      fixture.componentRef.setInput('endDisabled', true);
      fixture.componentInstance.writeValue({ start: null, end: null });
      fixture.detectChanges();
      instance.selectDate('2026-04-28');
      instance.apply();
      expect(seen).toEqual([{ start: '2026-04-28', end: null }]);
    });

    it('disables the end input in the panel when the end side is disabled', async () => {
      const element = createFixture();
      fixture.componentRef.setInput('endDisabled', true);
      fixture.detectChanges();
      (
        element.querySelector(
          '.solaris-date-range-picker__trigger',
        ) as HTMLButtonElement
      ).click();
      await fixture.whenStable();
      const endInput = document.querySelector(
        '.solaris-date-range-picker__inputs input[aria-label="End date"]',
      ) as HTMLInputElement;
      expect(endInput.disabled).toBe(true);
      expect(endInput.getAttribute('aria-disabled')).toBe('true');
    });

    it('updates only the end when the start side is disabled', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('startDisabled', true);
      fixture.componentInstance.writeValue({
        start: '2026-04-28',
        end: '2026-05-04',
      });
      fixture.detectChanges();
      instance.selectDate('2026-05-10');
      expect(instance.pending()).toEqual({
        start: '2026-04-28',
        end: '2026-05-10',
      });
    });

    it('ignores calendar selection when both sides are disabled', () => {
      createFixture();
      const instance = fixture.componentInstance as any;
      fixture.componentRef.setInput('startDisabled', true);
      fixture.componentRef.setInput('endDisabled', true);
      fixture.componentInstance.writeValue({
        start: '2026-04-28',
        end: '2026-05-04',
      });
      fixture.detectChanges();
      instance.selectDate('2026-05-10');
      expect(instance.pending()).toEqual({
        start: '2026-04-28',
        end: '2026-05-04',
      });
    });
  });
});
