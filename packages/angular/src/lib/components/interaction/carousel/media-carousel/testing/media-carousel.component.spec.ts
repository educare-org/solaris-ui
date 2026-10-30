import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import { provideSolarisTranslateTesting } from '../../../../../services/translation';

import { SolarisMediaCarouselComponent } from '../component/media-carousel.component';
import { SolarisMediaCarouselHarness } from './media-carousel.harness';
import type { SolarisMediaSlide } from '../model/solaris-media-slide';

const THREE_SLIDES: readonly SolarisMediaSlide[] = [
  { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
  { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
  { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
];

const TWO_SLIDES: readonly SolarisMediaSlide[] = [
  { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
  { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
];

const BASE_INPUTS = {
  slides: THREE_SLIDES,
  ariaLabel: 'Featured stories',
} as const;

function createCarousel(
  inputs: Record<string, unknown> = {},
): ComponentFixture<SolarisMediaCarouselComponent> {
  TestBed.resetTestingModule();
  configureSolarisTesting();
  const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
  fixture.componentRef.setInput('slides', BASE_INPUTS.slides);
  fixture.componentRef.setInput('ariaLabel', BASE_INPUTS.ariaLabel);
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture;
}

function element(
  fixture: ComponentFixture<SolarisMediaCarouselComponent>,
): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

function activeSlideLabel(
  fixture: ComponentFixture<SolarisMediaCarouselComponent>,
): string | null {
  return (
    element(fixture)
      .querySelector('.solaris-media-carousel__slide[data-active]')
      ?.getAttribute('aria-label') ?? null
  );
}

@Component({
  standalone: true,
  imports: [SolarisMediaCarouselComponent],
  template: `<solaris-media-carousel
    [slides]="slides"
    [(activeIndex)]="index"
    (activeIndexChange)="onChange($event)"
    ariaLabel="Featured stories"
  />`,
})
class EmitHostComponent {
  slides: readonly SolarisMediaSlide[] = THREE_SLIDES;
  index = 0;
  seen: number[] = [];

  onChange(index: number): void {
    this.seen.push(index);
  }
}

describe('SolarisMediaCarouselComponent', () => {
  it('should create the carousel region with roledescription and label', () => {
    const fixture = createCarousel();
    const host = element(fixture);
    expect(host.getAttribute('role')).toBe('region');
    expect(host.getAttribute('aria-roledescription')).toBe('carousel');
    expect(host.getAttribute('aria-label')).toBe('Featured stories');
    expect(host.getAttribute('data-navigation')).toBe('dots');
    expect(host.getAttribute('data-visible')).toBe('single');
    expect(host.getAttribute('data-dots-position')).toBe('overlay');
    expect(host.getAttribute('data-radius')).toBe('lg');
  });

  it('should render one slide per input with group roles and position labels', () => {
    const fixture = createCarousel();
    const slides = element(fixture).querySelectorAll(
      '.solaris-media-carousel__slide',
    );
    expect(slides.length).toBe(3);
    expect(slides[0].getAttribute('role')).toBe('group');
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[0].getAttribute('aria-label')).toBe('1 of 3');
    expect(slides[2].getAttribute('aria-label')).toBe('3 of 3');
  });

  it('should mark only the active slide as current and hide the rest', () => {
    const fixture = createCarousel();
    expect(activeSlideLabel(fixture)).toBe('1 of 3');
    expect(
      element(fixture).querySelectorAll(
        '.solaris-media-carousel__slide[aria-hidden="true"]',
      ).length,
    ).toBe(2);
    expect(
      element(fixture).querySelectorAll('.solaris-media-carousel__slide[inert]')
        .length,
    ).toBe(2);
  });

  it('should advance with the next arrow and wrap with loop enabled', () => {
    const fixture = createCarousel();
    const next = element(fixture).querySelector(
      '.solaris-media-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(activeSlideLabel(fixture)).toBe('2 of 3');
    fixture.componentRef.setInput('activeIndex', 2);
    fixture.detectChanges();
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should emit activeIndexChange on navigation', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(EmitHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-media-carousel',
    ) as HTMLElement;
    const next = host.querySelector(
      '.solaris-media-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    next.click();
    fixture.detectChanges();
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.seen).toEqual([1, 2, 0]);
    expect(fixture.componentInstance.index).toBe(0);
  });

  it('should move back with the previous arrow', () => {
    const fixture = createCarousel({ activeIndex: 1 });
    const prev = element(fixture).querySelector(
      '.solaris-media-carousel__arrow--prev',
    ) as HTMLButtonElement;
    prev.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should clamp at the ends with aria-disabled when loop is off', () => {
    const fixture = createCarousel({ loop: false, activeIndex: 2 });
    const host = element(fixture);
    const next = host.querySelector(
      '.solaris-media-carousel__arrow--next',
    ) as HTMLButtonElement;
    expect(next.getAttribute('aria-disabled')).toBe('true');
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    fixture.componentRef.setInput('activeIndex', 0);
    fixture.detectChanges();
    const prev = host.querySelector(
      '.solaris-media-carousel__arrow--prev',
    ) as HTMLButtonElement;
    expect(prev.getAttribute('aria-disabled')).toBe('true');
  });

  it('should navigate through dots with accessible names and current marking', () => {
    const fixture = createCarousel();
    const dots = element(fixture).querySelectorAll(
      '.solaris-media-carousel__dot',
    );
    expect(dots.length).toBe(3);
    expect(dots[1].getAttribute('aria-label')).toBe('Go to slide 2 of 3');
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[1].getAttribute('aria-current')).toBeNull();
    (dots[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
  });

  it('should wrap from last to first with loop enabled', () => {
    const fixture = createCarousel({ activeIndex: 2 });
    const next = element(fixture).querySelector(
      '.solaris-media-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    expect(
      element(fixture)
        .querySelector('.solaris-media-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
  });

  it('should sync slides when activeIndex changes externally', () => {
    const fixture = createCarousel();
    fixture.componentRef.setInput('activeIndex', 2);
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    expect(
      element(fixture)
        .querySelector('.solaris-media-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('3 of 3');
  });

  it('should keep overlay dots inside the viewport', () => {
    const fixture = createCarousel();
    const viewport = element(fixture).querySelector(
      '.solaris-media-carousel__viewport',
    ) as HTMLElement;
    const dots = element(fixture).querySelector(
      '.solaris-media-carousel__dots',
    ) as HTMLElement;
    expect(dots.parentElement).toBe(viewport);
  });

  it('should keep the play/pause toggle out of the animated dots group', () => {
    const fixture = createCarousel({ autoplay: true, duration: 100 });
    const toggle = element(fixture).querySelector(
      '.solaris-media-carousel__play-pause',
    ) as HTMLElement;
    expect(toggle.closest('.solaris-media-carousel__dots-group')).toBeNull();
    expect(toggle.closest('.solaris-media-carousel__dots')).not.toBeNull();
    fixture.destroy();
  });

  it('should render outside dots below the viewport', () => {
    const fixture = createCarousel({ dotsPosition: 'outside' });
    const host = element(fixture);
    const viewport = host.querySelector(
      '.solaris-media-carousel__viewport',
    ) as HTMLElement;
    const dots = host.querySelector(
      '.solaris-media-carousel__dots',
    ) as HTMLElement;
    expect(viewport.querySelector('.solaris-media-carousel__dots')).toBeNull();
    expect(dots.parentElement).toBe(host);
    expect(dots.querySelectorAll('.solaris-media-carousel__dot').length).toBe(
      3,
    );
  });

  it('should hide arrows and dots for a single slide', () => {
    const fixture = createCarousel({ slides: [THREE_SLIDES[0]] });
    const host = element(fixture);
    expect(host.querySelector('.solaris-media-carousel__arrow')).toBeNull();
    expect(host.querySelector('.solaris-media-carousel__dot')).toBeNull();
    expect(activeSlideLabel(fixture)).toBe('1 of 1');
  });

  it('should render the empty state with role status', () => {
    const fixture = createCarousel({ slides: [] });
    const empty = element(fixture).querySelector(
      '.solaris-media-carousel__empty',
    );
    expect(empty?.getAttribute('role')).toBe('status');
    expect(empty?.textContent).toContain('No slides to show');
  });

  it('should resolve the empty text through direct input', () => {
    const fixture = createCarousel({ slides: [], emptyText: 'Nada por aqui' });
    expect(
      element(fixture).querySelector('.solaris-media-carousel__empty')
        ?.textContent,
    ).toContain('Nada por aqui');
  });

  it('should move with ArrowRight/ArrowLeft and jump with Home/End', () => {
    const fixture = createCarousel();
    const viewport = element(fixture).querySelector(
      '.solaris-media-carousel__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should expose data-dots-position outside on the host', () => {
    const fixture = createCarousel({ dotsPosition: 'outside' });
    expect(element(fixture).getAttribute('data-dots-position')).toBe('outside');
    expect(
      element(fixture).querySelectorAll('.solaris-media-carousel__dot').length,
    ).toBe(3);
  });

  it('should hide dots when navigation is none', () => {
    const fixture = createCarousel({ navigation: 'none' });
    expect(
      element(fixture).querySelector('.solaris-media-carousel__dot'),
    ).toBeNull();
  });

  it('should render images with alt text and lazy loading', () => {
    const fixture = createCarousel();
    const images = element(fixture).querySelectorAll('img');
    expect(images.length).toBe(3);
    expect(images[0].getAttribute('alt')).toBe('First story');
    expect(images[0].getAttribute('loading')).toBe('lazy');
    expect(images[0].getAttribute('draggable')).toBe('false');
  });

  it('should render video slides through their poster with src fallback', () => {
    const fixture = createCarousel({
      slides: [
        { type: 'video', src: 'tour.mp4', poster: 'tour.jpg', alt: 'Tour' },
        { type: 'video', src: 'clip.mp4', alt: 'Clip' },
      ],
    });
    const images = element(fixture).querySelectorAll('img');
    expect(images[0].getAttribute('src')).toBe('tour.jpg');
    expect(images[1].getAttribute('src')).toBe('clip.mp4');
  });

  it('should resolve slide alt text through translation keys', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({
      translate: {
        locale: 'en-US',
        translations: { 'en-US': { 'story.alt': 'Custom alt' } },
      },
    });
    const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
    fixture.componentRef.setInput('slides', [
      { type: 'image', src: 'a.jpg', alt: '', altKey: 'story.alt' },
      { type: 'image', src: 'b.jpg', alt: '', altKey: 'missing.key' },
    ]);
    fixture.componentRef.setInput('ariaLabel', 'Stories');
    fixture.detectChanges();
    const images = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'img',
    );
    expect(images[0].getAttribute('alt')).toBe('Custom alt');
    expect(images[1].getAttribute('alt')).toBe('');
  });

  it('should fall back to lg for unknown radius values', () => {
    const fixture = createCarousel({ radius: 'full' as 'lg' });
    expect(element(fixture).getAttribute('data-radius')).toBe('lg');
  });

  it('should fall back to the default aspect ratio for empty values', () => {
    const fixture = createCarousel({ aspectRatio: '' });
    expect(
      element(fixture)
        .querySelector('.solaris-media-carousel__viewport')
        ?.getAttribute('style'),
    ).toContain('aspect-ratio: 16 / 9');
  });

  it('should render dots for progress and no indicator for preview in F1', () => {
    const progress = createCarousel({ navigation: 'progress' });
    expect(
      element(progress).querySelectorAll('.solaris-media-carousel__dot').length,
    ).toBe(3);
    expect(element(progress).getAttribute('data-navigation')).toBe('progress');
    const preview = createCarousel({ navigation: 'preview' });
    expect(
      element(preview).querySelector('.solaris-media-carousel__dot'),
    ).toBeNull();
  });

  it('should move to the next slide on a left swipe', () => {
    const fixture = createCarousel();
    const track = element(fixture).querySelector(
      '.solaris-media-carousel__track',
    ) as HTMLElement;
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 200,
        clientY: 100,
      }),
    );
    track.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
        clientX: 100,
        clientY: 102,
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
  });

  it('should move to the previous slide on a right swipe', () => {
    const fixture = createCarousel({ activeIndex: 1 });
    const track = element(fixture).querySelector(
      '.solaris-media-carousel__track',
    ) as HTMLElement;
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }),
    );
    track.dispatchEvent(
      new MouseEvent('pointerup', { bubbles: true, clientX: 200, clientY: 98 }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should ignore short and vertical drags', () => {
    const fixture = createCarousel();
    const track = element(fixture).querySelector(
      '.solaris-media-carousel__track',
    ) as HTMLElement;
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 200,
        clientY: 100,
      }),
    );
    track.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
        clientX: 180,
        clientY: 100,
      }),
    );
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 200,
        clientY: 100,
      }),
    );
    track.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
        clientX: 200,
        clientY: 200,
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should forget a cancelled swipe', () => {
    const fixture = createCarousel();
    const track = element(fixture).querySelector(
      '.solaris-media-carousel__track',
    ) as HTMLElement;
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 200,
        clientY: 100,
      }),
    );
    track.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));
    track.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should not emit slideActivate for the tap after a swipe', () => {
    const fixture = createCarousel();
    const seen: unknown[] = [];
    fixture.componentInstance.slideActivate.subscribe((slide) =>
      seen.push(slide),
    );
    const track = element(fixture).querySelector(
      '.solaris-media-carousel__track',
    ) as HTMLElement;
    const trigger = element(fixture).querySelector(
      '.solaris-media-carousel__slide-trigger',
    ) as HTMLButtonElement;
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        bubbles: true,
        clientX: 200,
        clientY: 100,
      }),
    );
    track.dispatchEvent(
      new MouseEvent('pointerup', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      }),
    );
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(seen).toEqual([]);
    trigger.click();
    fixture.detectChanges();
    expect(seen.length).toBe(1);
  });

  it('should ignore keyboard navigation for a single slide', () => {
    const fixture = createCarousel({ slides: [THREE_SLIDES[0]] });
    const viewport = element(fixture).querySelector(
      '.solaris-media-carousel__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should fall back to an empty label for unknown aria keys', () => {
    const fixture = createCarousel({
      ariaLabel: undefined,
      ariaLabelKey: 'missing.key',
    });
    expect(element(fixture).getAttribute('aria-label')).toBe('');
  });

  it('should expose the peek value through data-visible', () => {
    const fixture = createCarousel({ visibleCount: 'peek' });
    expect(element(fixture).getAttribute('data-visible')).toBe('peek');
    expect(
      element(fixture).querySelectorAll('.solaris-media-carousel__slide')
        .length,
    ).toBe(3);
  });
});

describe('SolarisMediaCarouselComponent i18n', () => {
  it('should resolve labels in pt-BR', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({
      translate: { locale: 'pt-BR' },
    });
    @Component({
      standalone: true,
      imports: [SolarisMediaCarouselComponent],
      template: `<solaris-media-carousel
        [slides]="slides"
        ariaLabel="Destaques"
      />`,
    })
    class PtHost {
      slides = TWO_SLIDES;
    }
    const fixture = TestBed.createComponent(PtHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-media-carousel',
    ) as HTMLElement;
    expect(
      host
        .querySelector('.solaris-media-carousel__dot')
        ?.getAttribute('aria-label'),
    ).toBe('Ir para o slide 1 de 2');
    expect(
      host
        .querySelector('.solaris-media-carousel__slide')
        ?.getAttribute('aria-label'),
    ).toBe('1 de 2');
  });

  it('should resolve labels through the translate testing provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideSolarisTranslateTesting({ locale: 'pt-BR' })],
    });
    const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
    fixture.componentRef.setInput('slides', TWO_SLIDES);
    fixture.componentRef.setInput('ariaLabel', 'Destaques');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('.solaris-media-carousel__arrow--prev')
        ?.getAttribute('aria-label'),
    ).toBe('Slide anterior');
  });
});

describe('SolarisMediaCarouselHarness', () => {
  @Component({
    standalone: true,
    imports: [SolarisMediaCarouselComponent],
    template: `<solaris-media-carousel
      [slides]="slides"
      [loop]="loop"
      [activeIndex]="index"
      ariaLabel="Featured stories"
    />`,
  })
  class HarnessHostComponent {
    slides: readonly SolarisMediaSlide[] = THREE_SLIDES;
    loop = true;
    index = 0;
  }

  function createHarnessHost(
    patch: Partial<Pick<HarnessHostComponent, 'loop' | 'index'>> = {},
  ): ComponentFixture<HarnessHostComponent> {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(HarnessHostComponent);
    Object.assign(fixture.componentInstance, patch);
    fixture.detectChanges();
    return fixture;
  }

  it('should navigate through the harness', async () => {
    const fixture = createHarnessHost();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisMediaCarouselHarness);
    expect(await harness.getSlideCount()).toBe(3);
    await harness.goToNext();
    expect(await harness.getActiveSlideLabel()).toBe('2 of 3');
    await harness.goToSlide(2);
    expect(await harness.getActiveSlideLabel()).toBe('3 of 3');
    await harness.goToPrevious();
    expect(await harness.getActiveSlideLabel()).toBe('2 of 3');
    expect(await harness.isNextDisabled()).toBe(false);
  });

  it('should report disabled arrows when loop is off at the ends', async () => {
    const fixture = createHarnessHost({ loop: false, index: 2 });
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisMediaCarouselHarness);
    expect(await harness.isNextDisabled()).toBe(true);
    expect(await harness.isPreviousDisabled()).toBe(false);
  });
});
