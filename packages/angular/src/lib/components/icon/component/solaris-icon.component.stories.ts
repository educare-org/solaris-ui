import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisIconComponent } from './solaris-icon.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisIconComponent> = {
  component: SolarisIconComponent,
  title: 'SolarisIconComponent',
};
export default meta;

type Story = StoryObj<SolarisIconComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/solaris-icon/gi)).toBeTruthy();
  },
};
