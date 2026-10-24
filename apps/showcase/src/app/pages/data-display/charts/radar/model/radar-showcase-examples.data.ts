export const RADAR_AXIS_IDS = [
  'reading',
  'writing',
  'math',
  'science',
  'social',
] as const;

export type RadarAxisId = (typeof RADAR_AXIS_IDS)[number];

export const RADAR_SERIES_VALUES: Readonly<
  Record<string, readonly (number | null)[]>
> = {
  'class-a': [8.5, 7, 9, 6.5, 8],
  'class-b': [7, 8, 6, 8.5, 7.5],
};

export const RADAR_MANY_AXIS_IDS = [
  'reading',
  'writing',
  'math',
  'science',
  'social',
  'arts',
  'sports',
  'tech',
  'music',
  'english',
] as const;

export type RadarManyAxisId = (typeof RADAR_MANY_AXIS_IDS)[number];

export const RADAR_MANY_SERIES_VALUES: Readonly<
  Record<string, readonly (number | null)[]>
> = {
  'class-a': [8.5, 7, 9, 6.5, 8, 7.5, 6, 8, 7, 9],
  'class-b': [7, 8, 6, 8.5, 7.5, 6.5, 8, 7, 9, 6],
  'class-c': [9, 6.5, 8, 7, 9.5, 8, 7, 6.5, 8, 7.5],
  'class-d': [6, 9, 7.5, 8, 6.5, 9, 8.5, 7, 6, 8.5],
  'class-e': [8, 7.5, 9.5, 6, 7, 8.5, 9, 8, 7.5, 6.5],
  'class-f': [7.5, 8.5, 6.5, 9, 8, 7, 6.5, 9.5, 8.5, 7],
};
