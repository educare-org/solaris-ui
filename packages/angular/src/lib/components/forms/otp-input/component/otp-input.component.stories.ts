import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisOtpInputComponent } from './otp-input.component';

const meta: Meta<SolarisOtpInputComponent> = {
  component: SolarisOtpInputComponent,
  title: 'Forms/OtpInput',
  args: {
    label: 'Verification code',
    maxLength: 6,
    minLength: 4,
  },
};
export default meta;

type Story = StoryObj<SolarisOtpInputComponent>;

export const Primary: Story = {
  args: {},
};

export const SixDigits: Story = {
  args: {
    label: 'Verification code',
    maxLength: 6,
  },
};

export const TwelveDigits: Story = {
  args: {
    label: 'Verification code',
    maxLength: 12,
  },
};

export const Masked: Story = {
  args: {
    label: 'Masked code',
    maxLength: 6,
    masked: true,
  },
};

export const Grouped: Story = {
  args: {
    label: 'Grouped code',
    maxLength: 6,
    separatorEvery: 3,
  },
};

export const Alphanumeric: Story = {
  args: {
    label: 'Alphanumeric code',
    maxLength: 6,
    charType: 'alphanumeric',
  },
};

export const Required: Story = {
  args: {
    label: 'Required code',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled code',
    disabled: true,
    value: '123456',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Read-only code',
    readonly: true,
    value: '123456',
  },
};

export const Filled: Story = {
  args: {
    label: 'Filled appearance',
    appearance: 'filled',
  },
};
