import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisRadioComponent } from './radio.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisRadioComponent> = {
  component: SolarisRadioComponent,
  title: 'SolarisRadioComponent',
};
export default meta;

type Story = StoryObj<SolarisRadioComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/radio/gi)).toBeTruthy();
  },
};

export const WithDescription: Story = {
  args: { label: 'Pro', description: 'For growing teams.' },
};

export const LabelStart: Story = {
  args: { label: 'Pro', labelPosition: 'start' },
};

export const Sizes: Story = {
  args: { label: 'Pro', size: 'lg', density: 'comfortable' },
};
