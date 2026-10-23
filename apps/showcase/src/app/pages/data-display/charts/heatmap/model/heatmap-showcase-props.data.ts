export interface HeatmapPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export const PROP_ROWS: readonly HeatmapPropRow[] = [
  {
    prop: 'rows',
    type: 'SolarisHeatmapRow[]',
    values: '{ id, label, values }[]',
    default: 'required',
  },
  {
    prop: 'columns',
    type: 'string[]',
    values: '—',
    default: 'required',
  },
  { prop: 'locale', type: 'string', values: 'BCP-47', default: 'required' },
  { prop: 'max', type: 'number', values: 'peak > 0', default: 'data peak' },
  {
    prop: 'valueFormat',
    type: '(value: number) => string',
    values: '—',
    default: 'Intl (1 fraction)',
  },
  {
    prop: 'showScale',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'size',
    type: 'SolarisHeatmapSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisHeatmapDensity',
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
