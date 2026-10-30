import type { ActionPropRow } from '../../model/action-props-table.data';

export const BUTTON_GROUP_PROP_ROWS: readonly ActionPropRow[] = [
  {
    prop: 'orientation',
    type: 'SolarisButtonGroupOrientation',
    values: 'horizontal | vertical',
    default: 'horizontal',
  },
  {
    prop: 'size',
    type: 'SolarisButtonGroupSize',
    values: 'sm | md | lg',
    default: 'md',
  },
  {
    prop: 'density',
    type: 'SolarisButtonGroupDensity',
    values: 'compact | normal | comfortable',
    default: 'theme',
  },
  {
    prop: 'fullWidth',
    type: 'boolean',
    values: 'true | false',
    default: 'false',
  },
  {
    prop: 'attached',
    type: 'boolean',
    values: 'true | false',
    default: 'true',
  },
];
