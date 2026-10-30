// @vitest-environment node
import '@angular/compiler';
import { Component, type Type } from '@angular/core';
import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideServerRendering,
  renderApplication,
} from '@angular/platform-server';
import {
  SolarisContentCarouselComponent,
  SolarisCarouselSlideDirective,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-content-basic-host',
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
class SsrContentBasicHostComponent {}

@Component({
  selector: 'solaris-ssr-content-empty-host',
  standalone: true,
  imports: [SolarisContentCarouselComponent],
  template: `<solaris-content-carousel ariaLabel="Empty" />`,
})
class SsrContentEmptyHostComponent {}

@Component({
  selector: 'solaris-ssr-content-divider-host',
  standalone: true,
  imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
  template: `
    <solaris-content-carousel
      align="end"
      [showDivider]="true"
      ariaLabel="Login highlights"
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
class SsrContentDividerHostComponent {}

@Component({
  selector: 'solaris-ssr-content-clamped-host',
  standalone: true,
  imports: [SolarisContentCarouselComponent, SolarisCarouselSlideDirective],
  template: `
    <solaris-content-carousel
      [activeIndex]="1"
      [loop]="false"
      ariaLabel="Clamped"
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
class SsrContentClampedHostComponent {}

async function renderHost(host: Type<unknown>, tag: string): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) =>
      bootstrapApplication(
        host,
        {
          providers: [
            provideClientHydration(),
            provideServerRendering(),
            provideSolarisTesting(),
          ],
        },
        context,
      ),
    {
      document: `<html><head></head><body><${tag}></${tag}></body></html>`,
      url: '/',
    },
  );
}

function countOccurrences(html: string, marker: string): number {
  return html.split(marker).length - 1;
}

describe('SolarisContentCarousel SSR', () => {
  it('renders the region with projected slides and dots', async () => {
    const html = await renderHost(
      SsrContentBasicHostComponent,
      'solaris-ssr-content-basic-host',
    );
    expect(html).toContain('aria-roledescription="carousel"');
    expect(countOccurrences(html, 'aria-roledescription="slide"')).toBe(3);
    expect(countOccurrences(html, 'solaris-content-carousel__dot"')).toBe(3);
    expect(html).toContain('aria-label="1 of 3"');
    expect(html).toContain('First panel');
  });

  it('renders the empty state with role status', async () => {
    const html = await renderHost(
      SsrContentEmptyHostComponent,
      'solaris-ssr-content-empty-host',
    );
    expect(html).toContain('solaris-content-carousel__empty');
    expect(html).toContain('role="status"');
  });

  it('renders the divider with the resolved side', async () => {
    const html = await renderHost(
      SsrContentDividerHostComponent,
      'solaris-ssr-content-divider-host',
    );
    expect(html).toContain('data-divider="left"');
    expect(html).toContain('solaris-content-carousel__divider--left');
    expect(html).toContain('aria-hidden="true"');
  });

  it('renders clamped ends with aria-disabled and no timer markup', async () => {
    const html = await renderHost(
      SsrContentClampedHostComponent,
      'solaris-ssr-content-clamped-host',
    );
    expect(html).toContain('aria-label="2 of 2"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain('setInterval');
  });
});
