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
