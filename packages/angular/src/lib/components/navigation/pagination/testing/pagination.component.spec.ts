import { TestBed } from '@angular/core/testing';

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
    expect(element.textContent).toContain('Page 3 of 3');
  });

  it('should render Page start of end with a known total', () => {
    const { element } = createFixture();
    expect(element.textContent).toContain('Page 1 of 10');
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
});
