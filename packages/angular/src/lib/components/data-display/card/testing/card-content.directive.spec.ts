import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardContentDirective } from '../directives/card-content.directive';

@Component({
  standalone: true,
  imports: [SolarisCardContentDirective],
  template: '<div solaris-card-content><p>Content</p></div>',
})
class TestHostComponent {}

describe('SolarisCardContentDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('[solaris-card-content]');
    expect(el.textContent).toContain('Content');
  });
});
