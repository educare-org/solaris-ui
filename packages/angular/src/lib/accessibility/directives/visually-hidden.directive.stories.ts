import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisVisuallyHiddenDirective } from './visually-hidden.directive';

const meta: Meta<SolarisVisuallyHiddenDirective> = {
  directive: SolarisVisuallyHiddenDirective,
  title: 'Foundation/VisuallyHidden',
  render: (args) => ({
    props: args,
    template: `
      <span [solaris-visually-hidden]="true">This text is visually hidden but available to screen readers</span>
      <p>The text above is visually hidden. Screen readers will announce it.</p>
    `,
  }),
};

export default meta;
type Story = StoryObj<SolarisVisuallyHiddenDirective>;

export const Default: Story = {};
