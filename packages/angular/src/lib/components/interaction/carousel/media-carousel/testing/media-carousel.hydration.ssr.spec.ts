// @vitest-environment jsdom
import '@angular/compiler';
import { Component } from '@angular/core';
import { SolarisMediaCarouselComponent } from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  ssrAndHydrate,
} from '../../../../../testing/hydration/hydration-harness';

describe('SolarisMediaCarousel hydration matrix', () => {
  it('basic carousel hydrates with slides and dots', async () => {
    const tag = 'solaris-media-matrix-basic';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisMediaCarouselComponent],
      template: `<solaris-media-carousel
        [slides]="slides"
        ariaLabel="Featured"
      />`,
    })
    class BasicHost {
      slides = [
        { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
        { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
      ];
    }
    const result = await ssrAndHydrate(BasicHost, tag);
    assertHydrationClean(result, 'basic');
    expect(
      document.querySelectorAll('.solaris-media-carousel__slide').length,
    ).toBe(2);
    expect(
      document.querySelectorAll('.solaris-media-carousel__dot').length,
    ).toBe(2);
    cleanupHydrationScenario(result);
  });

  it('empty carousel hydrates with the status text', async () => {
    const tag = 'solaris-media-matrix-empty';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisMediaCarouselComponent],
      template: `<solaris-media-carousel
        [slides]="slides"
        ariaLabel="Empty"
      />`,
    })
    class EmptyHost {
      slides: unknown[] = [];
    }
    const result = await ssrAndHydrate(EmptyHost, tag);
    assertHydrationClean(result, 'empty');
    expect(
      document.querySelector('.solaris-media-carousel__empty'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('clamped ends hydrate with aria-disabled arrows', async () => {
    const tag = 'solaris-media-matrix-clamped';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisMediaCarouselComponent],
      template: `<solaris-media-carousel
        [slides]="slides"
        [activeIndex]="1"
        [loop]="false"
        ariaLabel="Clamped"
      />`,
    })
    class ClampedHost {
      slides = [
        { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
        { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
      ];
    }
    const result = await ssrAndHydrate(ClampedHost, tag);
    assertHydrationClean(result, 'clamped');
    expect(
      document
        .querySelector('.solaris-media-carousel__arrow--next')
        ?.getAttribute('aria-disabled'),
    ).toBe('true');
    cleanupHydrationScenario(result);
  });

  it('navigation survives hydration (listener survival)', async () => {
    const tag = 'solaris-media-matrix-replay';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisMediaCarouselComponent],
      template: `<solaris-media-carousel
        [slides]="slides"
        ariaLabel="Replay"
      />`,
    })
    class ReplayHost {
      slides = [
        { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
        { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
        { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
      ];
    }
    const result = await ssrAndHydrate(ReplayHost, tag);
    assertHydrationClean(result, 'replay');
    const next = document.querySelector(
      '.solaris-media-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    result.appRef?.tick();
    expect(
      document
        .querySelector('.solaris-media-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 3');
    cleanupHydrationScenario(result);
  });

  it('preview hydrates with thumbs and thumb navigation', async () => {
    const tag = 'solaris-media-matrix-preview';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisMediaCarouselComponent],
      template: `<solaris-media-carousel
        [slides]="slides"
        navigation="preview"
        ariaLabel="Preview"
      />`,
    })
    class PreviewHost {
      slides = [
        { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
        { type: 'video', src: 'tour.mp4', poster: 'tour.jpg', alt: 'Tour' },
        { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
      ];
    }
    const result = await ssrAndHydrate(PreviewHost, tag);
    assertHydrationClean(result, 'preview');
    expect(
      document.querySelectorAll('.solaris-media-carousel__preview-thumb')
        .length,
    ).toBe(3);
    const thumbs = document.querySelectorAll(
      '.solaris-media-carousel__preview-thumb',
    );
    (thumbs[2] as HTMLButtonElement).click();
    result.appRef?.tick();
    expect(
      document
        .querySelector('.solaris-media-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('3 of 3');
    cleanupHydrationScenario(result);
  });
});
