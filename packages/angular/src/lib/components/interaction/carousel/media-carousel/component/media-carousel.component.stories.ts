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

const MIXED_SLIDES: readonly SolarisMediaSlide[] = [
  {
    type: 'image',
    src: 'https://placehold.co/800x450?text=Slide+1',
    alt: 'First slide',
  },
  {
    type: 'video',
    src: 'https://example.com/tour.mp4',
    poster: 'https://placehold.co/800x450?text=Video',
    alt: 'Product tour',
  },
  {
    type: 'image',
    src: 'https://placehold.co/800x450?text=Slide+3',
    alt: 'Third slide',
  },
  {
    type: 'video',
    src: 'https://example.com/clip.mp4',
    alt: 'Second clip',
  },
];

export const Preview: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    navigation: 'preview',
  },
};

export const PreviewMixed: Story = {
  args: {
    slides: MIXED_SLIDES,
    ariaLabel: 'Featured stories',
    navigation: 'preview',
  },
};

export const Minimal: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    navigation: 'none',
    showArrows: false,
  },
};

export const RatioStandard: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    aspectRatio: '4 / 3',
  },
};

export const RatioSquare: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    aspectRatio: '1 / 1',
  },
};

export const Progress: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    navigation: 'progress',
    autoplay: true,
    duration: 4000,
  },
};

export const Peek: Story = {
  args: {
    slides: SHOWCASE_SLIDES,
    ariaLabel: 'Featured stories',
    visibleCount: 'peek',
  },
};
