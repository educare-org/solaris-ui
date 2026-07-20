import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

export const LAYOUT_ICONS: SolarisIconDefinition[] = [
  {
    name: 'list',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'line', x1: 8, y1: 6, x2: 21, y2: 6 },
      { type: 'line', x1: 8, y1: 12, x2: 21, y2: 12 },
      { type: 'line', x1: 8, y1: 18, x2: 21, y2: 18 },
      { type: 'line', x1: 3, y1: 6, x2: 3.01, y2: 6 },
      { type: 'line', x1: 3, y1: 12, x2: 3.01, y2: 12 },
      { type: 'line', x1: 3, y1: 18, x2: 3.01, y2: 18 },
    ],
  },
  {
    name: 'grid',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M3 3h7v7H3z' },
      { type: 'path', d: 'M14 3h7v7h-7z' },
      { type: 'path', d: 'M14 14h7v7h-7z' },
      { type: 'path', d: 'M3 14h7v7H3z' },
    ],
  },
  {
    name: 'columns',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M3 3h7v9H3z' },
      { type: 'path', d: 'M14 3h7v5h-7z' },
      { type: 'path', d: 'M14 12h7v9h-7z' },
      { type: 'path', d: 'M3 16h7v5H3z' },
    ],
  },
];
