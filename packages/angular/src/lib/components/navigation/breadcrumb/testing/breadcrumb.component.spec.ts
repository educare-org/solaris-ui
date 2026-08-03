import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

import { SolarisBreadcrumbComponent } from '../component/breadcrumb.component';

import type {
  SolarisBreadcrumbSeparator,
  SolarisBreadcrumbOverflowPosition,
  SolarisBreadcrumbItem,
  SolarisBreadcrumbNavigateEvent,
} from '../model/breadcrumb.types';

describe('SolarisBreadcrumbComponent', () => {
  const defaultItems: SolarisBreadcrumbItem[] = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' },
  ];

  @Component({
    standalone: true,
    imports: [SolarisBreadcrumbComponent],
    template: `
      <solaris-breadcrumb
        [items]="items"
        (navigate)="onNavigate($event)"
        (previous)="onPrevious()"
        (next)="onNext()"
      />
    `,
  })
  class TestHostComponent {
    items: SolarisBreadcrumbItem[] = [...defaultItems];
    lastNavigate: SolarisBreadcrumbNavigateEvent | undefined;
    previousCount = 0;
    nextCount = 0;

    onNavigate(event: SolarisBreadcrumbNavigateEvent): void {
      this.lastNavigate = event;
    }

    onPrevious(): void {
      this.previousCount++;
    }

    onNext(): void {
      this.nextCount++;
    }
  }

  @Component({
    standalone: true,
    imports: [SolarisBreadcrumbComponent],
    template: ` <solaris-breadcrumb [items]="items" size="lg" /> `,
  })
  class SizeHost {
    items: SolarisBreadcrumbItem[] = [
      { label: 'Home', current: true },
      { label: 'Settings' },
    ];
  }

  let fixture: ComponentFixture<TestHostComponent>;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('solaris-breadcrumb') as HTMLElement;
  const getNav = (): HTMLElement =>
    fixture.nativeElement.querySelector('nav') as HTMLElement;
  const getItems = (): HTMLElement[] =>
    Array.from(getHost().querySelectorAll('.solaris-breadcrumb__item'));
  const getLinks = (): HTMLAnchorElement[] =>
    Array.from(getHost().querySelectorAll('.solaris-breadcrumb__link'));

  beforeEach(() => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose host class', () => {
    expect(getHost().classList.contains('solaris-breadcrumb')).toBe(true);
  });

  describe('semantics', () => {
    it('should render a nav with an ordered list', () => {
      expect(getNav().tagName).toBe('NAV');
      expect(getHost().querySelector('ol')).toBeTruthy();
      expect(getItems().length).toBe(3);
    });

    it('should provide a default aria-label', () => {
      expect(getNav().getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('should render an anchor for items with href', () => {
      expect(getLinks().length).toBe(2);
      expect(getLinks()[0].getAttribute('href')).toBe('/');
      expect(getLinks()[1].getAttribute('href')).toBe('/settings');
    });

    it('should render plain text for items without href', () => {
      const textEl = getHost().querySelector('.solaris-breadcrumb__text');
      expect(textEl).toBeTruthy();
      expect(textEl?.tagName).toBe('SPAN');
    });
  });

  describe('current item', () => {
    it('should mark the current item with aria-current=page', () => {
      const currentFixture = TestBed.createComponent(TestHostComponent);
      currentFixture.componentInstance.items = [
        { label: 'Home', href: '/' },
        { label: 'Profile', current: true },
      ];
      currentFixture.detectChanges();
      const current = currentFixture.nativeElement.querySelector(
        '[aria-current="page"]',
      );
      expect(current).toBeTruthy();
      expect(current?.textContent).toContain('Profile');
    });

    it('should not render the current item as a link', () => {
      const currentFixture = TestBed.createComponent(TestHostComponent);
      currentFixture.componentInstance.items = [
        { label: 'Home', href: '/' },
        { label: 'Profile', current: true, href: '/profile' },
      ];
      currentFixture.detectChanges();
      const links = Array.from(
        currentFixture.nativeElement.querySelectorAll(
          '.solaris-breadcrumb__link',
        ),
      ) as HTMLAnchorElement[];
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('href')).toBe('/');
    });
  });

  describe('icons', () => {
    it('should render an icon inside a link item', () => {
      const icon = getHost().querySelector(
        '.solaris-breadcrumb__link solaris-icon',
      );
      expect(icon).toBeTruthy();
    });

    it('should support icon-only items via aria-label', () => {
      const iconFixture = TestBed.createComponent(TestHostComponent);
      iconFixture.componentInstance.items = [
        { icon: 'home', href: '/', ariaLabel: 'Home page' },
        { label: 'Profile', current: true },
      ];
      iconFixture.detectChanges();
      const link = iconFixture.nativeElement.querySelector(
        '.solaris-breadcrumb__link',
      ) as HTMLAnchorElement;
      expect(link.getAttribute('aria-label')).toBe('Home page');
    });
  });

  describe('separators', () => {
    it('should default to slash separator', () => {
      expect(getHost().getAttribute('data-separator')).toBe('slash');
      const separator = getHost().querySelector(
        '.solaris-breadcrumb__separator',
      );
      expect(separator?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render a separator icon between items', () => {
      expect(
        getHost().querySelectorAll('.solaris-breadcrumb__separator').length,
      ).toBe(2);
    });

    it('should not render a separator after the last item', () => {
      const items = getItems();
      const last = items[items.length - 1];
      expect(last.querySelector('.solaris-breadcrumb__separator')).toBeNull();
    });
  });

  describe('navigate output', () => {
    it('should emit the item on link click', () => {
      getLinks()[0].click();
      expect(fixture.componentInstance.lastNavigate?.item.label).toBe('Home');
    });
  });

  describe('size', () => {
    it('should default to md', () => {
      expect(getHost().getAttribute('data-size')).toBe('md');
    });

    it('should reflect the size input', () => {
      const sizeFixture = TestBed.createComponent(SizeHost);
      sizeFixture.detectChanges();
      const hostEl = sizeFixture.nativeElement.querySelector(
        'solaris-breadcrumb',
      ) as HTMLElement;
      expect(hostEl.getAttribute('data-size')).toBe('lg');
    });
  });
});

@Component({
  standalone: true,
  imports: [SolarisBreadcrumbComponent],
  template: `
    <solaris-breadcrumb
      [items]="items"
      [separator]="separator"
      [maxVisibleItems]="maxVisibleItems"
      [overflowPosition]="overflowPosition"
    />
  `,
})
class OverflowHost {
  items: SolarisBreadcrumbItem[] = [
    { label: 'Item 1' },
    { label: 'Item 2' },
    { label: 'Item 3' },
    { label: 'Item 4' },
    { label: 'Item 5' },
  ];
  separator: SolarisBreadcrumbSeparator = 'slash';
  maxVisibleItems: number | null = 3;
  overflowPosition: SolarisBreadcrumbOverflowPosition = 'end';
}

@Component({
  standalone: true,
  imports: [SolarisBreadcrumbComponent],
  template: `
    <solaris-breadcrumb
      [items]="items"
      [showNavigation]="true"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class NavigationHost {
  items: SolarisBreadcrumbItem[] = [
    { label: 'Home', current: true },
    { label: 'Settings' },
  ];
  ariaLabel = 'Navigation';
}

describe('SolarisBreadcrumbComponent overflow', () => {
  let fixture: ComponentFixture<OverflowHost>;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('solaris-breadcrumb') as HTMLElement;
  const getRenderedLabels = (): string[] =>
    Array.from(getHost().querySelectorAll('.solaris-breadcrumb__label')).map(
      (el) => (el.textContent ?? '').trim(),
    );
  const hasOverflowTrigger = (): boolean =>
    !!getHost().querySelector('.solaris-breadcrumb__overflow-trigger');

  beforeEach(() => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(OverflowHost);
    fixture.detectChanges();
  });

  it('should render all items when no limit is set', () => {
    fixture = TestBed.createComponent(OverflowHost);
    fixture.componentInstance.maxVisibleItems = null;
    fixture.detectChanges();
    expect(hasOverflowTrigger()).toBe(false);
    expect(getRenderedLabels()).toEqual([
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
      'Item 5',
    ]);
  });

  it('should render an ellipsis trigger when over the limit', () => {
    expect(hasOverflowTrigger()).toBe(true);
  });

  describe('overflowPosition=end', () => {
    it('should keep the first and current items, hiding the tail', () => {
      const labels = getRenderedLabels();
      expect(labels[0]).toBe('Item 1');
      expect(labels[labels.length - 1]).toBe('Item 5');
      expect(labels.length).toBeLessThan(5);
    });

    it('should hide the end segment from the rendered trail', () => {
      expect(getRenderedLabels()).toEqual(['Item 1', 'Item 2', 'Item 5']);
    });
  });

  describe('overflowPosition=start', () => {
    it('should show the tail with the ellipsis at the start', () => {
      fixture = TestBed.createComponent(OverflowHost);
      fixture.componentInstance.overflowPosition = 'start';
      fixture.detectChanges();
      const host = getHost();
      const first = host.querySelector('.solaris-breadcrumb__item');
      expect(
        first?.querySelector('.solaris-breadcrumb__overflow-trigger'),
      ).toBeTruthy();
      expect(getRenderedLabels()[0]).toBe('Item 3');
    });
  });

  describe('overflowPosition=middle', () => {
    it('should keep the first and last items with the ellipsis in between', () => {
      fixture = TestBed.createComponent(OverflowHost);
      fixture.componentInstance.overflowPosition = 'middle';
      fixture.detectChanges();
      const labels = getRenderedLabels();
      expect(labels[0]).toBe('Item 1');
      expect(labels[labels.length - 1]).toBe('Item 5');
      expect(labels.length).toBeLessThan(5);
    });
  });
});

describe('SolarisBreadcrumbComponent navigation pager', () => {
  let fixture: ComponentFixture<NavigationHost>;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('solaris-breadcrumb') as HTMLElement;
  const getPagerButtons = (): HTMLButtonElement[] =>
    Array.from(getHost().querySelectorAll('.solaris-breadcrumb__pager-button'));

  beforeEach(() => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(NavigationHost);
    fixture.detectChanges();
  });

  it('should render pager buttons when showNavigation is enabled', () => {
    expect(getPagerButtons().length).toBe(2);
  });

  it('should not render pager buttons by default', () => {
    const plainFixture = TestBed.createComponent(TestHostFallback);
    plainFixture.detectChanges();
    const hostEl = plainFixture.nativeElement.querySelector(
      'solaris-breadcrumb',
    ) as HTMLElement;
    expect(
      hostEl.querySelector('.solaris-breadcrumb__pager-button'),
    ).toBeNull();
  });

  it('should disable previous when on the first item', () => {
    expect(getPagerButtons()[0].disabled).toBe(true);
  });

  it('should disable next when on the last item', () => {
    fixture = TestBed.createComponent(NavigationHost);
    fixture.componentInstance.items = [
      { label: 'Home' },
      { label: 'Settings', current: true },
    ];
    fixture.detectChanges();
    expect(getPagerButtons()[1].disabled).toBe(true);
  });

  it('should provide accessible labels for the pager buttons', () => {
    expect(getPagerButtons()[0].getAttribute('aria-label')).toBe('Previous');
    expect(getPagerButtons()[1].getAttribute('aria-label')).toBe('Next');
  });
});

@Component({
  standalone: true,
  imports: [SolarisBreadcrumbComponent],
  template: `<solaris-breadcrumb [items]="items" />`,
})
class TestHostFallback {
  items: SolarisBreadcrumbItem[] = [
    { label: 'Home' },
    { label: 'Settings', current: true },
  ];
}
