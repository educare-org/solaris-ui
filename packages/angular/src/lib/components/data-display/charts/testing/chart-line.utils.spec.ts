import { describe, expect, it } from 'vitest';

import type { SolarisChartSeries } from '../model/chart.types';
import {
  buildLineChartFrame,
  buildSvgAreaPath,
  buildSvgLinePath,
  buildSparklineGeometry,
  lineChartYPosition,
  sumLineChartValuesAt,
} from '../model/chart-line.utils';

const SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'usa',
    label: 'USA',
    points: [
      { x: 'Mon', y: 10 },
      { x: 'Tue', y: 20 },
      { x: 'Wed', y: 15 },
    ],
  },
  {
    id: 'europe',
    label: 'Europe',
    color: 'danger',
    points: [
      { x: 'Mon', y: 5 },
      { x: 'Tue', y: null },
      { x: 'Wed', y: 8 },
    ],
  },
];

describe('buildSvgLinePath', () => {
  it('renders linear paths with move and line commands', () => {
    expect(
      buildSvgLinePath(
        [
          { x: 0, y: 10 },
          { x: 10, y: 20 },
          { x: 20, y: 15 },
        ],
        'linear',
      ),
    ).toBe('M0,10L10,20L20,15');
  });

  it('renders smooth cubic paths through every point', () => {
    const path = buildSvgLinePath(
      [
        { x: 0, y: 10 },
        { x: 10, y: 20 },
        { x: 20, y: 15 },
      ],
      'smooth',
    );
    expect(path.startsWith('M0,10C')).toBe(true);
    expect(path.endsWith('20,15')).toBe(true);
    expect(path).toContain('C');
  });

  it('renders step paths with horizontal-then-vertical moves', () => {
    expect(
      buildSvgLinePath(
        [
          { x: 0, y: 10 },
          { x: 10, y: 20 },
        ],
        'step',
      ),
    ).toBe('M0,10H10V20');
  });

  it('handles empty and single-point inputs', () => {
    expect(buildSvgLinePath([], 'linear')).toBe('');
    expect(buildSvgLinePath([{ x: 5, y: 7 }], 'smooth')).toBe('M5,7');
  });
});

describe('buildSvgAreaPath', () => {
  it('closes the line back to the baseline', () => {
    expect(
      buildSvgAreaPath(
        [
          { x: 0, y: 10 },
          { x: 10, y: 20 },
        ],
        30,
        'linear',
      ),
    ).toBe('M0,10L10,20L10,30L0,30Z');
  });

  it('returns empty for a single point', () => {
    expect(buildSvgAreaPath([{ x: 0, y: 10 }], 30, 'smooth')).toBe('');
  });
});

describe('buildLineChartFrame', () => {
  it('splits null gaps into separate sub-paths', () => {
    const frame = buildLineChartFrame(SERIES, { interpolation: 'linear' });
    const europe = frame.series.find((entry) => entry.id === 'europe');
    expect(europe?.linePath).toContain('M');
    expect(europe?.linePath.split('M').length).toBe(3);
    expect(europe?.dots[1].cy).toBeNull();
  });

  it('maps smooth mode to cubic paths and step mode to H/V paths', () => {
    const smooth = buildLineChartFrame(SERIES, { interpolation: 'smooth' });
    const stepped = buildLineChartFrame(SERIES, {
      interpolation: 'smooth',
      step: true,
    });
    expect(smooth.series[0].linePath).toContain('C');
    expect(stepped.series[0].linePath).toContain('H');
    expect(stepped.series[0].linePath).not.toContain('C');
  });

  it('keeps series colors stable when an earlier series is hidden', () => {
    const frame = buildLineChartFrame(
      SERIES.map((entry, index) =>
        index === 0 ? { ...entry, hidden: true } : entry,
      ),
    );
    expect(frame.series.map((entry) => entry.id)).toEqual(['europe']);
    // europe é a 2ª série na ordem original → mantém a cor de índice 1
    // (override explícito 'danger'), sem herdar o 'primary' da 1ª.
    expect(frame.series[0].colorVar).toBe('var(--solaris-danger-solid)');
  });

  it('resolves palette colors in visible order with overrides', () => {
    const frame = buildLineChartFrame(SERIES);
    expect(frame.series[0].colorVar).toBe('var(--solaris-primary-solid)');
    expect(frame.series[1].colorVar).toBe('var(--solaris-danger-solid)');
  });

  it('keeps palette order by original index without overrides', () => {
    const plain = [
      {
        id: 'a',
        label: 'A',
        points: [{ x: 0, y: 1 }],
      },
      {
        id: 'b',
        label: 'B',
        points: [{ x: 0, y: 2 }],
      },
      {
        id: 'c',
        label: 'C',
        points: [{ x: 0, y: 3 }],
      },
    ] as const;
    const frame = buildLineChartFrame(
      plain.map((entry) => ({ ...entry, points: [...entry.points] })),
    );
    expect(frame.series[2].colorVar).toBe('var(--solaris-success-solid)');
    const hidden = buildLineChartFrame([
      { ...plain[0], points: [...plain[0].points], hidden: true },
      { ...plain[1], points: [...plain[1].points] },
      { ...plain[2], points: [...plain[2].points] },
    ]);
    expect(hidden.series.map((entry) => entry.id)).toEqual(['b', 'c']);
    expect(hidden.series[0].colorVar).toBe('var(--solaris-accent-solid)');
    expect(hidden.series[1].colorVar).toBe('var(--solaris-success-solid)');
  });

  it('skips hidden series without mutating the input', () => {
    const frozen = SERIES.map((entry) =>
      Object.freeze({ ...entry, points: Object.freeze([...entry.points]) }),
    );
    const snapshot = JSON.stringify(frozen);
    const frame = buildLineChartFrame(
      frozen.map((entry, index) =>
        index === 0 ? { ...entry, hidden: true } : entry,
      ),
    );
    expect(frame.series.map((entry) => entry.id)).toEqual(['europe']);
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });

  it('exposes ticks, baseline and evenly spaced x positions', () => {
    const frame = buildLineChartFrame(SERIES);
    expect(frame.yTicks.length).toBeGreaterThan(0);
    expect(frame.xPositions).toHaveLength(3);
    expect(frame.xPositions[0]).toBeLessThan(frame.xPositions[2]);
    expect(frame.baselineY).toBeGreaterThanOrEqual(frame.plot.top);
  });

  it('returns an empty frame for empty input', () => {
    const frame = buildLineChartFrame([]);
    expect(frame.series).toEqual([]);
    expect(frame.xPositions).toHaveLength(1);
  });
});

describe('sumLineChartValuesAt', () => {
  it('totals plottable values at an index across series', () => {
    expect(sumLineChartValuesAt(SERIES, 0)).toBe(15);
  });

  it('returns null when every value at the index is a gap', () => {
    const gaps: readonly SolarisChartSeries[] = [
      { id: 'a', label: 'A', points: [{ x: 0, y: null }] },
    ];
    expect(sumLineChartValuesAt(gaps, 0)).toBeNull();
  });
});

describe('lineChartYPosition', () => {
  it('maps values inside the plot bounds', () => {
    const y = lineChartYPosition(
      50,
      { min: 0, max: 100 },
      { left: 0, top: 0, width: 100, height: 100 },
    );
    expect(y).toBe(50);
  });
});

describe('buildSparklineGeometry', () => {
  it('detects upward and downward trends', () => {
    expect(buildSparklineGeometry([1, 2, 3]).trend).toBe('up');
    expect(buildSparklineGeometry([3, 2, 1]).trend).toBe('down');
    expect(buildSparklineGeometry([2, 2]).trend).toBe('flat');
  });

  it('returns empty paths for empty input', () => {
    const geometry = buildSparklineGeometry([]);
    expect(geometry.linePath).toBe('');
    expect(geometry.areaPath).toBe('');
  });
});
