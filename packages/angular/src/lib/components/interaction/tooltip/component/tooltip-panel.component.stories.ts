import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisTooltipPanelComponent } from './tooltip-panel.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisTooltipPanelComponent> = {
  component: SolarisTooltipPanelComponent,
  title: 'SolarisTooltipPanelComponent',
};
export default meta;

type Story = StoryObj<SolarisTooltipPanelComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/tooltip-panel/gi)).toBeTruthy();
  },
};
