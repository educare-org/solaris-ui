import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import type {
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
} from '../../model/calendar-drag.types';
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
    id: 'weekly',
    kind: 'event',
    title: 'Weekly sync',
    start: '2026-10-13T10:00:00-03:00',
    end: '2026-10-13T11:00:00-03:00',
    color: 'success',
    recurrence: { freq: 'weekly', count: 4 },
  },
];

describe('SolarisCalendarMonthViewComponent drag', () => {
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

  const gridKeydown = (
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

  const firstEventChip = (element: HTMLElement): HTMLElement => {
    const found = Array.from(
      element.querySelectorAll('[data-kind="event"][data-occurrence]'),
    ).find((chip) => chip.getAttribute('aria-label')?.includes('Team standup'));
    if (found === undefined) throw new Error('standup chip not found');
    return found as HTMLElement;
  };

  const chipKeydown = (chip: HTMLElement, key: string): void => {
    chip.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
  };

  it('moves an event with the keyboard and emits a proposal', () => {
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
    const chip = firstEventChip(element);
    chipKeydown(chip, 'ArrowRight');
    expect(element.getAttribute('data-dragging')).toBe('');
    expect(element.querySelector('[data-ghost]')).not.toBeNull();
    chipKeydown(chip, 'Enter');
    expect(moved?.id).toBe('standup');
    expect(moved?.start).toBe('2026-10-16T09:00:00-03:00');
    expect(moved?.end).toBe('2026-10-16T09:30:00-03:00');
    expect(moved?.occurrenceStart).toBe('2026-10-15T09:00:00-03:00');
    expect(moved?.occurrenceScope).toBe('single');
    expect(element.getAttribute('data-dragging')).toBeNull();
    // why: the Enter commit must not re-trigger the chip click behavior.
    expect(opened).toBeUndefined();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).toContain('moved');
  });

  it('creates a range with Shift+arrows on the grid', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let created: SolarisCalendarEventCreateProposal | undefined;
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    const gridElement = grid(element);
    gridKeydown(gridElement, 'ArrowRight', true);
    gridKeydown(gridElement, 'ArrowRight', true);
    expect(element.querySelector('[data-ghost]')).not.toBeNull();
    gridKeydown(gridElement, 'Enter');
    expect(created).toEqual({
      start: '2026-10-15',
      end: '2026-10-17',
      allDay: true,
    });
  });

  it('cancels keyboard drags with Escape without emitting', () => {
    const element = createFixture();
    const instance = fixture.componentRef.instance;
    let moved: SolarisCalendarEventMoveProposal | undefined;
    let created: SolarisCalendarEventCreateProposal | undefined;
    instance.eventMove.subscribe((value) => {
      moved = value;
    });
    instance.eventCreate.subscribe((value) => {
      created = value;
    });
    const chip = firstEventChip(element);
    chipKeydown(chip, 'ArrowRight');
    expect(element.getAttribute('data-dragging')).toBe('');
    chipKeydown(chip, 'Escape');
    expect(moved).toBeUndefined();
    expect(element.getAttribute('data-dragging')).toBeNull();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="status"]')
        ?.textContent,
    ).toContain('cancelled');
    const gridElement = grid(element);
    gridKeydown(gridElement, 'ArrowRight', true);
    gridKeydown(gridElement, 'Escape');
    expect(created).toBeUndefined();
  });

  it('never mutates a frozen consumer array while proposing', () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCalendarMonthViewComponent);
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
    const chip = firstEventChip(element);
    chipKeydown(chip, 'ArrowRight');
    chipKeydown(chip, 'Enter');
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
      element.querySelectorAll('[data-kind="event"]'),
    ).find((chip) => chip.getAttribute('aria-label')?.includes('Weekly sync'));
    if (sync === undefined) throw new Error('weekly chip not found');
    chipKeydown(sync as HTMLElement, 'ArrowRight');
    chipKeydown(sync as HTMLElement, 'Enter');
    expect(moved?.id).toBe('weekly');
    expect(moved?.occurrenceScope).toBe('occurrence');
    expect(moved?.start).toBe('2026-10-14T10:00:00-03:00');
    expect(moved?.end).toBe('2026-10-14T11:00:00-03:00');
  });

  it('blocks drag interactions when disabled', () => {
    const element = createFixture();
    fixture.componentRef.setInput('dragDisabled', true);
    fixture.detectChanges();
    let moved: SolarisCalendarEventMoveProposal | undefined;
    fixture.componentRef.instance.eventMove.subscribe((value) => {
      moved = value;
    });
    const chip = firstEventChip(element);
    chipKeydown(chip, 'ArrowRight');
    expect(element.getAttribute('data-dragging')).toBeNull();
    expect(moved).toBeUndefined();
    gridKeydown(grid(element), 'ArrowRight', true);
    expect(element.getAttribute('data-dragging')).toBeNull();
  });

  it('ignores incomplete proposals on the same day', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    let moved: SolarisCalendarEventMoveProposal | undefined;
    instance.eventMove.subscribe((value) => {
      moved = value;
    });
    // why: Left then Right returns to the origin — the commit must be a no-op.
    const chip = firstEventChip(fixture.nativeElement as HTMLElement);
    chipKeydown(chip, 'ArrowLeft');
    chipKeydown(chip, 'ArrowRight');
    chipKeydown(chip, 'Enter');
    expect(moved).toBeUndefined();
  });
});
