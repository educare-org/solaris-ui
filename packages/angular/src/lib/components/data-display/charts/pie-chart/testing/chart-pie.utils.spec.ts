import {
  SOLARIS_GAUGE_CHART_HEIGHT,
  SOLARIS_GAUGE_CHART_WIDTH,
  buildGaugeGeometry,
  buildPieChartFrame,
  easeOutCubic,
  gaugeAnchorPoint,
  gaugeArcPath,
  gaugeTargetTick,
  pieEnterTotalMs,
  pieSliceAnchorPoint,
  pieSliceEnterProgress,
  pieSliceLabelPosition,
  pieSlicePath,
  pieTooltipSide,
  seriesToPieSlices,
} from '../model/chart-pie.utils';

const SLICES = [
  { id: 'a', label: 'A', value: 50 },
  { id: 'b', label: 'B', value: 30 },
  { id: 'c', label: 'C', value: 20 },
];

describe('chart-pie.utils', () => {
  it('splits 360 degrees across slices starting at the top', () => {
    const frame = buildPieChartFrame(SLICES);
    expect(frame.slices).toHaveLength(3);
    expect(frame.slices[0].startAngle).toBe(0);
    expect(frame.slices[0].endAngle).toBeCloseTo(180, 5);
    expect(frame.slices[2].endAngle).toBeCloseTo(360, 5);
    expect(frame.total).toBe(100);
  });

  it('shares one path structure between pie and donut for d morphing', () => {
    const pie = buildPieChartFrame(SLICES);
    const donut = buildPieChartFrame(SLICES, { innerRatio: 0.62 });
    expect(donut.innerRadius).toBeGreaterThan(0);
    expect(pie.innerRadius).toBe(0);
    const commands = (d: string): string => d.replace(/[^MLAZ]/g, '');
    for (const slice of pie.slices) {
      expect(commands(slice.path)).toBe('MALAZ');
    }
    for (const slice of donut.slices) {
      expect(commands(slice.path)).toBe('MALAZ');
    }
  });

  it('renders a full ring for a single 100% donut slice', () => {
    const frame = buildPieChartFrame(
      [{ id: 'only', label: 'Only', value: 10 }],
      {
        innerRatio: 0.62,
      },
    );
    expect(frame.slices).toHaveLength(1);
    expect(frame.slices[0].path).toContain('A ');
    expect(frame.slices[0].percent).toBe(100);
  });

  it('returns an empty frame when the total is not positive', () => {
    expect(buildPieChartFrame([]).slices).toHaveLength(0);
    expect(buildPieChartFrame([{ id: 'z', label: 'Z', value: 0 }]).total).toBe(
      0,
    );
    expect(
      buildPieChartFrame([{ id: 'n', label: 'N', value: -5 }]).slices,
    ).toHaveLength(0);
  });

  it('clamps negative slice values at zero', () => {
    const frame = buildPieChartFrame([
      { id: 'a', label: 'A', value: 10 },
      { id: 'b', label: 'B', value: -4 },
    ]);
    expect(frame.total).toBe(10);
    expect(frame.slices).toHaveLength(2);
    expect(frame.slices[1].fraction).toBe(0);
  });

  it('falls back to default size on invalid sizes without mutating input', () => {
    const frozen = Object.freeze(
      SLICES.map((slice) => Object.freeze({ ...slice })),
    );
    const snapshot = JSON.stringify(frozen);
    const frame = buildPieChartFrame(frozen, { width: -2, height: NaN });
    expect(frame.width).toBe(320);
    expect(frame.height).toBe(260);
    expect(JSON.stringify(frozen)).toBe(snapshot);
  });

  it('emits an empty path for degenerate slices', () => {
    expect(pieSlicePath(160, 130, 100, 0, 40, 40)).toBe('');
    expect(pieSlicePath(160, 130, 0, 0, 0, 90)).toBe('');
    expect(pieSlicePath(160, 130, 100, 0, 90, 40)).toBe('');
  });

  it('draws gauge arcs left to right with clamped fractions', () => {
    const track = gaugeArcPath(160, 180, 124, 0, 1);
    expect(track.startsWith('M ')).toBe(true);
    expect(track).toContain('A 124 124');
    const half = gaugeArcPath(160, 180, 124, 0, 0.5);
    expect(half).not.toBe(track);
    expect(half.length).toBeGreaterThan(0);
    expect(gaugeArcPath(160, 180, 124, 0.5, 0.5)).toBe('');
    expect(gaugeArcPath(160, 180, 0, 0, 1)).toBe('');
    expect(gaugeArcPath(160, 180, 124, -2, 99)).toBe(track);
  });

  it('builds gauge geometry with min, max and an optional target', () => {
    const gauge = buildGaugeGeometry(87, 0, 100, 90);
    expect(gauge.fraction).toBeCloseTo(0.87, 5);
    expect(gauge.targetFraction).toBeCloseTo(0.9, 5);
    expect(gauge.targetAngle).toBeCloseTo(432, 5);
    expect(gauge.trackPath.length).toBeGreaterThan(0);
    expect(gauge.valuePath.length).toBeGreaterThan(0);
    expect(gauge.valuePath).not.toBe(gauge.trackPath);
  });

  it('clamps gauge values and repairs inverted bounds', () => {
    const over = buildGaugeGeometry(250, 0, 100, 120);
    expect(over.value).toBe(100);
    expect(over.target).toBe(100);
    const under = buildGaugeGeometry(-5, 0, 100, null);
    expect(under.value).toBe(0);
    expect(under.target).toBeNull();
    expect(under.targetAngle).toBeNull();
    const repaired = buildGaugeGeometry(5, 10, 10, undefined);
    expect(repaired.max).toBe(11);
    const nan = buildGaugeGeometry(Number.NaN, 0, 100, undefined);
    expect(nan.value).toBe(0);
  });

  it('sizes the gauge canvas from shared constants', () => {
    expect(SOLARIS_GAUGE_CHART_WIDTH).toBe(320);
    expect(SOLARIS_GAUGE_CHART_HEIGHT).toBe(196);
  });

  it('places the target tick across the arc radius', () => {
    const tick = gaugeTargetTick(160, 180, 124, 90);
    expect(tick.y1).toBeCloseTo(180, 5);
    expect(tick.y2).toBeCloseTo(180, 5);
    expect(tick.x1).toBeLessThan(tick.x2);
    expect(tick.x2 - tick.x1).toBeCloseTo(20, 5);
  });

  it('centers value labels inside donut bands and pie wedges', () => {
    const donut = pieSliceLabelPosition(160, 130, 104, 64, 0, 180);
    const pie = pieSliceLabelPosition(160, 130, 104, 0, 0, 180);
    expect(donut.x).toBeCloseTo(160 + 84, 1);
    expect(pie.x).toBeCloseTo(160 + 104 * 0.68, 0);
  });

  it('sums one slice per series for shell projections', () => {
    const slices = seriesToPieSlices([
      {
        id: 'automation',
        label: 'Automation',
        points: [
          { x: 'Mon', y: 10 },
          { x: 'Tue', y: null },
          { x: 'Wed', y: 20 },
        ],
      },
      {
        id: 'void',
        label: 'Void',
        points: [{ x: 'Mon', y: -8 }],
      },
    ]);
    expect(slices).toEqual([
      { id: 'automation', label: 'Automation', value: 30 },
      { id: 'void', label: 'Void', value: 0 },
    ]);
  });

  it('eases the enter interpolation between zero and one', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 5);
    expect(easeOutCubic(-2)).toBe(0);
    expect(easeOutCubic(99)).toBe(1);
  });

  it('staggers one slice reveal per position', () => {
    expect(pieSliceEnterProgress(0, 0)).toBe(0);
    expect(pieSliceEnterProgress(400, 0)).toBe(1);
    expect(pieSliceEnterProgress(70, 1)).toBe(0);
    expect(pieSliceEnterProgress(470, 1)).toBe(1);
    expect(pieSliceEnterProgress(200, 1)).toBeCloseTo(easeOutCubic(0.325), 5);
    expect(pieSliceEnterProgress(10000, 3)).toBe(1);
  });

  it('totals the enter run from the slice count', () => {
    expect(pieEnterTotalMs(0)).toBe(0);
    expect(pieEnterTotalMs(1)).toBe(400);
    expect(pieEnterTotalMs(4)).toBe(610);
    expect(pieEnterTotalMs(Number.NaN)).toBe(0);
  });

  it('anchors tooltips just outside the slice edge', () => {
    expect(pieSliceAnchorPoint(160, 130, 104, 0, 180)).toEqual({
      x: 278,
      y: 130,
    });
    expect(pieSliceAnchorPoint(160, 130, 104, 0, 360)).toEqual({
      x: 160,
      y: 248,
    });
    expect(pieSliceAnchorPoint(160, 130, 104, 0, 180, 0)).toEqual({
      x: 264,
      y: 130,
    });
    expect(pieSliceAnchorPoint(160, 130, -5, 0, 180)).toEqual({
      x: 174,
      y: 130,
    });
  });

  it('anchors gauge tooltips along the value angle', () => {
    expect(gaugeAnchorPoint(160, 180, 124, 0.5)).toEqual({ x: 160, y: 42 });
    expect(gaugeAnchorPoint(160, 180, 124, 0)).toEqual({ x: 22, y: 180 });
    expect(gaugeAnchorPoint(160, 180, 124, 1)).toEqual({ x: 298, y: 180 });
    expect(gaugeAnchorPoint(160, 180, 124, 9)).toEqual({ x: 298, y: 180 });
  });

  it('docks the tooltip on the outer side of the mid angle', () => {
    expect(pieTooltipSide(0)).toBe('top');
    expect(pieTooltipSide(44)).toBe('top');
    expect(pieTooltipSide(45)).toBe('right');
    expect(pieTooltipSide(90)).toBe('right');
    expect(pieTooltipSide(134)).toBe('right');
    expect(pieTooltipSide(135)).toBe('bottom');
    expect(pieTooltipSide(180)).toBe('bottom');
    expect(pieTooltipSide(224)).toBe('bottom');
    expect(pieTooltipSide(225)).toBe('left');
    expect(pieTooltipSide(270)).toBe('left');
    expect(pieTooltipSide(314)).toBe('left');
    expect(pieTooltipSide(315)).toBe('top');
    expect(pieTooltipSide(359)).toBe('top');
    expect(pieTooltipSide(-45)).toBe('top');
    expect(pieTooltipSide(405)).toBe('right');
  });
});
