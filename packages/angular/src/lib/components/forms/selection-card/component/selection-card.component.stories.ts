import type { Meta, StoryObj } from '@storybook/angular';

import { SolarisSelectionCardComponent } from './selection-card.component';

const meta: Meta<SolarisSelectionCardComponent> = {
  component: SolarisSelectionCardComponent,
  title: 'Forms/Selection Card',
  render: (args) => ({
    props: args,
    template: `
      <solaris-selection-card ariaLabel="Basic plan">
        <h3>Basic plan</h3>
        <p>For small teams getting started.</p>
      </solaris-selection-card>
    `,
  }),
};

export default meta;

type Story = StoryObj<SolarisSelectionCardComponent>;

export const Basic: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
