import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisFormLabelComponent } from './form-label.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisFormLabelComponent> = {
  component: SolarisFormLabelComponent,
  title: 'SolarisFormLabelComponent',
};
export default meta;

type Story = StoryObj<SolarisFormLabelComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/form-label/gi)).toBeTruthy();
  },
};
