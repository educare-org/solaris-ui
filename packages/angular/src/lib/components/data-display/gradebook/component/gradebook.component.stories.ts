import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisGradebookComponent } from './gradebook.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisGradebookComponent> = {
  component: SolarisGradebookComponent,
  title: 'SolarisGradebookComponent',
};
export default meta;

type Story = StoryObj<SolarisGradebookComponent<Record<string, unknown>>>;

const COLUMNS = [
  { id: 'name', header: 'Disciplina', accessor: 'name' as const },
  {
    id: 'gs1',
    header: 'GS1',
    accessor: 'gs1' as const,
    type: 'number' as const,
    assignmentId: 'gs1',
    maxScore: 20,
    sortable: true,
  },
];

const ROWS = [
  { name: 'Java Advanced', gs1: 18 },
  { name: 'Mobile Development', gs1: null },
];

export const Primary: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisGradebookComponent<Record<string, unknown>>>,
};

export const Grouped: Story = {
  args: {
    columns: [COLUMNS[0], { ...COLUMNS[1], headerGroup: 's1' }],
    headerGroups: [{ id: 's1', header: '1º Semestre' }],
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisGradebookComponent<Record<string, unknown>>>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/1º Semestre/)).toBeTruthy();
  },
};

export const WithStatus: Story = {
  args: {
    columns: [
      { id: 'name', header: 'Disciplina', accessor: 'name' as const },
      {
        id: 'result',
        header: 'Situação',
        accessor: 'result' as const,
        status: true,
      },
    ],
    data: [{ name: 'Java Advanced', result: 'Aprovado' }],
    rowId: 'name',
  } as Partial<SolarisGradebookComponent<Record<string, unknown>>>,
};

export const StickyLast: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'name',
    stickyLastColumn: true,
  } as Partial<SolarisGradebookComponent<Record<string, unknown>>>,
};

export const Aggregated: Story = {
  args: {
    columns: [{ ...COLUMNS[1], aggregate: 'average' as const }],
    data: ROWS,
    rowId: 'name',
  } as Partial<SolarisGradebookComponent<Record<string, unknown>>>,
};

export const Empty: Story = {
  args: {
    columns: COLUMNS,
    data: [],
    rowId: 'name',
  } as Partial<SolarisGradebookComponent<Record<string, unknown>>>,
};
