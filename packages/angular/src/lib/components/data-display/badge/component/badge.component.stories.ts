import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisBadgeComponent } from './badge.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisBadgeComponent> = {
  component: SolarisBadgeComponent,
  title: 'SolarisBadgeComponent',
};
export default meta;

type Story = StoryObj<SolarisBadgeComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/badge/gi)).toBeTruthy();
  },
};
