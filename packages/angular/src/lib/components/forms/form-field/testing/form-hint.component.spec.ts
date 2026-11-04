import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormHintComponent } from '../component/form-hint.component';
import { assertPresent } from '../../../../testing/solaris-test-utilities';

@Component({
  standalone: true,
  imports: [SolarisFormHintComponent],
  template:
    '<solaris-form-hint><span class="hint">Hint text</span></solaris-form-hint>',
})
class TestHostComponent {}

describe('SolarisFormHintComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-hint',
    );
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-form-hint', () => {
    const el = assertPresent(
      (fixture.nativeElement as HTMLElement).querySelector('solaris-form-hint'),
      'solaris-form-hint element',
    );
    expect(el.classList.contains('solaris-form-hint')).toBe(true);
  });

  it('should transclude content', () => {
    const hint = assertPresent(
      (fixture.nativeElement as HTMLElement).querySelector('.hint'),
      'hint element',
    );
    expect(hint.textContent?.trim()).toBe('Hint text');
  });
});
