import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisIconComponent } from '../component/solaris-icon.component';
import { provideSolarisIcons } from '../../../services/icon/provider/provide-solaris-icons';

describe('SolarisIconComponent', () => {
  let fixture: ComponentFixture<SolarisIconComponent>;

  const configureTesting = () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisIcons()],
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
    expect(svg.getAttribute('stroke-width')).toBe('2');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('stroke-linejoin')).toBe('round');
  });
});
