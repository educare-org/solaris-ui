import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisChartShellComponent } from './chart-shell.component';

const meta: Meta<SolarisChartShellComponent> = {
  title: 'Data Display/Chart Shell',
  component: SolarisChartShellComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisChartShellComponent>;

export const Line: Story = {
  args: {
    locale: 'en-US',
    title: 'Weekly Agent Activity',
    intervalLabel: 'Apr 28, 2026 → May 04, 2026',
    heroValue: '12,450',
    heroLabel: 'tasks',
    view: 'line',
    period: 'week',
    series: [
      {
        id: 'automation',
        label: 'Task Automation',
        points: [
          { x: 28, y: 180 },
          { x: 29, y: 210 },
          { x: 30, y: 150 },
          { x: 1, y: 190 },
        ],
      },
      {
        id: 'queries',
        label: 'User Queries',
        points: [
          { x: 28, y: 60 },
          { x: 29, y: 90 },
          { x: 30, y: 120 },
          { x: 1, y: 80 },
        ],
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    locale: 'en-US',
    title: 'Weekly Agent Activity',
    loading: true,
    series: [],
  },
};

export const Empty: Story = {
  args: {
    locale: 'en-US',
    title: 'Weekly Agent Activity',
    series: [],
  },
};

export const SizeDensity: Story = {
  args: {
    locale: 'en-US',
    title: 'Weekly Agent Activity',
    intervalLabel: 'Apr 28, 2026 → May 04, 2026',
    heroValue: '12,450',
    heroLabel: 'tasks',
    view: 'line',
    period: 'week',
    size: 'lg',
    density: 'comfortable',
    series: [
      {
        id: 'automation',
        label: 'Task Automation',
        points: [
          { x: 28, y: 180 },
          { x: 29, y: 210 },
          { x: 30, y: 150 },
          { x: 1, y: 190 },
        ],
      },
    ],
  },
};
