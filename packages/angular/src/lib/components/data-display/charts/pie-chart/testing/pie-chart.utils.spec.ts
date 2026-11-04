import {
  clampPercent,
  nextSolarisPieChartInstanceId,
} from '../functions/pie-chart.utils';

describe('pie-chart.utils', () => {
  it('clamps tooltip anchor percentages inside the frame', () => {
    expect(clampPercent(Number.NaN)).toBe(50);
    expect(clampPercent(0)).toBe(14);
    expect(clampPercent(100)).toBe(86);
    expect(clampPercent(50)).toBe(50);
  });

  it('issues strictly increasing instance ids', () => {
    const first = nextSolarisPieChartInstanceId();
    const second = nextSolarisPieChartInstanceId();
    expect(second).toBeGreaterThan(first);
  });
});
