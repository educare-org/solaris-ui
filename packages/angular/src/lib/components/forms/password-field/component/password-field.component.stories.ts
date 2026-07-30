import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisPasswordFieldComponent } from './password-field.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisPasswordFieldComponent> = {
  component: SolarisPasswordFieldComponent,
  title: 'SolarisPasswordFieldComponent',
};
export default meta;

type Story = StoryObj<SolarisPasswordFieldComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/password-field/gi)).toBeTruthy();
  },
};
