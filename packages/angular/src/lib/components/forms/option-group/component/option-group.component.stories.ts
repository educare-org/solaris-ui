import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisOptionGroupComponent } from './option-group.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisOptionGroupComponent> = {
  component: SolarisOptionGroupComponent,
  title: 'SolarisOptionGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisOptionGroupComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/option-group/gi)).toBeTruthy();
  },
};
