import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisTabComponent } from './tab.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisTabComponent> = {
  component: SolarisTabComponent,
  title: 'SolarisTabComponent',
};
export default meta;

type Story = StoryObj<SolarisTabComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/tab/gi)).toBeTruthy();
  },
};
