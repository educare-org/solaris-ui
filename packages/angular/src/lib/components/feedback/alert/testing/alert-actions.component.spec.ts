import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisAlertActionsComponent } from '../component/alert-actions.component';

@Component({
  standalone: true,
  imports: [SolarisAlertActionsComponent],
  template:
    '<solaris-alert-actions><a href="#">Action</a></solaris-alert-actions>',
})
class TestHostComponent {}

describe('SolarisAlertActionsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content', () => {
    const el = fixture.nativeElement.querySelector('solaris-alert-actions');
    expect(el.textContent).toContain('Action');
  });

  it('should have the alert-actions host class', () => {
    const el = fixture.nativeElement.querySelector('solaris-alert-actions');
    expect(el.classList.contains('solaris-alert-actions')).toBe(true);
  });
});
