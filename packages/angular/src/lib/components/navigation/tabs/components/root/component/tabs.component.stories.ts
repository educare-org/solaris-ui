import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisTabsComponent } from './tabs.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisTabsComponent> = {
  component: SolarisTabsComponent,
  title: 'SolarisTabsComponent',
};
export default meta;

type Story = StoryObj<SolarisTabsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/tabs/gi)).toBeTruthy();
  },
};
