import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarScheduleViewComponent } from '../component/schedule-view.component';

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
    id: 'weekly',
    kind: 'event',
    title: 'Weekly sync',
    start: '2026-10-13T10:00:00-03:00',
    end: '2026-10-13T11:00:00-03:00',
    color: 'success',
    recurrence: { freq: 'weekly', count: 4 },
  },
  {
    id: 'far',
    kind: 'event',
    title: 'Far future',
    start: '2026-12-01T10:00:00-03:00',
    end: '2026-12-01T11:00:00-03:00',
    color: 'accent',
  },
];

function stressEvents(total: number): SolarisCalendarEvent[] {
  return Array.from({ length: total }, (_, index) => {
    const day = (index % 60) + 1;
    const month = index % 60 < 31 ? '10' : '11';
    const date = `2026-${month}-${String(day > 31 ? day - 31 : day).padStart(2, '0')}`;
    return {
      id: `stress-${index}`,
      kind: 'event',
      title: `Stress ${index}`,
      start: `${date}T10:00:00-03:00`,
      end: `${date}T11:00:00-03:00`,
      color: 'info',
    } as SolarisCalendarEvent;
  });
}

describe('SolarisCalendarScheduleViewComponent', () => {
  let fixture: ComponentFixture<SolarisCalendarScheduleViewComponent>;

  const createFixture = (options?: {
    locale?: string;
    windowDays?: number;
    focusedDate?: string;
  }): HTMLElement => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarScheduleViewComponent);
    fixture.componentRef.setInput('locale', options?.locale ?? 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput(
      'focusedDate',
      options?.focusedDate ?? '2026-10-15',
    );
    fixture.componentRef.setInput('events', EVENTS);
    if (options?.windowDays !== undefined) {
      fixture.componentRef.setInput('windowDays', options.windowDays);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const list = (element: HTMLElement): HTMLElement => {
    const found = element.querySelector('[role="list"]');
    if (found === null) throw new Error('schedule list not found');
    return found as HTMLElement;
  };

  const groups = (element: HTMLElement): HTMLElement[] =>
    Array.from(
      element.querySelectorAll('.solaris-calendar-schedule-view__day'),
    );

  const items = (element: HTMLElement): HTMLElement[] =>
    Array.from(
      element.querySelectorAll(
        '.solaris-calendar-schedule-view__item[data-kind="event"]',
      ),
    );

  const keydown = (target: HTMLElement, key: string): void => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
  };

  it('groups the window chronologically and skips out-of-window events', () => {
    const element = createFixture();
    const dates = groups(element).map((group) =>
      group.getAttribute('data-date'),
    );
    expect(dates).toEqual(['2026-10-15', '2026-10-20']);
    expect(items(element).length).toBeGreaterThanOrEqual(3);
    expect(
      groups(element).some(
        (group) => group.getAttribute('data-date') === '2026-12-01',
      ),
    ).toBe(false);
  });

  it('expands recurrence only inside the window', () => {
    const element = createFixture({ windowDays: 14 });
    const syncs = items(element).filter((item) =>
      item.getAttribute('aria-label')?.includes('Weekly sync'),
    );
    expect(syncs.length).toBeGreaterThanOrEqual(2);
    expect(syncs.length).toBeLessThanOrEqual(3);
  });

  it('bounds rendering to the window with a thousand events', () => {
    const total = 1000;
    createFixture();
    fixture.componentRef.setInput('events', stressEvents(total));
    const started = performance.now();
    fixture.detectChanges();
    const elapsed = performance.now() - started;
    const element = fixture.nativeElement as HTMLElement;
    expect(groups(element).length).toBeLessThanOrEqual(7);
    expect(items(element).length).toBeLessThan(total);
    expect(elapsed).toBeLessThan(1000);
  });

  it('paginates forward and back without moving on day clicks', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    const range = element.querySelector(
      '.solaris-calendar-schedule-view__range',
    );
    const before = range?.textContent;
    (
      element.querySelectorAll(
        '.solaris-calendar-schedule-view__nav',
      )[1] as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const after = (fixture.nativeElement as HTMLElement).querySelector(
      '.solaris-calendar-schedule-view__range',
    )?.textContent;
    expect(instance.focusedDate()).toBe('2026-10-22');
    expect(after).not.toBe(before);
    let selected: string | undefined;
    instance.daySelect.subscribe((value) => {
      selected = value;
    });
    (
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-schedule-view__dayhead',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(selected).not.toBeUndefined();
    expect(instance.focusedDate()).toBe('2026-10-22');
    (
      (fixture.nativeElement as HTMLElement).querySelectorAll(
        '.solaris-calendar-schedule-view__nav',
      )[0] as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).not.toHaveLength(0);
  });

  it('returns to today from the toolbar', () => {
    const element = createFixture({ focusedDate: '2026-01-05' });
    (
      element.querySelector(
        '.solaris-calendar-schedule-view__today',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    const today = new Date();
    const padded = (value: number): string => String(value).padStart(2, '0');
    expect(fixture.componentRef.instance.focusedDate()).toBe(
      `${today.getFullYear()}-${padded(today.getMonth() + 1)}-${padded(today.getDate())}`,
    );
  });

  it('renders an empty state when the window has no items', () => {
    const element = createFixture({ focusedDate: '2027-05-01' });
    expect(groups(element)).toHaveLength(0);
    expect(
      element.querySelector('.solaris-calendar-schedule-view__empty-title')
        ?.textContent,
    ).toContain('No events');
    expect(
      element.querySelector('.solaris-calendar-schedule-view__empty-hint')
        ?.textContent,
    ).not.toHaveLength(0);
  });

  it('opens events and toggles tasks inline', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let opened: { id: string; start: string } | undefined;
    let toggled: string | undefined;
    instance.eventOpen.subscribe((value) => {
      opened = value;
    });
    instance.taskToggle.subscribe((value) => {
      toggled = value;
    });
    const standup = items(element).find((item) =>
      item.getAttribute('aria-label')?.includes('Team standup'),
    ) as HTMLButtonElement;
    standup.click();
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
  });

  it('moves between groups with arrows and paginates with PageUp PageDown', () => {
    const element = createFixture();
    const listElement = list(element);
    expect(listElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-15',
    );
    keydown(listElement, 'ArrowDown');
    expect(listElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-20',
    );
    keydown(listElement, 'ArrowUp');
    expect(listElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-15',
    );
    keydown(listElement, 'End');
    expect(listElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-20',
    );
    keydown(listElement, 'Home');
    expect(listElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-15',
    );
    let selected: string | undefined;
    fixture.componentRef.instance.daySelect.subscribe((value) => {
      selected = value;
    });
    keydown(listElement, 'Enter');
    expect(selected).toBe('2026-10-15');
    keydown(listElement, 'PageDown');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-22');
    keydown(listElement, 'PageUp');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-15');
  });

  it('clamps the window size', () => {
    expect(
      createFixture({ windowDays: 0 }).querySelector('[role="list"]'),
    ).toBeTruthy();
    fixture.componentRef.setInput('windowDays', 500);
    fixture.detectChanges();
    expect(
      groups(fixture.nativeElement as HTMLElement).length,
    ).toBeLessThanOrEqual(31);
  });

  it('reflects density and size on the host', () => {
    const element = createFixture();
    expect(element.getAttribute('data-density')).toBe('comfortable');
    expect(element.getAttribute('data-size')).toBe('md');
    fixture.componentRef.setInput('density', 'compact');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(element.getAttribute('data-density')).toBe('compact');
    expect(element.getAttribute('data-size')).toBe('lg');
  });

  it('translates chrome strings through the translate service', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({ translate: { locale: 'pt-BR' } });
    fixture = TestBed.createComponent(SolarisCalendarScheduleViewComponent);
    fixture.componentRef.setInput('locale', 'pt-BR');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-calendar-schedule-view__today')
        ?.textContent,
    ).toContain('Hoje');
    expect(
      element
        .querySelector('.solaris-calendar-schedule-view__nav')
        ?.getAttribute('aria-label'),
    ).toContain('anteriores');
  });

  it('highlights the selected item', () => {
    const element = createFixture();
    expect(
      element.querySelector(
        '.solaris-calendar-schedule-view__item[data-selected]',
      ),
    ).toBeNull();
    fixture.componentRef.setInput('selectedId', 'standup');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-schedule-view__item[data-selected]',
      ),
    ).not.toBeNull();
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
    expect(groups(fixture.nativeElement as HTMLElement)).toHaveLength(0);
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[data-empty]'),
    ).not.toBeNull();
  });

  it('shows the toolbar by default and hides it when showToolbar is false', () => {
    const element = createFixture();
    expect(
      element.querySelector('.solaris-calendar-schedule-view__toolbar'),
    ).not.toBeNull();
    fixture.componentRef.setInput('showToolbar', false);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.solaris-calendar-schedule-view__toolbar',
      ),
    ).toBeNull();
  });
});
