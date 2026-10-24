export interface PieChartPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export const PROP_ROWS: readonly PieChartPropRow[] = [
  {
    prop: 'series',
    type: 'SolarisChartSeries[]',
    values: '—',
    default: '[] (slices)',
  },
  {
    prop: 'slices',
    type: 'SolarisChartSlice[]',
    values: '{ id, label, value }[]',
    default: 'sums of series',
  },
  { prop: 'locale', type: 'string', values: 'BCP-47', default: 'required' },
  {
    prop: 'variant',
    type: 'SolarisPieChartVariant',
    values: 'pie | donut | gauge',
    default: 'pie',
  },
  { prop: 'centerValue', type: 'string', values: '—', default: 'total' },
  {
    prop: 'centerLabel',
    type: 'string',
    values: '—',
    default: 'solaris.chart.total',
  },
  {
    prop: 'minSlicePercent',
    type: 'number',
    values: 'percent ≥ 0',
    default: '2',
  },
  {
    prop: 'showValues',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  { prop: 'gaugeMin', type: 'number', values: '—', default: '0' },
  { prop: 'gaugeMax', type: 'number', values: '—', default: '100' },
  { prop: 'gaugeTarget', type: 'number', values: '—', default: '—' },
  {
    prop: 'valueFormat',
    type: '(value: number) => string',
    values: '—',
    default: 'compact Intl',
  },
  {
    prop: 'size',
    type: 'SolarisPieChartSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisPieChartDensity',
    values: 'compact | normal | comfortable',
    default: 'theme',
  },
  {
    prop: 'ariaLabel | ariaLabelKey',
    type: 'string',
    values: '—',
    default: 'synthesized summary',
  },
];
