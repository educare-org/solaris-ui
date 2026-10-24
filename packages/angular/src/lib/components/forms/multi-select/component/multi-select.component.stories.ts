import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisMultiSelectComponent } from './multi-select.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisMultiSelectComponent> = {
  component: SolarisMultiSelectComponent,
  title: 'SolarisMultiSelectComponent',
};
export default meta;

type Story = StoryObj<SolarisMultiSelectComponent>;

export const Primary: Story = {
  args: {},
};

export const Suffix: Story = {
  args: { suffix: 'info' },
};

export const RadiusXl: Story = {
  args: { radius: 'xl' },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/multi-select/gi)).toBeTruthy();
  },
};
