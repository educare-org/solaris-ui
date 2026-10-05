import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisStepperComponent } from '../../root/component/stepper.component';
import { SolarisStepComponent } from '../component/step.component';

function q(
  fixture: ComponentFixture<unknown>,
  selector: string,
): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

function configureBase() {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
}

describe('SolarisStepComponent', () => {
  it('should render with label input', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="Test Step" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const label = q(fixture, '.solaris-stepper__label');
    expect(label).toBeTruthy();
    expect(label?.textContent?.trim()).toBe('Test Step');
  });

  it('should render completed status (non-active step)', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper [activeIndex]="0">
          <solaris-step label="Active" />
          <solaris-step label="Done" status="completed" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const allSteps = fixture.nativeElement.querySelectorAll(
      '.solaris-stepper__step',
    );
    const doneStep = allSteps[allSteps.length - 1];
    expect(doneStep).toBeTruthy();
    expect(doneStep?.getAttribute('data-status')).toBe('completed');
  });

  it('should render error status', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper [activeIndex]="0">
          <solaris-step label="Active" />
          <solaris-step label="Error" status="error" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const errorStep = fixture.nativeElement.querySelector(
      '[data-status="error"]',
    );
    expect(errorStep).toBeTruthy();
  });

  it('should render warning status', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper [activeIndex]="0">
          <solaris-step label="Active" />
          <solaris-step label="Caution" status="warning" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const warningStep = fixture.nativeElement.querySelector(
      '[data-status="warning"]',
    );
    expect(warningStep).toBeTruthy();
  });

  it('should prefer error over warning', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper [activeIndex]="0">
          <solaris-step label="Active" />
          <solaris-step label="Issue" [error]="true" [warning]="true" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const steps = fixture.nativeElement.querySelectorAll(
      '.solaris-stepper__step',
    );
    expect(steps[steps.length - 1]?.getAttribute('data-status')).toBe('error');
  });

  it('should have aria-disabled when disabled', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="Disabled" [disabled]="true" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const step = q(fixture, 'solaris-step');
    expect(step?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should show step number when no status or icon', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="First" />
          <solaris-step label="Second" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const numbers = fixture.nativeElement.querySelectorAll(
      '.solaris-stepper__number',
    );
    expect(numbers.length).toBeGreaterThan(0);
  });

  it('should show description when provided', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="Test" description="Step description" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const desc = q(fixture, '.solaris-stepper__description');
    expect(desc).toBeTruthy();
    expect(desc?.textContent?.trim()).toBe('Step description');
  });

  it('should render custom icon when provided', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="Icon" icon="info" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      '.solaris-stepper__step-button',
    );
    expect(button).toBeTruthy();
  });

  it('should render the whole header as a single button when clickable', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="First" />
          <solaris-step label="Second" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      '.solaris-stepper__step-button',
    );
    expect(button?.textContent).toContain('First');
    expect(button?.querySelector('.solaris-stepper__indicator')).toBeTruthy();
  });

  it('should not render a status badge without optional or status text', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="First" />
          <solaris-step label="Second" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.solaris-stepper__status-badge'),
    ).toBeNull();
  });

  it('should render status text in the badge', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step
            label="Shipment"
            status="warning"
            statusText="Delayed"
          />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector(
      '.solaris-stepper__status-text',
    );
    expect(badge?.textContent?.trim()).toBe('Delayed');
  });

  it('should expose the label as title for truncated labels', () => {
    configureBase();
    @Component({
      standalone: true,
      imports: [SolarisStepperComponent, SolarisStepComponent],
      template: `
        <solaris-stepper>
          <solaris-step label="Shipment" />
        </solaris-stepper>
      `,
    })
    class TestHost {}
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector(
      '.solaris-stepper__label',
    );
    expect(label?.getAttribute('title')).toBe('Shipment');
  });
});
