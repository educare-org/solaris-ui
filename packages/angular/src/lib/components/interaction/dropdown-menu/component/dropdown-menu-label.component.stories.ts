import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDropdownMenuLabelComponent } from './dropdown-menu-label.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDropdownMenuLabelComponent> = {
  component: SolarisDropdownMenuLabelComponent,
  title: 'SolarisDropdownMenuLabelComponent',
};
export default meta;

type Story = StoryObj<SolarisDropdownMenuLabelComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dropdown-menu-label/gi)).toBeTruthy();
  },
};
