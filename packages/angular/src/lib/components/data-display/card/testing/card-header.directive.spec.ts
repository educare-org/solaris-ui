import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardHeaderDirective } from '../directives/card-header.directive';

@Component({
  standalone: true,
  imports: [SolarisCardHeaderDirective],
  template: '<div solaris-card-header><span>Header Content</span></div>',
})
class TestHostComponent {}

describe('SolarisCardHeaderDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('[solaris-card-header]');
    expect(el.textContent).toContain('Header Content');
  });
});
