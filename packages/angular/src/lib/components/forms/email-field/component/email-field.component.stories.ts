import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisEmailFieldComponent } from './email-field.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisEmailFieldComponent> = {
  component: SolarisEmailFieldComponent,
  title: 'SolarisEmailFieldComponent',
};
export default meta;

type Story = StoryObj<SolarisEmailFieldComponent>;

export const Primary: Story = {
  args: {},
};

export const Clearable: Story = {
  args: { clearable: true, value: 'user@company.com' },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/email-field/gi)).toBeTruthy();
  },
};
