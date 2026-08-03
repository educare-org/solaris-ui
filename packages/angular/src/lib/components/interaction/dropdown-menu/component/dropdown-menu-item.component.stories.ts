import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDropdownMenuItemComponent } from './dropdown-menu-item.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDropdownMenuItemComponent> = {
  component: SolarisDropdownMenuItemComponent,
  title: 'SolarisDropdownMenuItemComponent',
};
export default meta;

type Story = StoryObj<SolarisDropdownMenuItemComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dropdown-menu-item/gi)).toBeTruthy();
  },
};
