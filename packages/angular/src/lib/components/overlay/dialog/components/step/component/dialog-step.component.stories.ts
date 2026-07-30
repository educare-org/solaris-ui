import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogStepComponent } from './dialog-step.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogStepComponent> = {
  component: SolarisDialogStepComponent,
  title: 'SolarisDialogStepComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogStepComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-step/gi)).toBeTruthy();
  },
};
