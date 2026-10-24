import {
  SOLARIS_RADAR_CHART_HEIGHT,
  SOLARIS_RADAR_CHART_LEVELS,
  SOLARIS_RADAR_CHART_RADIUS,
  SOLARIS_RADAR_CHART_WIDTH,
  buildRadarFrame,
  clampRadarPercent,
  easeOutRadar,
  radarAnchorPoint,
  radarEnterProgress,
  radarEnterTotalMs,
  radarPolygonPath,
  radarSeriesFill,
  radarTooltipSide,
  radarVertexPoint,
  resolveRadarMax,
  visibleRadarSeries,
} from '../model/chart-radar.utils';
import type { SolarisRadarSeries } from '../model/chart-radar.types';

const AXES = ['Reading', 'Writing', 'Math', 'Science', 'Social'];
const SERIES: readonly SolarisRadarSeries[] = [
  { id: 'a', label: 'Class A', values: [8.5, 7, 9, 6.5, 8] },
  { id: 'b', label: 'Class B', values: [7, 8, 6, 8.5, null] },
];

describe('chart-radar.utils', () => {
  it('resolves the max from the peak plottable value', () => {
    expect(resolveRadarMax(SERIES)).toBe(9);
  });

  it('honors an explicit positive max and ignores invalid ones', () => {
    expect(resolveRadarMax(SERIES, 10)).toBe(10);
    expect(resolveRadarMax(SERIES, 0)).toBe(9);
    expect(resolveRadarMax(SERIES, Number.NaN)).toBe(9);
  });

  it('falls back to 1 with no plottable data', () => {
    expect(resolveRadarMax([{ id: 'x', label: 'X', values: [null, -1] }])).toBe(
      1,
    );
    expect(resolveRadarMax([])).toBe(1);
  });

  it('excludes prop-hidden series from the visible set', () => {
    const hidden: SolarisRadarSeries = {
      id: 'c',
      label: 'C',
      values: [5, 5, 5, 5, 5],
      hidden: true,
    };
    expect(visibleRadarSeries([...SERIES, hidden])).toHaveLength(2);
  });

  it('places the first axis at the top of the web', () => {
    const point = radarVertexPoint(160, 150, 104, 1, 0, 5);
    expect(point.x).toBe(160);
    expect(point.y).toBe(46);
  });

  it('clamps fractions into the web', () => {
    const center = radarVertexPoint(160, 150, 104, 2, 1, 5);
    const distance = Math.hypot(center.x - 160, center.y - 150);
    expect(distance).toBeLessThanOrEqual(104.01);
    expect(radarVertexPoint(160, 150, 104, -1, 1, 5)).toEqual({
      x: 160,
      y: 150,
    });
  });

  it('builds closed polygon paths and an empty path for no points', () => {
    expect(
      radarPolygonPath([
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ]),
    ).toBe('M 1 2 L 3 4 Z');
    expect(radarPolygonPath([])).toBe('');
  });

  it('washes polygons with the series token over transparent', () => {
    expect(radarSeriesFill('var(--solaris-primary-solid)')).toBe(
      'color-mix(in srgb, var(--solaris-primary-solid) 22%, transparent)',
    );
  });

  it('builds a frame with rings, axes and one geometry per series', () => {
    const frame = buildRadarFrame(AXES, SERIES, { max: 10 });
    expect(frame.width).toBe(SOLARIS_RADAR_CHART_WIDTH);
    expect(frame.height).toBe(SOLARIS_RADAR_CHART_HEIGHT);
    expect(frame.max).toBe(10);
    expect(frame.rings).toHaveLength(SOLARIS_RADAR_CHART_LEVELS);
    expect(frame.rings[0]).toHaveLength(5);
    expect(frame.axisEnds).toHaveLength(5);
    expect(frame.series).toHaveLength(2);
    expect(frame.series[0]?.fractions[2]).toBe(0.9);
    expect(frame.series[1]?.fractions[4]).toBe(0);
    expect(frame.series[0]?.path.startsWith('M ')).toBe(true);
    expect(frame.series[0]?.path.endsWith(' Z')).toBe(true);
  });

  it('treats missing entries as center points', () => {
    const frame = buildRadarFrame(AXES, SERIES, { max: 10 });
    const missing = frame.series[1]?.vertices[4];
    expect(missing?.value).toBeNull();
    expect(missing?.x).toBe(frame.centerX);
    expect(missing?.y).toBe(frame.centerY);
  });

  it('respects custom ring levels and falls back on invalid input', () => {
    expect(buildRadarFrame(AXES, SERIES, { levels: 2 }).rings).toHaveLength(2);
    expect(
      buildRadarFrame(AXES, SERIES, { levels: Number.NaN }).rings,
    ).toHaveLength(SOLARIS_RADAR_CHART_LEVELS);
  });

  it('returns an empty web with fewer than three axes', () => {
    const frame = buildRadarFrame(['a', 'b'], SERIES);
    expect(frame.series).toHaveLength(0);
    expect(frame.rings).toHaveLength(0);
    expect(frame.axisEnds).toHaveLength(0);
  });

  it('anchors tooltips outward from the web center', () => {
    const anchor = radarAnchorPoint({ x: 264, y: 150 }, { x: 160, y: 150 }, 14);
    expect(anchor.x).toBeGreaterThan(264);
    expect(anchor.y).toBe(150);
  });

  it('pushes center vertices upward when there is no direction', () => {
    expect(
      radarAnchorPoint({ x: 160, y: 150 }, { x: 160, y: 150 }, 14),
    ).toEqual({ x: 160, y: 136 });
  });

  it('eases enter progress with a per-series stagger', () => {
    expect(easeOutRadar(0)).toBe(0);
    expect(easeOutRadar(1)).toBe(1);
    expect(radarEnterProgress(0, 0)).toBe(0);
    expect(radarEnterProgress(0, 1)).toBe(0);
    expect(radarEnterTotalMs(2)).toBe(600);
    expect(radarEnterTotalMs(0)).toBe(0);
  });

  it('docks the tooltip outside the hovered vertex', () => {
    expect(radarTooltipSide(0, 5)).toBe('top');
    expect(radarTooltipSide(1, 5)).toBe('right');
    expect(radarTooltipSide(2, 5)).toBe('bottom');
    expect(radarTooltipSide(3, 5)).toBe('bottom');
    expect(radarTooltipSide(4, 5)).toBe('left');
  });

  it('clamps tooltip percents inside the canvas', () => {
    expect(clampRadarPercent(2)).toBe(14);
    expect(clampRadarPercent(97)).toBe(86);
    expect(clampRadarPercent(Number.NaN)).toBe(50);
  });

  it('keeps the radius constant on every axis', () => {
    const frame = buildRadarFrame(AXES, SERIES, { max: 10 });
    for (const end of frame.axisEnds) {
      const distance = Math.hypot(end.x - frame.centerX, end.y - frame.centerY);
      expect(distance).toBeCloseTo(SOLARIS_RADAR_CHART_RADIUS, 1);
    }
  });
});
