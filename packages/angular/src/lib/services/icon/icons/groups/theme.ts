import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

export const THEME_ICONS: SolarisIconDefinition[] = [
  {
    name: 'sun',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'circle', cx: 12, cy: 12, r: 4 },
      { type: 'path', d: 'M12 2v2' },
      { type: 'path', d: 'M12 20v2' },
      { type: 'path', d: 'M5 5l1.5 1.5' },
      { type: 'path', d: 'M17.5 17.5L19 19' },
      { type: 'path', d: 'M2 12h2' },
      { type: 'path', d: 'M20 12h2' },
      { type: 'path', d: 'M5 19l1.5-1.5' },
      { type: 'path', d: 'M17.5 6.5L19 5' },
    ],
  },
  {
    name: 'moon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' },
    ],
  },
];
