import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

export const DATA_ICONS: SolarisIconDefinition[] = [
  {
    name: 'building',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z' },
      { type: 'path', d: 'M9 22v-4h6v4' },
      { type: 'path', d: 'M8 6h.01' },
      { type: 'path', d: 'M16 6h.01' },
      { type: 'path', d: 'M12 6h.01' },
      { type: 'path', d: 'M12 10h.01' },
      { type: 'path', d: 'M12 14h.01' },
      { type: 'path', d: 'M16 10h.01' },
      { type: 'path', d: 'M16 14h.01' },
      { type: 'path', d: 'M8 10h.01' },
      { type: 'path', d: 'M8 14h.01' },
    ],
  },
  {
    name: 'eye',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' },
      { type: 'circle', cx: 12, cy: 12, r: 3 },
    ],
  },
  {
    name: 'eye-off',
    viewBox: '0 0 24 24',
    elements: [
      {
        type: 'path',
        d: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24',
      },
      { type: 'line', x1: 1, y1: 1, x2: 23, y2: 23 },
    ],
  },
  {
    name: 'globe',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', d: 'M15 21v-4a2 2 0 012-2h4' },
      {
        type: 'path',
        d: 'M7 4v2a3 3 0 003 2h0a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h3',
      },
      { type: 'path', d: 'M3 11h2a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v4' },
      { type: 'circle', cx: 12, cy: 12, r: 10 },
    ],
  },
  {
    name: 'graduation-cap',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M22 10v6M2 10l10-5 10 5-10 5z' },
      { type: 'path', d: 'M6 12v5c3 3 9 3 12 0v-5' },
    ],
  },
  {
    name: 'map-pin',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' },
      { type: 'circle', cx: 12, cy: 10, r: 3 },
    ],
  },
  {
    name: 'message-circle',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z' },
    ],
  },
  {
    name: 'user',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' },
      { type: 'circle', cx: 12, cy: 7, r: 4 },
    ],
  },
  {
    name: 'users',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' },
      { type: 'circle', cx: 9, cy: 7, r: 4 },
      { type: 'path', d: 'M23 21v-2a4 4 0 00-3-3.87' },
      { type: 'path', d: 'M16 3.13a4 4 0 010 7.75' },
    ],
  },
];
