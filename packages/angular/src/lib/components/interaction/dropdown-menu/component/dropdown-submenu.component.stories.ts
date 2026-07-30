import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDropdownSubmenuComponent } from './dropdown-submenu.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDropdownSubmenuComponent> = {
  component: SolarisDropdownSubmenuComponent,
  title: 'SolarisDropdownSubmenuComponent',
};
export default meta;

type Story = StoryObj<SolarisDropdownSubmenuComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dropdown-submenu/gi)).toBeTruthy();
  },
};
