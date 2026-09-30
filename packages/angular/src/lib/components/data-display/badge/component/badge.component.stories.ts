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

export const Count: Story = {
  args: {
    color: 'danger',
    count: 3,
  } as Partial<SolarisBadgeComponent>,
};

export const CountCapped: Story = {
  args: {
    color: 'primary',
    count: 103,
  } as Partial<SolarisBadgeComponent>,
};

export const Dot: Story = {
  args: {
    color: 'success',
    dot: true,
    ariaLabel: 'Online',
  } as Partial<SolarisBadgeComponent>,
};

export const DotPulse: Story = {
  args: {
    color: 'danger',
    dot: true,
    pulse: true,
    ariaLabel: 'Live',
  } as Partial<SolarisBadgeComponent>,
};
