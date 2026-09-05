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
