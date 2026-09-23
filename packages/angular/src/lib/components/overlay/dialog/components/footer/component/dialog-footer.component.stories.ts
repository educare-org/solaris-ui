import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogFooterComponent } from './dialog-footer.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogFooterComponent> = {
  component: SolarisDialogFooterComponent,
  title: 'SolarisDialogFooterComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogFooterComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-footer/gi)).toBeTruthy();
  },
};
