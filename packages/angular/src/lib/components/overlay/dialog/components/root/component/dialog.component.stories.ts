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
    options: { title: 'Dialog Title', description: 'Basic dialog.', actions: [{ label: 'OK', color: 'primary', close: true }] },
  },
};

export const Warning: Story = {
  args: {
    options: { title: 'Discard changes?', description: 'Unsaved changes.', variant: 'warning', actions: [{ label: 'Cancel', appearance: 'ghost', close: true }, { label: 'Discard', color: 'danger', close: true }] },
  },
};
