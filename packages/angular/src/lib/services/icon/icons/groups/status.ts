import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

export const STATUS_ICONS: SolarisIconDefinition[] = [
  {
    name: 'check',
    viewBox: '0 0 24 24',
    strokeWidth: 3,
    elements: [{ type: 'path', d: 'M20 6 9 17l-5-5' }],
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
];
