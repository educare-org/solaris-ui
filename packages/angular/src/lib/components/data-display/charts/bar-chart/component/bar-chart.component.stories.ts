import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisBarChartComponent } from './bar-chart.component';

const meta: Meta<SolarisBarChartComponent> = {
  title: 'Data Display/Bar Chart',
  component: SolarisBarChartComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisBarChartComponent>;

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const GroupedVertical: Story = {
  args: {
    locale: 'en-US',
    orientation: 'vertical',
    layout: 'grouped',
    xLabels: WEEK,
    series: [
      {
        id: 'automation',
        label: 'Automation',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1820, 2050, 1740, 2210, 1980, 1890, 2400][index],
        })),
      },
      {
        id: 'queries',
        label: 'Queries',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [640, 880, 760, 940, 810, 720, 1010][index],
        })),
      },
    ],
  },
};

export const WithValues: Story = {
  args: {
    locale: 'en-US',
    orientation: 'vertical',
    layout: 'grouped',
    showValues: true,
    xLabels: WEEK,
    series: [
      {
        id: 'automation',
        label: 'Automation',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1820, 2050, 1740, 2210, 1980, 1890, 2400][index],
        })),
      },
      {
        id: 'queries',
        label: 'Queries',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [640, 880, 760, 940, 810, 720, 1010][index],
        })),
      },
    ],
  },
};

export const Stacked: Story = {
  args: {
    locale: 'en-US',
    orientation: 'vertical',
    layout: 'stacked',
    xLabels: WEEK,
    series: [
      {
        id: 'automation',
        label: 'Automation',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1820, 2050, 1740, 2210, 1980, 1890, 2400][index],
        })),
      },
      {
        id: 'queries',
        label: 'Queries',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [640, 880, 760, 940, 810, 720, 1010][index],
        })),
      },
      {
        id: 'system',
        label: 'System',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [320, 410, 380, 440, 390, 350, 470][index],
        })),
      },
    ],
  },
};

export const Stacked100: Story = {
  args: {
    locale: 'en-US',
    orientation: 'vertical',
    layout: 'stacked-100',
    xLabels: WEEK,
    series: [
      {
        id: 'automation',
        label: 'Automation',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [62, 58, 64, 60, 61, 59, 63][index],
        })),
      },
      {
        id: 'queries',
        label: 'Queries',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [25, 28, 24, 26, 27, 25, 24][index],
        })),
      },
      {
        id: 'system',
        label: 'System',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [13, 14, 12, 14, 12, 16, 13][index],
        })),
      },
    ],
  },
};

export const HorizontalLongLabels: Story = {
  args: {
    locale: 'en-US',
    orientation: 'horizontal',
    layout: 'grouped',
    series: [
      {
        id: 'enrollment',
        label: 'Enrollment',
        points: [
          { x: 'A1', y: 42, label: 'Turma de alfabetização avançada' },
          { x: 'B2', y: 68, label: 'Turma de reforço de matemática' },
          { x: 'C3', y: 55, label: 'Turma de leitura e interpretação' },
          { x: 'D4', y: 81, label: 'Turma de ciências aplicadas' },
        ],
      },
      {
        id: 'attendance',
        label: 'Attendance',
        points: [
          { x: 'A1', y: 38, label: 'Turma de alfabetização avançada' },
          { x: 'B2', y: 61, label: 'Turma de reforço de matemática' },
          { x: 'C3', y: 49, label: 'Turma de leitura e interpretação' },
          { x: 'D4', y: 74, label: 'Turma de ciências aplicadas' },
        ],
      },
    ],
  },
};

export const HorizontalGrouped: Story = {
  args: {
    locale: 'en-US',
    orientation: 'horizontal',
    layout: 'grouped',
    referenceLines: [{ value: 1500, label: 'Class average' }],
    series: [
      {
        id: 'automation',
        label: 'Automation',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1820, 2050, 1740, 2210, 1980, 1890, 2400][index],
        })),
      },
      {
        id: 'queries',
        label: 'Queries',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [640, 880, 760, 940, 810, 720, 1010][index],
        })),
      },
    ],
  },
};

export const SizeDensity: Story = {
  args: {
    locale: 'en-US',
    orientation: 'vertical',
    layout: 'grouped',
    size: 'lg',
    density: 'comfortable',
    xLabels: WEEK,
    series: [
      {
        id: 'automation',
        label: 'Automation',
        points: WEEK.map((day, index) => ({
          x: day,
          y: [1820, 2050, 1740, 2210, 1980, 1890, 2400][index],
        })),
      },
    ],
  },
};
