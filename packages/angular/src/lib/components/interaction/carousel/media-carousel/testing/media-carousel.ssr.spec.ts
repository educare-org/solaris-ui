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
  SolarisMediaCarouselComponent,
  provideSolarisTesting,
} from '@educarehq/solaris-ui';

@Component({
  selector: 'solaris-ssr-media-basic-host',
  standalone: true,
  imports: [SolarisMediaCarouselComponent],
  template: `<solaris-media-carousel
    [slides]="slides"
    ariaLabel="Featured stories"
  />`,
})
class SsrMediaBasicHostComponent {
  readonly slides = [
    { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
    { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
    { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
  ] as const;
}

@Component({
  selector: 'solaris-ssr-media-empty-host',
  standalone: true,
  imports: [SolarisMediaCarouselComponent],
  template: `<solaris-media-carousel [slides]="[]" ariaLabel="Empty" />`,
})
class SsrMediaEmptyHostComponent {}

@Component({
  selector: 'solaris-ssr-media-clamped-host',
  standalone: true,
  imports: [SolarisMediaCarouselComponent],
  template: `<solaris-media-carousel
    [slides]="slides"
    [activeIndex]="2"
    [loop]="false"
    ariaLabel="Clamped"
  />`,
})
class SsrMediaClampedHostComponent {
  readonly slides = [
    { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
    { type: 'image', src: 'slide-2.jpg', alt: 'Second story' },
    { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
  ] as const;
}

@Component({
  selector: 'solaris-ssr-media-preview-host',
  standalone: true,
  imports: [SolarisMediaCarouselComponent],
  template: `<solaris-media-carousel
    [slides]="slides"
    navigation="preview"
    ariaLabel="Preview"
  />`,
})
class SsrMediaPreviewHostComponent {
  readonly slides = [
    { type: 'image', src: 'slide-1.jpg', alt: 'First story' },
    { type: 'video', src: 'tour.mp4', poster: 'tour.jpg', alt: 'Tour' },
    { type: 'image', src: 'slide-3.jpg', alt: 'Third story' },
  ] as const;
}

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

describe('SolarisMediaCarousel SSR', () => {
  it('renders the region with slides and dots', async () => {
    const html = await renderHost(
      SsrMediaBasicHostComponent,
      'solaris-ssr-media-basic-host',
    );
    expect(html).toContain('aria-roledescription="carousel"');
    expect(countOccurrences(html, 'aria-roledescription="slide"')).toBe(3);
    expect(countOccurrences(html, 'solaris-media-carousel__dot"')).toBe(3);
    expect(html).toContain('aria-label="1 of 3"');
  });

  it('renders the empty state with role status', async () => {
    const html = await renderHost(
      SsrMediaEmptyHostComponent,
      'solaris-ssr-media-empty-host',
    );
    expect(html).toContain('solaris-media-carousel__empty');
    expect(html).toContain('role="status"');
  });

  it('renders clamped ends with aria-disabled and no timer markup', async () => {
    const html = await renderHost(
      SsrMediaClampedHostComponent,
      'solaris-ssr-media-clamped-host',
    );
    expect(html).toContain('aria-label="3 of 3"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain('setInterval');
  });

  it('renders the preview strip with thumbs and the video badge', async () => {
    const html = await renderHost(
      SsrMediaPreviewHostComponent,
      'solaris-ssr-media-preview-host',
    );
    expect(
      countOccurrences(html, 'solaris-media-carousel__preview-thumb"'),
    ).toBe(3);
    expect(html).toContain('aria-current="true"');
    expect(html).toContain('solaris-media-carousel__preview-badge');
  });
});
