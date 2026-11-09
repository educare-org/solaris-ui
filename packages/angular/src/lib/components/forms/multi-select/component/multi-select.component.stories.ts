import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisMultiSelectComponent } from './multi-select.component';
import { expect } from 'storybook/test';

const meta: Meta<SolarisMultiSelectComponent> = {
  component: SolarisMultiSelectComponent,
  title: 'SolarisMultiSelectComponent',
};
export default meta;

type Story = StoryObj<SolarisMultiSelectComponent>;

export const Primary: Story = {
  args: {},
};

export const Suffix: Story = {
  args: { suffix: 'info' },
};

export const InConstrainedContainer: Story = {
  name: 'InConstrainedContainer (320px)',
  render: () => ({
    template: `
      <div style="width: 320px; max-width: 320px; overflow: hidden; border: 1px dashed var(--solaris-neutral-border-default); padding: 16px; box-sizing: border-box;">
        <solaris-multi-select label="Account type" placeholder="Select account type">
          <solaris-option value="independent" label="Escola independente (unidade própria)" />
          <solaris-option value="network" label="Rede (2 ou mais instituições)" />
          <solaris-option value="maintainer" label="Mantenedora" />
        </solaris-multi-select>
      </div>
    `,
  }),
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/multi-select/gi)).toBeTruthy();
  },
};
