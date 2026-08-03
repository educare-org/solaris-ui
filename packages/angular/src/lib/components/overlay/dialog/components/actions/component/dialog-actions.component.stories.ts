import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogActionsComponent } from './dialog-actions.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogActionsComponent> = {
  component: SolarisDialogActionsComponent,
  title: 'SolarisDialogActionsComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogActionsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-actions/gi)).toBeTruthy();
  },
};
