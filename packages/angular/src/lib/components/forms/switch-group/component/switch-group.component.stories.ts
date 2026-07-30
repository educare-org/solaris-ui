import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSwitchGroupComponent } from './switch-group.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisSwitchGroupComponent> = {
  component: SolarisSwitchGroupComponent,
  title: 'SolarisSwitchGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisSwitchGroupComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/switch-group/gi)).toBeTruthy();
  },
};
