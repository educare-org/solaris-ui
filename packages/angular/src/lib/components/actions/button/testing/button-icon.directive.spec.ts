import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisButtonIconDirective } from '../directives/button-icon.directive';

@Component({
  standalone: true,
  imports: [SolarisButtonIconDirective],
  template: '<span solaris-button-icon class="test-icon">X</span>',
})
class TestHostComponent {}

describe('SolarisButtonIconDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('.test-icon');
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-button-icon', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector('.test-icon')!;
    expect(el.classList.contains('solaris-button-icon')).toBe(true);
  });
});
