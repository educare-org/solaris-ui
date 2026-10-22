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
});
