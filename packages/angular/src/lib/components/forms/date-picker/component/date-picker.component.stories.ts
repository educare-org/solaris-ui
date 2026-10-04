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

export const Clearable: Story = {
  args: { label: 'Date', clearable: true },
};

export const CalendarOptions: Story = {
  args: {
    label: 'Date',
    weekStartsOn: 1,
    disablePast: true,
    dateFormat: 'numeric',
  },
};
