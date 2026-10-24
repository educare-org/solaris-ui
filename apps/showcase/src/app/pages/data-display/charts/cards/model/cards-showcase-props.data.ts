export interface ChartCardPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export const PROP_ROWS: readonly ChartCardPropRow[] = [
  {
    prop: 'solaris-card-header',
    type: 'slot (SolarisCardHeaderDirective)',
    values: 'title + description + optional interval',
    default: 'required per recipe',
  },
  {
    prop: 'solaris-card-content',
    type: 'slot (SolarisCardContentDirective)',
    values: 'sparkline | bar/line/heatmap/radar + optional totals table',
    default: 'required per recipe',
  },
  {
    prop: 'totals table',
    type: 'native <table> (caption + th scope)',
    values: 'mirrors the projected series',
    default: 'recommended (a11y + print)',
  },
  {
    prop: 'solaris-chart-shell',
    type: 'alternative wrapper',
    values: 'use when view/period/legend switching is needed',
    default: 'prefer shell over free card then',
  },
];
