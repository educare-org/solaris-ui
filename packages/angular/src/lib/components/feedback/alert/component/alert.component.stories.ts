import type { Meta } from '@storybook/angular';
import { SolarisAlertComponent } from './alert.component';

const meta: Meta<SolarisAlertComponent> = {
  component: SolarisAlertComponent,
  title: 'Feedback/Alert',
  render: (args: any) => ({
    props: args,
    template: `<solaris-alert [variant]="variant" [title]="title" [description]="description" [textPosition]="textPosition" />`,
  }),
};
export default meta;

export const Info = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'Informational alert.',
  },
};
export const Success = {
  args: { variant: 'success', title: 'Success', description: 'Completed.' },
};
export const Warning = {
  args: { variant: 'warning', title: 'Warning', description: 'Check input.' },
};
export const Danger = {
  args: {
    variant: 'danger',
    title: 'Error',
    description: 'An error occurred.',
  },
};

export const TextPositionStart = {
  args: {
    variant: 'info',
    textPosition: 'start',
    description: 'Text aligned to start.',
  },
};

export const TextPositionCenter = {
  args: {
    variant: 'info',
    textPosition: 'center',
    description: 'Text centered.',
  },
};

export const TextPositionEnd = {
  args: {
    variant: 'info',
    textPosition: 'end',
    description: 'Text aligned to end.',
  },
};

export const TextPositionSpaceBetween = {
  render: () => ({
    props: { variant: 'info', textPosition: 'space-between' as const },
    template: `
      <solaris-alert variant="info" [textPosition]="textPosition">
        <p solaris-alert-description>First description.</p>
        <p solaris-alert-description>Second description.</p>
      </solaris-alert>
    `,
  }),
};
