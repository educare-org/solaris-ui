export interface SolarisWeekOverlapSpan {
  id: string;
  startMs: number;
  endMs: number;
}

export interface SolarisWeekOverlapPlacement {
  column: number;
  columns: number;
}

export interface SolarisWeekDaySegment {
  startMs: number;
  endMs: number;
}

function compareSpans(
  first: SolarisWeekOverlapSpan,
  second: SolarisWeekOverlapSpan,
): number {
  if (first.startMs !== second.startMs) return first.startMs - second.startMs;
  if (first.endMs !== second.endMs) return first.endMs - second.endMs;
  if (first.id < second.id) return -1;
  if (first.id > second.id) return 1;
  return 0;
}

export function clipSpanToDay(
  startMs: number,
  endMs: number,
  dayStartMs: number,
  dayEndMs: number,
): SolarisWeekDaySegment | null {
  if (
    !Number.isFinite(startMs) ||
    !Number.isFinite(endMs) ||
    !Number.isFinite(dayStartMs) ||
    !Number.isFinite(dayEndMs) ||
    dayEndMs <= dayStartMs
  ) {
    return null;
  }
  const start = Math.max(startMs, dayStartMs);
  const end = Math.min(Math.max(endMs, startMs), dayEndMs);
  if (end <= start) return null;
  return { startMs: start, endMs: end };
}

export function layoutOverlappingSpans(
  spans: readonly SolarisWeekOverlapSpan[],
): SolarisWeekOverlapPlacement[] {
  const placements: SolarisWeekOverlapPlacement[] = spans.map(() => ({
    column: 0,
    columns: 1,
  }));
  if (spans.length === 0) return placements;
  const order = spans
    .map((span, index) => index)
    .sort((first, second) => {
      const result = compareSpans(spans[first], spans[second]);
      return result === 0 ? first - second : result;
    });
  let cluster: number[] = [];
  let clusterEnd = Number.NEGATIVE_INFINITY;
  let clusterMaxColumns = 1;
  const columnEnds: number[] = [];
  const flush = (): void => {
    for (const index of cluster) {
      placements[index] = {
        column: placements[index].column,
        columns: clusterMaxColumns,
      };
    }
    cluster = [];
    clusterEnd = Number.NEGATIVE_INFINITY;
    clusterMaxColumns = 1;
    columnEnds.length = 0;
  };
  for (const index of order) {
    const span = spans[index];
    if (span.endMs <= span.startMs) {
      if (cluster.length > 0 && span.startMs >= clusterEnd) flush();
      continue;
    }
    if (cluster.length > 0 && span.startMs >= clusterEnd) flush();
    let column = columnEnds.findIndex((end) => end <= span.startMs);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(span.endMs);
    } else {
      columnEnds[column] = span.endMs;
    }
    placements[index] = { column, columns: 1 };
    cluster.push(index);
    clusterEnd = Math.max(clusterEnd, span.endMs);
    clusterMaxColumns = Math.max(clusterMaxColumns, columnEnds.length);
  }
  flush();
  return placements;
}
