export const HEATMAP_DAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri'] as const;

export type HeatmapDayId = (typeof HEATMAP_DAY_IDS)[number];

export const HEATMAP_SLOTS = ['7h', '8h', '9h', '10h', '11h', '12h'] as const;

export const HEATMAP_VALUES: Readonly<
  Record<HeatmapDayId, readonly (number | null)[]>
> = {
  mon: [92, 95, 88, 90, 84, null],
  tue: [90, 93, 91, 87, 82, null],
  wed: [88, 90, 85, 89, 80, null],
  thu: [94, 96, 92, 91, 86, null],
  fri: [85, 88, 80, 76, 70, null],
};

export const HEATMAP_SCALE_CLASS_IDS = [
  'classA',
  'classB',
  'classC',
  'classD',
  'classE',
  'classF',
] as const;

export type HeatmapScaleClassId = (typeof HEATMAP_SCALE_CLASS_IDS)[number];

export const HEATMAP_SCALE_COLUMNS = [
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'S8',
] as const;

export const HEATMAP_SCALE_VALUES: Readonly<
  Record<HeatmapScaleClassId, readonly (number | null)[]>
> = {
  classA: [96, 12, 74, 62, 5, 83, 70, null],
  classB: [8, 93, 66, 15, 85, 59, 94, 72],
  classC: [69, 3, 88, 95, 63, 20, 71, 86],
  classD: [58, 66, 10, 81, 90, 97, 64, null],
  classE: [84, 79, 92, 68, 76, 18, 99, 61],
  classF: [72, 89, 60, 94, 67, 78, 6, 93],
};
