import type { SolarisChartPeriod } from '@solaris-ui/angular';

export const WEEK_POINTS: Readonly<
  Record<string, readonly { x: number; y: number }[]>
> = {
  automation: [
    { x: 28, y: 180 },
    { x: 29, y: 210 },
    { x: 30, y: 150 },
    { x: 1, y: 190 },
    { x: 2, y: 205 },
    { x: 3, y: 175 },
    { x: 4, y: 220 },
  ],
  queries: [
    { x: 28, y: 60 },
    { x: 29, y: 90 },
    { x: 30, y: 120 },
    { x: 1, y: 80 },
    { x: 2, y: 95 },
    { x: 3, y: 70 },
    { x: 4, y: 110 },
  ],
  system: [
    { x: 28, y: 40 },
    { x: 29, y: 45 },
    { x: 30, y: 50 },
    { x: 1, y: 42 },
    { x: 2, y: 48 },
    { x: 3, y: 44 },
    { x: 4, y: 52 },
  ],
};

export const WEEK_SUBTITLES: readonly string[] = [
  '28 de abr. de 2026',
  '29 de abr. de 2026',
  '30 de abr. de 2026',
  '1 de mai. de 2026',
  '2 de mai. de 2026',
  '3 de mai. de 2026',
  '4 de mai. de 2026',
];

export function buildMonthValues(
  base: number,
  step: number,
  wobble: number,
  days = 30,
): readonly number[] {
  return Array.from({ length: days }, (_, index) =>
    Math.round(
      base +
        step * index +
        wobble * Math.sin(index * 1.7) +
        wobble * 0.4 * Math.cos(index * 0.6),
    ),
  );
}

export const MONTH_VALUES = {
  automation: buildMonthValues(820, 36, 90),
  queries: buildMonthValues(410, 17, 45),
  system: buildMonthValues(180, 8, 20),
} as const;

export const MONTH_SUBTITLES: readonly string[] = Array.from(
  { length: 30 },
  (_, index) => `${index + 1} de abr. de 2026`,
);

export interface ChartShellPeriodDataset {
  readonly xs: readonly (string | number)[];
  readonly xLabels?: readonly string[];
  readonly tooltipSubtitle?: string | readonly string[];
  readonly values: Readonly<
    Record<'automation' | 'queries' | 'system', readonly number[]>
  >;
  readonly reference: number;
}

export const PERIOD_DATASETS: Readonly<
  Record<SolarisChartPeriod, ChartShellPeriodDataset>
> = {
  day: {
    xs: ['8h', '10h', '12h', '14h', '16h', '18h'],
    tooltipSubtitle: '4 de mai. de 2026',
    values: {
      automation: [38, 52, 47, 61, 55, 68],
      queries: [15, 22, 18, 26, 21, 29],
      system: [7, 9, 8, 11, 10, 12],
    },
    reference: 40,
  },
  week: {
    xs: [28, 29, 30, 1, 2, 3, 4],
    xLabels: ['28', '29', '30', '01', '02', '03', '04'],
    tooltipSubtitle: WEEK_SUBTITLES,
    values: {
      automation: WEEK_POINTS['automation'].map((point) => point.y),
      queries: WEEK_POINTS['queries'].map((point) => point.y),
      system: WEEK_POINTS['system'].map((point) => point.y),
    },
    reference: 120,
  },
  month: {
    xs: Array.from({ length: 30 }, (_, index) => index + 1),
    tooltipSubtitle: MONTH_SUBTITLES,
    values: {
      automation: MONTH_VALUES.automation,
      queries: MONTH_VALUES.queries,
      system: MONTH_VALUES.system,
    },
    reference: 1500,
  },
  quarter: {
    xs: [
      'S1',
      'S2',
      'S3',
      'S4',
      'S5',
      'S6',
      'S7',
      'S8',
      'S9',
      'S10',
      'S11',
      'S12',
    ],
    tooltipSubtitle: 'ago. → out. de 2026',
    values: {
      automation: [
        2100, 2380, 2260, 2510, 2740, 2690, 2930, 3110, 3280, 3440, 3610, 3850,
      ],
      queries: [
        1050, 1190, 1130, 1260, 1370, 1340, 1470, 1560, 1640, 1720, 1810, 1930,
      ],
      system: [380, 430, 410, 460, 500, 490, 540, 570, 600, 630, 660, 720],
    },
    reference: 3200,
  },
  year: {
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    tooltipSubtitle: 'jan. → out. de 2026',
    xLabels: [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
    ],
    values: {
      automation: [
        9200, 10400, 11800, 11200, 13100, 14500, 15900, 15200, 17100, 18600,
      ],
      queries: [4600, 5200, 5900, 5600, 6550, 7250, 7950, 7600, 8550, 9300],
      system: [1650, 1860, 2100, 2000, 2340, 2590, 2830, 2710, 3050, 3320],
    },
    reference: 14000,
  },
  all: {
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tooltipSubtitle: '2026',
    xLabels: [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ],
    values: {
      automation: [
        8800, 9600, 11200, 12400, 13900, 15200, 16800, 18100, 19700, 21300,
        23100, 25400,
      ],
      queries: [
        4400, 4800, 5600, 6200, 6950, 7600, 8400, 9050, 9850, 10650, 11550,
        12700,
      ],
      system: [
        1580, 1730, 2010, 2230, 2500, 2730, 3020, 3260, 3540, 3830, 4140, 4570,
      ],
    },
    reference: 19000,
  },
};

export const SERIES_LABEL_KEYS = {
  automation: 'chart-shell-view.examples.seriesAutomation',
  queries: 'chart-shell-view.examples.seriesQueries',
  system: 'chart-shell-view.examples.seriesSystem',
} as const;

export const PERIOD_INTERVAL_KEYS: Readonly<
  Record<SolarisChartPeriod, string>
> = {
  day: 'chart-shell-view.examples.intervalDay',
  week: 'chart-shell-view.examples.intervalWeek',
  month: 'chart-shell-view.examples.intervalMonth',
  quarter: 'chart-shell-view.examples.intervalQuarter',
  year: 'chart-shell-view.examples.intervalYear',
  all: 'chart-shell-view.examples.intervalAll',
};
