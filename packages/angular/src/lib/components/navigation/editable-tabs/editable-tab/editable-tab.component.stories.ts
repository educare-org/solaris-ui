import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisEditableTabComponent } from './editable-tab.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisEditableTabComponent> = {
  component: SolarisEditableTabComponent,
  title: 'SolarisEditableTabComponent',
};
export default meta;

type Story = StoryObj<SolarisEditableTabComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/editable-tab/gi)).toBeTruthy();
  },
};
