import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisDialogComponent } from './dialog.component';

const meta: Meta<SolarisDialogComponent> = {
  component: SolarisDialogComponent,
  title: 'Overlay/Dialog',
  render: (args) => ({
    props: args,
    template: `<solaris-dialog [options]="options" />`,
  }),
};
export default meta;

type Story = StoryObj<SolarisDialogComponent>;

export const Basic: Story = {
  args: {
    options: {
      title: 'Dialog Title',
      description: 'Basic dialog.',
      actions: [{ label: 'OK', color: 'primary', close: true }],
    },
  },
};

export const Warning: Story = {
  args: {
    options: {
      title: 'Discard changes?',
      description: 'Unsaved changes.',
      variant: 'warning',
      actions: [
        { label: 'Cancel', appearance: 'ghost', close: true },
        { label: 'Discard', color: 'danger', close: true },
      ],
    },
  },
};

export const Placement: Story = {
  args: {
    options: {
      title: 'Placed dialog',
      description: 'Anchored to the bottom-left corner.',
      placement: 'bottom-left',
      actions: [{ label: 'OK', color: 'primary', close: true }],
    },
  },
};

export const NoSeparators: Story = {
  args: {
    options: {
      title: 'Dialog without separators',
      description: 'Header and footer separators are disabled.',
      headerSeparator: false,
      footerSeparator: false,
      actions: [{ label: 'OK', color: 'primary', close: true }],
    },
  },
};

export const CustomActions: Story = {
  args: {
    options: {
      title: 'Dialog with custom actions',
      description: 'Wide full-radius buttons with comfortable density.',
      density: 'comfortable',
      actionsShape: 'wide',
      actionsRadius: 'full',
      actions: [
        { label: 'Cancel', appearance: 'ghost', close: true },
        { label: 'Confirm', color: 'primary', icon: 'check', close: true },
      ],
    },
  },
};
