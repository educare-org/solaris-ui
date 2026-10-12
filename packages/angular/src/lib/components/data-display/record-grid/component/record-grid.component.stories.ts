import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisRecordGridComponent } from './record-grid.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisRecordGridComponent> = {
  component: SolarisRecordGridComponent,
  title: 'SolarisRecordGridComponent',
};
export default meta;

type Story = StoryObj<SolarisRecordGridComponent<Record<string, unknown>>>;

const COLUMNS = [
  { id: 'student', header: 'Student', accessor: 'student' as const },
  {
    id: 'present',
    header: 'Present',
    accessor: 'present' as const,
    type: 'number' as const,
    sortable: true,
  },
  {
    id: 'project',
    header: 'Project',
    accessor: 'project' as const,
    type: 'number' as const,
    sortable: true,
  },
];

const ROWS = [
  { student: 'Ada 1', present: 8, project: 7 },
  { student: 'Grace 2', present: 9, project: 6 },
];

export const Primary: Story = {
  args: {
    columns: COLUMNS,
    data: ROWS,
    rowId: 'student',
  } as Partial<SolarisRecordGridComponent<Record<string, unknown>>>,
};

export const Sections: Story = {
  args: {
    columns: [
      COLUMNS[0],
      { ...COLUMNS[1], sectionId: 'morning' },
      { ...COLUMNS[2], sectionId: 'morning' },
    ],
    sections: [{ id: 'morning', header: 'Morning shift' }],
    sectionOf: () => 'morning',
    data: ROWS,
    rowId: 'student',
  } as Partial<SolarisRecordGridComponent<Record<string, unknown>>>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Morning shift/)).toBeTruthy();
  },
};

export const Formulas: Story = {
  args: {
    columns: [
      ...COLUMNS,
      {
        id: 'total',
        header: 'Total',
        type: 'number',
        computed: { from: ['present', 'project'], by: 'sum' },
      },
    ],
    data: ROWS,
    rowId: 'student',
  } as Partial<SolarisRecordGridComponent<Record<string, unknown>>>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('15')).toBeTruthy();
  },
};
