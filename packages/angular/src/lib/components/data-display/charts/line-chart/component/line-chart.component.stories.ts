import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisLineChartComponent } from './line-chart.component';

const meta: Meta<SolarisLineChartComponent> = {
  title: 'Data Display/Line Chart',
  component: SolarisLineChartComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisLineChartComponent>;

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const SmoothArea: Story = {
  args: {
    locale: 'en-US',
    interpolation: 'smooth',
    area: true,
    showDots: true,
    xLabels: WEEK,
    series: [
      {
        id: 'revenue',
        label: 'Revenue',
        points: [
          { x: 'Mon', y: 1839 },
          { x: 'Tue', y: 2100 },
          { x: 'Wed', y: 1950 },
          { x: 'Thu', y: 2400 },
          { x: 'Fri', y: 2280 },
          { x: 'Sat', y: 1900 },
          { x: 'Sun', y: 2600 },
        ],
      },
    ],
  },
};

export const LinearMultiSeries: Story = {
  args: {
    locale: 'en-US',
    interpolation: 'linear',
    area: false,
    showDots: true,
    xLabels: WEEK,
    referenceLines: [{ value: 1500, label: 'Class average' }],
    series: [
      {
        id: 'usa',
        label: 'USA',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1200, 1500, 1400, 1800, 1700, 1900, 2200][index],
        })),
      },
      {
        id: 'europe',
        label: 'Europe',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [900, 1100, 1250, 1300, 1500, 1450, 1700][index],
        })),
      },
    ],
  },
};

export const WithGaps: Story = {
  args: {
    locale: 'en-US',
    interpolation: 'smooth',
    area: true,
    showDots: true,
    xLabels: WEEK,
    series: [
      {
        id: 'attendance',
        label: 'Attendance',
        points: [
          { x: 'Mon', y: 30 },
          { x: 'Tue', y: null },
          { x: 'Wed', y: 28 },
          { x: 'Thu', y: 31 },
          { x: 'Fri', y: null },
          { x: 'Sat', y: 26 },
          { x: 'Sun', y: 29 },
        ],
      },
    ],
  },
};

export const Stepped: Story = {
  args: {
    locale: 'en-US',
    interpolation: 'linear',
    step: true,
    area: false,
    showDots: true,
    xLabels: WEEK,
    series: [
      {
        id: 'enrollment',
        label: 'Enrollment',
        points: WEEK.map((day, index) => ({ x: day, y: 40 + index * 5 })),
      },
    ],
  },
};

export const SizeDensity: Story = {
  args: {
    locale: 'en-US',
    interpolation: 'smooth',
    area: true,
    showDots: true,
    size: 'lg',
    density: 'comfortable',
    xLabels: WEEK,
    series: [
      {
        id: 'revenue',
        label: 'Revenue',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1839, 2100, 1950, 2400, 2280, 1900, 2600][index],
        })),
      },
    ],
  },
};
