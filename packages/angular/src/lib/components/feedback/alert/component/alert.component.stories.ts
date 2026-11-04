import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisAlertComponent } from './alert.component';
import { SolarisAlertActionsComponent } from './alert-actions.component';
import { SolarisAlertTitleDirective } from '../directives/alert-title.directive';
import { SolarisAlertDescriptionDirective } from '../directives/alert-description.directive';

const meta: Meta<SolarisAlertComponent> = {
  component: SolarisAlertComponent,
  title: 'Feedback/Alert',
  render: (args: AlertStoryArgs) => ({
    props: args,
    moduleMetadata: {
      imports: [
        SolarisAlertActionsComponent,
        SolarisAlertTitleDirective,
        SolarisAlertDescriptionDirective,
      ],
    },
    template: `
      <solaris-alert
        [variant]="variant"
        [appearance]="appearance"
        [size]="size"
        [radius]="radius"
        [density]="density"
        [closable]="closable"
        [showIcon]="showIcon"
        [textPosition]="textPosition"
      >
        <h3 solaris-alert-title>{{ title }}</h3>
        <p solaris-alert-description>{{ description }}</p>
      </solaris-alert>
    `,
  }),
};
export default meta;

type AlertStoryArgs = Partial<SolarisAlertComponent> & {
  title?: string;
  description?: string;
};

type Story = StoryObj<SolarisAlertComponent>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'Informational alert.',
  } as AlertStoryArgs,
};
export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    description: 'Completed.',
  } as AlertStoryArgs,
};
export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'Check input.',
  } as AlertStoryArgs,
};
export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Error',
    description: 'An error occurred.',
  } as AlertStoryArgs,
};

export const Small: Story = {
  args: { size: 'sm', description: 'Small alert.' } as AlertStoryArgs,
};

export const Large: Story = {
  args: { size: 'lg', description: 'Large alert.' } as AlertStoryArgs,
};

export const Closable: Story = {
  args: { closable: true, description: 'Dismissible alert.' } as AlertStoryArgs,
};

export const TextPositionCenter: Story = {
  args: {
    variant: 'info',
    textPosition: 'center',
    description: 'Text centered.',
  } as AlertStoryArgs,
};

export const TextPositionSpaceBetween: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SolarisAlertDescriptionDirective],
    },
    template: `
      <solaris-alert variant="info" textPosition="space-between">
        <p solaris-alert-description>First description.</p>
        <p solaris-alert-description>Second description.</p>
      </solaris-alert>
    `,
  }),
};
