import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, TemplateRef } from '@angular/core';
import { SolarisDialogStepComponent } from '../component/dialog-step.component';

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
    const stepEl = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-step',
    );
    const stepComponent = (stepEl as any)?.__ngContext__;
    const cmpInstance = (fixture.debugElement.children[0] as any)
      .componentInstance as SolarisDialogStepComponent;
    expect(cmpInstance.templateRef()).toBeInstanceOf(TemplateRef);
  });
});
