import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';

export const SOLARIS_BUILT_IN_ICONS: SolarisIconDefinition[] = [
  {
    name: 'x',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M18 6 6 18' },
      { type: 'path', d: 'm6 6 12 12' },
    ],
  },
  {
    name: 'check',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'M20 6 9 17l-5-5' }],
  },
  {
    name: 'chevron-down',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'm6 9 6 6 6-6' }],
  },
  {
    name: 'chevron-left',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'm15 18-6-6 6-6' }],
  },
  {
    name: 'chevron-right',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'm9 18 6-6-6-6' }],
  },
  {
    name: 'chevron-up',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'm18 15-6-6-6 6' }],
  },
  {
    name: 'chevron-forward',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'm9 18 6-6-6-6' },
      { type: 'path', d: 'm15 18 6-6-6-6' },
    ],
  },
  {
    name: 'chevron-backward',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'm15 18-6-6 6-6' },
      { type: 'path', d: 'm9 18-6-6 6-6' },
    ],
  },
  {
    name: 'chevron-first',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'm15 18-6-6 6-6' },
      { type: 'path', d: 'M7 6v12' },
    ],
  },
  {
    name: 'chevron-last',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'm9 18 6-6-6-6' },
      { type: 'path', d: 'M17 6v12' },
    ],
  },
  {
    name: 'info',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', cx: 12, cy: 12, r: 10 },
      { type: 'path', d: 'M12 16v-4' },
      { type: 'path', d: 'M12 8h.01' },
    ],
  },
  {
    name: 'warning',
    viewBox: '0 0 24 24',
    elements: [
      {
        type: 'path',
        d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
      },
      { type: 'path', d: 'M12 9v4' },
      { type: 'path', d: 'M12 17h.01' },
    ],
  },
  {
    name: 'danger',
    viewBox: '0 0 24 24',
    elements: [
      {
        type: 'polygon',
        points:
          '7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86',
      },
      { type: 'path', d: 'm15 9-6 6' },
      { type: 'path', d: 'm9 9 6 6' },
    ],
  },
  {
    name: 'caution',
    viewBox: '0 0 24 24',
    elements: [
      {
        type: 'polygon',
        points:
          '7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86',
      },
      { type: 'path', d: 'M12 8v4' },
      { type: 'path', d: 'M12 16h.01' },
    ],
  },
  {
    name: 'success',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', cx: 12, cy: 12, r: 10 },
      { type: 'path', d: 'm9 12 2 2 4-4' },
    ],
  },
  {
    name: 'shield-check',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' },
      { type: 'path', d: 'm9 12 2 2 4-4' },
    ],
  },
  {
    name: 'loader',
    viewBox: '0 0 24 24',
    elements: [{ type: 'path', d: 'M12 2a10 10 0 0 1 10 10' }],
  },
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
