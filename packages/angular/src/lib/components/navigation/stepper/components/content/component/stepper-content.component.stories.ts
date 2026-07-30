import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisStepperContentComponent } from './stepper-content.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisStepperContentComponent> = {
  component: SolarisStepperContentComponent,
  title: 'SolarisStepperContentComponent',
};
export default meta;

type Story = StoryObj<SolarisStepperContentComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/stepper-content/gi)).toBeTruthy();
  },
};
