import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisStepComponent } from './step.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisStepComponent> = {
  component: SolarisStepComponent,
  title: 'SolarisStepComponent',
};
export default meta;

type Story = StoryObj<SolarisStepComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/step/gi)).toBeTruthy();
  },
};
