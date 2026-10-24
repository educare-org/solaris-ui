import {
  SOLARIS_BAR_CHART_HEIGHT,
  SOLARIS_BAR_CHART_WIDTH,
  buildBarChartFrame,
  resolveBarLabelEvery,
  resolveMorphSeriesDelay,
  truncateBarCategoryLabel,
} from '../model/chart-bar.utils';
import type { SolarisChartSeries } from '../../model/chart.types';

const SERIES: readonly SolarisChartSeries[] = [
  {
    id: 'automation',
    label: 'Automation',
    points: [
      { x: 'Mon', y: 10 },
      { x: 'Tue', y: 20 },
      { x: 'Wed', y: 30 },
    ],
  },
  {
    id: 'queries',
    label: 'Queries',
    points: [
      { x: 'Mon', y: 5 },
      { x: 'Tue', y: 15 },
      { x: 'Wed', y: null },
    ],
  },
];

describe('buildBarChartFrame', () => {
  it('lays grouped vertical bars side by side with equal widths', () => {
    const frame = buildBarChartFrame(SERIES);
    expect(frame.series).toHaveLength(2);
    const first = frame.series[0].bars;
    const second = frame.series[1].bars;
    expect(first).toHaveLength(3);
    expect(second).toHaveLength(2);
    expect(first[0].width).toBeGreaterThan(0);
    expect(first[0].width).toBe(second[0].width);
    expect(second[0].x).toBeGreaterThan(first[0].x);
    expect(first[0].y + first[0].height).toBeCloseTo(frame.baseline, 5);
  });

  it('lays grouped horizontal bars along x with equal heights', () => {
    const frame = buildBarChartFrame(SERIES, {
      orientation: 'horizontal',
    });
    const bars = frame.series[0].bars;
    expect(bars).toHaveLength(3);
    expect(bars[0].height).toBe(bars[1].height);
    expect(bars[2].width).toBeGreaterThan(bars[0].width);
    expect(bars[0].x).toBeCloseTo(frame.baseline, 5);
  });

  it('stacks vertical bars cumulatively from the baseline', () => {
    const frame = buildBarChartFrame(SERIES, { layout: 'stacked' });
    expect(frame.series[0].bars).toHaveLength(3);
    expect(frame.series[1].bars).toHaveLength(2);
    const bottom = frame.series[0].bars[0];
    const top = frame.series[1].bars[0];
    expect(top.x).toBeCloseTo(bottom.x, 5);
    expect(top.width).toBeCloseTo(bottom.width, 5);
    expect(top.y + top.height).toBeCloseTo(bottom.y, 5);
    expect(bottom.y + bottom.height).toBeCloseTo(frame.baseline, 5);
  });

  it('stacks horizontal bars cumulatively along x', () => {
    const frame = buildBarChartFrame(SERIES, {
      layout: 'stacked',
      orientation: 'horizontal',
    });
    const first = frame.series[0].bars[0];
    const second = frame.series[1].bars[0];
    expect(first.y).toBeCloseTo(second.y, 5);
    expect(first.height).toBeCloseTo(second.height, 5);
    expect(second.x).toBeCloseTo(first.x + first.width, 5);
  });

  it('normalizes stacked-100 columns to 100 percent', () => {
    const frame = buildBarChartFrame(SERIES, { layout: 'stacked-100' });
    expect(frame.domain).toEqual({ min: 0, max: 100 });
    const totals = [0, 1].map((index) =>
      frame.series.reduce((sum, row) => sum + (row.bars[index]?.value ?? 0), 0),
    );
    for (const total of totals) {
      expect(total).toBeCloseTo(100, 5);
    }
  });

  it('treats negative values as zero in stacked-100', () => {
    const frame = buildBarChartFrame(
      [
        {
          id: 'a',
          label: 'A',
          points: [
            { x: 'Mon', y: 10 },
            { x: 'Tue', y: -8 },
          ],
        },
        {
          id: 'b',
          label: 'B',
          points: [
            { x: 'Mon', y: 10 },
            { x: 'Tue', y: 10 },
          ],
        },
      ],
      { layout: 'stacked-100' },
    );
    const tuesday = frame.series.map((row) => row.bars[1]?.value ?? 0);
    expect(tuesday[0]).toBe(0);
    expect(tuesday[0] + tuesday[1]).toBeCloseTo(100, 5);
  });

  it('skips null gaps without shifting the remaining bars', () => {
    const frame = buildBarChartFrame(SERIES);
    expect(frame.series[1].bars.some((bar) => bar.index === 2)).toBe(false);
    expect(frame.series[0].bars[2].index).toBe(2);
  });

  it('draws negative grouped bars below the baseline', () => {
    const frame = buildBarChartFrame([
      {
        id: 'delta',
        label: 'Delta',
        points: [
          { x: 'Mon', y: 10 },
          { x: 'Tue', y: -6 },
        ],
      },
    ]);
    const bars = frame.series[0].bars;
    expect(bars[0].y + bars[0].height).toBeCloseTo(frame.baseline, 5);
    expect(bars[1].y).toBeCloseTo(frame.baseline, 5);
    expect(bars[1].height).toBeGreaterThan(0);
  });

  it('stacks negatives downward and positives upward in stacked mode', () => {
    const frame = buildBarChartFrame(
      [
        {
          id: 'a',
          label: 'A',
          points: [{ x: 'Mon', y: 10 }],
        },
        {
          id: 'b',
          label: 'B',
          points: [{ x: 'Mon', y: -4 }],
        },
      ],
      { layout: 'stacked' },
    );
    const positive = frame.series[0].bars[0];
    const negative = frame.series[1].bars[0];
    expect(positive.y + positive.height).toBeCloseTo(frame.baseline, 5);
    expect(negative.y).toBeCloseTo(frame.baseline, 5);
  });

  it('excludes hidden series from bars', () => {
    const frame = buildBarChartFrame(
      SERIES.map((entry) =>
        entry.id === 'queries' ? { ...entry, hidden: true } : entry,
      ),
    );
    expect(frame.series).toHaveLength(1);
    expect(frame.series[0].id).toBe('automation');
  });

  it('returns an empty frame for empty input', () => {
    const frame = buildBarChartFrame([]);
    expect(frame.series).toHaveLength(0);
    expect(frame.categoryCenters).toHaveLength(0);
    expect(frame.valueTicks).toHaveLength(0);
    expect(frame.width).toBe(SOLARIS_BAR_CHART_WIDTH);
    expect(frame.height).toBe(SOLARIS_BAR_CHART_HEIGHT);
  });

  it('falls back to default size for invalid dimensions', () => {
    const frame = buildBarChartFrame(SERIES, { width: -10, height: 0 });
    expect(frame.width).toBe(SOLARIS_BAR_CHART_WIDTH);
    expect(frame.height).toBe(SOLARIS_BAR_CHART_HEIGHT);
  });

  it('never mutates the consumer series', () => {
    const frozen = SERIES.map((entry) =>
      Object.freeze({ ...entry, points: Object.freeze([...entry.points]) }),
    );
    const snapshot = JSON.stringify(frozen);
    buildBarChartFrame(frozen, { layout: 'stacked' });
    buildBarChartFrame(frozen, {
      layout: 'stacked-100',
      orientation: 'horizontal',
    });
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });
});

describe('resolveBarLabelEvery', () => {
  it('keeps every label on wide hosts', () => {
    expect(resolveBarLabelEvery(5, 800)).toBe(1);
    expect(resolveBarLabelEvery(16, 800)).toBe(2);
  });

  it('thins aggressively on narrow hosts', () => {
    expect(resolveBarLabelEvery(16, 300)).toBe(3);
    expect(resolveBarLabelEvery(4, 300)).toBe(2);
  });

  it('handles empty and unknown sizes', () => {
    expect(resolveBarLabelEvery(0, 800)).toBe(1);
    expect(resolveBarLabelEvery(8, 0)).toBe(1);
  });
});

describe('truncateBarCategoryLabel', () => {
  it('keeps short labels intact', () => {
    expect(truncateBarCategoryLabel('Turma A')).toBe('Turma A');
  });

  it('truncates long labels with an ellipsis', () => {
    const long = 'Turma de alfabetização avançada';
    const truncated = truncateBarCategoryLabel(long);
    expect(truncated).toContain('…');
    expect(truncated.length).toBeLessThan(long.length);
    expect(truncateBarCategoryLabel(long, 10).length).toBeLessThanOrEqual(10);
  });
});

describe('resolveMorphSeriesDelay', () => {
  it('chains one phase per series', () => {
    expect(resolveMorphSeriesDelay(0, 300)).toBe('0ms');
    expect(resolveMorphSeriesDelay(1, 300)).toBe('300ms');
    expect(resolveMorphSeriesDelay(2, 300)).toBe('600ms');
  });

  it('clamps unknown series and invalid phases to zero', () => {
    expect(resolveMorphSeriesDelay(-1, 300)).toBe('0ms');
    expect(resolveMorphSeriesDelay(1, -50)).toBe('0ms');
  });
});
