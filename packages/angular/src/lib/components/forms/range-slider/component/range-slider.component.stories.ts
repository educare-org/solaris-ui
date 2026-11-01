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
