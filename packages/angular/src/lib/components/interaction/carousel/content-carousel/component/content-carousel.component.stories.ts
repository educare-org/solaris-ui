import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisContentCarouselComponent } from './content-carousel.component';
import { SolarisCarouselSlideDirective } from '../directives/carousel-slide.directive';

const meta: Meta<SolarisContentCarouselComponent> = {
  component: SolarisContentCarouselComponent,
  title: 'SolarisContentCarouselComponent',
};
export default meta;

type Story = StoryObj<SolarisContentCarouselComponent>;

const LOGIN_SPLIT_TEMPLATE = `
  <solaris-content-carousel
    align="end"
    [showDivider]="true"
    ariaLabel="Login highlights"
    style="height: 320px; display: block;"
  >
    <ng-template solaris-carousel-slide>
      <div style="padding: 24px;">
        <h2>Scan to continue</h2>
        <p>Point your banking app at the code to sign in on this device.</p>
      </div>
    </ng-template>
    <ng-template solaris-carousel-slide>
      <div style="padding: 24px;">
        <h2>Early access is live</h2>
        <p>Invite your team and unlock spend controls today.</p>
      </div>
    </ng-template>
  </solaris-content-carousel>
`;

export const LoginSplit: Story = {
  args: {
    align: 'end',
    showDivider: true,
    ariaLabel: 'Login highlights',
  },
  render: () => ({
    props: {},
    template: LOGIN_SPLIT_TEMPLATE,
    moduleMetadata: {
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
    },
  }),
};

export const Promo: Story = {
  args: {
    align: 'end',
    showDivider: true,
    ariaLabel: 'Promotions',
  },
  render: () => ({
    props: {},
    template: `
      <solaris-content-carousel
        align="end"
        [showDivider]="true"
        ariaLabel="Promotions"
        style="height: 280px; display: block;"
      >
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Cashback weekend</h2>
            <p>Earn double points on every card purchase.</p>
          </div>
        </ng-template>
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Travel perks</h2>
            <p>Lounge access included on premium plans.</p>
          </div>
        </ng-template>
      </solaris-content-carousel>
    `,
    moduleMetadata: {
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
    },
  }),
};

export const MegaPanel: Story = {
  args: {
    align: 'none',
    ariaLabel: 'Featured content',
  },
  render: () => ({
    props: {},
    template: `
      <solaris-content-carousel
        align="none"
        ariaLabel="Featured content"
        style="height: 240px; display: block;"
      >
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Wellness stipend</h2>
            <p>New perk guide for growing teams.</p>
          </div>
        </ng-template>
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Founder stories</h2>
            <p>How three startups scaled spend.</p>
          </div>
        </ng-template>
      </solaris-content-carousel>
    `,
    moduleMetadata: {
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
    },
  }),
};

export const CenterDividers: Story = {
  args: {
    align: 'center',
    showDivider: true,
    ariaLabel: 'Centered highlights',
  },
  render: () => ({
    props: {},
    template: `
      <solaris-content-carousel
        align="center"
        [showDivider]="true"
        ariaLabel="Centered highlights"
        style="height: 220px; display: block;"
      >
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Framed highlight</h2>
            <p>Dividers frame both sides of centered content.</p>
          </div>
        </ng-template>
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Still framed</h2>
            <p>The divider stays put while slides glide past it.</p>
          </div>
        </ng-template>
      </solaris-content-carousel>
    `,
    moduleMetadata: {
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
    },
  }),
};

export const Minimal: Story = {
  args: {
    navigation: 'none',
    showArrows: false,
    ariaLabel: 'Quiet rotator',
  },
  render: () => ({
    props: {},
    template: `
      <solaris-content-carousel
        navigation="none"
        [showArrows]="false"
        ariaLabel="Quiet rotator"
        style="height: 220px; display: block;"
      >
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Downtime notice</h2>
            <p>Scheduled maintenance happens Sunday at dawn.</p>
          </div>
        </ng-template>
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Silent rotation</h2>
            <p>Keyboards move slides even with no visible controls.</p>
          </div>
        </ng-template>
      </solaris-content-carousel>
    `,
    moduleMetadata: {
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
    },
  }),
};

export const Progress: Story = {
  args: {
    navigation: 'progress',
    autoplay: true,
    duration: 4000,
    ariaLabel: 'Rotating announcements',
  },
  render: () => ({
    props: {},
    template: `
      <solaris-content-carousel
        navigation="progress"
        [autoplay]="true"
        [duration]="4000"
        ariaLabel="Rotating announcements"
        style="height: 220px; display: block;"
      >
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Downtime notice</h2>
            <p>Scheduled maintenance happens Sunday at dawn.</p>
          </div>
        </ng-template>
        <ng-template solaris-carousel-slide>
          <div style="padding: 24px;">
            <h2>Silent rotation</h2>
            <p>Keyboards move slides even with no visible controls.</p>
          </div>
        </ng-template>
      </solaris-content-carousel>
    `,
    moduleMetadata: {
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
    },
  }),
};
