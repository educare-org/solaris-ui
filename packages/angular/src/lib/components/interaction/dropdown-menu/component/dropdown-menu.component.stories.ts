import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDropdownMenuComponent } from './dropdown-menu.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDropdownMenuComponent> = {
  component: SolarisDropdownMenuComponent,
  title: 'SolarisDropdownMenuComponent',
};
export default meta;

type Story = StoryObj<SolarisDropdownMenuComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dropdown-menu/gi)).toBeTruthy();
  },
};
