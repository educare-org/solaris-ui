import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisRadioGroupComponent } from './radio-group.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisRadioGroupComponent> = {
  component: SolarisRadioGroupComponent,
  title: 'SolarisRadioGroupComponent',
};
export default meta;

type Story = StoryObj<SolarisRadioGroupComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/radio-group/gi)).toBeTruthy();
  },
};
