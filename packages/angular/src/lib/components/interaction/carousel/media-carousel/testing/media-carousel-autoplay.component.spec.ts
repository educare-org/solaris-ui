import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';

import { SolarisMediaCarouselComponent } from '../component/media-carousel.component';
import type { SolarisMediaSlide } from '../model/solaris-media-slide';

const THREE_SLIDES: readonly SolarisMediaSlide[] = [
  { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
  { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
  { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
];

function createCarousel(
  inputs: Record<string, unknown> = {},
): ComponentFixture<SolarisMediaCarouselComponent> {
  TestBed.resetTestingModule();
  configureSolarisTesting();
  const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
  fixture.componentRef.setInput('slides', THREE_SLIDES);
  fixture.componentRef.setInput('ariaLabel', 'Featured stories');
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

describe('SolarisMediaCarouselComponent autoplay', () => {
  function createAutoplay(
    inputs: Record<string, unknown> = {},
  ): ComponentFixture<SolarisMediaCarouselComponent> {
    return createCarousel({ autoplay: true, duration: 100, ...inputs });
  }

  function viewport(
    fixture: ComponentFixture<SolarisMediaCarouselComponent>,
  ): HTMLElement {
    return element(fixture).querySelector(
      '.solaris-media-carousel__viewport',
    ) as HTMLElement;
  }

  async function settle(
    fixture: ComponentFixture<SolarisMediaCarouselComponent>,
    ms = 120,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
    fixture.detectChanges();
  }

  it('should advance on duration and render the fill on the active dot', async () => {
    const fixture = createAutoplay();
    expect(
      element(fixture).querySelector('.solaris-media-carousel__dot-fill'),
    ).toBeTruthy();
    await settle(fixture, 150);
    expect(fixture.componentInstance.activeIndex()).toBeGreaterThan(0);
    fixture.destroy();
  });

  it('should pause on hover and resume on leave', async () => {
    const fixture = createAutoplay();
    viewport(fixture).dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(
      element(fixture)
        .querySelector('.solaris-media-carousel__dot-fill')
        ?.getAttribute('style'),
    ).toContain('paused');
    await settle(fixture, 250);
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    viewport(fixture).dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    await settle(fixture, 150);
    expect(fixture.componentInstance.activeIndex()).toBeGreaterThan(0);
    fixture.destroy();
  });

  it('should pause on focus and resume on blur', async () => {
    const fixture = createAutoplay();
    viewport(fixture).dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    await settle(fixture, 250);
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    viewport(fixture).dispatchEvent(new FocusEvent('focusout'));
    fixture.detectChanges();
    await settle(fixture, 150);
    expect(fixture.componentInstance.activeIndex()).toBeGreaterThan(0);
    fixture.destroy();
  });

  it('should ignore hover pause when pauseOnHover is off', async () => {
    const fixture = createAutoplay({ pauseOnHover: false });
    viewport(fixture).dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await settle(fixture, 150);
    expect(fixture.componentInstance.activeIndex()).toBeGreaterThan(0);
    fixture.destroy();
  });

  it('should toggle through the play/pause button with label swap', async () => {
    const fixture = createAutoplay();
    const states: boolean[] = [];
    fixture.componentInstance.autoplayChange.subscribe((playing) =>
      states.push(playing),
    );
    const toggle = element(fixture).querySelector(
      '.solaris-media-carousel__play-pause',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Pause');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-label')).toBe('Play');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    await settle(fixture, 200);
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    toggle.click();
    fixture.detectChanges();
    expect(states).toEqual([false, true]);
    expect(toggle.getAttribute('aria-label')).toBe('Pause');
    fixture.destroy();
  });

  it('should hide the toggle when showPlayPause is false', () => {
    const fixture = createAutoplay({ showPlayPause: false });
    expect(
      element(fixture).querySelector('.solaris-media-carousel__play-pause'),
    ).toBeNull();
    fixture.destroy();
  });

  it('should render both text labels for a fluid play/pause swap', () => {
    const fixture = createAutoplay();
    const toggle = element(fixture).querySelector(
      '.solaris-media-carousel__play-pause',
    ) as HTMLButtonElement;
    const labels = toggle.querySelector(
      '.solaris-media-carousel__play-pause-labels',
    ) as HTMLElement;
    expect(labels.getAttribute('aria-hidden')).toBe('true');
    expect(
      toggle.querySelector('.solaris-media-carousel__play-pause-label--play')
        ?.textContent,
    ).toBe('Play');
    expect(
      toggle.querySelector('.solaris-media-carousel__play-pause-label--pause')
        ?.textContent,
    ).toBe('Pause');
    expect(toggle.hasAttribute('data-playing')).toBe(true);
    fixture.destroy();
  });

  it('should stay off under reduced motion until the user plays', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({
      accessibility: { forceReducedMotion: true },
    });
    const fixture = TestBed.createComponent(SolarisMediaCarouselComponent);
    fixture.componentRef.setInput('slides', THREE_SLIDES);
    fixture.componentRef.setInput('ariaLabel', 'Stories');
    fixture.componentRef.setInput('autoplay', true);
    fixture.componentRef.setInput('duration', 100);
    fixture.detectChanges();
    await settle(fixture, 250);
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    const toggle = element(fixture).querySelector(
      '.solaris-media-carousel__play-pause',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    await settle(fixture, 150);
    expect(fixture.componentInstance.activeIndex()).toBeGreaterThan(0);
    fixture.destroy();
  });

  it('should not render the fill without a positive duration', () => {
    const fixture = createAutoplay({ duration: 0 });
    expect(
      element(fixture).querySelector('.solaris-media-carousel__dot-fill'),
    ).toBeNull();
    fixture.destroy();
  });

  it('should not render the fill or toggle without autoplay', () => {
    const fixture = createCarousel();
    expect(
      element(fixture).querySelector('.solaris-media-carousel__dot-fill'),
    ).toBeNull();
    expect(
      element(fixture).querySelector('.solaris-media-carousel__play-pause'),
    ).toBeNull();
    fixture.destroy();
  });
});
