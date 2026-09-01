import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisAnimatedIconComponent } from '../component/solaris-animated-icon.component';

@Component({
  standalone: true,
  imports: [SolarisAnimatedIconComponent],
  template: `
    <a href="/navigation">
      <solaris-animated-icon name="menu" [active]="open" [decorative]="true" />
    </a>
  `,
})
class LinkHost {
  open = false;
}

describe('SolarisAnimatedIconComponent', () => {
  let fixture: ComponentFixture<SolarisAnimatedIconComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisAnimatedIconComponent);
    fixture.componentRef.setInput('name', 'menu');
    fixture.detectChanges();
  };

  it('should render the menu icon with two currentColor paths', () => {
    createFixture();

    const svg = fixture.nativeElement.querySelector('svg');
    const paths = fixture.nativeElement.querySelectorAll('path');

    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(paths.length).toBe(2);
  });

  it('should expose the active state on the host', () => {
    createFixture();

    expect(fixture.nativeElement.hasAttribute('data-active')).toBe(false);

    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-active')).toBe('');
  });

  it('should apply accessible semantics when labelled', () => {
    createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Open menu');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Open menu');
  });

  it('should hide the SVG when decorative', () => {
    createFixture();
    fixture.componentRef.setInput('decorative', true);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('role')).toBe('presentation');
  });

  it('should compose inside a link', () => {
    TestBed.configureTestingModule({});
    const linkFixture = TestBed.createComponent(LinkHost);
    linkFixture.detectChanges();

    const link = linkFixture.nativeElement.querySelector('a');
    const icon = linkFixture.nativeElement.querySelector(
      'solaris-animated-icon',
    );

    expect(link).toBeTruthy();
    expect(icon).toBeTruthy();
  });
});
