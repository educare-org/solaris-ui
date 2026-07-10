import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardActionsDirective } from '../directives/card-actions.directive';

@Component({
  standalone: true,
  imports: [SolarisCardActionsDirective],
  template: '<div solaris-card-actions><button>Action</button></div>',
})
class TestHostComponent {}

describe('SolarisCardActionsDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('[solaris-card-actions]');
    expect(el.textContent).toContain('Action');
  });
});
