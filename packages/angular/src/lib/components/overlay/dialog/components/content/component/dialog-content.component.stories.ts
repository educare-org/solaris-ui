import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogContentComponent } from './dialog-content.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogContentComponent> = {
  component: SolarisDialogContentComponent,
  title: 'SolarisDialogContentComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogContentComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-content/gi)).toBeTruthy();
  },
};
