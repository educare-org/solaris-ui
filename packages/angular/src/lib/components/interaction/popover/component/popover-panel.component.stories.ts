import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisPopoverPanelComponent } from './popover-panel.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisPopoverPanelComponent> = {
  component: SolarisPopoverPanelComponent,
  title: 'SolarisPopoverPanelComponent',
};
export default meta;

type Story = StoryObj<SolarisPopoverPanelComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/popover-panel/gi)).toBeTruthy();
  },
};
