import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisAlertDescriptionDirective } from '../directives/alert-description.directive';

@Component({
  standalone: true,
  imports: [SolarisAlertDescriptionDirective],
  template: '<p solaris-alert-description>Alert description text.</p>',
})
class TestHostComponent {}

describe('SolarisAlertDescriptionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the solaris-alert-description class', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-alert-description]',
    );
    expect(element).toBeTruthy();
    expect(element.classList.contains('solaris-alert-description')).toBe(true);
  });

  it('should preserve the host element', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-alert-description]',
    );
    expect(element.tagName).toBe('P');
  });

  it('should have kebab-case selector', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-alert-description]',
    );
    expect(element).toBeTruthy();
  });
});
