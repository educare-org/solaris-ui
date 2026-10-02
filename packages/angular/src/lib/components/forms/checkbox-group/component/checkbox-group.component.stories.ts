import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisCheckboxGroupComponent } from './checkbox-group.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisCheckboxGroupComponent> = {
  component: SolarisCheckboxGroupComponent,
  title: 'SolarisCheckboxGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisCheckboxGroupComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/checkbox-group/gi)).toBeTruthy();
  },
};

export const Sizes: Story = {
  args: { size: 'lg', density: 'comfortable' },
};
