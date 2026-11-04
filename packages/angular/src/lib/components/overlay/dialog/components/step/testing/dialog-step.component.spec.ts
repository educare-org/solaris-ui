import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, TemplateRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SolarisDialogStepComponent } from '../component/dialog-step.component';
import { assertPresent } from '../../../../../../testing/solaris-test-utilities';

@Component({
  standalone: true,
  imports: [SolarisDialogStepComponent],
  template:
    '<solaris-dialog-step><p class="step-content">Step content</p></solaris-dialog-step>',
})
class TestHostComponent {}

describe('SolarisDialogStepComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-step',
    );
    expect(el).toBeTruthy();
  });

  it('should have a TemplateRef via viewChild', () => {
    const step = assertPresent(
      fixture.debugElement.query(By.directive(SolarisDialogStepComponent)),
      'dialog step',
    );
    const cmpInstance = step.componentInstance as SolarisDialogStepComponent;
    expect(cmpInstance.templateRef()).toBeInstanceOf(TemplateRef);
  });
});
