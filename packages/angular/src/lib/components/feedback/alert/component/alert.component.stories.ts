import type { Meta } from '@storybook/angular';
import { SolarisAlertComponent } from './alert.component';

const meta: Meta<SolarisAlertComponent> = {
  component: SolarisAlertComponent,
  title: 'Feedback/Alert',
  render: (args: any) => ({
    props: args,
    template: `<solaris-alert [variant]="variant" [title]="title" [description]="description" />`,
  }),
};
export default meta;

export const Info = { args: { variant: 'info', title: 'Information', description: 'Informational alert.' } };
export const Success = { args: { variant: 'success', title: 'Success', description: 'Completed.' } };
export const Warning = { args: { variant: 'warning', title: 'Warning', description: 'Check input.' } };
export const Danger = { args: { variant: 'danger', title: 'Error', description: 'An error occurred.' } };
