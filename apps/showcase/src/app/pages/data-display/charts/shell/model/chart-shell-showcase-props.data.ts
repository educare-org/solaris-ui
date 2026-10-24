export interface ChartShellPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export const PROP_ROWS: readonly ChartShellPropRow[] = [
  { prop: 'title', type: 'string', values: '—', default: 'undefined' },
  {
    prop: 'heroValue',
    type: 'string',
    values: '—',
    default: 'undefined',
  },
  {
    prop: 'heroLabel',
    type: 'string',
    values: '—',
    default: 'undefined',
  },
  {
    prop: 'heroDelta',
    type: 'string',
    values: '—',
    default: 'undefined',
  },
  {
    prop: 'heroDeltaDirection',
    type: "'up' | 'down' | 'flat'",
    values: 'up | down | flat',
    default: 'undefined',
  },
  {
    prop: 'intervalLabel',
    type: 'string',
    values: '—',
    default: 'undefined',
  },
  {
    prop: 'series',
    type: 'SolarisChartSeries[]',
    values: '{ id, label, points, hidden? }[]',
    default: 'required',
  },
  {
    prop: 'view',
    type: 'SolarisChartView',
    values: 'line | bar | pie',
    default: "'line'",
  },
  {
    prop: 'period',
    type: 'SolarisChartPeriod',
    values: 'day | week | month | quarter | year | all',
    default: "'week'",
  },
  {
    prop: 'displayMode',
    type: 'SolarisChartDisplayMode',
    values: 'timeline | list',
    default: "'timeline'",
  },
  {
    prop: 'availablePeriods',
    type: 'SolarisChartShellPeriodOption[]',
    values: '{ value, label? }[]',
    default: 'all periods',
  },
  {
    prop: 'loading',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  { prop: 'error', type: 'string', values: '—', default: 'undefined' },
  { prop: 'locale', type: 'string', values: 'BCP-47', default: 'required' },
  {
    prop: 'size',
    type: 'SolarisChartShellSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisChartShellDensity',
    values: 'compact | normal | comfortable',
    default: 'theme',
  },
  {
    prop: 'seriesToggle',
    type: 'output<string>',
    values: 'series id',
    default: '—',
  },
  {
    prop: 'actionRequest | retry | viewChange | periodChange | displayModeChange',
    type: 'output',
    values: '—',
    default: '—',
  },
];
