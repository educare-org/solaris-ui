import {
  SOLARIS_HEATMAP_CELL_SIZE,
  SOLARIS_HEATMAP_GAP,
  SOLARIS_HEATMAP_HEADER_HEIGHT,
  buildHeatmapFrame,
  clampHeatmapPercent,
  heatmapAnchorPoint,
  heatmapCellFill,
  heatmapCellKey,
  heatmapEnterDelayMs,
  heatmapFillMix,
  heatmapIntensity,
  heatmapTooltipSide,
  resolveHeatmapMax,
  sameMark,
} from '../model/chart-heatmap.utils';
import type { SolarisHeatmapRow } from '../model/chart-heatmap.types';

const ROWS: readonly SolarisHeatmapRow[] = [
  { id: 'mon', label: 'Mon', values: [50, 100, null] },
  { id: 'tue', label: 'Tue', values: [25, 75, 0] },
];
const COLUMNS = ['7h', '8h', '9h'];

describe('chart-heatmap.utils', () => {
  it('resolves the max from the peak plottable value', () => {
    expect(resolveHeatmapMax(ROWS)).toBe(100);
  });

  it('honors an explicit positive max and ignores invalid ones', () => {
    expect(resolveHeatmapMax(ROWS, 40)).toBe(40);
    expect(resolveHeatmapMax(ROWS, 0)).toBe(100);
    expect(resolveHeatmapMax(ROWS, Number.NaN)).toBe(100);
  });

  it('falls back to 1 with no plottable data', () => {
    expect(
      resolveHeatmapMax([{ id: 'x', label: 'X', values: [null, null] }]),
    ).toBe(1);
    expect(resolveHeatmapMax([])).toBe(1);
  });

  it('scales intensity against the max and clamps out-of-range input', () => {
    expect(heatmapIntensity(50, 100)).toBe(0.5);
    expect(heatmapIntensity(0, 100)).toBe(0);
    expect(heatmapIntensity(null, 100)).toBe(0);
    expect(heatmapIntensity(200, 100)).toBe(1);
    expect(heatmapIntensity(-5, 100)).toBe(0);
    expect(heatmapIntensity(50, 0)).toBe(0);
  });

  it('maps intensity to a fill mix inside the readable range', () => {
    expect(heatmapFillMix(0)).toBe(8);
    expect(heatmapFillMix(1)).toBe(92);
    expect(heatmapFillMix(0.5)).toBe(50);
    expect(heatmapFillMix(-1)).toBe(8);
    expect(heatmapFillMix(2)).toBe(92);
  });

  it('fills empty cells with the neutral subtle token', () => {
    expect(heatmapCellFill(null, 100)).toBe('var(--solaris-neutral-subtle)');
    expect(heatmapCellFill(-3, 100)).toBe('var(--solaris-neutral-subtle)');
  });

  it('mixes the primary token over the neutral surface for values', () => {
    expect(heatmapCellFill(100, 100)).toBe(
      'color-mix(in srgb, var(--solaris-primary-solid) 92%, var(--solaris-neutral-default))',
    );
    expect(heatmapCellFill(0, 100)).toBe(
      'color-mix(in srgb, var(--solaris-primary-solid) 8%, var(--solaris-neutral-default))',
    );
  });

  it('builds a frame with one cell per row and column', () => {
    const frame = buildHeatmapFrame(ROWS, COLUMNS);
    expect(frame.rowCount).toBe(2);
    expect(frame.columnCount).toBe(3);
    expect(frame.cells).toHaveLength(6);
    expect(frame.max).toBe(100);
    expect(frame.width).toBe(
      SOLARIS_HEATMAP_GAP +
        3 * (SOLARIS_HEATMAP_CELL_SIZE + SOLARIS_HEATMAP_GAP),
    );
    expect(frame.height).toBe(
      SOLARIS_HEATMAP_HEADER_HEIGHT +
        SOLARIS_HEATMAP_GAP +
        2 * (SOLARIS_HEATMAP_CELL_SIZE + SOLARIS_HEATMAP_GAP),
    );
  });

  it('keeps cell geometry aligned to the grid', () => {
    const frame = buildHeatmapFrame(ROWS, COLUMNS);
    const first = frame.cells[0];
    expect(first?.x).toBe(SOLARIS_HEATMAP_GAP);
    expect(first?.y).toBe(SOLARIS_HEATMAP_HEADER_HEIGHT + SOLARIS_HEATMAP_GAP);
    expect(first?.width).toBe(SOLARIS_HEATMAP_CELL_SIZE);
    expect(first?.intensity).toBe(0.5);
    expect(first?.fillMix).toBe(50);
  });

  it('treats missing and negative entries as empty cells', () => {
    const frame = buildHeatmapFrame(
      [{ id: 'x', label: 'X', values: [10] }],
      ['a', 'b'],
    );
    expect(frame.cells[1]?.value).toBeNull();
    const negative = buildHeatmapFrame(
      [{ id: 'x', label: 'X', values: [-4] }],
      ['a'],
    );
    expect(negative.cells[0]?.value).toBeNull();
    expect(negative.cells[0]?.intensity).toBe(0);
  });

  it('returns an empty frame with no rows or columns', () => {
    expect(buildHeatmapFrame([], COLUMNS).cells).toHaveLength(0);
    expect(buildHeatmapFrame(ROWS, []).cells).toHaveLength(0);
  });

  it('never mutates the consumer rows', () => {
    const frozen = ROWS.map((row) => Object.freeze({ ...row }));
    Object.freeze(frozen);
    buildHeatmapFrame(frozen, COLUMNS);
    expect(frozen[0]?.values).toEqual([50, 100, null]);
  });

  it('keys cells by row and column', () => {
    expect(heatmapCellKey('mon', 2)).toBe('mon:2');
  });

  it('staggers enter delays and caps the tail', () => {
    expect(heatmapEnterDelayMs(0)).toBe(0);
    expect(heatmapEnterDelayMs(3)).toBe(54);
    expect(heatmapEnterDelayMs(1000)).toBe(540);
    expect(heatmapEnterDelayMs(Number.NaN)).toBe(0);
  });

  it('anchors tooltips inside the cell edge toward the grid center', () => {
    const frameCenter = { x: 100, y: 100 };
    const right = heatmapAnchorPoint(
      { x: 120, y: 80, width: 32, height: 32 },
      frameCenter,
    );
    expect(right.side).toBe('left');
    expect(right).toEqual({ x: 112, y: 96, side: 'left' });
    const top = heatmapAnchorPoint(
      { x: 84, y: 20, width: 32, height: 32 },
      frameCenter,
    );
    expect(top.side).toBe('bottom');
    expect(top).toEqual({ x: 100, y: 60, side: 'bottom' });
    const left = heatmapAnchorPoint(
      { x: 20, y: 80, width: 32, height: 32 },
      frameCenter,
    );
    expect(left.side).toBe('right');
    expect(left).toEqual({ x: 60, y: 96, side: 'right' });
    const bottom = heatmapAnchorPoint(
      { x: 84, y: 140, width: 32, height: 32 },
      frameCenter,
    );
    expect(bottom.side).toBe('top');
    expect(bottom).toEqual({ x: 100, y: 132, side: 'top' });
  });

  it('docks the tooltip toward the grid center to stay inside the canvas', () => {
    const center = { x: 100, y: 100 };
    expect(heatmapTooltipSide({ x: 160, y: 100 }, center)).toBe('left');
    expect(heatmapTooltipSide({ x: 40, y: 100 }, center)).toBe('right');
    expect(heatmapTooltipSide({ x: 100, y: 160 }, center)).toBe('top');
    expect(heatmapTooltipSide({ x: 100, y: 40 }, center)).toBe('bottom');
    expect(heatmapTooltipSide({ x: 100, y: 100 }, center)).toBe('top');
  });

  it('clamps tooltip percents inside the canvas', () => {
    expect(clampHeatmapPercent(2)).toBe(14);
    expect(clampHeatmapPercent(97)).toBe(86);
    expect(clampHeatmapPercent(Number.NaN)).toBe(50);
  });

  describe('sameMark', () => {
    it('returns true for null/null', () => {
      expect(sameMark(null, null)).toBe(true);
    });

    it('returns false for null/mark', () => {
      expect(sameMark(null, { rowId: 'mon', columnIndex: 0 })).toBe(false);
    });

    it('returns false for mark/null', () => {
      expect(sameMark({ rowId: 'mon', columnIndex: 0 }, null)).toBe(false);
    });

    it('returns true for equal marks', () => {
      expect(
        sameMark(
          { rowId: 'mon', columnIndex: 1 },
          { rowId: 'mon', columnIndex: 1 },
        ),
      ).toBe(true);
    });

    it('returns false for a different row', () => {
      expect(
        sameMark(
          { rowId: 'mon', columnIndex: 1 },
          { rowId: 'tue', columnIndex: 1 },
        ),
      ).toBe(false);
    });

    it('returns false for a different column', () => {
      expect(
        sameMark(
          { rowId: 'mon', columnIndex: 0 },
          { rowId: 'mon', columnIndex: 1 },
        ),
      ).toBe(false);
    });
  });
});
