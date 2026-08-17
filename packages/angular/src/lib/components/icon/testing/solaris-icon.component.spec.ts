import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisIconComponent } from '../component/solaris-icon.component';
import { provideSolaris } from '../../../providers/provide-solaris';
describe('SolarisIconComponent', () => {
  let fixture: ComponentFixture<SolarisIconComponent>;

  const configureTesting = () => {
    TestBed.configureTestingModule({
      providers: [provideSolaris()],
    });

    fixture = TestBed.createComponent(SolarisIconComponent);
  };

  it('should render a registered icon', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');

    const path = fixture.nativeElement.querySelector('path');
    expect(path).toBeTruthy();
    expect(path.getAttribute('d')).toBeTruthy();
  });

  it('should not render anything for an unregistered icon', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'nonexistent');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeFalsy();
  });

  it('should apply aria-hidden when decorative is true', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('decorative', true);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('role')).toBe('presentation');
  });

  it('should apply aria-label when ariaLabel is provided and not decorative', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('ariaLabel', 'Confirm');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-label')).toBe('Confirm');
    expect(svg.getAttribute('role')).toBe('img');
  });

  it('should not have aria-label when decorative is true even if ariaLabel is set', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('decorative', true);
    fixture.componentRef.setInput('ariaLabel', 'Confirm');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-label')).toBeFalsy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should use role img when not decorative and no ariaLabel', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-hidden')).toBeFalsy();
  });

  it('should render SVG with stroke attributes from definition', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-width')).toBe('3');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('stroke-linejoin')).toBe('round');
  });

  it('should use no stroke for icons with their own colors', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'google');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('stroke')).toBe('none');
    expect(svg.getAttribute('stroke-width')).toBe('0');
  });

  it('should render per-element fill on multicolor brand icons', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'microsoft');
    fixture.detectChanges();

    const rects = fixture.nativeElement.querySelectorAll('svg rect');
    expect(rects.length).toBe(4);
    expect(rects[0].getAttribute('fill')).toBe('#F35325');
    expect(rects[1].getAttribute('fill')).toBe('#81BC06');
    expect(rects[2].getAttribute('fill')).toBe('#05A6F0');
    expect(rects[3].getAttribute('fill')).toBe('#FFBA08');
  });

  it('should force currentColor stroke when inheritColor is true on a line icon', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('inheritColor', true);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
  });

  it('should disable inherited stroke when inheritColor is false', () => {
    configureTesting();
    fixture.componentRef.setInput('name', 'check');
    fixture.componentRef.setInput('inheritColor', false);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('stroke')).toBe('none');
  });
});
