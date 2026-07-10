import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardFooterDirective } from '../directives/card-footer.directive';

@Component({
  standalone: true,
  imports: [SolarisCardFooterDirective],
  template: '<div solaris-card-footer><span>Footer</span></div>',
})
class DefaultHostComponent {}

@Component({
  standalone: true,
  imports: [SolarisCardFooterDirective],
  template:
    '<div solaris-card-footer [separator]="true"><span>Footer</span></div>',
})
class SeparatorHostComponent {}

describe('SolarisCardFooterDirective', () => {
  it('should project content', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DefaultHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-card-footer]');
    expect(el.textContent).toContain('Footer');
  });

  it('should not have data-separator by default', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DefaultHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-card-footer]');
    expect(el.hasAttribute('data-separator')).toBe(false);
  });

  it('should have data-separator when separator is true', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SeparatorHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-card-footer]');
    expect(el.hasAttribute('data-separator')).toBe(true);
  });
});
