import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisRadarComponent } from './radar.component';

const meta: Meta<SolarisRadarComponent> = {
  title: 'Data Display/Radar',
  component: SolarisRadarComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SolarisRadarComponent>;

const AXES = ['Reading', 'Writing', 'Math', 'Science', 'Social'];

export const ClassProfile: Story = {
  args: {
    locale: 'en-US',
    axes: AXES,
    max: 10,
    series: [{ id: 'class-a', label: 'Class A', values: [8.5, 7, 9, 6.5, 8] }],
  },
};

export const TwoClasses: Story = {
  args: {
    locale: 'en-US',
    axes: AXES,
    max: 10,
    series: [
      { id: 'class-a', label: 'Class A', values: [8.5, 7, 9, 6.5, 8] },
      { id: 'class-b', label: 'Class B', values: [7, 8, 6, 8.5, 7.5] },
    ],
  },
};

const MANY_AXES = [
  'Reading',
  'Writing',
  'Math',
  'Science',
  'Social',
  'Arts',
  'Sports',
  'Tech',
  'Music',
  'English',
];

export const ManySeries: Story = {
  args: {
    locale: 'en-US',
    axes: MANY_AXES,
    max: 10,
    series: [
      {
        id: 'class-a',
        label: 'Class A',
        values: [8.5, 7, 9, 6.5, 8, 7.5, 6, 8, 7, 9],
      },
      {
        id: 'class-b',
        label: 'Class B',
        values: [7, 8, 6, 8.5, 7.5, 6.5, 8, 7, 9, 6],
      },
      {
        id: 'class-c',
        label: 'Class C',
        values: [9, 6.5, 8, 7, 9.5, 8, 7, 6.5, 8, 7.5],
      },
      {
        id: 'class-d',
        label: 'Class D',
        values: [6, 9, 7.5, 8, 6.5, 9, 8.5, 7, 6, 8.5],
      },
      {
        id: 'class-e',
        label: 'Class E',
        values: [8, 7.5, 9.5, 6, 7, 8.5, 9, 8, 7.5, 6.5],
      },
      {
        id: 'class-f',
        label: 'Class F',
        values: [7.5, 8.5, 6.5, 9, 8, 7, 6.5, 9.5, 8.5, 7],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    locale: 'en-US',
    axes: AXES,
    series: [],
  },
};
