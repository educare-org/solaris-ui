// @vitest-environment jsdom
import '@angular/compiler';
import { Component } from '@angular/core';
import {
  SolarisContentCarouselComponent,
  SolarisCarouselSlideDirective,
} from '@educarehq/solaris-ui';
import {
  cleanupHydrationScenario,
  assertHydrationClean,
  ssrAndHydrate,
} from '../../../../../testing/hydration/hydration-harness';

describe('SolarisContentCarousel hydration matrix', () => {
  it('basic carousel hydrates with projected slides and dots', async () => {
    const tag = 'solaris-content-matrix-basic';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabel="Featured">
          <ng-template solaris-carousel-slide>
            <section><h2>First panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Second panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class BasicHost {}
    const result = await ssrAndHydrate(BasicHost, tag);
    assertHydrationClean(result, 'basic');
    expect(
      document.querySelectorAll('.solaris-content-carousel__slide').length,
    ).toBe(2);
    expect(
      document.querySelectorAll('.solaris-content-carousel__dot').length,
    ).toBe(2);
    cleanupHydrationScenario(result);
  });

  it('empty carousel hydrates with the status text', async () => {
    const tag = 'solaris-content-matrix-empty';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisContentCarouselComponent],
      template: `<solaris-content-carousel ariaLabel="Empty" />`,
    })
    class EmptyHost {}
    const result = await ssrAndHydrate(EmptyHost, tag);
    assertHydrationClean(result, 'empty');
    expect(
      document.querySelector('.solaris-content-carousel__empty'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('divider carousel hydrates with the resolved side', async () => {
    const tag = 'solaris-content-matrix-divider';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          align="end"
          [showDivider]="true"
          ariaLabel="Login"
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
    class DividerHost {}
    const result = await ssrAndHydrate(DividerHost, tag);
    assertHydrationClean(result, 'divider');
    expect(
      document.querySelector('.solaris-content-carousel__divider--left'),
    ).toBeTruthy();
    cleanupHydrationScenario(result);
  });

  it('navigation survives hydration (listener survival)', async () => {
    const tag = 'solaris-content-matrix-replay';
    @Component({
      selector: tag,
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabel="Replay">
          <ng-template solaris-carousel-slide>
            <section><h2>First panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Second panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Third panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class ReplayHost {}
    const result = await ssrAndHydrate(ReplayHost, tag);
    assertHydrationClean(result, 'replay');
    const next = document.querySelector(
      '.solaris-content-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    result.appRef?.tick();
    expect(
      document
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 3');
    cleanupHydrationScenario(result);
  });
});
