import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisCheckboxComponent } from './checkbox.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisCheckboxComponent> = {
  component: SolarisCheckboxComponent,
  title: 'SolarisCheckboxComponent',
};
export default meta;

type Story = StoryObj<SolarisCheckboxComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/checkbox/gi)).toBeTruthy();
  },
};
