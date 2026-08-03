import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisFormFieldComponent } from './form-field.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisFormFieldComponent> = {
  component: SolarisFormFieldComponent,
  title: 'SolarisFormFieldComponent',
};
export default meta;

type Story = StoryObj<SolarisFormFieldComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/form-field/gi)).toBeTruthy();
  },
};
