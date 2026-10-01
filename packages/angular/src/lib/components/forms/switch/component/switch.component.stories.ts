import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSwitchComponent } from './switch.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisSwitchComponent> = {
  component: SolarisSwitchComponent,
  title: 'SolarisSwitchComponent',
};
export default meta;

type Story = StoryObj<SolarisSwitchComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/switch/gi)).toBeTruthy();
  },
};

export const WithIcon: Story = {
  args: { icon: 'check' },
};

export const WithText: Story = {
  args: { text: 'ON' },
};

export const Sizes: Story = {
  args: { size: 'lg', density: 'comfortable' },
};
