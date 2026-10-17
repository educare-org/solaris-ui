import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it, vi } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisCalendarComponent } from '../component/shell.component';
import {
  formatTimeZoneOffset,
  isNarrowViewport,
  normalizeCustomDays,
  normalizeShellView,
  resolveEffectiveView,
  resolveMiniMonth,
  shiftShellDate,
  visibleDaysForView,
} from '../model/shell.utils';

describe('shell utils', () => {
  it('normalizes the view with a month fallback', () => {
    expect(normalizeShellView('week')).toBe('week');
    expect(normalizeShellView('custom')).toBe('custom');
    expect(normalizeShellView('nope')).toBe('month');
    expect(normalizeShellView(null)).toBe('month');
    expect(normalizeShellView(undefined)).toBe('month');
  });

  it('clamps custom days to 1..7 with a 4 default', () => {
    expect(normalizeCustomDays(3)).toBe(3);
    expect(normalizeCustomDays('5')).toBe(5);
    expect(normalizeCustomDays(0)).toBe(1);
    expect(normalizeCustomDays(9)).toBe(7);
    expect(normalizeCustomDays(2.4)).toBe(2);
    expect(normalizeCustomDays(Number.NaN)).toBe(4);
    expect(normalizeCustomDays(undefined)).toBe(4);
    expect(normalizeCustomDays(null)).toBe(4);
    expect(normalizeCustomDays(true)).toBe(4);
    expect(normalizeCustomDays({})).toBe(4);
    expect(normalizeCustomDays('abc')).toBe(4);
  });

  it('maps views to visible days', () => {
    expect(visibleDaysForView('day', 4)).toBe(1);
    expect(visibleDaysForView('week', 4)).toBe(7);
    expect(visibleDaysForView('month', 4)).toBe(7);
    expect(visibleDaysForView('year', 4)).toBe(7);
    expect(visibleDaysForView('schedule', 4)).toBe(7);
    expect(visibleDaysForView('custom', 3)).toBe(3);
    expect(visibleDaysForView('custom', 9)).toBe(7);
  });

  it('detects narrow viewports at 640px', () => {
    expect(isNarrowViewport(360)).toBe(true);
    expect(isNarrowViewport(640)).toBe(true);
    expect(isNarrowViewport(641)).toBe(false);
    expect(isNarrowViewport(undefined)).toBe(false);
    expect(isNarrowViewport(Number.NaN)).toBe(false);
    expect(isNarrowViewport('640')).toBe(false);
    expect(isNarrowViewport(null)).toBe(false);
  });

  it('resolves the responsive fallback', () => {
    expect(resolveEffectiveView('month', true, 'schedule')).toBe('schedule');
    expect(resolveEffectiveView('schedule', true, 'schedule')).toBe('schedule');
    expect(resolveEffectiveView('month', false, 'schedule')).toBe('month');
    expect(resolveEffectiveView('month', true, null)).toBe('month');
    expect(resolveEffectiveView('month', false, null)).toBe('month');
    expect(resolveEffectiveView('schedule', false, 'schedule')).toBe(
      'schedule',
    );
  });

  it('shifts dates per view', () => {
    expect(shiftShellDate('2026-10-15', 'day', 4, 1)).toBe('2026-10-16');
    expect(shiftShellDate('2026-10-15', 'week', 4, 1)).toBe('2026-10-22');
    expect(shiftShellDate('2026-10-15', 'custom', 3, 1)).toBe('2026-10-18');
    expect(shiftShellDate('2026-10-15', 'month', 4, 1)).toBe('2026-11-15');
    expect(shiftShellDate('2026-10-15', 'month', 4, -1)).toBe('2026-09-15');
    expect(shiftShellDate('2026-10-15', 'year', 4, 1)).toBe('2027-10-15');
    expect(shiftShellDate('2026-10-15', 'year', 4, -1)).toBe('2025-10-15');
    expect(shiftShellDate('2026-10-15', 'schedule', 4, 1)).toBe('2026-10-22');
    expect(shiftShellDate('2026-10-15', 'nope' as never, 4, 1)).toBe(
      '2026-10-15',
    );
    expect(shiftShellDate('not-a-date', 'day', 4, 1)).toBe('not-a-date');
    expect(shiftShellDate('not-a-date', 'week', 4, 1)).toBe('not-a-date');
    expect(shiftShellDate('not-a-date', 'custom', 3, 1)).toBe('not-a-date');
    expect(shiftShellDate('not-a-date', 'month', 4, 1)).toBe('not-a-date');
    expect(shiftShellDate('not-a-date', 'schedule', 4, 1)).toBe('not-a-date');
    expect(shiftShellDate('not-a-date', 'year', 4, 1)).toBe('not-a-date');
    expect(shiftShellDate('not-a-date', 'nope' as never, 4, 1)).toBe(
      'not-a-date',
    );
    expect(visibleDaysForView('invalid' as never, 4)).toBe(7);
  });

  it('formats the GMT offset label', () => {
    const behind = formatTimeZoneOffset(
      'America/Sao_Paulo',
      Date.parse('2026-10-15T12:00:00Z'),
    );
    expect(behind).toMatch(/^GMT[+-]\d{2}:\d{2}$/);
    const ahead = formatTimeZoneOffset(
      'Europe/Berlin',
      Date.parse('2026-07-15T12:00:00Z'),
    );
    expect(ahead).toMatch(/^GMT[+-]\d{2}:\d{2}$/);
    expect(normalizeShellView(7)).toBe('month');
    expect(normalizeShellView('')).toBe('month');
  });
});

describe('SolarisCalendarComponent', () => {
  let fixture: ComponentFixture<SolarisCalendarComponent>;

  const createFixture = (): HTMLElement => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders toolbar, switcher, mini-month, and the month grid', () => {
    const element = createFixture();
    expect(element.querySelector('.solaris-calendar__toolbar')).not.toBeNull();
    expect(element.querySelector('.solaris-calendar__today')).not.toBeNull();
    expect(element.querySelectorAll('.solaris-calendar__view')).toHaveLength(6);
    expect(
      element.querySelector('.solaris-calendar-month-view__grid'),
    ).not.toBeNull();
    expect(element.getAttribute('data-view')).toBe('month');
  });

  it('switches views and emits viewChange', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let changed: string | undefined;
    instance.viewChange.subscribe((value) => {
      changed = value as string;
    });
    (
      element.querySelector(
        '.solaris-calendar__view[data-view="week"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(changed).toBe('week');
    expect(
      element.querySelector('.solaris-calendar-week-view__grid'),
    ).not.toBeNull();
  });

  it('shifts and returns to today', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    (
      element.querySelector('.solaris-calendar__next') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(instance.focusedDate()).toBe('2026-11-15');
    (
      element.querySelector('.solaris-calendar__prev') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(instance.focusedDate()).toBe('2026-10-15');
    (
      element.querySelector('.solaris-calendar__today') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(instance.focusedDate()).not.toHaveLength(0);
  });

  it('drills through the mini-month', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let selected: string | undefined;
    instance.daySelect.subscribe((value) => {
      selected = value;
    });
    (
      element.querySelector(
        '.solaris-calendar__mini-day[data-date="2026-10-20"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(selected).toBe('2026-10-20');
    expect(instance.focusedDate()).toBe('2026-10-20');
  });

  it('toggles weekends and custom days', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    const weekends = fixture.debugElement.query(
      By.css('solaris-checkbox.solaris-calendar__weekends'),
    );
    expect(weekends).not.toBeNull();
    weekends.triggerEventHandler('checkedChange', false);
    fixture.detectChanges();
    expect(instance.showWeekends()).toBe(false);
    const custom = element.querySelector(
      '.solaris-calendar__custom-days',
    ) as HTMLInputElement;
    custom.value = '3';
    custom.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(instance.customDays()).toBe(3);
  });

  it('falls back to schedule on narrow viewports', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    instance.view.set('month');
    (
      instance as unknown as { isNarrow: { set: (value: boolean) => void } }
    ).isNarrow.set(true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-calendar-schedule-view__list'),
    ).not.toBeNull();
    instance.view.set('schedule');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-schedule-view__list',
      ),
    ).not.toBeNull();
  });

  it('renders the timezone label and select', () => {
    const element = createFixture();
    expect(element.querySelector('.solaris-calendar__tz')).not.toBeNull();
    const select = fixture.debugElement.query(
      By.css('solaris-select.solaris-calendar__tz-select'),
    );
    expect(select).not.toBeNull();
    select.triggerEventHandler('valueChange', 'UTC');
    fixture.detectChanges();
    expect(fixture.componentRef.instance.timeZone()).toBe('UTC');
  });

  it('renders day, year, and custom views', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    instance.view.set('day');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-week-view__grid',
      ),
    ).not.toBeNull();
    instance.view.set('year');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-year-view__grid',
      ),
    ).not.toBeNull();
    instance.view.set('custom');
    instance.customDays.set(1);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-week-view__grid',
      ),
    ).not.toBeNull();
    expect(element.getAttribute('data-view')).not.toBeNull();
  });

  it('covers control edges and forwarding', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    const custom = element.querySelector(
      '.solaris-calendar__custom-days',
    ) as HTMLInputElement;
    custom.value = 'abc';
    custom.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(instance.customDays()).toBe(1);
    (
      instance as unknown as { onCustomDays: (value: string) => void }
    ).onCustomDays('abc');
    fixture.detectChanges();
    expect(instance.customDays()).toBe(1);
    (
      instance as unknown as { onCustomDays: (value: string) => void }
    ).onCustomDays('3');
    fixture.detectChanges();
    expect(instance.customDays()).toBe(3);
    const select = fixture.debugElement.query(
      By.css('solaris-select.solaris-calendar__tz-select'),
    );
    const before = instance.timeZone();
    select.triggerEventHandler('valueChange', '');
    fixture.detectChanges();
    expect(instance.timeZone()).toBe(before);
    const dayBefore = instance.focusedDate();
    (instance as unknown as { pickMini: (date: string) => void }).pickMini(
      'not-a-date',
    );
    fixture.detectChanges();
    expect(instance.focusedDate()).toBe(dayBefore);
    (instance as unknown as { shiftMini: (delta: number) => void }).shiftMini(
      -1,
    );
    fixture.detectChanges();
    (instance as unknown as { shiftMini: (delta: number) => void }).shiftMini(
      1,
    );
    fixture.detectChanges();
    let forwarded: string | undefined;
    instance.daySelect.subscribe((value) => {
      forwarded = value;
    });
    (instance as unknown as { forwardDay: (date: string) => void }).forwardDay(
      '2026-10-20',
    );
    expect(forwarded).toBe('2026-10-20');
    fixture.componentRef.setInput('weekStartsOn', 1);
    fixture.componentRef.setInput('responsiveFallback', null);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-view'),
    ).toBe('month');
    expect(
      (
        instance as unknown as {
          viewLabel: (option: string) => string;
        }
      ).viewLabel('nope'),
    ).toBe('nope');
  });

  it('falls back for invalid focused dates', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    fixture.componentRef.setInput('focusedDate', 'not-a-date');
    instance.view.set('month');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-month-view__grid',
      ),
    ).not.toBeNull();
    instance.view.set('year');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-year-view__grid',
      ),
    ).not.toBeNull();
    expect(resolveMiniMonth('not-a-date')).toEqual({ year: 2026, month: 9 });
    expect(resolveMiniMonth('2026-10-15')).toEqual({ year: 2026, month: 9 });
  });

  it('renders seven days for unsupported custom counts', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    instance.view.set('custom');
    instance.customDays.set(2);
    fixture.detectChanges();
    const grid = (fixture.nativeElement as HTMLElement).querySelector(
      '.solaris-calendar-week-view__grid',
    );
    expect(grid).not.toBeNull();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[data-days="7"]'),
    ).not.toBeNull();
  });

  it('tracks narrow viewports through matchMedia', () => {
    const listeners = new Map<string, (event: { matches: boolean }) => void>();
    const remove = vi.fn();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: (
          type: string,
          listener: (event: { matches: boolean }) => void,
        ) => {
          listeners.set(type, listener);
        },
        removeEventListener: remove,
      })),
    );
    try {
      createFixture();
      expect(
        (fixture.nativeElement as HTMLElement).querySelector(
          '.solaris-calendar-month-view__grid',
        ),
      ).not.toBeNull();
      listeners.get('change')?.({ matches: true });
      fixture.detectChanges();
      expect(
        (fixture.nativeElement as HTMLElement).querySelector(
          '.solaris-calendar-schedule-view__list',
        ),
      ).not.toBeNull();
      fixture.destroy();
      expect(remove).toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('falls back to locale strings without the translate service', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    TestBed.overrideProvider(SolarisTranslateService, { useValue: null });
    fixture = TestBed.createComponent(SolarisCalendarComponent);
    fixture.componentRef.setInput('locale', 'pt-BR');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-calendar__today')?.textContent,
    ).toContain('Hoje');
  });
});
