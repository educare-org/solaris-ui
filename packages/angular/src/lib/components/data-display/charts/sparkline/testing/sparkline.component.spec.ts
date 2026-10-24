import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisSparklineComponent } from '../component/sparkline.component';

describe('SolarisSparklineComponent', () => {
  let fixture: ComponentFixture<SolarisSparklineComponent>;

  const createFixture = (
    points: readonly (number | null | undefined)[] = [3, 5, 4, 8],
  ): HTMLElement => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisSparklineComponent);
    fixture.componentRef.setInput('points', points);
    fixture.componentRef.setInput('ariaLabel', 'Revenue trend, rising');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders an svg with the required aria label', () => {
    const el = createFixture();
    const svg = el.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Revenue trend, rising');
    expect(el.getAttribute('data-trend')).toBe('up');
  });

  it('colors rising series as success when positive is good', () => {
    const el = createFixture([3, 5, 4, 8]);
    expect(
      el.querySelector('.solaris-sparkline__line')?.getAttribute('style'),
    ).toContain('var(--solaris-success-solid)');
  });

  it('colors falling series as danger when positive is good', () => {
    const el = createFixture([8, 5, 4, 3]);
    expect(el.getAttribute('data-trend')).toBe('down');
    expect(
      el.querySelector('.solaris-sparkline__line')?.getAttribute('style'),
    ).toContain('var(--solaris-danger-solid)');
  });

  it('inverts the semantic color when positive is not good', () => {
    const el = createFixture([8, 5, 4, 3]);
    fixture.componentRef.setInput('positiveIsGood', false);
    fixture.detectChanges();
    expect(
      el.querySelector('.solaris-sparkline__line')?.getAttribute('style'),
    ).toContain('var(--solaris-success-solid)');
  });

  it('renders flat neutral series without interpolation artifacts', () => {
    const el = createFixture([4, 4, 4]);
    expect(el.getAttribute('data-trend')).toBe('flat');
    expect(
      el.querySelector('.solaris-sparkline__line')?.getAttribute('d'),
    ).not.toBe('');
  });

  it('renders linear paths on demand and an area wash', () => {
    const el = createFixture();
    fixture.componentRef.setInput('interpolation', 'linear');
    fixture.detectChanges();
    const path =
      el.querySelector('.solaris-sparkline__line')?.getAttribute('d') ?? '';
    expect(path).toContain('L');
    expect(
      el.querySelector('.solaris-sparkline__area')?.getAttribute('d'),
    ).not.toBe('');
  });

  it('renders nothing plottable for empty input', () => {
    const el = createFixture([]);
    expect(el.querySelector('.solaris-sparkline__line')).toBeNull();
    expect(el.getAttribute('data-trend')).toBe('flat');
  });

  it('reflects size and density on the host', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-density')).toBe('comfortable');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('renders a KPI card with value, delta badge and sparkline', () => {
    const el = createFixture([3, 5, 4, 8]);
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('title', 'Active users');
    fixture.componentRef.setInput('value', '12,480');
    fixture.componentRef.setInput('delta', '+8.2%');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('card');
    expect(el.querySelector('solaris-card')).not.toBeNull();
    expect(el.textContent).toContain('Active users');
    expect(el.textContent).toContain('12,480');
    const badge = el.querySelector('solaris-badge');
    expect(badge?.textContent).toContain('+8.2%');
    expect(badge?.getAttribute('data-color')).toBe('success');
    expect(el.querySelector('.solaris-sparkline__line')).not.toBeNull();
  });

  it('inverts the delta badge when positive is not good', () => {
    const el = createFixture([8, 5, 4, 3]);
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('delta', '-12%');
    fixture.componentRef.setInput('positiveIsGood', false);
    fixture.detectChanges();
    expect(el.querySelector('solaris-badge')?.getAttribute('data-color')).toBe(
      'success',
    );
  });

  it('renders a neutral badge for a flat delta', () => {
    const el = createFixture([4, 4, 4]);
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('delta', '0%');
    fixture.detectChanges();
    expect(el.querySelector('solaris-badge')?.getAttribute('data-color')).toBe(
      'neutral',
    );
  });

  it('renders a bare card with a danger badge for a bad fall', () => {
    const el = createFixture([8, 5, 4, 3]);
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('delta', '-3.1%');
    fixture.detectChanges();
    expect(el.querySelector('.solaris-sparkline__card-title')).toBeNull();
    expect(el.querySelector('.solaris-sparkline__card-value')).toBeNull();
    expect(el.querySelector('solaris-badge')?.getAttribute('data-color')).toBe(
      'danger',
    );
  });

  it('honors an explicit delta direction override', () => {
    const el = createFixture([3, 5, 4, 8]);
    fixture.componentRef.setInput('appearance', 'card');
    fixture.componentRef.setInput('delta', '+1.0%');
    fixture.componentRef.setInput('deltaDirection', 'down');
    fixture.detectChanges();
    expect(el.querySelector('solaris-badge')?.getAttribute('data-color')).toBe(
      'danger',
    );
  });
});
