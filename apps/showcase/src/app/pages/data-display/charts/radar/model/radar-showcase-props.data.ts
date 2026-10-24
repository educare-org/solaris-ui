export interface RadarPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export const PROP_ROWS: readonly RadarPropRow[] = [
  {
    prop: 'axes',
    type: 'string[]',
    values: '≥ 3 labels',
    default: 'required',
  },
  {
    prop: 'series',
    type: 'SolarisRadarSeries[]',
    values: '{ id, label, color?, values, hidden? }[]',
    default: '[]',
  },
  { prop: 'locale', type: 'string', values: 'BCP-47', default: 'required' },
  { prop: 'max', type: 'number', values: 'peak > 0', default: 'data peak' },
  { prop: 'levels', type: 'number', values: 'rings ≥ 1', default: '4' },
  {
    prop: 'valueFormat',
    type: '(value: number) => string',
    values: '—',
    default: 'Intl (1 fraction)',
  },
  {
    prop: 'showVertices',
    type: 'boolean',
    values: 'true | false',
    default: 'true',
  },
  {
    prop: 'size',
    type: 'SolarisRadarSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisRadarDensity',
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
