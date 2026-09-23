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

export const Scrolled: Story = {
  args: {
    scrolled: true,
  },
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector('solaris-dialog-footer');
    await expect(footer?.getAttribute('data-scrolled')).toBe('');
  },
};
