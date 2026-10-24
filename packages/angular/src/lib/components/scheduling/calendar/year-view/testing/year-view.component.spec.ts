import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { SolarisCalendarYearViewComponent } from '../component/year-view.component';

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
    id: 'weekly',
    kind: 'event',
    title: 'Weekly sync',
    start: '2026-10-05T10:00:00-03:00',
    end: '2026-10-05T11:00:00-03:00',
    color: 'success',
    recurrence: { freq: 'weekly', count: 6 },
  },
];

describe('SolarisCalendarYearViewComponent', () => {
  let fixture: ComponentFixture<SolarisCalendarYearViewComponent>;

  const createFixture = (options?: {
    locale?: string;
    showWeekends?: boolean;
  }): HTMLElement => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarYearViewComponent);
    fixture.componentRef.setInput('locale', options?.locale ?? 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    if (options?.showWeekends !== undefined) {
      fixture.componentRef.setInput('showWeekends', options.showWeekends);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const grid = (element: HTMLElement): HTMLElement => {
    const found = element.querySelector('[role="grid"]');
    if (found === null) throw new Error('year grid not found');
    return found as HTMLElement;
  };

  const months = (element: HTMLElement): HTMLElement[] =>
    Array.from(element.querySelectorAll('.solaris-calendar-year-view__month'));

  const dayButton = (element: HTMLElement, date: string): HTMLButtonElement => {
    const found = element.querySelector(
      `[data-date="${date}"]`,
    ) as HTMLButtonElement | null;
    if (found === null) throw new Error(`${date} button not found`);
    return found;
  };

  const keydown = (target: HTMLElement, key: string): void => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
  };

  it('renders twelve mini-months for the focused year', () => {
    const element = createFixture();
    expect(months(element)).toHaveLength(12);
    expect(months(element)[9].getAttribute('aria-label')).toContain('October');
    expect(months(element)[9].getAttribute('aria-label')).toContain('2026');
    expect(grid(element).getAttribute('aria-label')).toContain('2026');
  });

  it('shows month-only titles with a capital first letter', () => {
    const element = createFixture();
    const october = months(element)[9];
    expect(
      october
        .querySelector('.solaris-calendar-year-view__title')
        ?.textContent?.trim(),
    ).toBe('October');
    expect(october.getAttribute('aria-label')).toContain('2026');
  });

  it('fills adjacent-month days in a muted tone across six weeks', () => {
    const element = createFixture();
    const october = months(element)[9];
    expect(
      october.querySelectorAll('.solaris-calendar-year-view__week'),
    ).toHaveLength(6);
    expect(
      october.querySelector('.solaris-calendar-year-view__blank'),
    ).toBeNull();
    const filler = october.querySelector('[data-date="2026-09-28"]');
    expect(filler).not.toBeNull();
    expect(
      filler
        ?.closest('.solaris-calendar-year-view__cell')
        ?.hasAttribute('data-outside-month'),
    ).toBe(true);
    expect(october.querySelector('[data-date="2026-11-01"]')).not.toBeNull();
  });

  it('counts items on filler days and drills from them', () => {
    createFixture();
    fixture.componentRef.setInput('holidays', [
      { date: '2026-09-28', name: 'Holiday' },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const october = months(element)[9];
    const filler = october.querySelector(
      '[data-date="2026-09-28"]',
    ) as HTMLButtonElement;
    expect(
      filler.querySelectorAll('.solaris-calendar-year-view__dot'),
    ).toHaveLength(1);
    let selected: string | undefined;
    fixture.componentRef.instance.daySelect.subscribe((value) => {
      selected = value;
    });
    filler.click();
    fixture.detectChanges();
    expect(selected).toBe('2026-09-28');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-09-28');
  });

  it('renders density dots for days with items', () => {
    const element = createFixture();
    const busy = dayButton(element, '2026-10-15');
    expect(
      busy.querySelectorAll('.solaris-calendar-year-view__dot'),
    ).toHaveLength(2);
    expect(busy.getAttribute('aria-label')).toContain('2');
    const quiet = dayButton(element, '2026-10-14');
    expect(
      quiet.querySelectorAll('.solaris-calendar-year-view__dot'),
    ).toHaveLength(0);
  });

  it('caps dots at three while the label keeps the full count', () => {
    createFixture();
    fixture.componentRef.setInput('events', [
      ...EVENTS,
      {
        id: 'extra-a',
        kind: 'event',
        title: 'Extra A',
        start: '2026-10-15T17:00:00-03:00',
        end: '2026-10-15T18:00:00-03:00',
      },
      {
        id: 'extra-b',
        kind: 'event',
        title: 'Extra B',
        start: '2026-10-15T19:00:00-03:00',
        end: '2026-10-15T20:00:00-03:00',
      },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const busy = dayButton(element, '2026-10-15');
    expect(
      busy.querySelectorAll('.solaris-calendar-year-view__dot'),
    ).toHaveLength(3);
    expect(busy.getAttribute('aria-label')).toContain('4');
  });

  it('marks holidays on the day cell', () => {
    createFixture();
    fixture.componentRef.setInput('holidays', [
      { date: '2026-10-12', name: 'Holiday' },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const holiday = dayButton(element, '2026-10-12').closest(
      '.solaris-calendar-year-view__cell',
    );
    expect(holiday?.hasAttribute('data-holiday')).toBe(true);
  });

  it('drills down by setting focusedDate and emitting daySelect', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let selected: string | undefined;
    instance.daySelect.subscribe((value) => {
      selected = value;
    });
    dayButton(element, '2026-10-20').click();
    fixture.detectChanges();
    expect(selected).toBe('2026-10-20');
    expect(instance.focusedDate()).toBe('2026-10-20');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).not.toHaveLength(0);
  });

  it('moves the active day with arrows and drills with Enter', () => {
    const element = createFixture();
    const gridElement = grid(element);
    expect(gridElement.getAttribute('aria-activedescendant')).toContain(
      '2026-10-15',
    );
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-16');
    keydown(gridElement, 'ArrowDown');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-23');
    keydown(gridElement, 'ArrowUp');
    keydown(gridElement, 'ArrowLeft');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-15');
    let selected: string | undefined;
    fixture.componentRef.instance.daySelect.subscribe((value) => {
      selected = value;
    });
    keydown(gridElement, 'Enter');
    expect(selected).toBe('2026-10-15');
  });

  it('jumps to week edges and shifts months with PageUp PageDown', () => {
    const element = createFixture();
    const gridElement = grid(element);
    keydown(gridElement, 'Home');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-11');
    keydown(gridElement, 'End');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-17');
    keydown(gridElement, 'PageUp');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-09-17');
    keydown(gridElement, 'PageDown');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-17');
  });

  it('hides weekend columns when requested', () => {
    const element = createFixture({ showWeekends: false });
    expect(() => dayButton(element, '2026-10-17')).toThrow();
    expect(() => dayButton(element, '2026-10-18')).toThrow();
    expect(dayButton(element, '2026-10-19')).toBeTruthy();
    const gridElement = grid(element);
    fixture.componentRef.instance.focusedDate.set('2026-10-16');
    fixture.detectChanges();
    keydown(gridElement, 'ArrowRight');
    expect(fixture.componentRef.instance.focusedDate()).toBe('2026-10-19');
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

  it('translates day labels through the translate service', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({ translate: { locale: 'pt-BR' } });
    fixture = TestBed.createComponent(SolarisCalendarYearViewComponent);
    fixture.componentRef.setInput('locale', 'pt-BR');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      dayButton(element, '2026-10-15').getAttribute('aria-label'),
    ).toContain('itens');
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
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-date="2026-10-15"]')).not.toBeNull();
  });
});
