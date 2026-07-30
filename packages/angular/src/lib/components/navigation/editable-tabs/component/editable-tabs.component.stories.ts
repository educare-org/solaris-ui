import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisEditableTabsComponent } from './editable-tabs.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisEditableTabsComponent> = {
  component: SolarisEditableTabsComponent,
  title: 'SolarisEditableTabsComponent',
};
export default meta;

type Story = StoryObj<SolarisEditableTabsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/editable-tabs/gi)).toBeTruthy();
  },
};
