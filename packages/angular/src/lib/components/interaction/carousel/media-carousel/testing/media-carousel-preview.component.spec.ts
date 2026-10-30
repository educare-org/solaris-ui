import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';

import { SolarisMediaCarouselComponent } from '../component/media-carousel.component';
import type { SolarisMediaSlide } from '../model/solaris-media-slide';

const FOUR_SLIDES: readonly SolarisMediaSlide[] = [
  { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
  {
    type: 'video',
    src: 'tour.mp4',
    poster: 'tour.jpg',
    alt: 'Product tour',
  },
  { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
  { type: 'image', src: 'slide-4.jpg', alt: 'Fourth story' },
];

const THREE_SLIDES: readonly SolarisMediaSlide[] = [
  { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
  { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
  { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
];

function createPreview(
  inputs: Record<string, unknown> = {},
): ComponentFixture<SolarisMediaCarouselComponent> {
  TestBed.resetTestingModule();
  configureSolarisTesting();
  const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
  fixture.componentRef.setInput('slides', FOUR_SLIDES);
  fixture.componentRef.setInput('ariaLabel', 'Featured stories');
  fixture.componentRef.setInput('navigation', 'preview');
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

function thumbs(
  fixture: ComponentFixture<SolarisMediaCarouselComponent>,
): NodeListOf<HTMLButtonElement> {
  return element(fixture).querySelectorAll(
    '.solaris-media-carousel__preview-thumb',
  );
}

describe('SolarisMediaCarouselComponent preview', () => {
  it('should render three thumbs for current plus next two with loop wrap', () => {
    const fixture = createPreview({ activeIndex: 3 });
    const buttons = thumbs(fixture);
    expect(buttons.length).toBe(3);
    expect(buttons[0].getAttribute('aria-label')).toBe('Go to slide 4 of 4');
    expect(buttons[1].getAttribute('aria-label')).toBe('Go to slide 1 of 4');
    expect(buttons[2].getAttribute('aria-label')).toBe('Go to slide 2 of 4');
    expect(buttons[0].getAttribute('aria-current')).toBe('true');
    expect(buttons[1].getAttribute('aria-current')).toBeNull();
  });

  it('should truncate instead of wrapping when loop is off', () => {
    const fixture = createPreview({ activeIndex: 3, loop: false });
    const buttons = thumbs(fixture);
    expect(buttons.length).toBe(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('Go to slide 4 of 4');
    expect(buttons[0].getAttribute('aria-current')).toBe('true');
  });

  it('should clamp previewCount above three and below one', () => {
    const clampedHigh = createPreview({ previewCount: 9 });
    expect(thumbs(clampedHigh).length).toBe(3);
    const clampedLow = createPreview({ previewCount: 0 });
    expect(thumbs(clampedLow).length).toBe(1);
    expect(thumbs(clampedLow)[0].getAttribute('aria-label')).toBe(
      'Go to slide 1 of 4',
    );
  });

  it('should navigate when a preview thumb is clicked', () => {
    const fixture = createPreview();
    (thumbs(fixture)[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(2);
    expect(thumbs(fixture)[0].getAttribute('aria-label')).toBe(
      'Go to slide 3 of 4',
    );
  });

  it('should hide dots and the strip for a single slide', () => {
    const fixture = createPreview({ slides: [THREE_SLIDES[0]] });
    expect(
      element(fixture).querySelector('.solaris-media-carousel__preview'),
    ).toBeNull();
    expect(
      element(fixture).querySelector('.solaris-media-carousel__dot'),
    ).toBeNull();
    expect(
      element(fixture).querySelector('.solaris-media-carousel__arrow'),
    ).toBeNull();
  });

  it('should expose the overlay preview position on the host', () => {
    const fixture = createPreview();
    expect(element(fixture).getAttribute('data-navigation')).toBe('preview');
    expect(element(fixture).getAttribute('data-preview-position')).toBe(
      'overlay',
    );
  });

  it('should render the video Play badge only on video thumbs', () => {
    const fixture = createPreview();
    const buttons = thumbs(fixture);
    const badges = element(fixture).querySelectorAll(
      '.solaris-media-carousel__preview-badge',
    );
    expect(badges.length).toBe(1);
    expect(badges[0].textContent).toBe('Play');
    expect(badges[0].getAttribute('aria-hidden')).toBe('true');
    expect(
      buttons[1].querySelector('.solaris-media-carousel__preview-badge'),
    ).toBeTruthy();
    expect(
      buttons[0].querySelector('.solaris-media-carousel__preview-badge'),
    ).toBeNull();
  });

  it('should mark video thumbs with data-video for the wider badge fit', () => {
    const fixture = createPreview();
    const buttons = thumbs(fixture);
    expect(buttons[0].hasAttribute('data-video')).toBe(false);
    expect(buttons[1].getAttribute('data-video')).toBe('');
    expect(buttons[2].hasAttribute('data-video')).toBe(false);
  });
});

describe('SolarisMediaCarouselComponent preview motion', () => {
  function mockThumbMotion(host: HTMLElement): {
    animateSpy: ReturnType<typeof vi.fn>;
  } {
    const animateSpy = vi.fn().mockReturnValue({ cancel: vi.fn() });
    vi.spyOn(
      window.Element.prototype,
      'getBoundingClientRect',
    ).mockImplementation(function (this: Element) {
      const siblings = this.parentElement
        ? Array.from(this.parentElement.children)
        : [];
      const at = siblings.indexOf(this);
      const left = (at < 0 ? 0 : at * 100) - window.scrollX;
      const top = 0 - window.scrollY;
      return {
        width: 56,
        height: 56,
        top,
        left,
        right: left + 56,
        bottom: top + 56,
        x: left,
        y: top,
      } as DOMRect;
    });
    for (const thumb of Array.from(
      host.querySelectorAll('.solaris-media-carousel__preview-thumb'),
    )) {
      (thumb as HTMLElement & { animate?: unknown }).animate = animateSpy;
    }
    return { animateSpy };
  }

  function glide(
    fixture: ComponentFixture<SolarisMediaCarouselComponent>,
  ): void {
    (
      fixture.componentInstance as unknown as {
        glidePreviewThumbs(): void;
      }
    ).glidePreviewThumbs();
  }

  it('should glide moved thumbs to their new positions', () => {
    const fixture = createPreview();
    const { animateSpy } = mockThumbMotion(element(fixture));
    try {
      glide(fixture);
      animateSpy.mockClear();
      fixture.componentRef.setInput('activeIndex', 1);
      fixture.detectChanges();
      glide(fixture);
      expect(animateSpy).toHaveBeenCalledTimes(2);
      expect(animateSpy).toHaveBeenCalledWith(
        [
          { transform: 'translate(100px, 0px)' },
          { transform: 'translate(0px, 0px)' },
        ],
        { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('should skip the glide under reduced motion', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({
      accessibility: { forceReducedMotion: true },
    });
    const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
    fixture.componentRef.setInput('slides', FOUR_SLIDES);
    fixture.componentRef.setInput('ariaLabel', 'Featured stories');
    fixture.componentRef.setInput('navigation', 'preview');
    fixture.detectChanges();
    const { animateSpy } = mockThumbMotion(element(fixture));
    try {
      glide(fixture);
      animateSpy.mockClear();
      fixture.componentRef.setInput('activeIndex', 1);
      fixture.detectChanges();
      glide(fixture);
      expect(animateSpy).not.toHaveBeenCalled();
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('should ignore page scroll when gliding', () => {
    const fixture = createPreview();
    const { animateSpy } = mockThumbMotion(element(fixture));
    const scrollXDesc = Object.getOwnPropertyDescriptor(window, 'scrollX');
    const scrollYDesc = Object.getOwnPropertyDescriptor(window, 'scrollY');
    Object.defineProperty(window, 'scrollY', {
      value: 1200,
      configurable: true,
    });
    try {
      glide(fixture);
      animateSpy.mockClear();
      fixture.componentRef.setInput('activeIndex', 1);
      fixture.detectChanges();
      glide(fixture);
      expect(animateSpy).toHaveBeenCalledTimes(2);
      expect(animateSpy).toHaveBeenCalledWith(
        [
          { transform: 'translate(100px, 0px)' },
          { transform: 'translate(0px, 0px)' },
        ],
        { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      );
    } finally {
      if (scrollXDesc) {
        Object.defineProperty(window, 'scrollX', scrollXDesc);
      }
      if (scrollYDesc) {
        Object.defineProperty(window, 'scrollY', scrollYDesc);
      }
      vi.restoreAllMocks();
    }
  });
});

describe('SolarisMediaCarouselComponent preview activation', () => {
  it('should emit slideActivate with the slide on preview click', () => {
    const fixture = createPreview();
    const seen: SolarisMediaSlide[] = [];
    fixture.componentInstance.slideActivate.subscribe((slide) =>
      seen.push(slide),
    );
    (thumbs(fixture)[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(seen).toEqual([FOUR_SLIDES[1]]);
    expect(fixture.componentInstance.activeIndex()).toBe(1);
  });

  it('should emit slideActivate with the slide on slide click', () => {
    const fixture = createPreview();
    const seen: SolarisMediaSlide[] = [];
    fixture.componentInstance.slideActivate.subscribe((slide) =>
      seen.push(slide),
    );
    const trigger = element(fixture).querySelector(
      '.solaris-media-carousel__slide[data-active] .solaris-media-carousel__slide-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    expect(seen).toEqual([FOUR_SLIDES[0]]);
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should keep preview thumbs as named buttons with current marking', () => {
    const fixture = createPreview();
    for (const thumb of Array.from(thumbs(fixture))) {
      expect(thumb.tagName).toBe('BUTTON');
      expect(thumb.getAttribute('aria-label')).toContain('Go to slide');
    }
    const active = element(fixture).querySelector(
      '.solaris-media-carousel__preview-thumb[aria-current="true"]',
    );
    expect(active).toBeTruthy();
    expect(active?.getAttribute('data-active')).toBe('');
  });
});

describe('SolarisMediaCarouselComponent preview i18n', () => {
  const cases = [
    {
      locale: 'en-US',
      empty: 'No slides to show',
      goToSlide: 'Go to slide 1 of 2',
    },
    {
      locale: 'pt-BR',
      empty: 'Nenhum slide para exibir',
      goToSlide: 'Ir para o slide 1 de 2',
    },
    {
      locale: 'es-419',
      empty: 'No hay diapositivas para mostrar',
      goToSlide: 'Ir a la diapositiva 1 de 2',
    },
  ] as const;

  for (const { locale, empty, goToSlide } of cases) {
    it(`should resolve empty text and preview labels in ${locale}`, () => {
      TestBed.resetTestingModule();
      configureSolarisTesting({
        translate: { locale },
      });
      @Component({
        standalone: true,
        imports: [SolarisMediaCarouselComponent],
        template: `<solaris-media-carousel
          [slides]="slides"
          navigation="preview"
          ariaLabel="Stories"
        />`,
      })
      class LocalePreviewHost {
        slides: readonly SolarisMediaSlide[] = [
          { type: 'image', src: 'a.jpg', alt: 'A' },
          { type: 'video', src: 'b.mp4', alt: 'B' },
        ];
      }
      const fixture = TestBed.createComponent(LocalePreviewHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector(
        'solaris-media-carousel',
      ) as HTMLElement;
      const buttons = host.querySelectorAll(
        '.solaris-media-carousel__preview-thumb',
      );
      expect(buttons.length).toBe(2);
      expect(buttons[0].getAttribute('aria-label')).toBe(goToSlide);
      expect(
        host.querySelector(
          '.solaris-media-carousel__preview-thumb[aria-current="true"]',
        ),
      ).toBeTruthy();
      expect(
        host.querySelector('.solaris-media-carousel__preview-badge')
          ?.textContent,
      ).not.toBeNull();
    });

    it(`should resolve the empty state in ${locale}`, () => {
      TestBed.resetTestingModule();
      configureSolarisTesting({
        translate: { locale },
      });
      const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
      fixture.componentRef.setInput('slides', []);
      fixture.componentRef.setInput('navigation', 'preview');
      fixture.componentRef.setInput('ariaLabel', 'Stories');
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      expect(
        host.querySelector('.solaris-media-carousel__empty')?.textContent,
      ).toContain(empty);
      expect(host.querySelector('.solaris-media-carousel__preview')).toBeNull();
    });
  }
});
