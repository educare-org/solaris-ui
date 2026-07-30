import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDropdownSubmenuTriggerComponent } from './dropdown-submenu-trigger.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDropdownSubmenuTriggerComponent> = {
  component: SolarisDropdownSubmenuTriggerComponent,
  title: 'SolarisDropdownSubmenuTriggerComponent',
};
export default meta;

type Story = StoryObj<SolarisDropdownSubmenuTriggerComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dropdown-submenu-trigger/gi)).toBeTruthy();
  },
};
