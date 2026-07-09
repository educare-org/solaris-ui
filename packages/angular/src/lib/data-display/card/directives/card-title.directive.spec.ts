import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardTitleDirective } from './card-title.directive';

@Component({
  standalone: true,
  imports: [SolarisCardTitleDirective],
  template: '<h3 solaris-card-title>Card Title</h3>',
})
class TestHostComponent {}

describe('SolarisCardTitleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the solaris-card-title class', () => {
    const element = fixture.nativeElement.querySelector('[solaris-card-title]');
    expect(element).toBeTruthy();
    expect(element.classList.contains('solaris-card-title')).toBe(true);
  });

  it('should preserve the host element', () => {
    const element = fixture.nativeElement.querySelector('[solaris-card-title]');
    expect(element.tagName).toBe('H3');
  });

  it('should have kebab-case selector', () => {
    const element = fixture.nativeElement.querySelector('[solaris-card-title]');
    expect(element).toBeTruthy();
  });
});
