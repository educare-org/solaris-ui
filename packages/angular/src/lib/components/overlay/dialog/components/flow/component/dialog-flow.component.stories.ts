import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogFlowComponent } from './dialog-flow.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogFlowComponent> = {
  component: SolarisDialogFlowComponent,
  title: 'SolarisDialogFlowComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogFlowComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-flow/gi)).toBeTruthy();
  },
};
