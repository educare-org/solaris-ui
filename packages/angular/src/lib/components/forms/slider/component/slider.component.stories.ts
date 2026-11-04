import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSliderComponent } from './slider.component';

const meta: Meta<SolarisSliderComponent> = {
  component: SolarisSliderComponent,
  title: 'SolarisSliderComponent',
};
export default meta;

type Story = StoryObj<SolarisSliderComponent>;

export const Single: Story = {
  args: {
    label: 'Volume',
    value: 50,
  },
};

export const Ticks: Story = {
  args: {
    label: 'Brightness',
    value: 50,
    showTicks: true,
    tickStep: 10,
  },
};

export const Vertical: Story = {
  args: {
    label: 'Balance',
    value: 30,
    orientation: 'vertical',
  },
};

export const Icons: Story = {
  args: {
    label: 'Volume',
    value: 70,
    startIcon: 'minus',
    endIcon: 'plus',
    thumbIcon: 'grip-vertical',
  },
};

export const Tooltip: Story = {
  args: {
    label: 'Opacity',
    value: 80,
    valueDisplay: 'tooltip',
  },
};

export const MinMax: Story = {
  args: {
    label: 'Volume',
    value: 50,
    showMinMax: true,
  },
};

export const Log: Story = {
  args: {
    label: 'Frequency',
    min: 20,
    max: 20000,
    value: 1000,
    scale: { kind: 'log' },
    showTicks: true,
    tickValues: [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000],
  },
};

export const Zones: Story = {
  args: {
    label: 'Risk',
    value: 70,
    zones: [
      { from: 0, to: 33, color: 'success' },
      { from: 33, to: 66, color: 'warning' },
      { from: 66, to: 100, color: 'danger' },
    ],
  },
};

export const Distribution: Story = {
  args: {
    label: 'Price',
    value: 50,
    distribution: [2, 5, 9, 7, 3],
  },
};
