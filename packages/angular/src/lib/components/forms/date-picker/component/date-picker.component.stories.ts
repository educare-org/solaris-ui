import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisDatePickerComponent } from './date-picker.component';

const meta: Meta<SolarisDatePickerComponent> = {
  component: SolarisDatePickerComponent,
  title: 'Forms/Date Picker',
};

export default meta;

type Story = StoryObj<SolarisDatePickerComponent>;

export const Basic: Story = {
  args: { label: 'Date' },
};

export const Required: Story = {
  args: { label: 'Date', required: true },
};
