import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisOptionComponent } from './option.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisOptionComponent> = {
  component: SolarisOptionComponent,
  title: 'SolarisOptionComponent',
};
export default meta;

type Story = StoryObj<SolarisOptionComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/option/gi)).toBeTruthy();
  },
};
