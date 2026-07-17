import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

export const ACTIONS_ICONS: SolarisIconDefinition[] = [
  {
    name: 'bookmark',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z' },
    ],
  },
  {
    name: 'download',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' },
      { type: 'polyline', points: '7 10 12 15 17 10' },
      { type: 'line', x1: 12, y1: 15, x2: 12, y2: 3 },
    ],
  },
  {
    name: 'export',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' },
      { type: 'polyline', points: '17 8 12 3 7 8' },
      { type: 'line', x1: 12, y1: 3, x2: 12, y2: 15 },
    ],
  },
  {
    name: 'loader',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'M12 2a10 10 0 0 1 10 10' }],
  },
  {
    name: 'search',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', cx: 11, cy: 11, r: 8 },
      { type: 'line', x1: 21, y1: 21, x2: 16.65, y2: 16.65 },
    ],
  },
  {
    name: 'x',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M18 6 6 18' },
      { type: 'path', d: 'm6 6 12 12' },
    ],
  },
];
