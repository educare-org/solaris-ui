import type { Meta, StoryObj } from '@storybook/angular';

import {
  createCsvExporter,
  createJsonExporter,
} from '../../../../services/export';
import { SolarisTableToolbarComponent } from './table-toolbar.component';

const meta: Meta<SolarisTableToolbarComponent> = {
  component: SolarisTableToolbarComponent,
  title: 'SolarisTableToolbarComponent',
};
export default meta;

type Story = StoryObj<SolarisTableToolbarComponent<Record<string, unknown>>>;

const COLUMNS = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name' as const,
    type: 'text' as const,
  },
  {
    id: 'city',
    header: 'City',
    accessor: 'city' as const,
    type: 'text' as const,
  },
];

export const Primary: Story = {
  args: {
    columns: COLUMNS,
  } as Partial<SolarisTableToolbarComponent<Record<string, unknown>>>,
};

export const WithExport: Story = {
  args: {
    columns: COLUMNS,
    exporters: [createCsvExporter(), createJsonExporter()],
    exportDisplay: 'icon-label',
  } as Partial<SolarisTableToolbarComponent<Record<string, unknown>>>,
};

export const WithViews: Story = {
  args: {
    columns: COLUMNS,
    views: [
      {
        id: 'all',
        name: 'All contacts',
        filter: {
          globalSearch: '',
          conditions: [],
          columnVisibility: {},
          columnOrder: [],
        },
      },
      {
        id: 'mine',
        name: 'My contacts',
        filter: {
          globalSearch: '',
          conditions: [
            { columnId: 'city', operator: 'equals', value: 'Recife' },
          ],
          columnVisibility: {},
          columnOrder: [],
        },
      },
    ],
    selectedViewId: 'all',
  } as Partial<SolarisTableToolbarComponent<Record<string, unknown>>>,
};
