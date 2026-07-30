import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisTabPanelComponent } from './tab-panel.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisTabPanelComponent> = {
  component: SolarisTabPanelComponent,
  title: 'SolarisTabPanelComponent',
};
export default meta;

type Story = StoryObj<SolarisTabPanelComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/tab-panel/gi)).toBeTruthy();
  },
};
