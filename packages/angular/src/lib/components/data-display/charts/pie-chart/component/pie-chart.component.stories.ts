import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisPieChartComponent } from './pie-chart.component';

const meta: Meta<SolarisPieChartComponent> = {
  title: 'Data Display/Pie Chart',
  component: SolarisPieChartComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisPieChartComponent>;

const ENROLLMENT = [
  { id: 'fundamental', label: 'Fundamental', value: 1240 },
  { id: 'medio', label: 'Ensino médio', value: 860 },
  { id: 'eja', label: 'EJA', value: 310 },
  { id: 'integral', label: 'Integral', value: 190 },
];

const LONG_TAIL = [
  ...ENROLLMENT,
  { id: 'noturno', label: 'Noturno', value: 42 },
  { id: 'ead', label: 'EAD', value: 18 },
];

export const Pie: Story = {
  args: {
    locale: 'en-US',
    variant: 'pie',
    slices: ENROLLMENT,
  },
};

export const Donut: Story = {
  args: {
    locale: 'en-US',
    variant: 'donut',
    slices: ENROLLMENT,
  },
};

export const DonutWithValues: Story = {
  args: {
    locale: 'en-US',
    variant: 'donut',
    slices: ENROLLMENT,
    showValues: true,
  },
};

export const GroupedOthers: Story = {
  args: {
    locale: 'en-US',
    variant: 'donut',
    slices: LONG_TAIL,
    minSlicePercent: 3,
    showValues: true,
  },
};

export const Gauge: Story = {
  args: {
    locale: 'en-US',
    variant: 'gauge',
    slices: [{ id: 'attendance', label: 'Attendance', value: 87 }],
    gaugeMin: 0,
    gaugeMax: 100,
    gaugeTarget: 90,
    centerLabel: 'Attendance',
  },
};

export const ScoreRing: Story = {
  args: {
    locale: 'en-US',
    variant: 'donut',
    size: 'sm',
    slices: [{ id: 'score', label: 'Score', value: 7.5 }],
    centerValue: '7.5',
    centerLabel: 'Average',
  },
};

export const Empty: Story = {
  args: {
    locale: 'en-US',
    variant: 'donut',
    slices: [],
  },
};
