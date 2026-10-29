import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogContentComponent } from './dialog-content.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogContentComponent> = {
  component: SolarisDialogContentComponent,
  title: 'SolarisDialogContentComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogContentComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/dialog-content/gi)).toBeTruthy();
  },
};

export const DensityCompact: Story = {
  args: {
    density: 'compact',
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector(
      'solaris-dialog-content',
    ) as HTMLElement;
    await expect(host?.getAttribute('data-density')).toBe('compact');
  },
};

export const DensityNormal: Story = {
  args: {
    density: 'normal',
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector(
      'solaris-dialog-content',
    ) as HTMLElement;
    await expect(host?.getAttribute('data-density')).toBe('normal');
  },
};

export const DensityComfortable: Story = {
  args: {
    density: 'comfortable',
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector(
      'solaris-dialog-content',
    ) as HTMLElement;
    await expect(host?.getAttribute('data-density')).toBe('comfortable');
  },
};
