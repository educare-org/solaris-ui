import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormPrefixDirective } from '../directives/form-prefix.directive';
import { assertPresent } from '../../../../testing/solaris-test-utilities';

@Component({
  standalone: true,
  imports: [SolarisFormPrefixDirective],
  template: '<span solaris-form-prefix class="test-prefix">$</span>',
})
class TestHostComponent {}

describe('SolarisFormPrefixDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the element with directive', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      '.test-prefix',
    );
    expect(el).toBeTruthy();
  });

  it('should have host class solaris-form-prefix', () => {
    const el = assertPresent(
      (fixture.nativeElement as HTMLElement).querySelector('.test-prefix'),
      'prefix element',
    );
    expect(el.classList.contains('solaris-form-prefix')).toBe(true);
  });
});
