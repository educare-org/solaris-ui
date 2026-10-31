import type { ActionPropRow } from '../../model/action-props-table.data';

export const ICON_BUTTON_PROP_ROWS: readonly ActionPropRow[] = [
  {
    prop: 'appearance',
    type: 'SolarisIconButtonAppearance',
    values: 'solid | outline | ghost | tonal | surface | gradient',
    default: 'solid',
  },
  {
    prop: 'color',
    type: 'SolarisIconButtonColor',
    values: 'neutral | primary | success | warning | danger | info | custom',
    default: 'neutral',
  },
  {
    prop: 'size',
    type: 'SolarisIconButtonSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'radius',
    type: 'SolarisIconButtonRadius',
    values: 'none | sm | md | lg | full',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisIconButtonDensity',
    values: 'compact | normal | comfortable',
    default: 'theme',
  },
  {
    prop: 'shape',
    type: 'SolarisIconButtonShape',
    values: 'normal | wide',
    default: 'normal',
  },
  {
    prop: 'disabled',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'action',
    type: '() => Promise<unknown>',
    values: '—',
    default: '—',
  },
  {
    prop: 'actionSuccess',
    type: 'unknown',
    values: '—',
    default: '—',
  },
  {
    prop: 'actionError',
    type: 'unknown',
    values: '—',
    default: '—',
  },
  {
    prop: 'loading',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'pressed',
    type: 'boolean | undefined',
    values: 'true | false',
    default: '—',
  },
  {
    prop: 'chromeless',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'loadingLabel | loadingLabelKey',
    type: 'string',
    values: '—',
    default: '—',
  },
  {
    prop: 'ariaLabel | ariaLabelKey',
    type: 'string',
    values: '—',
    default: '—',
  },
];
