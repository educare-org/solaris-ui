import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisAnnouncementComponent } from './announcement.component';

const meta: Meta<SolarisAnnouncementComponent> = {
  component: SolarisAnnouncementComponent,
  title: 'Feedback/Announcement',
  render: (args: any) => ({
    props: args,
    template: `
      <solaris-announcement
        [align]="align"
        [size]="size"
        [variant]="variant"
        [appearance]="appearance"
        [sticky]="sticky"
        [closable]="closable"
        [showIcon]="showIcon"
      >
        New features just dropped in September Early Access.
        <a href="#">See what's new →</a>
      </solaris-announcement>
    `,
  }),
};
export default meta;

type Story = StoryObj<SolarisAnnouncementComponent>;

export const Center: Story = {
  args: { align: 'center' } as any,
};

export const Left: Story = {
  args: { align: 'left' } as any,
};

export const WithIcon: Story = {
  args: { showIcon: true, variant: 'info' } as any,
};

export const ImageBackground: Story = {
  render: () => ({
    template: `
      <solaris-announcement variant="custom" class="announcement-image-bg">
        Limited offer — ends Sunday.
        <a href="#">Shop now</a>
      </solaris-announcement>
    `,
    styles: [
      `
      .announcement-image-bg {
        --solaris-alert-custom-color: #ffffff;
        --solaris-alert-custom-background: center / cover
          url('https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1600') #111827;
        --solaris-alert-custom-border-color: transparent;
        --solaris-alert-custom-icon-color: #ffffff;
      }
    `,
    ],
  }),
};
