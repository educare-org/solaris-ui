let solarisPieChartInstanceCount = 0;

export function nextSolarisPieChartInstanceId(): number {
  solarisPieChartInstanceCount += 1;
  return solarisPieChartInstanceCount;
}

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(86, Math.max(14, value));
}
