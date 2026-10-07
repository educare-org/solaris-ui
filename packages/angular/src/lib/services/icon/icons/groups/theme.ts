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
  {
    name: 'monitor',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M2 3h20v14H2z' },
      { type: 'path', d: 'M8 21h8' },
      { type: 'path', d: 'M12 17v4' },
    ],
  },
  {
    name: 'contrast',
    viewBox: '0 0 122.88 122.88',
    fill: 'none',
    elements: [
      {
        type: 'path',
        fill: 'currentColor',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        d: 'M122.88,61.44L122.88,61.44L122.88,61.44c0,8.47-1.5,16.34-4.5,23.58c-0.49,1.19-1.02,2.35-1.59,3.49 c-2.92,5.89-6.89,11.35-11.92,16.36l0,0l0,0l0,0l0,0l0,0c-1.67,1.68-3.4,3.24-5.17,4.68c-1.78,1.45-3.61,2.78-5.48,3.98 c-9.65,6.23-20.58,9.34-32.78,9.34h0v0c-8.47,0-16.33-1.5-23.58-4.5c-1.19-0.49-2.35-1.02-3.49-1.59 c-5.89-2.92-11.35-6.89-16.36-11.92l0,0l0,0l0,0l0,0l0,0c-1.68-1.67-3.24-3.4-4.68-5.17c-1.45-1.78-2.78-3.61-3.98-5.48 C3.11,84.58,0,73.64,0,61.44v0h0c0-8.47,1.5-16.33,4.5-23.58c0.49-1.19,1.02-2.35,1.59-3.49c2.92-5.89,6.89-11.35,11.92-16.36l0,0 l0,0l0,0l0,0l0,0c1.67-1.68,3.4-3.24,5.17-4.68c1.78-1.45,3.61-2.78,5.48-3.98C38.3,3.11,49.24,0,61.44,0h0v0 c8.47,0,16.33,1.5,23.58,4.5c1.19,0.49,2.35,1.02,3.49,1.59c5.89,2.92,11.35,6.89,16.36,11.92l0,0l0,0l0,0l0,0l0,0 c1.68,1.67,3.24,3.4,4.68,5.17c1.45,1.78,2.78,3.61,3.98,5.48C119.77,38.3,122.88,49.24,122.88,61.44L122.88,61.44z M61.44,10.96 c0.11,0,0.22,0,0.32,0v100.96c-0.11,0-0.22,0-0.32,0c-27.88,0-50.48-22.6-50.48-50.48C10.96,33.56,33.56,10.96,61.44,10.96 L61.44,10.96z',
      },
    ],
  },
];
