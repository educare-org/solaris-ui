import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisStepperComponent } from './stepper.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisStepperComponent> = {
  component: SolarisStepperComponent,
  title: 'SolarisStepperComponent',
};
export default meta;

type Story = StoryObj<SolarisStepperComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/stepper/gi)).toBeTruthy();
  },
};
