import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisHeatmapComponent } from './heatmap.component';

const meta: Meta<SolarisHeatmapComponent> = {
  title: 'Data Display/Heatmap',
  component: SolarisHeatmapComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisHeatmapComponent>;

const COLUMNS = ['7h', '8h', '9h', '10h', '11h', '12h'];

const ATTENDANCE = [
  { id: 'mon', label: 'Mon', values: [92, 95, 88, 90, 84, null] },
  { id: 'tue', label: 'Tue', values: [90, 93, 91, 87, 82, null] },
  { id: 'wed', label: 'Wed', values: [88, 90, 85, 89, 80, null] },
  { id: 'thu', label: 'Thu', values: [94, 96, 92, 91, 86, null] },
  { id: 'fri', label: 'Fri', values: [85, 88, 80, 76, 70, null] },
];

export const WeeklyAttendance: Story = {
  args: {
    locale: 'en-US',
    rows: ATTENDANCE,
    columns: COLUMNS,
    max: 100,
  },
};

export const WithGaps: Story = {
  args: {
    locale: 'en-US',
    rows: [
      { id: 'mon', label: 'Mon', values: [92, null, 88, null, 84, null] },
      { id: 'tue', label: 'Tue', values: [null, 93, null, 87, null, null] },
      { id: 'wed', label: 'Wed', values: [88, 90, null, null, 80, null] },
    ],
    columns: COLUMNS,
    max: 100,
  },
};

const SCALE_COLUMNS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

export const VariedIntensity: Story = {
  args: {
    locale: 'en-US',
    rows: [
      {
        id: 'class-a',
        label: 'Class A',
        values: [96, 12, 74, 62, 5, 83, 70, null],
      },
      {
        id: 'class-b',
        label: 'Class B',
        values: [8, 93, 66, 15, 85, 59, 94, 72],
      },
      {
        id: 'class-c',
        label: 'Class C',
        values: [69, 3, 88, 95, 63, 20, 71, 86],
      },
      {
        id: 'class-d',
        label: 'Class D',
        values: [58, 66, 10, 81, 90, 97, 64, null],
      },
      {
        id: 'class-e',
        label: 'Class E',
        values: [84, 79, 92, 68, 76, 18, 99, 61],
      },
      {
        id: 'class-f',
        label: 'Class F',
        values: [72, 89, 60, 94, 67, 78, 6, 93],
      },
    ],
    columns: SCALE_COLUMNS,
    max: 100,
    showScale: true,
  },
};

export const Empty: Story = {
  args: {
    locale: 'en-US',
    rows: [],
    columns: COLUMNS,
  },
};

export const SizeDensity: Story = {
  args: {
    locale: 'en-US',
    rows: ATTENDANCE,
    columns: COLUMNS,
    max: 100,
    size: 'lg',
    density: 'comfortable',
  },
};
