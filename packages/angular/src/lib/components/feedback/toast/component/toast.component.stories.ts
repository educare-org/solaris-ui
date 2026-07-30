import type { Meta } from '@storybook/angular';
import { SolarisToastComponent } from './toast.component';

const meta: Meta<SolarisToastComponent> = {
  component: SolarisToastComponent,
  title: 'Feedback/Toast',
  render: (args: any) => ({
    props: args,
    template: `<solaris-toast [options]="options" />`,
  }),
};
export default meta;

export const Neutral = { args: { options: { title: 'Toast', description: 'A message.' } } };
export const Success = { args: { options: { variant: 'success', title: 'Saved!', description: 'Changes saved.' } } };
export const Danger = { args: { options: { variant: 'danger', title: 'Error', description: 'Failed.' } } };
