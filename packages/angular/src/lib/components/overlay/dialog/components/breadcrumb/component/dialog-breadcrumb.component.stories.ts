import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisDialogBreadcrumbComponent } from './dialog-breadcrumb.component';

const meta: Meta<SolarisDialogBreadcrumbComponent> = {
  component: SolarisDialogBreadcrumbComponent,
  title: 'Overlay/DialogBreadcrumb',
};

export default meta;

type Story = StoryObj<SolarisDialogBreadcrumbComponent>;

const uploadSteps = [
  { value: 'upload', label: 'Upload' },
  { value: 'format', label: 'Format' },
  { value: 'voice', label: 'Voice' },
  { value: 'pronunciation', label: 'Pronunciation' },
];

export const Basic: Story = {
  args: {
    items: uploadSteps,
    activeStep: 1,
  },
};

export const FirstStep: Story = {
  args: {
    items: uploadSteps,
    activeStep: 0,
  },
};

export const LastStep: Story = {
  args: {
    items: uploadSteps,
    activeStep: 3,
  },
};

export const WithError: Story = {
  args: {
    items: [
      { value: 'upload', label: 'Upload', completed: true },
      { value: 'format', label: 'Format', error: true },
      { value: 'voice', label: 'Voice', disabled: true },
      { value: 'pronunciation', label: 'Pronunciation' },
    ],
    activeStep: 0,
  },
};

export const NonLinear: Story = {
  args: {
    items: uploadSteps,
    activeStep: 0,
    linear: false,
  },
};
