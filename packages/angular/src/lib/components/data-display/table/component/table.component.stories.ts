import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisTableComponent } from './table.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisTableComponent> = {
  component: SolarisTableComponent,
  title: 'SolarisTableComponent',
};
export default meta;

type Story = StoryObj<SolarisTableComponent<Record<string, unknown>>>;

const COLUMNS = [
  { id: 'name', header: 'Name', accessor: 'name' as const, sortable: true },
  {
    id: 'age',
    header: 'Age',
    accessor: 'age' as const,
    type: 'number' as const,
    sortable: true,
  },
];

const ROWS = [
  { name: 'Ada Lovelace', age: 36 },
  { name: 'Grace Hopper', age: 85 },
];

export const Primary: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const Empty: Story = {
  args: {
    columns: COLUMNS,
    data: [],
    rowId: 'name',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/no results found/gi)).toBeTruthy();
  },
};

export const Loading: Story = {
  args: {
    columns: COLUMNS,
    data: [],
    rowId: 'name',
    loading: true,
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};
