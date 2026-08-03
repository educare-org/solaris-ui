import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisButtonGroupComponent } from './button-group.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisButtonGroupComponent> = {
  component: SolarisButtonGroupComponent,
  title: 'SolarisButtonGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisButtonGroupComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/button-group/gi)).toBeTruthy();
  },
};
