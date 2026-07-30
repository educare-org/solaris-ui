import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormHintComponent } from '../component/form-hint.component';

@Component({
  standalone: true,
  imports: [SolarisFormHintComponent],
  template: '<solaris-form-hint><span class="hint">Hint text</span></solaris-form-hint>',
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
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-form-hint');
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-form-hint', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('solaris-form-hint')!;
    expect(el.classList.contains('solaris-form-hint')).toBe(true);
  });

  it('should transclude content', () => {
    const hint = (fixture.nativeElement as HTMLElement).querySelector('.hint')!;
    expect(hint.textContent?.trim()).toBe('Hint text');
  });
});
