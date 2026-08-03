import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDropdownMenuGroupComponent } from './dropdown-menu-group.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDropdownMenuGroupComponent> = {
  component: SolarisDropdownMenuGroupComponent,
  title: 'SolarisDropdownMenuGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisDropdownMenuGroupComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dropdown-menu-group/gi)).toBeTruthy();
  },
};
