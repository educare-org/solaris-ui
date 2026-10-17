import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import type {
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
  SolarisCalendarEventResizeProposal,
} from '../../model/calendar-drag.types';
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
    id: 'weekly',
    kind: 'event',
    title: 'Weekly sync',
    start: '2026-10-13T10:00:00-03:00',
    end: '2026-10-13T11:00:00-03:00',
    color: 'success',
    recurrence: { freq: 'weekly', count: 4 },
  },
];

describe('SolarisCalendarWeekViewComponent drag', () => {
  let fixture: ComponentFixture<SolarisCalendarWeekViewComponent>;

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, 'matchMedia');
  });

  const createFixture = (options?: {
    snapStepMinutes?: number;
    dragDisabled?: boolean;
  }): HTMLElement => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FROZEN_UTC));
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarWeekViewComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    fixture.componentRef.setInput('events', EVENTS);
    if (options?.snapStepMinutes !== undefined) {
      fixture.componentRef.setInput('snapStepMinutes', options.snapStepMinutes);
    }
    if (options?.dragDisabled !== undefined) {
      fixture.componentRef.setInput('dragDisabled', options.dragDisabled);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const grid = (element: HTMLElement): HTMLElement => {
    const found = element.querySelector('[role="grid"]');
    if (found === null) throw new Error('week grid not found');
    return found as HTMLElement;
  };

  const keydown = (
    target: HTMLElement,
    key: string,
    shiftKey = false,
  ): void => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        shiftKey,
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.detectChanges();
  };

  const standupBlock = (element: HTMLElement): HTMLElement => {
    const found = Array.from(
      element.querySelectorAll('.solaris-calendar-week-view__block'),
    ).find((block) =>
      block.getAttribute('aria-label')?.includes('Team standup'),
    );
    if (found === undefined) throw new Error('standup block not found');
    return found as HTMLElement;
  };

  it('moves a block with the keyboard and emits a proposal', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let moved: SolarisCalendarEventMoveProposal | undefined;
    let opened: { id: string; start: string } | undefined;
    instance.eventMove.subscribe((value) => {
      moved = value;
    });
    instance.eventOpen.subscribe((value) => {
      opened = value;
    });
    const block = standupBlock(element);
    keydown(block, 'ArrowRight');
    expect(element.getAttribute('data-dragging')).toBe('');
    expect(element.querySelector('[data-ghost]')).not.toBeNull();
    keydown(block, 'Enter');
    expect(moved?.id).toBe('standup');
    expect(moved?.start).toBe('2026-10-16T09:00:00-03:00');
    expect(moved?.end).toBe('2026-10-16T09:30:00-03:00');
    expect(moved?.occurrenceStart).toBe('2026-10-15T09:00:00-03:00');
    expect(moved?.occurrenceScope).toBe('single');
    expect(element.getAttribute('data-dragging')).toBeNull();
    // why: the Enter commit must not re-trigger the block click behavior.
    expect(opened).toBeUndefined();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).toContain('moved');
  });

  it('resizes the end edge with Shift+arrows', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let resized: SolarisCalendarEventResizeProposal | undefined;
    instance.eventResize.subscribe((value) => {
      resized = value;
    });
    const block = standupBlock(element);
    keydown(block, 'ArrowDown', true);
    expect(element.getAttribute('data-resizing')).toBe('');
    keydown(block, 'Enter');
    expect(resized?.id).toBe('standup');
    expect(resized?.start).toBe('2026-10-15T09:00:00-03:00');
    expect(resized?.end).toBe('2026-10-15T10:00:00-03:00');
    expect(resized?.occurrenceScope).toBe('single');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).toContain('resized');
  });

  it('creates a timed range with Shift+arrows on the grid', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let created: SolarisCalendarEventCreateProposal | undefined;
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    // why: the active slot follows focusedDate, so creation starts on 2026-10-15.
    const gridElement = grid(element);
    keydown(gridElement, 'ArrowDown', true);
    expect(element.querySelector('[data-ghost]')).not.toBeNull();
    keydown(gridElement, 'Enter');
    expect(created?.allDay).toBe(false);
    expect(created?.start).toBe('2026-10-15T09:00:00-03:00');
    expect(created?.end).toBe('2026-10-15T09:30:00-03:00');
  });

  it('honors a custom snap step for keyboard creation', () => {
    createFixture({ snapStepMinutes: 15 });
    const instance = fixture.componentRef.instance;
    let created: SolarisCalendarEventCreateProposal | undefined;
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    const gridElement = grid(fixture.nativeElement as HTMLElement);
    keydown(gridElement, 'ArrowDown', true);
    keydown(gridElement, 'Enter');
    expect(created?.start).toBe('2026-10-15T09:00:00-03:00');
    expect(created?.end).toBe('2026-10-15T09:15:00-03:00');
  });

  it('cancels keyboard drags with Escape without emitting', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let moved: SolarisCalendarEventMoveProposal | undefined;
    let resized: SolarisCalendarEventResizeProposal | undefined;
    let created: SolarisCalendarEventCreateProposal | undefined;
    instance.eventMove.subscribe((value) => {
      moved = value;
    });
    instance.eventResize.subscribe((value) => {
      resized = value;
    });
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    const block = standupBlock(element);
    keydown(block, 'ArrowRight');
    keydown(block, 'Escape');
    expect(moved).toBeUndefined();
    expect(element.getAttribute('data-dragging')).toBeNull();
    keydown(block, 'ArrowDown', true);
    keydown(block, 'Escape');
    expect(resized).toBeUndefined();
    keydown(grid(element), 'ArrowDown', true);
    keydown(grid(element), 'Escape');
    expect(created).toBeUndefined();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).toContain('cancelled');
  });

  it('never mutates a frozen consumer array while proposing', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FROZEN_UTC));
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarWeekViewComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('timeZone', 'America/Sao_Paulo');
    fixture.componentRef.setInput('focusedDate', '2026-10-15');
    const frozen = Object.freeze(EVENTS.map((event) => Object.freeze(event)));
    fixture.componentRef.setInput('events', frozen);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const snapshot = JSON.stringify(frozen);
    let moved: SolarisCalendarEventMoveProposal | undefined;
    fixture.componentRef.instance.eventMove.subscribe((value) => {
      moved = value;
    });
    const block = standupBlock(element);
    keydown(block, 'ArrowRight');
    keydown(block, 'Enter');
    expect(moved?.start).toBe('2026-10-16T09:00:00-03:00');
    expect(JSON.stringify(frozen)).toBe(snapshot);
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  it('moves recurring occurrences as single instances', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let moved: SolarisCalendarEventMoveProposal | undefined;
    instance.eventMove.subscribe((value) => {
      moved = value;
    });
    const sync = Array.from(
      element.querySelectorAll('.solaris-calendar-week-view__block'),
    ).find((block) =>
      block.getAttribute('aria-label')?.includes('Weekly sync'),
    );
    if (sync === undefined) throw new Error('weekly block not found');
    keydown(sync as HTMLElement, 'ArrowRight');
    keydown(sync as HTMLElement, 'Enter');
    expect(moved?.id).toBe('weekly');
    expect(moved?.occurrenceScope).toBe('occurrence');
    expect(moved?.start).toBe('2026-10-14T10:00:00-03:00');
    expect(moved?.end).toBe('2026-10-14T11:00:00-03:00');
  });

  it('blocks drag interactions when disabled', () => {
    const element = createFixture({ dragDisabled: true });
    const instance = fixture.componentRef.instance;
    let moved: SolarisCalendarEventMoveProposal | undefined;
    instance.eventMove.subscribe((value) => {
      moved = value;
    });
    keydown(standupBlock(element), 'ArrowRight');
    expect(element.getAttribute('data-dragging')).toBeNull();
    expect(moved).toBeUndefined();
    keydown(grid(element), 'ArrowDown', true);
    expect(element.getAttribute('data-dragging')).toBeNull();
  });
});
