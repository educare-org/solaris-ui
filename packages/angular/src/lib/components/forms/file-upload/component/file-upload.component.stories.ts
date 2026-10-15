import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisFileUploadComponent } from './file-upload.component';

const meta: Meta<SolarisFileUploadComponent> = {
  component: SolarisFileUploadComponent,
  title: 'SolarisFileUploadComponent',
};

export default meta;
type Story = StoryObj<SolarisFileUploadComponent>;

export const Dropzone: Story = {
  args: {
    label: 'Attachments',
    hint: 'Drag files here or browse.',
  },
};

export const Button: Story = {
  args: {
    variant: 'button',
    label: 'Avatar photo',
  },
};

export const Field: Story = {
  args: {
    variant: 'field',
    label: 'Attachment',
  },
};
