import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisButtonIconDirective } from '../directives/button-icon.directive';
import { assertPresent } from '../../../../testing/solaris-test-utilities';

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
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      '.test-icon',
    );
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-button-icon', () => {
    const el = assertPresent(
      (fixture.nativeElement as HTMLElement).querySelector('.test-icon'),
      'icon element',
    );
    expect(el.classList.contains('solaris-button-icon')).toBe(true);
  });
});
