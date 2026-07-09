import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardMediaComponent } from './card-media.component';

@Component({
  standalone: true,
  imports: [SolarisCardMediaComponent],
  template:
    '<solaris-card-media><img src="test.jpg" alt="Test image" /></solaris-card-media>',
})
class TestHostComponent {}

describe('SolarisCardMediaComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('solaris-card-media');
    expect(el.querySelector('img')).toBeTruthy();
  });

  it('should preserve alt attribute of projected image', () => {
    const el = fixture.nativeElement.querySelector('solaris-card-media');
    const img = el.querySelector('img');
    expect(img.getAttribute('alt')).toBe('Test image');
  });
});
