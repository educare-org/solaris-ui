import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogContainerComponent } from './dialog-container.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogContainerComponent> = {
  component: SolarisDialogContainerComponent,
  title: 'SolarisDialogContainerComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogContainerComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-container/gi)).toBeTruthy();
  },
};
