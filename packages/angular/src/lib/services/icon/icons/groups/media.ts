import type { SolarisIconDefinition } from '../../model/solaris-icon-definition.interface';

export const MEDIA_ICONS: SolarisIconDefinition[] = [
  {
    name: 'image',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'rect', x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 },
      { type: 'circle', cx: 9, cy: 9, r: 2 },
      {
        type: 'path',
        d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
      },
    ],
  },
  {
    name: 'video',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      {
        type: 'path',
        d: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5',
      },
      { type: 'rect', x: 2, y: 6, width: 14, height: 12, rx: 2 },
    ],
  },
  {
    name: 'mic',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      { type: 'path', d: 'M12 19v3' },
      { type: 'path', d: 'M19 10v2a7 7 0 0 1-14 0v-2' },
      { type: 'rect', x: 9, y: 2, width: 6, height: 13, rx: 3 },
    ],
  },
  {
    name: 'leaf',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    elements: [
      {
        type: 'path',
        d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
      },
      { type: 'path', d: 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' },
    ],
  },
];
