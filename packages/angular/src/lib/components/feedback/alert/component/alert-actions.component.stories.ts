import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisAlertActionsComponent } from './alert-actions.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisAlertActionsComponent> = {
  component: SolarisAlertActionsComponent,
  title: 'SolarisAlertActionsComponent',
};
export default meta;

type Story = StoryObj<SolarisAlertActionsComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/alert-actions/gi)).toBeTruthy();
  },
};
