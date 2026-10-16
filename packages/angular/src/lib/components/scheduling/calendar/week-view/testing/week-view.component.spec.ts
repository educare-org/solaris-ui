import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarWeekViewComponent } from '../component/week-view.component';

const FROZEN_UTC = '2026-10-15T12:00:00Z';

const EVENTS: SolarisCalendarEvent[] = [
  {
    id: 'standup',
    kind: 'event',
    title: 'Team standup',
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T09:30:00-03:00',
    color: 'info',
  },
  {
    id: 'planning',
    kind: 'event',
    title: 'Sprint planning',
    start: '2026-10-15T10:00:00-03:00',
    end: '2026-10-15T12:00:00-03:00',
    color: 'primary',
  },
  {
    id: 'review',
    kind: 'event',
    title: 'Design review',
    start: '2026-10-15T10:30:00-03:00',
    end: '2026-10-15T11:30:00-03:00',
    color: 'violet',
  },
  {
    id: 'weekly',
    kind: 'event',
    title: 'Weekly sync',
    start: '2026-10-13T10:00:00-03:00',
    end: '2026-10-13T11:00:00-03:00',
    color: 'success',
    recurrence: { freq: 'weekly', count: 4 },
  },
];

describe('SolarisCalendarWeekViewComponent', () => {
  let fixture: ComponentFixture<SolarisCalendarWeekViewComponent>;

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, 'matchMedia');
  });

  const stubReducedMotion = (matches: boolean): void => {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string) => ({
        matches: query.includes('reduce') ? matches : false,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
      configurable: true,
    });
  };

  const createFixture = (options?: {
    locale?: string;
    timeZone?: string;
    visibleDays?: 1 | 3 | 4 | 7;
    showWeekends?: boolean;
  }): HTMLElement => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FROZEN_UTC));
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarWeekViewComponent);
    fixture.componentRef.setInput('locale', options?.locale ?? 'en-US');
    fixture.componentRef.setInput(
      'timeZone',
      options?.timeZone ?? 'America/Sao_Paulo',
    );
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    if (options?.visibleDays !== undefined) {
      fixture.componentRef.setInput('visibleDays', options.visibleDays);
    }
    if (options?.showWeekends !== undefined) {
      fixture.componentRef.setInput('showWeekends', options.showWeekends);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const grid = (element: HTMLElement): HTMLElement => {
    const found = element.querySelector('[role="grid"]');
    if (found === null) throw new Error('week grid not found');
    return found as HTMLElement;
  };

  const lanes = (element: HTMLElement): HTMLElement[] =>
    Array.from(element.querySelectorAll('.solaris-calendar-week-view__lane'));

  const nowLine = (element: HTMLElement): HTMLElement => {
    const found = element.querySelector('.solaris-calendar-week-view__now');
    if (found === null) throw new Error('now-line not found');
    return found as HTMLElement;
  };

  const blocks = (element: HTMLElement): HTMLElement[] =>
    Array.from(element.querySelectorAll('.solaris-calendar-week-view__block'));

  const blockByTitle = (element: HTMLElement, title: string): HTMLElement => {
    const found = blocks(element).find((block) =>
      block.getAttribute('aria-label')?.includes(title),
    );
    if (found === undefined) throw new Error(`${title} block not found`);
    return found;
  };

  const keydown = (target: HTMLElement, key: string): void => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
  };

  it('renders one lane per visible day', () => {
    expect(lanes(createFixture())).toHaveLength(7);
    expect(lanes(createFixture({ visibleDays: 1 }))).toHaveLength(1);
    expect(lanes(createFixture({ visibleDays: 3 }))).toHaveLength(3);
    expect(lanes(createFixture({ visibleDays: 4 }))).toHaveLength(4);
  });

  it('anchors weeks to the locale week start', () => {
    const element = createFixture();
    const heads = Array.from(
      element.querySelectorAll('.solaris-calendar-week-view__dayhead'),
    );
    expect(heads).toHaveLength(7);
    expect(grid(element).getAttribute('aria-label')).toContain('October 11');
    expect(grid(element).getAttribute('aria-label')).toContain('October 17');
  });

  it('places timed blocks with proportional geometry', () => {
    const element = createFixture();
    const standup = blockByTitle(element, 'Team standup');
    expect(standup.style.top).toBe('37.5%');
    expect(standup.style.height).toBe('2.083333333333333%');
    expect(standup.style.width).toBe('100%');
    expect(standup.getAttribute('aria-label')).toContain('Team standup');
  });

  it('lays overlapping blocks out in deterministic columns', () => {
    const element = createFixture();
    const planning = blockByTitle(element, 'Sprint planning');
    const review = blockByTitle(element, 'Design review');
    expect(planning.style.width).toBe(
      'calc(50% - var(--solaris-calendar-week-view-block-gap))',
    );
    expect(review.style.width).toBe(
      'calc(50% - var(--solaris-calendar-week-view-block-gap))',
    );
    expect(planning.style.left).toBe('0%');
    expect(review.style.left).toBe('50%');
  });

  it('expands recurrence into the visible range', () => {
    const element = createFixture();
    const syncs = blocks(element).filter((block) =>
      block.getAttribute('aria-label')?.includes('Weekly sync'),
    );
    expect(syncs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all-day events, tasks, and holidays above the grid', () => {
    createFixture();
    fixture.componentRef.setInput('events', [
      {
        id: 'offsite',
        kind: 'event',
        title: 'Design offsite',
        start: '2026-10-20',
        end: '2026-10-22',
        allDay: true,
        color: 'accent',
      },
    ]);
    fixture.componentRef.setInput('tasks', [
      {
        id: 't1',
        kind: 'task',
        title: 'Report',
        due: '2026-10-16',
        completed: false,
      },
    ]);
    fixture.componentRef.setInput('holidays', [
      { date: '2026-10-12', name: 'Holiday' },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-calendar-week-view__allday-label')
        ?.textContent,
    ).toContain('All day');
    expect(
      element.querySelector('[data-kind="holiday"]')?.textContent,
    ).toContain('Holiday');
    const task = element.querySelector('[data-kind="task"]');
    expect(task?.getAttribute('role')).toBe('checkbox');
  });

  it('renders the now-line at the time-zone wall time', () => {
    const element = createFixture({ timeZone: 'America/Sao_Paulo' });
    const now = nowLine(element);
    expect(now?.style.top).toBe('37.5%');
    expect(now?.getAttribute('aria-label')).toContain('Current time');
  });

  it('shifts the now-line with the display time zone', () => {
    const element = createFixture({ timeZone: 'UTC' });
    const now = nowLine(element);
    expect(now?.style.top).toBe('50%');
  });

  it('refreshes the now-line on a timer unless reduced motion is set', () => {
    const element = createFixture();
    const before = nowLine(element).style.top;
    vi.advanceTimersByTime(61_000);
    fixture.detectChanges();
    const after = nowLine(fixture.nativeElement as HTMLElement).style.top;
    expect(before).toBe('37.5%');
    expect(after).not.toBe(before);
  });

  it('keeps the now-line static with reduced motion', () => {
    stubReducedMotion(true);
    const element = createFixture();
    const before = nowLine(element).style.top;
    vi.advanceTimersByTime(3_600_000);
    fixture.detectChanges();
    const after = nowLine(fixture.nativeElement as HTMLElement).style.top;
    expect(before).toBe('37.5%');
    expect(after).toBe(before);
  });

  it('selects slots and days with pointer and keyboard', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let slot: { date: string; time: string } | undefined;
    let day: string | undefined;
    let opened: { id: string; start: string } | undefined;
    let toggled: string | undefined;
    instance.slotSelect.subscribe((value) => {
      slot = value;
    });
    instance.daySelect.subscribe((value) => {
      day = value;
    });
    instance.eventOpen.subscribe((value) => {
      opened = value;
    });
    instance.taskToggle.subscribe((value) => {
      toggled = value;
    });
    const slots = Array.from(
      element.querySelectorAll('.solaris-calendar-week-view__slot'),
    ) as HTMLButtonElement[];
    slots[0].click();
    expect(slot?.date).toBe('2026-10-11');
    const gridElement = grid(element);
    keydown(gridElement, 'Enter');
    expect(slot?.time).toBe('09:00');
    const heads = Array.from(
      element.querySelectorAll('.solaris-calendar-week-view__dayhead'),
    ) as HTMLButtonElement[];
    heads[4].click();
    expect(day).toBe('2026-10-15');
    blockByTitle(element, 'Team standup').click();
    expect(opened?.id).toBe('standup');
    fixture.componentRef.setInput('tasks', [
      {
        id: 't1',
        kind: 'task',
        title: 'Report',
        due: '2026-10-15',
        completed: false,
      },
    ]);
    fixture.detectChanges();
    (
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-kind="task"]',
      ) as HTMLButtonElement
    ).click();
    expect(toggled).toBe('t1');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).not.toHaveLength(0);
  });

  it('moves the active slot with arrows and jumps with Home End PageUp PageDown', () => {
    const element = createFixture();
    const gridElement = grid(element);
    expect(gridElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-15-09',
    );
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-16');
    keydown(gridElement, 'ArrowDown');
    expect(gridElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-16-10',
    );
    keydown(gridElement, 'ArrowUp');
    keydown(gridElement, 'ArrowLeft');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-15');
    keydown(gridElement, 'Home');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-11');
    keydown(gridElement, 'End');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-17');
    keydown(gridElement, 'PageDown');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-24');
    keydown(gridElement, 'PageUp');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-17');
  });

  it('skips hidden weekends in navigation', () => {
    const element = createFixture({ showWeekends: false });
    expect(lanes(element)).toHaveLength(5);
    const gridElement = grid(element);
    fixture.componentRef.instance.focusedDate.set('2026-10-16');
    fixture.detectChanges();
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-19');
  });

  it('collapses all-day overflow into a more button', () => {
    createFixture();
    fixture.componentRef.setInput('tasks', [
      {
        id: 't1',
        kind: 'task',
        title: 'Report',
        due: '2026-10-15',
        completed: false,
      },
    ]);
    fixture.componentRef.setInput('maxVisiblePerDay', 0);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    let opened: string | undefined;
    fixture.componentRef.instance.moreOpen.subscribe((value) => {
      opened = value;
    });
    const more = element.querySelector(
      '.solaris-calendar-week-view__more',
    ) as HTMLButtonElement;
    expect(more.textContent).toContain('more');
    more.click();
    fixture.detectChanges();
    expect(opened).toBe('2026-10-15');
  });

  it('renders hour labels in a 12-hour clock', () => {
    const element = createFixture();
    const gutters = Array.from(
      element.querySelectorAll('.solaris-calendar-week-view__gutter'),
    );
    expect(gutters[0].textContent).toContain('12 AM');
    expect(gutters[9].textContent).toContain('9 AM');
    expect(gutters[13].textContent).toContain('1 PM');
  });

  it('hides the all-day row when requested', () => {
    const element = createFixture();
    expect(
      element.querySelector('.solaris-calendar-week-view__allday'),
    ).toBeTruthy();
    fixture.componentRef.setInput('showAllDay', false);
    fixture.detectChanges();
    const hidden = fixture.nativeElement as HTMLElement;
    expect(
      hidden.querySelector('.solaris-calendar-week-view__allday'),
    ).toBeNull();
    expect(hidden.querySelector('[data-kind]')).toBeNull();
  });

  it('exposes the lane count for responsive minimum widths', () => {
    expect(createFixture().getAttribute('data-days')).toBe('7');
    expect(
      createFixture({ showWeekends: false }).getAttribute('data-days'),
    ).toBe('5');
    expect(createFixture({ visibleDays: 1 }).getAttribute('data-days')).toBe(
      '1',
    );
  });

  it('reflects density and size on the host', () => {
    const element = createFixture();
    expect(element.getAttribute('data-density')).toBe('comfortable');
    expect(element.getAttribute('data-size')).toBe('md');
    fixture.componentRef.setInput('density', 'compact');
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(element.getAttribute('data-density')).toBe('compact');
    expect(element.getAttribute('data-size')).toBe('sm');
  });

  it('translates chrome strings through the translate service', () => {
    configureSolarisTesting({ translate: { locale: 'pt-BR' } });
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FROZEN_UTC));
    fixture = TestBed.createComponent(SolarisCalendarWeekViewComponent);
    fixture.componentRef.setInput('locale', 'pt-BR');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-calendar-week-view__allday-label')
        ?.textContent,
    ).toContain('Dia inteiro');
    const slot = element.querySelector(
      '.solaris-calendar-week-view__slot',
    ) as HTMLElement;
    expect(slot.getAttribute('aria-label')).toContain('às');
  });

  it('skips invalid consumer events without throwing', () => {
    createFixture();
    fixture.componentRef.setInput('events', [
      {
        id: 'broken',
        kind: 'event',
        title: 'Broken',
        start: 'not-a-date',
        end: 'also-broken',
      },
    ]);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-week-view__block',
      ),
    ).toBeNull();
  });
});
