import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideSolarisIcons } from '../../../../services/icon/provider/provide-solaris-icons';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';
import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisDialogFlowComponent } from './dialog-flow.component';
import { SolarisDialogStepComponent } from './dialog-step.component';

describe('SolarisDialogFlowComponent', () => {
  it('should create', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step><p>Step 1</p></solaris-dialog-step>
          <solaris-dialog-step><p>Step 2</p></solaris-dialog-step>
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const flowEl = fixture.nativeElement.querySelector('solaris-dialog-flow');
    expect(flowEl).toBeTruthy();
  });

  it('should render step content when steps are provided', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step
            ><p class="step-content">Step 1 content</p></solaris-dialog-step
          >
          <solaris-dialog-step
            ><p class="step-content">Step 2 content</p></solaris-dialog-step
          >
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const flowEl = fixture.nativeElement.querySelector('solaris-dialog-flow');
    expect(flowEl).toBeTruthy();

    const stepContent = fixture.nativeElement.querySelectorAll('.step-content');
    expect(stepContent.length).toBe(2);
  });
});
