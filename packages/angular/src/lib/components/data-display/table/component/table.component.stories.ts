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

export const Error: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
    error: 'Unable to load data',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toBeTruthy();
    await expect(canvas.getByRole('table')).toBeTruthy();
  },
};

export const Appearance: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
    appearance: 'surface',
    striped: true,
    stripedMode: 'even',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const CellExpandable: Story = {
  args: {
    columns: [
      { id: 'name', header: 'Name', accessor: 'name' as const },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age' as const,
        type: 'number' as const,
        expandable: true,
      },
    ],
    data: ROWS,
    rowId: 'name',
    expandable: true,
    expandMode: 'cell',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const Grid: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
    appearance: 'grid',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const Radius: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
    radius: 'lg',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const IconHeader: Story = {
  args: {
    columns: [
      { id: 'name', header: 'Name', accessor: 'name' as const, icon: 'user' },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age' as const,
        type: 'number' as const,
        icon: 'calendar',
        iconPosition: 'end',
      },
    ],
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const AddRow: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
    showAddRow: true,
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const Wide: Story = {
  args: {
    columns: [
      ...COLUMNS,
      { id: 'city', header: 'City', accessor: 'name' as const },
      { id: 'joined', header: 'Joined', accessor: 'name' as const },
      { id: 'score', header: 'Score', accessor: 'age' as const },
      { id: 'level', header: 'Level', accessor: 'age' as const },
      { id: 'team', header: 'Team', accessor: 'name' as const },
      { id: 'track', header: 'Track', accessor: 'name' as const },
      { id: 'grade', header: 'Grade', accessor: 'age' as const },
      { id: 'office', header: 'Office', accessor: 'name' as const },
    ],
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const StickyColumn: Story = {
  args: {
    columns: [
      ...COLUMNS,
      { id: 'city', header: 'City', accessor: 'name' as const },
      { id: 'joined', header: 'Joined', accessor: 'name' as const },
      { id: 'score', header: 'Score', accessor: 'age' as const },
    ],
    data: ROWS,
    rowId: 'name',
    stickyFirstColumn: true,
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const FooterAggregates: Story = {
  args: {
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        footer: 'Average',
      },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age' as const,
        type: 'number' as const,
        footerValueOf: (rows: readonly Record<string, unknown>[]) =>
          `avg ${rows.reduce((sum, row) => sum + Number(row['age'] ?? 0), 0) / rows.length}`,
      },
    ],
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};

export const HeaderGroups: Story = {
  args: {
    columns: [
      { id: 'name', header: 'Name', accessor: 'name' as const },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age' as const,
        type: 'number' as const,
        headerGroup: 'metrics',
      },
    ],
    headerGroups: [{ id: 'metrics', header: 'Metrics' }],
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisTableComponent<Record<string, unknown>>>,
};
