import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormErrorComponent } from '../component/form-error.component';

@Component({
  standalone: true,
  selector: 'solaris-form-error-test-host',
  imports: [SolarisFormErrorComponent],
  template:
    '<solaris-form-error><span class="msg">Error text</span></solaris-form-error>',
})
class TestHostComponent {}

describe('SolarisFormErrorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-error',
    );
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-form-error', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-error',
    )!;
    expect(el.classList.contains('solaris-form-error')).toBe(true);
  });

  it('should have role alert', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-error',
    )!;
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('should transclude content', () => {
    const msg = (fixture.nativeElement as HTMLElement).querySelector('.msg')!;
    expect(msg.textContent?.trim()).toBe('Error text');
  });
});
