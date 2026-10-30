import type { ActionPropRow } from '../../model/action-props-table.data';

export const BUTTON_PROP_ROWS: readonly ActionPropRow[] = [
  {
    prop: 'appearance',
    type: 'SolarisButtonAppearance',
    values: 'solid | outline | ghost | tonal | surface | gradient',
    default: 'solid',
  },
  {
    prop: 'color',
    type: 'SolarisButtonColor',
    values: 'neutral | primary | success | warning | danger | info | custom',
    default: 'neutral',
  },
  {
    prop: 'size',
    type: 'SolarisButtonSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'radius',
    type: 'SolarisButtonRadius',
    values: 'none | sm | md | lg | full',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisButtonDensity',
    values: 'compact | normal | comfortable',
    default: 'theme',
  },
  {
    prop: 'shape',
    type: 'SolarisButtonShape',
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
    prop: 'fullWidth',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'icon | iconPosition',
    type: 'SolarisIconName | SolarisButtonIconPosition',
    values: '—',
    default: 'start',
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
