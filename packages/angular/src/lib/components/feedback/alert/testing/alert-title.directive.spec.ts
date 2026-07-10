import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisAlertTitleDirective } from '../directives/alert-title.directive';

@Component({
  standalone: true,
  imports: [SolarisAlertTitleDirective],
  template: '<h3 solaris-alert-title>Alert Title</h3>',
})
class TestHostComponent {}

describe('SolarisAlertTitleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the solaris-alert-title class', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-alert-title]',
    );
    expect(element).toBeTruthy();
    expect(element.classList.contains('solaris-alert-title')).toBe(true);
  });

  it('should preserve the host element', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-alert-title]',
    );
    expect(element.tagName).toBe('H3');
  });

  it('should have kebab-case selector', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-alert-title]',
    );
    expect(element).toBeTruthy();
  });
});
