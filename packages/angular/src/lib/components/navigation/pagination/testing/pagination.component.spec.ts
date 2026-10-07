import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideSolarisTranslateTesting } from '../../../../services/translation';
import { SolarisPaginationComponent } from '../component/pagination.component';

function createFixture() {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(SolarisPaginationComponent);
  fixture.componentRef.setInput('total', 95);
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
  };
}

function button(element: HTMLElement, label: string): HTMLButtonElement | null {
  return element.querySelector(
    `.solaris-pagination__button[aria-label="${label}"]`,
  );
}

describe('SolarisPaginationComponent', () => {
  it('should render first/prev/next/last with accessible labels', () => {
    const { element } = createFixture();
    expect(button(element, 'First page')).toBeTruthy();
    expect(button(element, 'Previous page')).toBeTruthy();
    expect(button(element, 'Next page')).toBeTruthy();
    expect(button(element, 'Last page')).toBeTruthy();
  });

  it('should disable previous and first on the first page', () => {
    const { element } = createFixture();
    expect(button(element, 'First page')?.disabled).toBe(true);
    expect(button(element, 'Previous page')?.disabled).toBe(true);
    expect(button(element, 'Next page')?.disabled).toBe(false);
  });

  it('should disable next and last on the last page', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('pageIndex', 9);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('total', 95);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(button(element, 'Next page')?.disabled).toBe(true);
    expect(button(element, 'Last page')?.disabled).toBe(true);
  });

  it('should clamp pageIndex beyond the last page', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('pageIndex', 99);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('total', 25);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('21–25 of 25');
  });

  it('should render the item window range with a known total', () => {
    const { element } = createFixture();
    expect(element.textContent).toContain('1–10 of 95');
  });

  it('should emit pageChange on navigation', () => {
    const { fixture } = createFixture();
    const events: unknown[] = [];
    fixture.componentInstance.pageChange.subscribe((event) =>
      events.push(event),
    );
    button(fixture.nativeElement as HTMLElement, 'Next page')?.click();
    expect(events).toEqual([{ pageIndex: 1, pageSize: 10 }]);
  });

  it('should reset to zero and emit when page size changes', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('pageIndex', 3);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('total', 95);
    fixture.detectChanges();
    const events: unknown[] = [];
    fixture.componentInstance.pageChange.subscribe((event) =>
      events.push(event),
    );
    const component = fixture.componentInstance as unknown as {
      handlePageSizeChange: (value: unknown) => void;
    };
    component.handlePageSizeChange(25);
    expect(events).toEqual([{ pageIndex: 0, pageSize: 25 }]);
  });

  it('should render the compact range and enable next by hasMore without total', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('pageIndex', 2);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('hasMore', true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('21–30');
    expect(button(element, 'Next page')?.disabled).toBe(false);
  });

  it('should disable next without hasMore and unknown total', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('pageIndex', 0);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(button(element, 'Next page')?.disabled).toBe(true);
  });

  it('should hide sections behind show flags', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('showFirstLast', false);
    fixture.componentRef.setInput('showRangeLabel', false);
    fixture.componentRef.setInput('showPageSize', false);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(button(element, 'First page')).toBeFalsy();
    expect(button(element, 'Last page')).toBeFalsy();
    expect(element.querySelector('.solaris-pagination__range')).toBeFalsy();
    expect(element.querySelector('.solaris-pagination__page-size')).toBeFalsy();
  });

  it('should inherit density and expose the navigation label', () => {
    const { element, fixture } = createFixture();
    expect(element.getAttribute('data-density')).toBe('normal');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(element.getAttribute('data-density')).toBe('compact');
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe(
      'Pagination',
    );
  });

  it('should resolve labels through direct text', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('nextPageLabel', 'Avançar');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector(
        '.solaris-pagination__button[aria-label="Avançar"]',
      ),
    ).toBeTruthy();
  });

  it('should display the current page size in the selector', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('pageSize', 25);
    fixture.componentRef.setInput('total', 95);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-pagination__page-size')?.textContent,
    ).toContain('25');
  });

  it('should render the description on the left and group controls on the right', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('description', 'Task management');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(
      element.querySelector('.solaris-pagination__description')?.textContent,
    ).toContain('Task management');
    const trailing = element.querySelector('.solaris-pagination__trailing');
    expect(trailing).toBeTruthy();
    expect(
      trailing?.querySelector('.solaris-pagination__page-size'),
    ).toBeTruthy();
    expect(trailing?.querySelector('.solaris-pagination__range')).toBeTruthy();
    expect(
      trailing?.querySelector('.solaris-pagination__controls'),
    ).toBeTruthy();
  });

  it('should resolve pagination labels in pt-BR', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTranslateTesting({ locale: 'pt-BR' })],
    });
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('total', 95);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Linhas por página');
    expect(element.textContent).toContain('1–10 de 95');
    expect(
      element.querySelector(
        '.solaris-pagination__button[aria-label="Próxima página"]',
      ),
    ).toBeTruthy();
  });

  it('should render a compact page-size selector without min-width floors', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisPaginationComponent);
    fixture.componentRef.setInput('total', 95);
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('solaris-select'))
      .componentInstance as unknown as {
      triggerMinWidth: () => unknown;
      panelMinWidth: () => unknown;
    };
    expect(select.triggerMinWidth()).toBe(0);
    expect(select.panelMinWidth()).toBe(0);
  });

  it('should hide the page-size label and use outline select on narrow viewports', () => {
    const originalMatchMedia = window.matchMedia;
    let observedQuery: string | undefined;
    window.matchMedia = ((query: string) => {
      observedQuery = query;
      return {
        matches: true,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      };
    }) as unknown as typeof window.matchMedia;
    try {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SolarisPaginationComponent);
      fixture.componentRef.setInput('total', 95);
      fixture.detectChanges();
      const element = fixture.nativeElement as HTMLElement;
      expect(observedQuery).toBe('(max-width: 720px)');
      expect(element.getAttribute('data-narrow')).toBe('');
      expect(
        element.querySelector('.solaris-pagination__page-size-label'),
      ).toBeFalsy();
      expect(
        element
          .querySelector('solaris-select solaris-form-field')
          ?.getAttribute('data-appearance'),
      ).toBe('outline');
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});
