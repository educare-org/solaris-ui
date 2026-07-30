import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisStepperActionsComponent } from './stepper-actions.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisStepperActionsComponent> = {
  component: SolarisStepperActionsComponent,
  title: 'SolarisStepperActionsComponent',
};
export default meta;

type Story = StoryObj<SolarisStepperActionsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/stepper-actions/gi)).toBeTruthy();
  },
};
