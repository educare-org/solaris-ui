import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisDialogHeaderComponent } from './dialog-header.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisDialogHeaderComponent> = {
  component: SolarisDialogHeaderComponent,
  title: 'SolarisDialogHeaderComponent',
};
export default meta;

type Story = StoryObj<SolarisDialogHeaderComponent>;

export const Primary: Story = {
  args: {
    title: 'Dialog title',
    description: 'Dialog description rendered below the title.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Dialog title')).toBeTruthy();
  },
};

export const WithIcon: Story = {
  args: {
    icon: 'info',
    title: 'Dialog title',
    description: 'Icon, title and close stay centered on the same row.',
    variant: 'info',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Dialog title')).toBeTruthy();
  },
};

export const Closeable: Story = {
  args: {
    icon: 'info',
    title: 'Dialog title',
    description: 'The close button is vertically centered with the title.',
    closeable: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Close' })).toBeTruthy();
  },
};

export const Scrolled: Story = {
  args: {
    title: 'Dialog title',
    description: 'Elevated with a shadow once the content scrolls.',
    closeable: true,
    scrolled: true,
  },
  play: async ({ canvas }) => {
    const header = canvas
      .getByText('Dialog title')
      .closest('solaris-dialog-header') as HTMLElement;
    await expect(header?.getAttribute('data-scrolled')).toBe('');
  },
};

export const DensityCompact: Story = {
  args: {
    icon: 'info',
    title: 'Dialog title',
    description: 'Compact pairs an md title with an md icon.',
    variant: 'info',
    density: 'compact',
  },
  play: async ({ canvas }) => {
    const header = canvas
      .getByText('Dialog title')
      .closest('solaris-dialog-header') as HTMLElement;
    await expect(header?.getAttribute('data-density')).toBe('compact');
  },
};

export const DensityNormal: Story = {
  args: {
    icon: 'info',
    title: 'Dialog title',
    description: 'Normal pairs an lg title with an lg icon.',
    variant: 'info',
    density: 'normal',
  },
  play: async ({ canvas }) => {
    const header = canvas
      .getByText('Dialog title')
      .closest('solaris-dialog-header') as HTMLElement;
    await expect(header?.getAttribute('data-density')).toBe('normal');
  },
};

export const Flat: Story = {
  args: {
    icon: 'info',
    title: 'Dialog title',
    description: 'Flat fuses the header with the content below.',
    variant: 'info',
    flat: true,
  },
  play: async ({ canvas }) => {
    const header = canvas
      .getByText('Dialog title')
      .closest('solaris-dialog-header') as HTMLElement;
    await expect(header?.getAttribute('data-flat')).toBe('');
  },
};

export const DensityComfortable: Story = {
  args: {
    icon: 'info',
    title: 'Dialog title',
    description: 'Comfortable pairs an xl title with an xl icon.',
    variant: 'info',
    density: 'comfortable',
  },
  play: async ({ canvas }) => {
    const header = canvas
      .getByText('Dialog title')
      .closest('solaris-dialog-header') as HTMLElement;
    await expect(header?.getAttribute('data-density')).toBe('comfortable');
  },
};
