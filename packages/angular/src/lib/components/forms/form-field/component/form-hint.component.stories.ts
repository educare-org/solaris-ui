import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisFormHintComponent } from './form-hint.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisFormHintComponent> = {
  component: SolarisFormHintComponent,
  title: 'SolarisFormHintComponent',
};
export default meta;

type Story = StoryObj<SolarisFormHintComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/form-hint/gi)).toBeTruthy();
  },
};
