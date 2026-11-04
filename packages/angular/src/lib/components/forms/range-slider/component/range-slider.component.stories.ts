import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisRangeSliderComponent } from './range-slider.component';

const meta: Meta<SolarisRangeSliderComponent> = {
  component: SolarisRangeSliderComponent,
  title: 'SolarisRangeSliderComponent',
};
export default meta;

type Story = StoryObj<SolarisRangeSliderComponent>;

export const Range: Story = {
  args: {
    label: 'Price',
    values: [25, 75],
  },
};

export const ThreeThumbs: Story = {
  args: {
    label: 'Segments',
    values: [10, 50, 90],
  },
};

export const FiveThumbs: Story = {
  args: {
    label: 'Stops',
    values: [5, 25, 50, 75, 95],
  },
};

export const Vertical: Story = {
  args: {
    label: 'Range',
    values: [20, 80],
    orientation: 'vertical',
  },
};

export const Ticks: Story = {
  args: {
    label: 'Brightness range',
    values: [30, 70],
    showTicks: true,
    tickStep: 10,
  },
};

export const MinMax: Story = {
  args: {
    label: 'Price',
    values: [25, 75],
    showMinMax: true,
  },
};

export const LogRange: Story = {
  args: {
    label: 'Frequency range',
    min: 20,
    max: 20000,
    values: [100, 5000],
    scale: { kind: 'log' },
    showTicks: true,
    tickValues: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000],
  },
};

export const TimeRange: Story = {
  args: {
    label: 'Booking window',
    min: 1704067200000,
    max: 1735689600000,
    values: [1709251200000, 1725148800000],
    scale: { kind: 'time' },
    showTicks: true,
    tickValues: [
      1704067200000, 1711929600000, 1719792000000, 1727740800000, 1735689600000,
    ],
  },
};

export const ZonesRange: Story = {
  args: {
    label: 'Risk band',
    values: [10, 70],
    zones: [
      { from: 0, to: 33, color: 'success' },
      { from: 33, to: 66, color: 'warning' },
      { from: 66, to: 100, color: 'danger' },
    ],
  },
};

export const DistributionRange: Story = {
  args: {
    label: 'Demand band',
    values: [25, 75],
    distribution: [2, 5, 9, 7, 3],
  },
};
