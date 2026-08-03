import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisFormErrorComponent } from './form-error.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisFormErrorComponent> = {
  component: SolarisFormErrorComponent,
  title: 'SolarisFormErrorComponent',
};
export default meta;

type Story = StoryObj<SolarisFormErrorComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/form-error/gi)).toBeTruthy();
  },
};
