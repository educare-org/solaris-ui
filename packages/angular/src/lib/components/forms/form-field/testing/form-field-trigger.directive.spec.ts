import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SolarisFormFieldTriggerDirective } from '../directives/form-field-trigger.directive';

@Component({
  standalone: true,
  imports: [SolarisFormFieldTriggerDirective],
  template:
    '<button solaris-form-field-trigger class="test-trigger">Open</button>',
})
class TestHostComponent {}

describe('SolarisFormFieldTriggerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      '.test-trigger',
    );
    expect(el).toBeTruthy();
  });

  it('should have solaris-form-field-trigger attribute', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      '.test-trigger',
    )!;
    expect(el.hasAttribute('solaris-form-field-trigger')).toBe(true);
  });
});
