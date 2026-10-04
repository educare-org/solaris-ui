import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisDateRangePickerComponent } from './date-range-picker.component';

const meta: Meta<SolarisDateRangePickerComponent> = {
  component: SolarisDateRangePickerComponent,
  title: 'Forms/Date Range Picker',
};

export default meta;

type Story = StoryObj<SolarisDateRangePickerComponent>;

export const Basic: Story = {
  args: { label: 'Date range' },
};

export const Clearable: Story = {
  args: { label: 'Date range', clearable: true },
};

export const CalendarOptions: Story = {
  args: {
    label: 'Date range',
    weekStartsOn: 1,
    disablePast: true,
    dateFormat: 'numeric',
  },
};
