export interface SolarisCarouselEngineConfig {
  slideCount: number;
  loop?: boolean;
  autoplay?: boolean;
  duration?: number;
  reducedMotion?: boolean;
  startIndex?: number;
  isBrowser?: boolean;
}

export interface SolarisCarouselEngineEvents {
  onIndexChange?: (index: number) => void;
}

export const SOLARIS_CAROUSEL_DEFAULT_DURATION = 5000;
