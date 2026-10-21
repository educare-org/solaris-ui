import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

import { provideSolarisTranslateTesting } from '@solaris-ui/angular';

import { SHELL_TRANSLATIONS } from '../translations';
import { ShowcaseDocsOnThisPage } from './docs-on-this-page';

describe('ShowcaseDocsOnThisPage', () => {
  let fixture: ComponentFixture<ShowcaseDocsOnThisPage>;
  let originalIntersectionObserver: typeof IntersectionObserver | undefined;

  beforeEach(async () => {
    originalIntersectionObserver = (
      globalThis as { IntersectionObserver?: typeof IntersectionObserver }
    ).IntersectionObserver;
    const MockObserver = class {
      static instances: Array<{
        callback: IntersectionObserverCallback;
        instance: unknown;
      }> = [];

      constructor(callback: IntersectionObserverCallback) {
        const entry = { callback, instance: this };
        MockObserver.instances.push(entry);
        (
          globalThis as { __lastShowcaseObserver?: unknown }
        ).__lastShowcaseObserver = entry;
      }

      observe(): void {
        return undefined;
      }
      unobserve(): void {
        return undefined;
      }
      disconnect(): void {
        return undefined;
      }
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    };
    MockObserver.instances = [];
    (
      globalThis as { __lastShowcaseObserver?: unknown }
    ).__lastShowcaseObserver = undefined;
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;
    await TestBed.configureTestingModule({
      imports: [ShowcaseDocsOnThisPage],
      providers: [
        provideSolarisTranslateTesting({ translations: SHELL_TRANSLATIONS }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ShowcaseDocsOnThisPage);
    fixture.componentRef.setInput('items', [
      { anchor: 'overview', label: 'Overview' },
      { anchor: 'api', label: 'API', level: 3 },
    ]);
    fixture.detectChanges();
  });

  afterEach(() => {
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
      originalIntersectionObserver;
    (
      globalThis as { __lastShowcaseObserver?: unknown }
    ).__lastShowcaseObserver = undefined;
    document.getElementById('overview')?.remove();
    document.getElementById('api')?.remove();
    fixture.destroy();
  });

  it('should create a labelled navigation landmark', () => {
    const nav = fixture.debugElement.query(By.css('nav.docs-on-this-page'));
    expect(nav).toBeTruthy();
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('On this page');
  });

  it('should render anchor links for every item', () => {
    const links = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__link'),
    );
    expect(links.map((link) => link.attributes['href'])).toEqual([
      '#overview',
      '#api',
    ]);
    expect(links.map((link) => link.nativeElement.textContent.trim())).toEqual([
      'Overview',
      'API',
    ]);
  });

  it('should activate the clicked anchor without scrolling motion', () => {
    const links = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__link'),
    );
    links[1].nativeElement.click();
    fixture.detectChanges();

    const active = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__item[data-active="true"]'),
    );
    expect(active).toHaveLength(1);
    expect(
      active[0].query(By.css('.docs-on-this-page__link')).attributes[
        'aria-current'
      ],
    ).toBe('true');
    expect(
      active[0].query(By.css('.docs-on-this-page__link')).attributes['href'],
    ).toBe('#api');
  });

  it('should respect the active fallback when no anchor was selected', () => {
    fixture.componentRef.setInput('items', [
      { anchor: 'overview', label: 'Overview', active: true },
      { anchor: 'api', label: 'API' },
    ]);
    fixture.detectChanges();

    const active = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__item[data-active="true"]'),
    );
    expect(active).toHaveLength(1);
  });

  it('should update the active link when scrolling between sections', async () => {
    const overview = document.createElement('section');
    overview.id = 'overview';
    const api = document.createElement('section');
    api.id = 'api';
    document.body.append(overview, api);

    const rects = new Map<string, number>([
      ['overview', 0],
      ['api', 800],
    ]);
    const spies = [overview, api].map((element) =>
      vi
        .spyOn(element, 'getBoundingClientRect')
        .mockImplementation(
          () => ({ top: rects.get(element.id) ?? 0 }) as unknown as DOMRect,
        ),
    );

    try {
      window.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
      fixture.detectChanges();

      expect(activeHref()).toBe('#overview');

      rects.set('overview', -600);
      rects.set('api', 50);
      window.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
      fixture.detectChanges();

      expect(activeHref()).toBe('#api');
    } finally {
      spies.forEach((spy) => spy.mockRestore());
      overview.remove();
      api.remove();
    }
  });

  it('should activate the last visible anchor reported by the observer', async () => {
    const overview = document.createElement('section');
    overview.id = 'overview';
    const api = document.createElement('section');
    api.id = 'api';
    document.body.append(overview, api);

    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const observer = getLastObserver();
      expect(observer).toBeTruthy();

      observer?.callback(
        [
          { isIntersecting: true, target: overview },
          { isIntersecting: true, target: api },
        ] as unknown as IntersectionObserverEntry[],
        observer.instance as IntersectionObserver,
      );
      fixture.detectChanges();

      expect(activeHref()).toBe('#api');
    } finally {
      overview.remove();
      api.remove();
    }
  });

  function activeHref(): string | null | undefined {
    const active = fixture.debugElement.queryAll(
      By.css('.docs-on-this-page__item[data-active="true"]'),
    );
    return active[0]?.query(By.css('.docs-on-this-page__link')).attributes[
      'href'
    ];
  }

  function getLastObserver():
    | {
        callback: IntersectionObserverCallback;
        instance: unknown;
      }
    | undefined {
    return (globalThis as { __lastShowcaseObserver?: unknown })
      .__lastShowcaseObserver as
      | {
          callback: IntersectionObserverCallback;
          instance: unknown;
        }
      | undefined;
  }
});
