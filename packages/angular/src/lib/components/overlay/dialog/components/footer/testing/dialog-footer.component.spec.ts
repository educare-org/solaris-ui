import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogFooterComponent } from '../component/dialog-footer.component';
import { SolarisDialogHeaderComponent } from '../../header/component/dialog-header.component';

@Component({
  standalone: true,
  imports: [SolarisDialogFooterComponent],
  template: `<solaris-dialog-footer
    [align]="align"
    [separator]="separator"
    [scrolled]="scrolled"
    ><button type="button">Footer action</button></solaris-dialog-footer
  >`,
})
class FooterHostComponent {
  align: 'start' | 'center' | 'end' | 'space-between' = 'end';
  separator = true;
  scrolled?: boolean;
}

describe('SolarisDialogFooterComponent', () => {
  function createFixture(
    align: 'start' | 'center' | 'end' | 'space-between' = 'end',
    separator = true,
    scrolled?: boolean,
  ): ComponentFixture<FooterHostComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      imports: [FooterHostComponent],
    });

    const fixture = TestBed.createComponent(FooterHostComponent);
    fixture.componentInstance.align = align;
    fixture.componentInstance.separator = separator;
    fixture.componentInstance.scrolled = scrolled;
    fixture.detectChanges();
    return fixture;
  }

  it('should create and project content', () => {
    const fixture = createFixture();
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    );
    expect(footer).toBeTruthy();
    expect(footer?.textContent?.trim()).toBe('Footer action');
  });

  it('should apply default align and separator attributes', () => {
    const fixture = createFixture();
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    expect(footer.getAttribute('data-align')).toBe('end');
    expect(footer.hasAttribute('data-separator')).toBe(true);
  });

  it('should reflect align and separator inputs', () => {
    const fixture = createFixture('start', false);

    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    expect(footer.getAttribute('data-align')).toBe('start');
    expect(footer.hasAttribute('data-separator')).toBe(false);
  });

  it('should not set data-scrolled by default', () => {
    const fixture = createFixture();
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    expect(footer.getAttribute('data-scrolled')).toBeNull();
  });

  it('should set data-scrolled when scrolled input is true', () => {
    const fixture = createFixture('end', true, true);
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    expect(footer.getAttribute('data-scrolled')).toBe('');
  });

  it('should set data-scrolled while the scroll parent has content below', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      imports: [FooterHostComponent],
    });

    const fixture = TestBed.createComponent(FooterHostComponent);
    const footer = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
    const scrollParent = footer.parentElement as HTMLElement;
    const prevOverflowY = scrollParent.style.overflowY;
    const prevScrollTop = scrollParent.scrollTop;
    const prevClientHeight = Object.getOwnPropertyDescriptor(
      scrollParent,
      'clientHeight',
    );
    const prevScrollHeight = Object.getOwnPropertyDescriptor(
      scrollParent,
      'scrollHeight',
    );
    scrollParent.style.overflowY = 'auto';
    try {
      mockScrollMetrics(scrollParent, {
        scrollTop: 0,
        clientHeight: 400,
        scrollHeight: 1000,
      });
      fixture.detectChanges();

      expect(footer.getAttribute('data-scrolled')).toBe('');

      scrollParent.scrollTop = 600;
      scrollParent.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(footer.getAttribute('data-scrolled')).toBeNull();
    } finally {
      scrollParent.style.overflowY = prevOverflowY;
      scrollParent.scrollTop = prevScrollTop;
      restoreScrollMetrics(scrollParent, prevClientHeight, prevScrollHeight);
    }
  });
});

@Component({
  standalone: true,
  imports: [SolarisDialogHeaderComponent, SolarisDialogFooterComponent],
  template: `
    <solaris-dialog-header [title]="title" [separator]="headerSeparator" />
    @if (bodyText) {
      <p>{{ bodyText }}</p>
    }
    <solaris-dialog-footer [separator]="footerSeparator"
      ><button type="button">Close</button></solaris-dialog-footer
    >
  `,
})
class AdjacentHeaderFooterHostComponent {
  title = 'Ada 1';
  headerSeparator = true;
  footerSeparator = true;
  bodyText?: string;
}

describe('SolarisDialogFooterComponent adjacent header separator', () => {
  function createAdjacentFixture(
    config: Partial<AdjacentHeaderFooterHostComponent> = {},
  ): ComponentFixture<AdjacentHeaderFooterHostComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      imports: [AdjacentHeaderFooterHostComponent],
    });

    const fixture = TestBed.createComponent(AdjacentHeaderFooterHostComponent);
    Object.assign(fixture.componentInstance, config);
    fixture.detectChanges();
    fixture.detectChanges();
    return fixture;
  }

  function footerOf(
    fixture: ComponentFixture<AdjacentHeaderFooterHostComponent>,
  ): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-footer',
    ) as HTMLElement;
  }

  it('should collapse the separator when directly below a header with separator', () => {
    const fixture = createAdjacentFixture();
    expect(footerOf(fixture).getAttribute('data-adjacent-header')).toBe('');
  });

  it('should keep the separator when the header separator is off', () => {
    const fixture = createAdjacentFixture({ headerSeparator: false });
    expect(footerOf(fixture).hasAttribute('data-adjacent-header')).toBe(false);
  });

  it('should keep the separator when its own separator is off', () => {
    const fixture = createAdjacentFixture({ footerSeparator: false });
    expect(footerOf(fixture).hasAttribute('data-adjacent-header')).toBe(false);
  });

  it('should keep the separator when body content sits between header and footer', () => {
    const fixture = createAdjacentFixture({ bodyText: 'Body content' });
    expect(footerOf(fixture).hasAttribute('data-adjacent-header')).toBe(false);
  });
});

function mockScrollMetrics(
  element: HTMLElement,
  metrics: { scrollTop: number; clientHeight: number; scrollHeight: number },
): void {
  element.scrollTop = metrics.scrollTop;
  Object.defineProperty(element, 'clientHeight', {
    value: metrics.clientHeight,
    configurable: true,
  });
  Object.defineProperty(element, 'scrollHeight', {
    value: metrics.scrollHeight,
    configurable: true,
  });
}

function restoreScrollMetrics(
  element: HTMLElement,
  clientHeight: PropertyDescriptor | undefined,
  scrollHeight: PropertyDescriptor | undefined,
): void {
  if (clientHeight) {
    Object.defineProperty(element, 'clientHeight', clientHeight);
  } else {
    Reflect.deleteProperty(element, 'clientHeight');
  }
  if (scrollHeight) {
    Object.defineProperty(element, 'scrollHeight', scrollHeight);
  } else {
    Reflect.deleteProperty(element, 'scrollHeight');
  }
}
