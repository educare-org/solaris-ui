import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisToastContainerComponent } from './toast-container.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisToastContainerComponent> = {
  component: SolarisToastContainerComponent,
  title: 'SolarisToastContainerComponent',
};
export default meta;

type Story = StoryObj<SolarisToastContainerComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/toast-container/gi)).toBeTruthy();
  },
};
