import type { SolarisIconDefinition } from '../model/solaris-icon-definition.interface';

export const SOLARIS_BUILT_IN_ICONS: SolarisIconDefinition[] = [
  {
    name: 'check',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M20 6L9 17l-5-5',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'x',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M18 6L6 18M6 6l12 12',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'chevron-down',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M6 9l6 6 6-6',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'chevron-right',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M9 6l6 6-6 6',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'info',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'warning',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'danger',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 4h2v2h-2z',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'success',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5l-2.59-2.59L6 13.5l4 4 8-8-1.41-1.42L10 14.5z',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
  {
    name: 'loader',
    viewBox: '0 0 24 24',
    paths: [
      {
        d: 'M12 4V2A10 10 0 002 12h2a8 8 0 018-8z',
        fillRule: 'nonzero',
        clipRule: 'nonzero',
      },
    ],
  },
];
