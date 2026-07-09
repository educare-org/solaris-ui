import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisCardActionsComponent } from './card-actions.component';

@Component({
  standalone: true,
  imports: [SolarisCardActionsComponent],
  template:
    '<solaris-card-actions><button>Action</button></solaris-card-actions>',
})
class TestHostComponent {}

describe('SolarisCardActionsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('solaris-card-actions');
    expect(el.textContent).toContain('Action');
  });
});
