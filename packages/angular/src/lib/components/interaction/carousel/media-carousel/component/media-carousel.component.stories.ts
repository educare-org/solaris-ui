import type { Meta, StoryObj } from '@storybook/angular';
import { SolarisMediaCarouselComponent } from './media-carousel.component';
import type { SolarisMediaSlide } from '../model/solaris-media-slide';

const meta: Meta<SolarisMediaCarouselComponent> = {
  component: SolarisMediaCarouselComponent,
  title: 'SolarisMediaCarouselComponent',
};
export default meta;

type Story = StoryObj<SolarisMediaCarouselComponent>;

const SHOWCASE_SLIDES: readonly SolarisMediaSlide[] = [
  {
    type: 'image',
    src: 'https://placehold.co/800x450?text=Slide+1',
    alt: 'First slide',
  },
  {
    type: 'image',
    src: 'https://placehold.co/800x450?text=Slide+2',
    alt: 'Second slide',
  },
  {
    type: 'image',
    src: 'https://placehold.co/800x450?text=Slide+3',
    alt: 'Third slide',
  },
];

export const Basic: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
  },
};

export const DotsOutside: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    dotsPosition: 'outside',
  },
};

export const Autoplay: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    autoplay: true,
    duration: 5000,
  },
};
