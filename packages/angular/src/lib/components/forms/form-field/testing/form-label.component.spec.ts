import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormLabelComponent } from '../component/form-label.component';

@Component({
  standalone: true,
  imports: [SolarisFormLabelComponent],
  template: '<solaris-form-label><span class="label">Field label</span></solaris-form-label>',
})
class TestHostComponent {}

describe('SolarisFormLabelComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-form-label');
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-form-label', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-form-label')!;
    expect(el.classList.contains('solaris-form-label')).toBe(true);
  });

  it('should transclude content', () => {
    const label = (fixture.nativeElement as HTMLElement).querySelector('.label')!;
    expect(label.textContent?.trim()).toBe('Field label');
  });
});
