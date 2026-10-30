import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';

import { SolarisContentCarouselComponent } from '../component/content-carousel.component';
import { SolarisCarouselSlideDirective } from '../directives/carousel-slide.directive';

@Component({
  standalone: true,
  imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
  template: `
    <solaris-content-carousel
      [autoplay]="true"
      [duration]="100"
      (autoplayChange)="onToggle($event)"
      ariaLabel="Featured panels"
    >
      <ng-template solaris-carousel-slide>
        <section><h2>First panel</h2></section>
      </ng-template>
      <ng-template solaris-carousel-slide>
        <section><h2>Second panel</h2></section>
      </ng-template>
    </solaris-content-carousel>
  `,
})
class AutoplayEmitHost {
  seen: boolean[] = [];

  onToggle(playing: boolean): void {
    this.seen.push(playing);
  }
}

@Component({
  standalone: true,
  imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
  template: `
    <solaris-content-carousel
      [autoplay]="true"
      [duration]="100"
      ariaLabel="Featured panels"
    >
      <ng-template solaris-carousel-slide>
        <section><h2>First panel</h2></section>
      </ng-template>
      <ng-template solaris-carousel-slide>
        <section><h2>Second panel</h2></section>
      </ng-template>
    </solaris-content-carousel>
  `,
})
class AutoplayProjectedHost {}

describe('SolarisContentCarouselComponent autoplay', () => {
  it('should render the fill on the active dot and advance on duration', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host.querySelector('.solaris-content-carousel__dot-fill'),
    ).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
    fixture.destroy();
  });

  it('should pause on hover and resume on leave', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const viewport = host.querySelector(
      '.solaris-content-carousel__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__dot-fill')
        ?.getAttribute('style'),
    ).toContain('paused');
    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 2');
    viewport.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
    fixture.destroy();
  });

  it('should pause on focus and resume on blur', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const viewport = host.querySelector(
      '.solaris-content-carousel__viewport',
    ) as HTMLElement;
    vi.spyOn(viewport, 'matches').mockReturnValue(true);
    viewport.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 250));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 2');
    viewport.dispatchEvent(new FocusEvent('focusout'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
    fixture.destroy();
  });

  it('should not pause on mouse-driven focus', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const viewport = host.querySelector(
      '.solaris-content-carousel__viewport',
    ) as HTMLElement;
    vi.spyOn(viewport, 'matches').mockReturnValue(false);
    viewport.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
    fixture.destroy();
  });

  it('should ignore hover pause when pauseOnHover is off', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          [autoplay]="true"
          [duration]="100"
          [pauseOnHover]="false"
          ariaLabel="Featured panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>First panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Second panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class NoHoverPauseHost {}
    const fixture = TestBed.createComponent(NoHoverPauseHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const viewport = host.querySelector(
      '.solaris-content-carousel__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 150));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
    fixture.destroy();
  });

  it('should pause through the dots zone hover', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const dots = host.querySelector(
      '.solaris-content-carousel__dots',
    ) as HTMLElement;
    vi.spyOn(dots, 'matches').mockReturnValue(true);
    dots.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__dot-fill')
        ?.getAttribute('style'),
    ).toContain('paused');
    dots.dispatchEvent(new FocusEvent('focusin'));
    fixture.detectChanges();
    dots.dispatchEvent(new FocusEvent('focusout'));
    fixture.detectChanges();
    dots.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__dot-fill')
        ?.getAttribute('style'),
    ).toContain('running');
    fixture.destroy();
  });

  it('should hide the toggle when showPlayPause is off with autoplay on', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          [autoplay]="true"
          [duration]="100"
          [showPlayPause]="false"
          ariaLabel="Featured panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>First panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Second panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class HiddenToggleHost {}
    const fixture = TestBed.createComponent(HiddenToggleHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host.querySelector('.solaris-content-carousel__play-pause'),
    ).toBeNull();
    expect(
      host.querySelector('.solaris-content-carousel__dot-fill'),
    ).toBeTruthy();
    fixture.destroy();
  });

  it('should show the toggle when showPlayPause is on with autoplay off', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          [showPlayPause]="true"
          ariaLabel="Featured panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>First panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Second panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class ShownToggleHost {}
    const fixture = TestBed.createComponent(ShownToggleHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const toggle = host.querySelector(
      '.solaris-content-carousel__play-pause',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Play');
    const carousel = fixture.debugElement.query(
      By.directive(SolarisContentCarouselComponent),
    ).componentInstance as SolarisContentCarouselComponent;
    const seen: boolean[] = [];
    carousel.autoplayChange.subscribe((playing) => seen.push(playing));
    toggle.click();
    fixture.detectChanges();
    expect(seen).toEqual([true]);
    expect(toggle.getAttribute('aria-label')).toBe('Play');
    fixture.destroy();
  });

  it('should toggle through the play/pause button with label swap', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const toggle = host.querySelector(
      '.solaris-content-carousel__play-pause',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Pause');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-label')).toBe('Play');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    fixture.destroy();
  });

  it('should pause when the document tab hides', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayProjectedHost);
    fixture.detectChanges();
    document.dispatchEvent(new Event('visibilitychange'));
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host.querySelector('.solaris-content-carousel__dot-fill'),
    ).toBeTruthy();
    fixture.destroy();
  });

  it('should pause when the viewport leaves the screen', () => {
    const seen: Element[] = [];
    let disconnected = 0;
    const previous = (globalThis as unknown as Record<string, unknown>)[
      'IntersectionObserver'
    ];
    try {
      (globalThis as unknown as Record<string, unknown>)[
        'IntersectionObserver'
      ] = class {
        constructor(
          private readonly callback: (
            entries: Array<{ isIntersecting: boolean }>,
          ) => void,
        ) {}

        observe(target: Element): void {
          seen.push(target);
          this.callback([{ isIntersecting: false }]);
        }

        disconnect(): void {
          disconnected += 1;
        }
      };
      TestBed.resetTestingModule();
      configureSolarisTesting();
      const fixture = TestBed.createComponent(AutoplayProjectedHost);
      fixture.detectChanges();
      expect(seen.length).toBe(1);
      fixture.destroy();
      expect(disconnected).toBe(1);
    } finally {
      if (previous === undefined) {
        delete (globalThis as unknown as Record<string, unknown>)[
          'IntersectionObserver'
        ];
      } else {
        (globalThis as unknown as Record<string, unknown>)[
          'IntersectionObserver'
        ] = previous;
      }
    }
  });

  it('should emit autoplayChange on toggle', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(AutoplayEmitHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const toggle = host.querySelector(
      '.solaris-content-carousel__play-pause',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.seen).toEqual([false, true]);
    fixture.destroy();
  });
});
