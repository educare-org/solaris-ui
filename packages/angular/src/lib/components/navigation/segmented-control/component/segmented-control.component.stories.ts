import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSegmentedControlComponent } from './segmented-control.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisSegmentedControlComponent> = {
  component: SolarisSegmentedControlComponent,
  title: 'SolarisSegmentedControlComponent',
};
export default meta;

type Story = StoryObj<SolarisSegmentedControlComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/segmented-control/gi)).toBeTruthy();
  },
};
