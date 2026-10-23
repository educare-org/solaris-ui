export interface SparklinePropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export const PROP_ROWS: readonly SparklinePropRow[] = [
  {
    prop: 'points',
    type: 'readonly (number | null | undefined)[]',
    values: '—',
    default: 'required',
  },
  {
    prop: 'interpolation',
    type: 'SolarisChartInterpolation',
    values: 'smooth | linear | step',
    default: 'smooth',
  },
  {
    prop: 'positiveIsGood',
    type: 'boolean',
    values: 'true | false',
    default: 'true',
  },
  {
    prop: 'ariaLabel',
    type: 'string',
    values: '—',
    default: 'required',
  },
  {
    prop: 'appearance',
    type: 'SolarisSparklineAppearance',
    values: 'plain | card',
    default: 'plain',
  },
  {
    prop: 'title',
    type: 'string',
    values: '—',
    default: '— (card only)',
  },
  {
    prop: 'value',
    type: 'string',
    values: '—',
    default: '— (card only)',
  },
  {
    prop: 'delta',
    type: 'string',
    values: '—',
    default: '— (card only)',
  },
  {
    prop: 'deltaDirection',
    type: 'SolarisSparklineDeltaDirection',
    values: 'up | down | flat',
    default: 'data trend',
  },
  {
    prop: 'size',
    type: 'SolarisSparklineSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisSparklineDensity',
    values: 'compact | normal | comfortable',
    default: 'normal',
  },
];
