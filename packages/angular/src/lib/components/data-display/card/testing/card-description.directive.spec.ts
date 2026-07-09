import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardDescriptionDirective } from '../directives/card-description.directive';

@Component({
  standalone: true,
  imports: [SolarisCardDescriptionDirective],
  template: '<p solaris-card-description>Card description text.</p>',
})
class TestHostComponent {}

describe('SolarisCardDescriptionDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the solaris-card-description class', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-card-description]',
    );
    expect(element).toBeTruthy();
    expect(element.classList.contains('solaris-card-description')).toBe(true);
  });

  it('should preserve the host element', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-card-description]',
    );
    expect(element.tagName).toBe('P');
  });

  it('should have kebab-case selector', () => {
    const element = fixture.nativeElement.querySelector(
      '[solaris-card-description]',
    );
    expect(element).toBeTruthy();
  });
});
