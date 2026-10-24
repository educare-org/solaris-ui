import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import { SolarisTranslateService } from '../../../../../services/translation';
import { SolarisDialogService } from '../../../../overlay/dialog';
import {
  SOLARIS_DIALOG_DATA,
  SOLARIS_DIALOG_REF,
} from '../../../../overlay/dialog';
import { SolarisCalendarEditorDialogComponent } from '../component/calendar-editor-dialog.component';
import { SolarisCalendarComponent } from '../component/shell.component';
import {
  buildSolarisCreateDraft,
  buildSolarisSlotDraft,
  formatTimeZoneOffset,
  isNarrowViewport,
  newSolarisCreateId,
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

  it('builds unique create ids', () => {
    const first = newSolarisCreateId();
    const second = newSolarisCreateId();
    expect(first.startsWith('event-')).toBe(true);
    expect(second.startsWith('event-')).toBe(true);
    expect(first).not.toBe(second);
  });

  it('builds a create draft from drag proposals', () => {
    const allDay = buildSolarisCreateDraft({
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    expect(allDay).toMatchObject({
      kind: 'event',
      title: '',
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    const timed = buildSolarisCreateDraft({
      start: '2026-10-20T09:00:00-03:00',
      end: '2026-10-20T10:00:00-03:00',
      allDay: false,
    });
    expect(timed).toMatchObject({ kind: 'event', allDay: false });
    expect(allDay?.id).not.toBe(timed?.id);
  });

  it('rejects invalid create proposals', () => {
    expect(
      buildSolarisCreateDraft({ start: '', end: '', allDay: true }),
    ).toBeNull();
    expect(
      buildSolarisCreateDraft({
        start: '2026-10-21',
        end: '2026-10-20',
        allDay: true,
      }),
    ).toBeNull();
    expect(
      buildSolarisCreateDraft({
        start: '2026-10-20T10:00:00-03:00',
        end: '2026-10-20T09:00:00-03:00',
        allDay: false,
      }),
    ).toBeNull();
  });

  it('builds a one-hour slot draft in the shell time zone', () => {
    const draft = buildSolarisSlotDraft(
      '2026-10-20',
      '09:00',
      'America/Sao_Paulo',
    );
    expect(draft).not.toBeNull();
    expect(draft).toMatchObject({ kind: 'event', title: '', allDay: false });
    expect(draft?.start).toContain('T09:00');
    expect(draft?.end).toContain('T10:00');
  });

  it('rejects invalid slot drafts', () => {
    expect(buildSolarisSlotDraft('not-a-date', '09:00', 'UTC')).toBeNull();
    expect(buildSolarisSlotDraft('2026-10-20', 'nope', 'UTC')).toBeNull();
    expect(buildSolarisSlotDraft('2026-10-20', '25:00', 'UTC')).toBeNull();
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
    const instance = fixture.componentRef.instance;
    expect(element.querySelector('.solaris-calendar__toolbar')).not.toBeNull();
    expect(element.querySelector('.solaris-calendar__today')).not.toBeNull();
    expect(
      element.querySelector('solaris-select.solaris-calendar__views-select'),
    ).not.toBeNull();
    expect(
      (
        instance as unknown as {
          viewOptions: () => readonly { value: string }[];
        }
      ).viewOptions(),
    ).toHaveLength(6);
    expect(
      element
        .querySelector('.solaris-calendar__mini-title')
        ?.textContent?.trim(),
    ).toBe('October 2026');
    expect(
      element
        .querySelector('.solaris-calendar__mini-prev')
        ?.getAttribute('data-radius'),
    ).toBe('full');
    expect(
      element
        .querySelector('.solaris-calendar__mini-next')
        ?.getAttribute('data-radius'),
    ).toBe('full');
    expect(
      element
        .querySelector('.solaris-calendar__nav')
        ?.getAttribute('aria-label'),
    ).toBe('Calendar navigation');
    expect(
      element
        .querySelector('.solaris-calendar__side')
        ?.getAttribute('aria-label'),
    ).toBe('Mini calendar');
    expect(
      element.querySelector('.solaris-calendar-month-view__grid'),
    ).not.toBeNull();
    expect(element.getAttribute('data-view')).toBe('month');
  });

  it('switches views and updates the view model', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    fixture.debugElement
      .query(By.css('solaris-select.solaris-calendar__views-select'))
      .triggerEventHandler('valueChange', 'week');
    fixture.detectChanges();
    expect(instance.view()).toBe('week');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-week-view__grid',
      ),
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
    createFixture();
    const instance = fixture.componentRef.instance;
    const weekends = fixture.debugElement.query(
      By.css('solaris-checkbox.solaris-calendar__weekends'),
    );
    expect(weekends).not.toBeNull();
    weekends.triggerEventHandler('checkedChange', false);
    fixture.detectChanges();
    expect(instance.showWeekends()).toBe(false);
    const holidays = fixture.debugElement.query(
      By.css('solaris-checkbox.solaris-calendar__holidays-toggle'),
    );
    expect(holidays).not.toBeNull();
    holidays.triggerEventHandler('checkedChange', false);
    fixture.detectChanges();
    expect(instance.showHolidays()).toBe(false);
    expect(
      (
        instance as unknown as { resolvedHolidays: () => unknown[] }
      ).resolvedHolidays(),
    ).toEqual([]);
    instance.view.set('custom');
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('solaris-select.solaris-calendar__custom-days'))
      .triggerEventHandler('valueChange', 3);
    fixture.detectChanges();
    expect(instance.customDays()).toBe(3);
  });

  it('hides the custom-days control outside the custom view', () => {
    const element = createFixture();
    expect(element.querySelector('.solaris-calendar__custom-days')).toBeNull();
    fixture.componentRef.instance.view.set('custom');
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-calendar__custom-days'),
    ).not.toBeNull();
  });

  it('forwards task moves from the month view', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    let moved: unknown;
    instance.taskMove.subscribe((value) => {
      moved = value;
    });
    fixture.debugElement
      .query(By.css('solaris-calendar-month-view'))
      .triggerEventHandler('taskMove', { id: 'report', due: '2026-10-20' });
    fixture.detectChanges();
    expect(moved).toEqual({ id: 'report', due: '2026-10-20' });
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

  it('renders the timezone select with label and offset hint', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    instance.view.set('custom');
    fixture.detectChanges();
    const select = fixture.debugElement.query(
      By.css('solaris-select.solaris-calendar__tz-select'),
    );
    expect(select).not.toBeNull();
    expect(element.textContent).toContain('Time zone');
    select.triggerEventHandler('valueChange', 'UTC');
    fixture.detectChanges();
    expect(instance.timeZone()).toBe('UTC');
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
    createFixture();
    const instance = fixture.componentRef.instance;
    instance.view.set('custom');
    fixture.detectChanges();
    const customDays = fixture.debugElement.query(
      By.css('solaris-select.solaris-calendar__custom-days'),
    );
    customDays.triggerEventHandler('valueChange', 'abc');
    fixture.detectChanges();
    expect(instance.customDays()).toBe(4);
    (
      instance as unknown as { onCustomDays: (value: unknown) => void }
    ).onCustomDays('abc');
    fixture.detectChanges();
    expect(instance.customDays()).toBe(4);
    (
      instance as unknown as { onCustomDays: (value: unknown) => void }
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
    instance.view.set('month');
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

  it('hides the embedded schedule toolbar and shows the window range in the title', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    instance.view.set('schedule');
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-calendar-schedule-view__toolbar'),
    ).toBeNull();
    expect(
      element.querySelector('.solaris-calendar__title')?.textContent,
    ).toContain('–');
  });

  it('renders a weekday header and mutes days outside the mini month', () => {
    const element = createFixture();
    const header = element.querySelectorAll('.solaris-calendar__mini-weekday');
    expect(header).toHaveLength(7);
    expect(
      element.querySelector('.solaris-calendar__mini-day[data-outside-month]'),
    ).not.toBeNull();
  });
});

describe('SolarisCalendarComponent editable', () => {
  let fixture: ComponentFixture<SolarisCalendarComponent>;

  const createEditableFixture = (dialogResult?: unknown) => {
    TestBed.resetTestingModule();
    const openComponent = vi.fn(() => ({
      afterClosed: () => of(dialogResult),
    }));
    configureSolarisTesting(undefined, {
      providers: [
        { provide: SolarisDialogService, useValue: { openComponent } },
      ],
    });
    fixture = TestBed.createComponent(SolarisCalendarComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', [
      {
        id: 'standup',
        kind: 'event',
        title: 'Team standup',
        start: '2026-10-15T09:00:00-03:00',
        end: '2026-10-15T09:30:00-03:00',
      },
    ]);
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    return openComponent;
  };

  it('emits eventOpen without a dialog when editable is false', () => {
    TestBed.resetTestingModule();
    const openComponent = vi.fn();
    configureSolarisTesting(undefined, {
      providers: [
        { provide: SolarisDialogService, useValue: { openComponent } },
      ],
    });
    fixture = TestBed.createComponent(SolarisCalendarComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.detectChanges();
    const instance = fixture.componentRef.instance;
    let opened: unknown;
    instance.eventOpen.subscribe((value) => {
      opened = value;
    });
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(opened).toEqual({
      id: 'standup',
      start: '2026-10-15T09:00:00-03:00',
    });
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('opens the editor with the current data on click', () => {
    const openComponent = createEditableFixture(undefined);
    const instance = fixture.componentRef.instance;
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).toHaveBeenCalledTimes(1);
    const [component, config] = openComponent.mock.calls[0] as unknown as [
      typeof SolarisCalendarEditorDialogComponent,
      { title: string; width: string; data: Record<string, unknown> },
    ];
    expect(component).toBe(SolarisCalendarEditorDialogComponent);
    expect(config.title).toBe('Team standup');
    expect(config.width).toBe('560px');
    expect(config.data).toMatchObject({
      occurrenceStart: '2026-10-15T09:00:00-03:00',
      locale: 'en-US',
    });
    expect((config.data['event'] as { id: string }).id).toBe('standup');
  });

  it('forwards editor save to eventSave without mutating the input', () => {
    const draft = {
      id: 'standup',
      kind: 'event',
      title: 'Updated standup',
      start: '2026-10-15T09:00:00-03:00',
      end: '2026-10-15T09:30:00-03:00',
    } as const;
    const saveRequest = {
      event: draft,
      scope: 'this',
      occurrenceStart: '2026-10-15T09:00:00-03:00',
    } as const;
    const openComponent = createEditableFixture({
      kind: 'save',
      saveRequest,
    });
    const instance = fixture.componentRef.instance;
    let saved: unknown;
    instance.eventSave.subscribe((value) => {
      saved = value;
    });
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).toHaveBeenCalledTimes(1);
    expect(saved).toEqual(saveRequest);
  });

  it('wraps legacy editor save drafts with scope all for backward compat', () => {
    const draft = {
      id: 'standup',
      kind: 'event',
      title: 'Updated standup',
      start: '2026-10-15T09:00:00-03:00',
      end: '2026-10-15T09:30:00-03:00',
    } as const;
    const openComponent = createEditableFixture({ kind: 'save', event: draft });
    const instance = fixture.componentRef.instance;
    let saved: unknown;
    instance.eventSave.subscribe((value) => {
      saved = value;
    });
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).toHaveBeenCalledTimes(1);
    expect(saved).toEqual({
      event: draft,
      scope: 'all',
      occurrenceStart: null,
    });
  });

  it('forwards editor delete scope to eventDelete', () => {
    const request = {
      scope: 'this',
      eventId: 'standup',
      occurrenceStart: '2026-10-15T09:00:00-03:00',
    } as const;
    const openComponent = createEditableFixture({
      kind: 'delete',
      request,
    });
    const instance = fixture.componentRef.instance;
    let deleted: unknown;
    instance.eventDelete.subscribe((value) => {
      deleted = value;
    });
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).toHaveBeenCalledTimes(1);
    expect(deleted).toEqual(request);
  });

  it('emits eventCancel when the dialog closes without a result', () => {
    const openComponent = createEditableFixture(undefined);
    const instance = fixture.componentRef.instance;
    let cancelled = 0;
    instance.eventCancel.subscribe(() => {
      cancelled += 1;
    });
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).toHaveBeenCalledTimes(1);
    expect(cancelled).toBe(1);
  });

  it('skips the dialog for unknown ids and when editorDisabled', () => {
    const openComponent = createEditableFixture(undefined);
    const instance = fixture.componentRef.instance;
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'missing', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).not.toHaveBeenCalled();
    fixture.componentRef.setInput('editorDisabled', true);
    fixture.detectChanges();
    (
      instance as unknown as {
        handleEventOpen: (open: { id: string; start: string }) => void;
      }
    ).handleEventOpen({ id: 'standup', start: '2026-10-15T09:00:00-03:00' });
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('opens the create dialog from a drag proposal and forwards save', () => {
    const draft = {
      id: 'event-created-1',
      kind: 'event',
      title: 'Created from drag',
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    } as const;
    const openComponent = createEditableFixture({
      kind: 'save',
      event: draft,
    });
    const instance = fixture.componentRef.instance;
    let created: unknown;
    let saved: unknown;
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    instance.eventSave.subscribe((value) => {
      saved = value;
    });
    (
      instance as unknown as {
        handleEventCreate: (proposal: {
          start: string;
          end: string;
          allDay: boolean;
        }) => void;
      }
    ).handleEventCreate({
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    expect(created).toEqual({
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    expect(openComponent).toHaveBeenCalledTimes(1);
    const [component, config] = openComponent.mock.calls[0] as unknown as [
      typeof SolarisCalendarEditorDialogComponent,
      { title: string; width: string; data: Record<string, unknown> },
    ];
    expect(component).toBe(SolarisCalendarEditorDialogComponent);
    expect(config.title).toBe('New event');
    expect(config.data).toMatchObject({
      occurrenceStart: null,
      locale: 'en-US',
    });
    expect((config.data['event'] as { start: string }).start).toBe(
      '2026-10-20',
    );
    expect(saved).toEqual({
      event: draft,
      scope: 'all',
      occurrenceStart: null,
    });
  });

  it('opens the create dialog from a slot click with a one-hour draft', () => {
    const openComponent = createEditableFixture(undefined);
    const instance = fixture.componentRef.instance;
    let selected: unknown;
    instance.slotSelect.subscribe((value) => {
      selected = value;
    });
    (
      instance as unknown as {
        handleSlotSelect: (slot: { date: string; time: string }) => void;
      }
    ).handleSlotSelect({ date: '2026-10-20', time: '09:00' });
    expect(selected).toEqual({ date: '2026-10-20', time: '09:00' });
    expect(instance.focusedDate()).toBe('2026-10-20');
    expect(openComponent).toHaveBeenCalledTimes(1);
    const [, config] = openComponent.mock.calls[0] as unknown as [
      typeof SolarisCalendarEditorDialogComponent,
      { title: string; width: string; data: Record<string, unknown> },
    ];
    const event = config.data['event'] as {
      start: string;
      end: string;
      allDay: boolean;
    };
    expect(event.allDay).toBe(false);
    expect(event.start).toContain('T09:00');
    expect(event.end).toContain('T10:00');
  });

  it('emits create and slot proposals without a dialog when not editable', () => {
    TestBed.resetTestingModule();
    const openComponent = vi.fn();
    configureSolarisTesting(undefined, {
      providers: [
        { provide: SolarisDialogService, useValue: { openComponent } },
      ],
    });
    fixture = TestBed.createComponent(SolarisCalendarComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.detectChanges();
    const instance = fixture.componentRef.instance;
    let created: unknown;
    let selected: unknown;
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    instance.slotSelect.subscribe((value) => {
      selected = value;
    });
    (
      instance as unknown as {
        handleEventCreate: (proposal: {
          start: string;
          end: string;
          allDay: boolean;
        }) => void;
        handleSlotSelect: (slot: { date: string; time: string }) => void;
      }
    ).handleEventCreate({
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    (
      instance as unknown as {
        handleSlotSelect: (slot: { date: string; time: string }) => void;
      }
    ).handleSlotSelect({ date: '2026-10-20', time: '09:00' });
    expect(created).toEqual({
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    expect(selected).toEqual({ date: '2026-10-20', time: '09:00' });
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('skips the create dialog for invalid proposals and slots', () => {
    const openComponent = createEditableFixture(undefined);
    const instance = fixture.componentRef.instance;
    (
      instance as unknown as {
        handleEventCreate: (proposal: {
          start: string;
          end: string;
          allDay: boolean;
        }) => void;
        handleSlotSelect: (slot: { date: string; time: string }) => void;
      }
    ).handleEventCreate({ start: '', end: '', allDay: true });
    (
      instance as unknown as {
        handleSlotSelect: (slot: { date: string; time: string }) => void;
      }
    ).handleSlotSelect({ date: 'not-a-date', time: '09:00' });
    expect(openComponent).not.toHaveBeenCalled();
    fixture.componentRef.setInput('editorDisabled', true);
    fixture.detectChanges();
    (
      instance as unknown as {
        handleEventCreate: (proposal: {
          start: string;
          end: string;
          allDay: boolean;
        }) => void;
      }
    ).handleEventCreate({
      start: '2026-10-20',
      end: '2026-10-21',
      allDay: true,
    });
    expect(openComponent).not.toHaveBeenCalled();
  });
});

describe('SolarisCalendarComponent keyboard shortcuts', () => {
  let fixture: ComponentFixture<SolarisCalendarComponent>;

  type ShortcutInstance = SolarisCalendarComponent & {
    onWindowKeydown: (event: KeyboardEvent) => void;
    announcement: () => string;
  };

  const createShortcutFixture = (options?: {
    editable?: boolean;
    editorDisabled?: boolean;
    openCount?: number;
    dialogResult?: unknown;
  }): {
    instance: ShortcutInstance;
    openComponent: ReturnType<typeof vi.fn>;
  } => {
    TestBed.resetTestingModule();
    const openComponent = vi.fn(() => ({
      afterClosed: () => of(options?.dialogResult),
    }));
    configureSolarisTesting(undefined, {
      providers: [
        {
          provide: SolarisDialogService,
          useValue: { openComponent, openCount: options?.openCount ?? 0 },
        },
      ],
    });
    fixture = TestBed.createComponent(SolarisCalendarComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('editable', options?.editable ?? false);
    if (options?.editorDisabled !== undefined) {
      fixture.componentRef.setInput('editorDisabled', options.editorDisabled);
    }
    fixture.detectChanges();
    return {
      instance: fixture.componentRef.instance as unknown as ShortcutInstance,
      openComponent,
    };
  };

  const keyEvent = (
    key: string,
    target?: HTMLElement | null,
    init?: KeyboardEventInit,
  ): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...init,
    });
    if (target !== undefined) {
      Object.defineProperty(event, 'target', { value: target });
    }
    return event;
  };

  const bodyTarget = (): HTMLElement => {
    const body = document.createElement('div');
    body.textContent = 'calendar body';
    return body;
  };

  it('opens the create dialog at the focused date on N when editable', () => {
    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    let created: unknown;
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    instance.onWindowKeydown(keyEvent('n', bodyTarget()));
    expect(created).toEqual({
      start: '2026-10-15',
      end: '2026-10-15',
      allDay: true,
    });
    expect(openComponent).toHaveBeenCalledTimes(1);
    expect(instance.announcement()).toBe('New event');
  });

  it('treats uppercase N as the create shortcut', () => {
    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    instance.onWindowKeydown(keyEvent('N', bodyTarget()));
    expect(openComponent).toHaveBeenCalledTimes(1);
  });

  it('ignores N when not editable, when the editor is disabled, or for an invalid date', () => {
    const readonlyCase = createShortcutFixture({ editable: false });
    readonlyCase.instance.onWindowKeydown(keyEvent('n', bodyTarget()));
    expect(readonlyCase.openComponent).not.toHaveBeenCalled();

    const disabledCase = createShortcutFixture({
      editable: true,
      editorDisabled: true,
    });
    disabledCase.instance.onWindowKeydown(keyEvent('n', bodyTarget()));
    expect(disabledCase.openComponent).not.toHaveBeenCalled();

    const invalidCase = createShortcutFixture({ editable: true });
    fixture.componentRef.setInput('focusedDate', 'not-a-date');
    fixture.detectChanges();
    invalidCase.instance.onWindowKeydown(keyEvent('n', bodyTarget()));
    expect(invalidCase.openComponent).not.toHaveBeenCalled();
  });

  it('goes to today on T and announces the title', () => {
    const { instance } = createShortcutFixture();
    instance.focusedDate.set('2026-09-01');
    fixture.detectChanges();
    const event = keyEvent('t', bodyTarget());
    const prevented = vi.spyOn(event, 'preventDefault');
    instance.onWindowKeydown(event);
    expect(instance.focusedDate()).not.toBe('2026-09-01');
    expect(instance.announcement().length).toBeGreaterThan(0);
    expect(prevented).toHaveBeenCalled();
  });

  it('switches day/week/month/year/schedule on 1-5', () => {
    const { instance } = createShortcutFixture();
    const expectations: Array<[string, string]> = [
      ['1', 'day'],
      ['2', 'week'],
      ['3', 'month'],
      ['4', 'year'],
      ['5', 'schedule'],
    ];
    for (const [digit, view] of expectations) {
      instance.onWindowKeydown(keyEvent(digit, bodyTarget()));
      expect(instance.view()).toBe(view);
      expect(instance.announcement().length).toBeGreaterThan(0);
    }
  });

  it('shifts the visible range on [ and ]', () => {
    const { instance } = createShortcutFixture();
    instance.view.set('day');
    instance.focusedDate.set('2026-10-15');
    fixture.detectChanges();
    instance.onWindowKeydown(keyEvent('[', bodyTarget()));
    expect(instance.focusedDate()).toBe('2026-10-14');
    instance.onWindowKeydown(keyEvent(']', bodyTarget()));
    expect(instance.focusedDate()).toBe('2026-10-15');
    expect(instance.announcement().length).toBeGreaterThan(0);
  });

  it('ignores unknown keys without side effects', () => {
    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    const before = instance.focusedDate();
    const announcementBefore = instance.announcement();
    instance.onWindowKeydown(keyEvent('q', bodyTarget()));
    instance.onWindowKeydown(keyEvent('Delete', bodyTarget()));
    instance.onWindowKeydown(keyEvent('Backspace', bodyTarget()));
    expect(instance.focusedDate()).toBe(before);
    expect(instance.announcement()).toBe(announcementBefore);
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('never triggers while typing in the editor title input', () => {
    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    const title = document.createElement('input');
    title.type = 'text';
    const before = instance.focusedDate();
    for (const key of ['n', 't', '1', '[', ']']) {
      instance.onWindowKeydown(keyEvent(key, title));
    }
    expect(instance.focusedDate()).toBe(before);
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('skips shortcuts from textarea, select, and contenteditable targets', () => {
    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    const textarea = document.createElement('textarea');
    const select = document.createElement('select');
    const editableDiv = document.createElement('div');
    editableDiv.contentEditable = 'true';
    const nested = document.createElement('div');
    const nestedInput = document.createElement('input');
    nestedInput.type = 'text';
    nested.appendChild(nestedInput);
    const before = instance.focusedDate();
    instance.onWindowKeydown(keyEvent('n', textarea));
    instance.onWindowKeydown(keyEvent('t', select));
    instance.onWindowKeydown(keyEvent('1', editableDiv));
    instance.onWindowKeydown(keyEvent('n', nestedInput));
    expect(instance.focusedDate()).toBe(before);
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('skips shortcuts when a dialog is open or the target lives in a dialog', () => {
    const guarded = createShortcutFixture({ editable: true, openCount: 1 });
    guarded.instance.onWindowKeydown(keyEvent('n', bodyTarget()));
    expect(guarded.openComponent).not.toHaveBeenCalled();

    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    const dialogHost = document.createElement('div');
    dialogHost.setAttribute('role', 'dialog');
    const dialogButton = document.createElement('button');
    dialogButton.textContent = 'dialog action';
    dialogHost.appendChild(dialogButton);
    instance.onWindowKeydown(keyEvent('t', dialogButton));
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('skips shortcuts with modifiers or a prevented default', () => {
    const { instance, openComponent } = createShortcutFixture({
      editable: true,
    });
    const before = instance.focusedDate();
    instance.onWindowKeydown(keyEvent('n', bodyTarget(), { ctrlKey: true }));
    instance.onWindowKeydown(keyEvent('n', bodyTarget(), { metaKey: true }));
    instance.onWindowKeydown(keyEvent('n', bodyTarget(), { altKey: true }));
    const prevented = keyEvent('n', bodyTarget(), { cancelable: true });
    prevented.preventDefault();
    instance.onWindowKeydown(prevented);
    expect(instance.focusedDate()).toBe(before);
    expect(openComponent).not.toHaveBeenCalled();
  });

  it('handles edge targets without throwing', () => {
    const { instance } = createShortcutFixture();
    // Why: window keydown can surface document-level targets without tagName.
    const noTarget = new KeyboardEvent('keydown', { key: 't', bubbles: true });
    instance.onWindowKeydown(noTarget);
    const tagless = new KeyboardEvent('keydown', { key: 'q', bubbles: true });
    Object.defineProperty(tagless, 'target', { value: {} });
    instance.onWindowKeydown(tagless);
    const noClosest = new KeyboardEvent('keydown', {
      key: 'q',
      bubbles: true,
    });
    Object.defineProperty(noClosest, 'target', { value: { tagName: 'DIV' } });
    instance.onWindowKeydown(noClosest);
    expect(instance.focusedDate().length).toBeGreaterThan(0);
  });
});

describe('SolarisCalendarEditorDialogComponent', () => {
  it('closes with save, delete, and cancel results', () => {
    TestBed.resetTestingModule();
    const close = vi.fn();
    configureSolarisTesting(undefined, {
      providers: [
        {
          provide: SOLARIS_DIALOG_DATA,
          useValue: {
            event: {
              id: 'standup',
              kind: 'event',
              title: 'Team standup',
              start: '2026-10-15T09:00:00-03:00',
              end: '2026-10-15T09:30:00-03:00',
            },
            occurrenceStart: '2026-10-15T09:00:00-03:00',
            timeZone: 'America/Sao_Paulo',
            timeZoneOptions: ['America/Sao_Paulo'],
            locale: 'en-US',
            size: 'md',
            density: 'comfortable',
          },
        },
        { provide: SOLARIS_DIALOG_REF, useValue: { close } },
      ],
    });
    const fixtureDialog = TestBed.createComponent(
      SolarisCalendarEditorDialogComponent,
    );
    fixtureDialog.detectChanges();
    const instance = fixtureDialog.componentRef.instance as unknown as {
      onSave: (event: unknown) => void;
      onDelete: (request: unknown) => void;
      onCancel: () => void;
      onTimeZoneChange: (zone: string) => void;
      timeZone: { (): string; set: (value: string) => void };
    };
    instance.onSave({
      event: { id: 'a' },
      scope: 'this',
      occurrenceStart: '2026-10-15T09:00:00-03:00',
    });
    instance.onDelete({ eventId: 'a' });
    instance.onCancel();
    expect(close).toHaveBeenNthCalledWith(1, {
      kind: 'save',
      saveRequest: {
        event: { id: 'a' },
        scope: 'this',
        occurrenceStart: '2026-10-15T09:00:00-03:00',
      },
    });
    expect(close).toHaveBeenNthCalledWith(2, {
      kind: 'delete',
      request: { eventId: 'a' },
    });
    expect(close).toHaveBeenNthCalledWith(3, { kind: 'cancel' });
    instance.onTimeZoneChange('UTC');
    expect(instance.timeZone()).toBe('UTC');
    instance.onTimeZoneChange('');
    expect(instance.timeZone()).toBe('UTC');
  });
});
