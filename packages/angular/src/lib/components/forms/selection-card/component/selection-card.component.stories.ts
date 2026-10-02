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

export const RadioEnd: Story = {
  args: {
    selection: 'radio',
    selectionPosition: 'end',
    checked: true,
  },
};

export const Switch: Story = {
  args: {
    selection: 'switch',
    checked: true,
  },
};

export const SwitchEnd: Story = {
  args: {
    selection: 'switch',
    selectionPosition: 'end',
  },
};

export const MediaStart: Story = {
  args: {
    mediaPosition: 'start',
  },
};

export const Sizes: Story = {
  args: {
    size: 'lg',
    density: 'comfortable',
  },
};
