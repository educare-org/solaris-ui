import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSegmentedItemComponent } from './segmented-item.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisSegmentedItemComponent> = {
  component: SolarisSegmentedItemComponent,
  title: 'SolarisSegmentedItemComponent',
};
export default meta;

type Story = StoryObj<SolarisSegmentedItemComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/segmented-item/gi)).toBeTruthy();
  },
};
