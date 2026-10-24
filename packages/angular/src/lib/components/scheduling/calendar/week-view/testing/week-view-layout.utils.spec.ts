import { describe, expect, it } from 'vitest';

import {
  clipSpanToDay,
  layoutOverlappingSpans,
} from '../model/week-view-layout.utils';

const HOUR = 3_600_000;

function span(
  id: string,
  startHour: number,
  endHour: number,
): { id: string; startMs: number; endMs: number } {
  return { id, startMs: startHour * HOUR, endMs: endHour * HOUR };
}

describe('layoutOverlappingSpans', () => {
  it('places sequential events in a single column', () => {
    expect(
      layoutOverlappingSpans([span('a', 9, 10), span('b', 10, 11)]),
    ).toEqual([
      { column: 0, columns: 1 },
      { column: 0, columns: 1 },
    ]);
  });

  it('places two overlapping events side by side', () => {
    expect(
      layoutOverlappingSpans([span('a', 9, 11), span('b', 10, 12)]),
    ).toEqual([
      { column: 0, columns: 2 },
      { column: 1, columns: 2 },
    ]);
  });

  it('stacks three overlapping events in three columns', () => {
    expect(
      layoutOverlappingSpans([
        span('a', 9, 12),
        span('b', 10, 11),
        span('c', 10.5, 11.5),
      ]),
    ).toEqual([
      { column: 0, columns: 3 },
      { column: 1, columns: 3 },
      { column: 2, columns: 3 },
    ]);
  });

  it('nests a contained event inside its parent column count', () => {
    expect(
      layoutOverlappingSpans([span('outer', 9, 13), span('inner', 10, 11)]),
    ).toEqual([
      { column: 0, columns: 2 },
      { column: 1, columns: 2 },
    ]);
  });

  it('reuses a freed column after a cluster ends', () => {
    expect(
      layoutOverlappingSpans([
        span('a', 9, 10),
        span('b', 9.5, 10.5),
        span('c', 11, 12),
      ]),
    ).toEqual([
      { column: 0, columns: 2 },
      { column: 1, columns: 2 },
      { column: 0, columns: 1 },
    ]);
  });

  it('orders ties deterministically by id', () => {
    expect(
      layoutOverlappingSpans([span('b', 9, 10), span('a', 9, 10)]),
    ).toEqual([
      { column: 1, columns: 2 },
      { column: 0, columns: 2 },
    ]);
  });

  it('renders zero-duration instants full width without clustering', () => {
    expect(
      layoutOverlappingSpans([
        span('a', 9, 11),
        { id: 'instant', startMs: 10 * HOUR, endMs: 10 * HOUR },
      ]),
    ).toEqual([
      { column: 0, columns: 1 },
      { column: 0, columns: 1 },
    ]);
  });
});

describe('clipSpanToDay', () => {
  const dayStart = 0;
  const dayEnd = 24 * HOUR;

  it('keeps contained spans unchanged', () => {
    expect(clipSpanToDay(9 * HOUR, 10 * HOUR, dayStart, dayEnd)).toEqual({
      startMs: 9 * HOUR,
      endMs: 10 * HOUR,
    });
  });

  it('clips overnight spans to the day window', () => {
    expect(clipSpanToDay(22 * HOUR, 26 * HOUR, dayStart, dayEnd)).toEqual({
      startMs: 22 * HOUR,
      endMs: dayEnd,
    });
  });

  it('rejects spans fully outside the day', () => {
    expect(clipSpanToDay(25 * HOUR, 26 * HOUR, dayStart, dayEnd)).toBeNull();
  });

  it('rejects non-finite bounds', () => {
    expect(clipSpanToDay(Number.NaN, 10 * HOUR, dayStart, dayEnd)).toBeNull();
  });
});
