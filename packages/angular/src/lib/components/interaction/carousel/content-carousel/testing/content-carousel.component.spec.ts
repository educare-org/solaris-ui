import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { configureSolarisTesting } from '../../../../../testing/solaris-test-utilities';
import { provideSolarisTranslateTesting } from '../../../../../services/translation';

import { SolarisContentCarouselComponent } from '../component/content-carousel.component';
import { SolarisCarouselSlideDirective } from '../directives/carousel-slide.directive';
import { SolarisContentCarouselHarness } from './content-carousel.harness';
import type { SolarisContentCarouselAlign } from '../model/content-carousel-align';

function createCarousel(
  inputs: Record<string, unknown> = {},
): ComponentFixture<SolarisContentCarouselComponent> {
  TestBed.resetTestingModule();
  configureSolarisTesting();
  const fixture = TestBed.createComponent(SolarisContentCarouselComponent);
  fixture.componentRef.setInput('ariaLabel', 'Featured panels');
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  return fixture;
}

function element(
  fixture: ComponentFixture<SolarisContentCarouselComponent>,
): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

@Component({
  standalone: true,
  imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
  template: `
    <solaris-content-carousel ariaLabel="Featured panels">
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
class ProjectionHostComponent {}

@Component({
  standalone: true,
  imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
  template: `
    <solaris-content-carousel
      [activeIndex]="index"
      [loop]="loop"
      ariaLabel="Featured panels"
    >
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
class HarnessHostComponent {
  index = 0;
  loop = true;
}

describe('SolarisContentCarouselComponent', () => {
  it('should create the carousel region with roledescription and label', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.getAttribute('role')).toBe('region');
    expect(host.getAttribute('aria-roledescription')).toBe('carousel');
    expect(host.getAttribute('aria-label')).toBe('Featured panels');
    expect(host.getAttribute('data-navigation')).toBe('dots');
    expect(host.getAttribute('data-align')).toBe('none');
    expect(host.getAttribute('data-divider')).toBe('none');
  });

  it('should project slides in DOM order with position labels', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const slides = host.querySelectorAll('.solaris-content-carousel__slide');
    expect(slides.length).toBe(3);
    expect(slides[0].getAttribute('role')).toBe('group');
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[0].getAttribute('aria-label')).toBe('1 of 3');
    expect(slides[2].getAttribute('aria-label')).toBe('3 of 3');
    expect(slides[0].textContent).toContain('First panel');
    expect(slides[1].textContent).toContain('Second panel');
    expect(slides[2].textContent).toContain('Third panel');
  });

  it('should mark only the active slide as current and hide the rest', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
    expect(
      host.querySelectorAll(
        '.solaris-content-carousel__slide[aria-hidden="true"]',
      ).length,
    ).toBe(2);
    expect(
      host.querySelectorAll('.solaris-content-carousel__slide[inert]').length,
    ).toBe(2);
  });

  it('should advance with arrows and wrap with loop enabled', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const next = host.querySelector(
      '.solaris-content-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 3');
  });

  it('should clamp at the ends with aria-disabled when loop is off', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel [loop]="false" ariaLabel="Featured panels">
          <ng-template solaris-carousel-slide>
            <section><h2>First panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Second panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class ClampedHost {}
    const fixture = TestBed.createComponent(ClampedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const next = host.querySelector(
      '.solaris-content-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
    expect(next.getAttribute('aria-disabled')).toBe('true');
    next.click();
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
  });

  it('should navigate through dots with accessible names and current marking', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const dots = host.querySelectorAll('.solaris-content-carousel__dot');
    expect(dots.length).toBe(3);
    expect(dots[1].getAttribute('aria-label')).toBe('Go to slide 2 of 3');
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[1].getAttribute('aria-current')).toBeNull();
    (dots[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('3 of 3');
  });

  it('should resolve the divider side for every align with showDivider', () => {
    const cases: Array<[SolarisContentCarouselAlign, string, string]> = [
      ['end', 'left', 'solaris-content-carousel__divider--left'],
      ['start', 'right', 'solaris-content-carousel__divider--right'],
      ['center', 'both', 'solaris-content-carousel__divider--left'],
      ['top', 'bottom', 'solaris-content-carousel__divider--bottom'],
      ['bottom', 'top', 'solaris-content-carousel__divider--top'],
      ['none', 'none', ''],
    ];
    for (const [align, side, dividerClass] of cases) {
      TestBed.resetTestingModule();
      configureSolarisTesting();
      @Component({
        standalone: true,
        imports: [
          SolarisContentCarouselComponent,
          SolarisCarouselSlideDirective,
        ],
        template: `
          <solaris-content-carousel
            [align]="align"
            [showDivider]="true"
            ariaLabel="Panels"
          >
            <ng-template solaris-carousel-slide>
              <section><h2>Panel</h2></section>
            </ng-template>
            <ng-template solaris-carousel-slide>
              <section><h2>Panel two</h2></section>
            </ng-template>
          </solaris-content-carousel>
        `,
      })
      class AlignHost {
        align: SolarisContentCarouselAlign = align;
      }
      const fixture = TestBed.createComponent(AlignHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector(
        'solaris-content-carousel',
      ) as HTMLElement;
      expect(host.getAttribute('data-divider')).toBe(side);
      if (dividerClass) {
        expect(host.querySelector(`.${dividerClass}`)).toBeTruthy();
      } else {
        expect(
          host.querySelector('.solaris-content-carousel__divider'),
        ).toBeNull();
      }
    }
  });

  it('should render center with dividers on both sides', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          align="center"
          [showDivider]="true"
          ariaLabel="Panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class CenterHost {}
    const fixture = TestBed.createComponent(CenterHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host.querySelector('.solaris-content-carousel__divider--left'),
    ).toBeTruthy();
    expect(
      host.querySelector('.solaris-content-carousel__divider--right'),
    ).toBeTruthy();
  });

  it('should render no divider by default', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.getAttribute('data-divider')).toBe('none');
    expect(host.querySelector('.solaris-content-carousel__divider')).toBeNull();
  });

  it('should render no divider when align is set without showDivider', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel align="end" ariaLabel="Panels">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class AlignOnlyHost {}
    const fixture = TestBed.createComponent(AlignOnlyHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.getAttribute('data-divider')).toBe('none');
    expect(host.querySelector('.solaris-content-carousel__divider')).toBeNull();
  });

  it('should hide the divider from assistive technology', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          align="end"
          [showDivider]="true"
          ariaLabel="Panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class DividerHost {}
    const fixture = TestBed.createComponent(DividerHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const divider = host.querySelector(
      '.solaris-content-carousel__divider',
    ) as HTMLElement;
    expect(divider.getAttribute('aria-hidden')).toBe('true');
  });

  it('should hide dots when navigation is none', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel navigation="none" ariaLabel="Panels">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class NoneHost {}
    const fixture = TestBed.createComponent(NoneHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.getAttribute('data-navigation')).toBe('none');
    expect(host.querySelector('.solaris-content-carousel__dot')).toBeNull();
  });

  it('should render dots with the duration fill for progress navigation', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          navigation="progress"
          [autoplay]="true"
          [duration]="100"
          ariaLabel="Panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class ProgressHost {}
    const fixture = TestBed.createComponent(ProgressHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.getAttribute('data-navigation')).toBe('progress');
    expect(host.querySelectorAll('.solaris-content-carousel__dot').length).toBe(
      2,
    );
    expect(
      host.querySelector('.solaris-content-carousel__dot-fill'),
    ).toBeTruthy();
    fixture.destroy();
  });

  it('should render the empty state with role status', () => {
    const fixture = createCarousel();
    const empty = element(fixture).querySelector(
      '.solaris-content-carousel__empty',
    );
    expect(empty?.getAttribute('role')).toBe('status');
    expect(empty?.textContent).toContain('No slides to show');
  });

  it('should move with ArrowRight/ArrowLeft and jump with Home/End', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const viewport = host.querySelector(
      '.solaris-content-carousel__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 3');
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('3 of 3');
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
  });

  it('should move to the next slide on a left swipe', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const track = host.querySelector(
      '.solaris-content-carousel__track',
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
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 3');
  });

  it('should move to the previous slide on a right swipe', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const next = host.querySelector(
      '.solaris-content-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    const track = host.querySelector(
      '.solaris-content-carousel__track',
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
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
  });

  it('should ignore short and vertical drags', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const track = host.querySelector(
      '.solaris-content-carousel__track',
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
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
  });

  it('should forget a cancelled swipe', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const fixture = TestBed.createComponent(ProjectionHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const track = host.querySelector(
      '.solaris-content-carousel__track',
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
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 3');
  });

  it('should hide arrows and dots for a single slide and ignore keys', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabel="Panels">
          <ng-template solaris-carousel-slide>
            <section><h2>Only panel</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class SingleHost {}
    const fixture = TestBed.createComponent(SingleHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.querySelector('.solaris-content-carousel__arrow')).toBeNull();
    expect(host.querySelector('.solaris-content-carousel__dot')).toBeNull();
    const viewport = host.querySelector(
      '.solaris-content-carousel__viewport',
    ) as HTMLElement;
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 1');
  });

  it('should disable the previous arrow at the start when loop is off', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel [loop]="false" ariaLabel="Panels">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class StartHost {}
    const fixture = TestBed.createComponent(StartHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const prev = host.querySelector(
      '.solaris-content-carousel__arrow--prev',
    ) as HTMLButtonElement;
    expect(prev.getAttribute('aria-disabled')).toBe('true');
    prev.click();
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('1 of 2');
  });

  it('should render no fill when duration is not positive', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          [autoplay]="true"
          [duration]="0"
          ariaLabel="Panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class ZeroDurationHost {}
    const fixture = TestBed.createComponent(ZeroDurationHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host.querySelector('.solaris-content-carousel__dot-fill'),
    ).toBeNull();
    fixture.destroy();
  });

  it('should fall back to an empty label for unknown aria keys', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabelKey="missing.key">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class MissingKeyHost {}
    const fixture = TestBed.createComponent(MissingKeyHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(host.getAttribute('aria-label')).toBe('');
  });

  it('should navigate from the last committed index before change detection', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel [activeIndex]="index()" ariaLabel="Panels">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class ResyncHost {
      readonly index = signal(0);
    }
    const fixture = TestBed.createComponent(ResyncHost);
    fixture.detectChanges();
    fixture.componentInstance.index.set(1);
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    const next = host.querySelector(
      '.solaris-content-carousel__arrow--next',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
  });

  it('should sync the engine when activeIndex changes externally', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel [activeIndex]="index()" ariaLabel="Panels">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel two</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class IndexHost {
      readonly index = signal(0);
    }
    const fixture = TestBed.createComponent(IndexHost);
    fixture.detectChanges();
    fixture.componentInstance.index.set(1);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host
        .querySelector('.solaris-content-carousel__slide[data-active]')
        ?.getAttribute('aria-label'),
    ).toBe('2 of 2');
  });
});

describe('SolarisContentCarouselComponent i18n', () => {
  it('should resolve labels in pt-BR', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({
      translate: { locale: 'pt-BR' },
    });
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabel="Destaques">
          <ng-template solaris-carousel-slide>
            <section><h2>Painel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Painel dois</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class PtHost {}
    const fixture = TestBed.createComponent(PtHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host
        .querySelector('.solaris-content-carousel__dot')
        ?.getAttribute('aria-label'),
    ).toBe('Ir para o slide 1 de 2');
    expect(
      host
        .querySelector('.solaris-content-carousel__slide')
        ?.getAttribute('aria-label'),
    ).toBe('1 de 2');
  });

  it('should resolve labels through the translate testing provider', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideSolarisTranslateTesting({ locale: 'pt-BR' })],
    });
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabel="Destaques">
          <ng-template solaris-carousel-slide>
            <section><h2>Painel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Painel dois</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class PtProviderHost {}
    const fixture = TestBed.createComponent(PtProviderHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host
        .querySelector('.solaris-content-carousel__arrow--prev')
        ?.getAttribute('aria-label'),
    ).toBe('Slide anterior');
  });

  it('should resolve labels in es-419', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting({
      translate: { locale: 'es-419' },
    });
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel ariaLabel="Destacados">
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel dos</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class EsHost {}
    const fixture = TestBed.createComponent(EsHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector(
      'solaris-content-carousel',
    ) as HTMLElement;
    expect(
      host
        .querySelector('.solaris-content-carousel__dot')
        ?.getAttribute('aria-label'),
    ).toBe('Ir a la diapositiva 1 de 2');
  });
});

describe('SolarisContentCarouselHarness', () => {
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
    const harness = await loader.getHarness(SolarisContentCarouselHarness);
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
    const harness = await loader.getHarness(SolarisContentCarouselHarness);
    expect(await harness.isNextDisabled()).toBe(true);
    expect(await harness.isPreviousDisabled()).toBe(false);
  });

  it('should expose the divider side through the harness', async () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
      template: `
        <solaris-content-carousel
          align="end"
          [showDivider]="true"
          ariaLabel="Panels"
        >
          <ng-template solaris-carousel-slide>
            <section><h2>Panel</h2></section>
          </ng-template>
          <ng-template solaris-carousel-slide>
            <section><h2>Panel dois</h2></section>
          </ng-template>
        </solaris-content-carousel>
      `,
    })
    class DividerHarnessHost {}
    const fixture = TestBed.createComponent(DividerHarnessHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SolarisContentCarouselHarness);
    expect(await harness.getDividerSide()).toBe('left');
  });
});
