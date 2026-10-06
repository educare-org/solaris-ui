import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

const SORT_ICON_BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const TABLE_ICONS: SolarisIconDefinition[] = [
  {
    name: 'sort',
    ...SORT_ICON_BASE,
    elements: [
      { type: 'path', d: 'M8 20V4' },
      { type: 'path', d: 'M11 7 8 4 5 7' },
      { type: 'path', d: 'M16 4v16' },
      { type: 'path', d: 'M13 17 16 20 19 17' },
    ],
  },
  {
    name: 'sort-asc',
    ...SORT_ICON_BASE,
    elements: [
      { type: 'path', d: 'M8 20V4' },
      { type: 'path', d: 'M11 7 8 4 5 7' },
    ],
  },
  {
    name: 'sort-desc',
    ...SORT_ICON_BASE,
    elements: [
      { type: 'path', d: 'M16 4v16' },
      { type: 'path', d: 'M13 17 16 20 19 17' },
    ],
  },
];
