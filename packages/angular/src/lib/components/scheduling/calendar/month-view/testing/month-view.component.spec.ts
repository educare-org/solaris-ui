import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { todaySolarisDate } from '../../../../forms/date/model/date.utils';
import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarMonthViewComponent } from '../component/month-view.component';

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
    start: '2026-10-15T14:00:00-03:00',
    end: '2026-10-15T16:00:00-03:00',
    color: 'primary',
  },
  {
    id: 'review',
    kind: 'event',
    title: 'Design review',
    start: '2026-10-15T17:00:00-03:00',
    end: '2026-10-15T18:00:00-03:00',
    color: 'violet',
  },
  {
    id: 'weekly',
    kind: 'event',
    title: 'Weekly sync',
    start: '2026-10-05T10:00:00-03:00',
    end: '2026-10-05T11:00:00-03:00',
    color: 'success',
    recurrence: { freq: 'weekly', count: 6 },
  },
];

describe('SolarisCalendarMonthViewComponent', () => {
  let fixture: ComponentFixture<SolarisCalendarMonthViewComponent>;

  const createFixture = (): HTMLElement => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarMonthViewComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const grid = (element: HTMLElement): HTMLElement => {
    const found = element.querySelector('[role="grid"]');
    if (found === null) throw new Error('month grid not found');
    return found as HTMLElement;
  };

  const dayCells = (element: HTMLElement): HTMLElement[] =>
    Array.from(element.querySelectorAll('[role="gridcell"]'));

  const keydown = (target: HTMLElement, key: string): void => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
  };

  it('renders a six-week grid with outside-month states', () => {
    const element = createFixture();
    expect(dayCells(element)).toHaveLength(42);
    expect(
      element.querySelectorAll('[data-outside-month]').length,
    ).toBeGreaterThan(0);
    expect(grid(element).getAttribute('aria-label')).toContain('October');
  });

  it('marks the active day and today', () => {
    const element = createFixture();
    const active = element.querySelector('[aria-selected="true"]');
    expect(active?.getAttribute('aria-label')).toContain('October 15');
    expect(grid(element).getAttribute('aria-activedescendant')).toBe(
      active?.getAttribute('id'),
    );
    fixture.componentRef.setInput('focusedDate', todaySolarisDate());
    fixture.detectChanges();
    expect(element.querySelector('[aria-current="date"]')).toBeTruthy();
  });

  it('renders event chips with times and expands recurrence', () => {
    const element = createFixture();
    const chips = Array.from(
      element.querySelectorAll('[data-kind="event"]'),
    ).map((chip) => chip.getAttribute('aria-label'));
    expect(chips.some((label) => label?.includes('Team standup'))).toBe(true);
    expect(chips.some((label) => label?.includes('Weekly sync'))).toBe(true);
    const chipElements = Array.from(
      element.querySelectorAll('[data-kind="event"]'),
    );
    const labels = chipElements.map(
      (chip) => chip.getAttribute('aria-label') ?? '',
    );
    const standupIndex = labels.findIndex((label) =>
      label.includes('Team standup'),
    );
    const planningIndex = labels.findIndex((label) =>
      label.includes('Sprint planning'),
    );
    expect(standupIndex).toBeGreaterThanOrEqual(0);
    expect(standupIndex).toBeLessThan(planningIndex);
    expect(
      chips.filter((label) => label?.includes('Weekly sync')),
    ).toHaveLength(5);
  });

  it('renders holiday and task rows', () => {
    createFixture();
    fixture.componentRef.setInput('holidays', [
      { date: '2026-10-12', name: 'Holiday' },
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
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('[data-kind="holiday"]')?.textContent,
    ).toContain('Holiday');
    const task = element.querySelector('[data-kind="task"]');
    expect(task?.getAttribute('role')).toBe('checkbox');
    expect(task?.getAttribute('aria-checked')).toBe('false');
  });

  it('collapses overflow into a more button emitting moreOpen', () => {
    const element = createFixture();
    fixture.componentRef.setInput('maxVisiblePerDay', 1);
    fixture.detectChanges();
    let opened: string | undefined;
    fixture.componentRef.instance.moreOpen.subscribe((value) => {
      opened = value;
    });
    const more = element.querySelector(
      '.solaris-calendar-month-view__more',
    ) as HTMLButtonElement;
    expect(more.textContent).toContain('2 more');
    more.click();
    fixture.detectChanges();
    expect(opened).toBe('2026-10-15');
  });

  it('prefers the measured cell capacity over maxVisiblePerDay', () => {
    const element = createFixture();
    fixture.componentRef.setInput('maxVisiblePerDay', 1);
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-calendar-month-view__more'),
    ).toBeTruthy();
    const instance = fixture.componentRef.instance as unknown as {
      fittedRows: { set(value: number | null): void };
    };
    instance.fittedRows.set(5);
    fixture.detectChanges();
    expect(
      element.querySelector('.solaris-calendar-month-view__more'),
    ).toBeNull();
    instance.fittedRows.set(2);
    fixture.detectChanges();
    const more = element.querySelector(
      '.solaris-calendar-month-view__more',
    ) as HTMLButtonElement;
    expect(more.textContent).toContain('2 more');
  });

  it('selects days and opens events and tasks', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let selected: string | undefined;
    let opened: { id: string; start: string } | undefined;
    let toggled: string | undefined;
    instance.daySelect.subscribe((value) => {
      selected = value;
    });
    instance.eventOpen.subscribe((value) => {
      opened = value;
    });
    instance.taskToggle.subscribe((value) => {
      toggled = value;
    });
    fixture.componentRef.setInput('tasks', [
      {
        id: 't1',
        kind: 'task',
        title: 'Report',
        due: '2026-10-16',
        completed: true,
      },
    ]);
    fixture.detectChanges();
    const dayButtons = Array.from(
      element.querySelectorAll('.solaris-calendar-month-view__day'),
    ) as HTMLButtonElement[];
    const october16 = dayButtons.find((button) =>
      button.getAttribute('aria-label')?.includes('October 16'),
    );
    if (october16 === undefined) throw new Error('October 16 button not found');
    october16.click();
    expect(selected).toBe('2026-10-16');
    const chips = Array.from(
      element.querySelectorAll('[data-kind="event"]'),
    ) as HTMLButtonElement[];
    const standup = chips.find((chip) =>
      chip.getAttribute('aria-label')?.includes('Team standup'),
    );
    if (standup === undefined) throw new Error('standup chip not found');
    standup.click();
    expect(opened?.id).toBe('standup');
    (element.querySelector('[data-kind="task"]') as HTMLButtonElement).click();
    expect(toggled).toBe('t1');
    fixture.detectChanges();
    expect(
      element.querySelector('[role="status"]')?.textContent,
    ).not.toHaveLength(0);
  });

  it('navigates with arrows and selects with Enter', () => {
    const element = createFixture();
    const gridElement = grid(element);
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-16');
    expect(gridElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-16',
    );
    keydown(gridElement, 'ArrowDown');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-23');
    keydown(gridElement, 'ArrowLeft');
    keydown(gridElement, 'ArrowUp');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-15');
    let selected: string | undefined;
    fixture.componentRef.instance.daySelect.subscribe((value) => {
      selected = value;
    });
    keydown(gridElement, 'Enter');
    expect(selected).toBe('2026-10-15');
  });

  it('jumps weeks and months with Home End PageUp PageDown', () => {
    const element = createFixture();
    const gridElement = grid(element);
    keydown(gridElement, 'Home');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-11');
    keydown(gridElement, 'End');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-17');
    keydown(gridElement, 'PageDown');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-11-17');
    keydown(gridElement, 'PageUp');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-17');
  });

  it('hides weekend columns when requested', () => {
    const element = createFixture();
    fixture.componentRef.setInput('showWeekends', false);
    fixture.detectChanges();
    expect(dayCells(element)).toHaveLength(30);
    const gridElement = grid(element);
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-16');
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-19');
  });

  it('reflects density on the host', () => {
    const element = createFixture();
    expect(element.getAttribute('data-density')).toBe('comfortable');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(element.getAttribute('data-density')).toBe('compact');
  });

  it('reflects size on the host', () => {
    const element = createFixture();
    expect(element.getAttribute('data-size')).toBe('md');
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(element.getAttribute('data-size')).toBe('sm');
  });

  it('translates chrome strings through the translate service', () => {
    configureSolarisTesting({ translate: { locale: 'pt-BR' } });
    fixture = TestBed.createComponent(SolarisCalendarMonthViewComponent);
    fixture.componentRef.setInput('locale', 'pt-BR');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    fixture.componentRef.setInput('maxVisiblePerDay', 1);
    fixture.componentRef.setInput('tasks', [
      {
        id: 't1',
        kind: 'task',
        title: 'Relatório',
        due: '2026-10-16',
        completed: false,
      },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const more = element.querySelector(
      '.solaris-calendar-month-view__more',
    ) as HTMLButtonElement;
    expect(more.textContent).toContain('Mais 2');
    const task = element.querySelector('[data-kind="task"]');
    expect(task?.getAttribute('aria-label')).toContain('tarefa não concluída');
    const active = element.querySelector('[aria-selected="true"]');
    expect(active?.getAttribute('aria-label')).toContain('itens');
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
  });
});
