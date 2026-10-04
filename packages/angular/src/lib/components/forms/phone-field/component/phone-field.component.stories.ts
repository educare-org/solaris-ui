import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisPhoneFieldComponent } from './phone-field.component';

const meta: Meta<SolarisPhoneFieldComponent> = {
  component: SolarisPhoneFieldComponent,
  title: 'Forms/PhoneField',
  args: {
    label: 'Phone',
    defaultCountry: 'BR',
  },
};
export default meta;

type Story = StoryObj<SolarisPhoneFieldComponent>;

export const Primary: Story = {
  args: {},
};

export const BrazilDefault: Story = {
  args: {
    label: 'Phone (Brazil)',
    defaultCountry: 'BR',
  },
};

export const UnitedStatesDefault: Story = {
  args: {
    label: 'Phone (US)',
    defaultCountry: 'US',
  },
};

export const Required: Story = {
  args: {
    label: 'Phone (required)',
    required: true,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Mobile',
    hint: 'Prefer a mobile number.',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    label: 'Phone',
    placeholder: 'Type your phone number',
  },
};

export const RestrictedCountries: Story = {
  args: {
    label: 'Phone (restricted)',
    countryList: ['US', 'GB', 'BR', 'PT'],
  },
};

export const Outline: Story = {
  args: {
    label: 'Outline',
    appearance: 'outline',
  },
};

export const Surface: Story = {
  args: {
    label: 'Surface',
    appearance: 'surface',
  },
};

export const Filled: Story = {
  args: {
    label: 'Filled',
    appearance: 'filled',
  },
};

export const Compact: Story = {
  args: {
    label: 'Compact',
    density: 'compact',
  },
};

export const Normal: Story = {
  args: {
    label: 'Normal',
    density: 'normal',
  },
};

export const Comfortable: Story = {
  args: {
    label: 'Comfortable',
    density: 'comfortable',
  },
};

export const LargeRadius: Story = {
  args: {
    label: 'Radius lg',
    radius: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
    value: '+5511999998888',
  },
};

export const Readonly: Story = {
  args: {
    label: 'Read-only',
    readonly: true,
    value: '+5511999998888',
  },
};

export const Clearable: Story = {
  args: {
    label: 'Clearable',
    clearable: true,
    value: '+5511999998888',
  },
};
