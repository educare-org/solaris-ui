import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisSelectComponent } from './select.component';

const meta: Meta<SolarisSelectComponent> = {
  component: SolarisSelectComponent,
  title: 'Forms/Select',
  render: (args) => ({
    props: args,
    template: `<solaris-select [label]="label" [placeholder]="placeholder" [searchable]="searchable" [clearable]="clearable" [disabled]="disabled">
      <solaris-option value="1" label="Option 1" />
      <solaris-option value="2" label="Option 2" />
      <solaris-option value="3" label="Option 3" />
    </solaris-select>`,
  }),
  argTypes: {
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<SolarisSelectComponent>;

export const Basic: Story = { args: { label: 'Choose an option', placeholder: 'Select...' } };
export const Searchable: Story = { args: { label: 'Search', placeholder: 'Type to search...', searchable: true } };
export const Clearable: Story = { args: { label: 'Clearable', placeholder: 'Select...', clearable: true } };
export const Disabled: Story = { args: { label: 'Disabled', placeholder: 'Cannot open', disabled: true } };
