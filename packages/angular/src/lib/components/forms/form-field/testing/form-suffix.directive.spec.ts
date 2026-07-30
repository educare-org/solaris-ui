import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormSuffixDirective } from '../directives/form-suffix.directive';

@Component({
  standalone: true,
  imports: [SolarisFormSuffixDirective],
  template: '<span solaris-form-suffix class="test-suffix">kg</span>',
})
class TestHostComponent {}

describe('SolarisFormSuffixDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('.test-suffix');
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-form-suffix', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('.test-suffix')!;
    expect(el.classList.contains('solaris-form-suffix')).toBe(true);
  });
});
