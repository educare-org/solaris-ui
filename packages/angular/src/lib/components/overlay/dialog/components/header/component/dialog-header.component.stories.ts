import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogHeaderComponent } from './dialog-header.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogHeaderComponent> = {
  component: SolarisDialogHeaderComponent,
  title: 'SolarisDialogHeaderComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogHeaderComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-header/gi)).toBeTruthy();
  },
};
