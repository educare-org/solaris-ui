import type { SolarisTableColumn } from '@solaris-ui/angular';

export interface ActionPropRow {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export interface ActionPropsHeaders {
  readonly prop: string;
  readonly type: string;
  readonly values: string;
  readonly default: string;
}

export function buildActionPropsColumns(
  headers: ActionPropsHeaders,
): SolarisTableColumn<ActionPropRow>[] {
  return [
    { id: 'prop', header: headers.prop, accessor: 'prop' },
    { id: 'type', header: headers.type, accessor: 'type' },
    {
      id: 'values',
      header: headers.values,
      accessor: 'values',
      cellTemplateId: 'values',
    },
    {
      id: 'default',
      header: headers.default,
      accessor: 'default',
      width: '150px',
    },
  ];
}
