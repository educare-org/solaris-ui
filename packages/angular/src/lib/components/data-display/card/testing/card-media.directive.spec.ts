import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardMediaDirective } from '../directives/card-media.directive';

@Component({
  standalone: true,
  imports: [SolarisCardMediaDirective],
  template:
    '<figure solaris-card-media><img src="test.jpg" alt="Test image" /></figure>',
})
class TestHostComponent {}

describe('SolarisCardMediaDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('[solaris-card-media]');
    expect(el.querySelector('img')).toBeTruthy();
  });

  it('should preserve alt attribute of projected image', () => {
    const el = fixture.nativeElement.querySelector('[solaris-card-media]');
    const img = el.querySelector('img');
    expect(img.getAttribute('alt')).toBe('Test image');
  });
});
