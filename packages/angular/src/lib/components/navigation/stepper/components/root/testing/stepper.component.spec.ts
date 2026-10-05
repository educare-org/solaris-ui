import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisStepperComponent } from '../component/stepper.component';
import { SolarisStepComponent } from '../../step/component/step.component';

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      (activeIndexChange)="activeIndex.set($event)"
    >
      <solaris-step label="Step 1" status="completed" />
      <solaris-step label="Step 2" status="active" />
      <solaris-step label="Step 3" status="pending" />
    </solaris-stepper>
  `,
})
class TestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      [orientation]="'vertical'"
      [appearance]="'default'"
      [linear]="false"
      [showConnectors]="true"
      [showStepStatus]="true"
      [showStepNumbers]="true"
      [contentTransition]="'fade'"
      [size]="'md'"
      [density]="'comfortable'"
    >
      <solaris-step label="A" />
      <solaris-step label="B" />
      <solaris-step label="C" />
    </solaris-stepper>
  `,
})
class VerticalStepperTestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      [orientation]="'horizontal'"
      [appearance]="'card'"
      [linear]="false"
      [showConnectors]="true"
      [showStepStatus]="true"
      [showStepNumbers]="true"
      [contentTransition]="'fade'"
      [size]="'md'"
      [density]="'comfortable'"
    >
      <solaris-step label="A" />
      <solaris-step label="B" />
      <solaris-step label="C" />
    </solaris-stepper>
  `,
})
class CardStepperTestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      [orientation]="'horizontal'"
      [appearance]="'dashed'"
      [linear]="false"
      [showConnectors]="true"
      [showStepStatus]="true"
      [showStepNumbers]="true"
      [contentTransition]="'fade'"
      [size]="'sm'"
      [density]="'compact'"
    >
      <solaris-step label="A" />
      <solaris-step label="B" />
      <solaris-step label="C" />
    </solaris-stepper>
  `,
})
class DashedCompactStepperTestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      [orientation]="'horizontal'"
      [appearance]="'default'"
      [linear]="false"
      [showConnectors]="false"
      [showStepStatus]="true"
      [showStepNumbers]="true"
      [contentTransition]="'fade'"
      [size]="'md'"
      [density]="'comfortable'"
    >
      <solaris-step label="A" />
      <solaris-step label="B" />
      <solaris-step label="C" />
    </solaris-stepper>
  `,
})
class NoConnectorsStepperTestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      [orientation]="'horizontal'"
      [appearance]="'default'"
      [linear]="false"
      [showConnectors]="true"
      [showStepStatus]="true"
      [showStepNumbers]="true"
      [contentTransition]="'fade'"
      [size]="'lg'"
      [density]="'comfortable'"
    >
      <solaris-step label="A" />
      <solaris-step label="B" />
      <solaris-step label="C" />
    </solaris-stepper>
  `,
})
class LargeStepperTestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper [activeIndex]="activeIndex()" [density]="'compact'">
      <solaris-step label="A" />
      <solaris-step label="B" />
      <solaris-step label="C" />
    </solaris-stepper>
  `,
})
class CompactStepperTestHostComponent {
  readonly activeIndex = signal(0);
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      (activeIndexChange)="activeIndex.set($event)"
      (stepBlocked)="onBlocked($event)"
    >
      <solaris-step label="A" [canExit]="canExit" />
      <solaris-step label="B" [canEnter]="canEnter" />
    </solaris-stepper>
  `,
})
class GuardStepperTestHostComponent {
  readonly activeIndex = signal(0);
  canEnter: (() => boolean) | undefined;
  canExit: (() => boolean) | undefined;
  lastBlocked:
    | { index: number; from: number; reason: 'enter' | 'exit' }
    | undefined;

  onBlocked(event: {
    index: number;
    from: number;
    reason: 'enter' | 'exit';
  }): void {
    this.lastBlocked = event;
  }
}

@Component({
  standalone: true,
  imports: [SolarisStepperComponent, SolarisStepComponent],
  template: `
    <solaris-stepper
      [activeIndex]="activeIndex()"
      (activeIndexChange)="activeIndex.set($event)"
      [linear]="true"
    >
      <solaris-step label="A" status="completed" />
      <solaris-step label="B" status="warning" />
      <solaris-step label="C" status="pending" />
    </solaris-stepper>
  `,
})
class LinearWarningStepperTestHostComponent {
  readonly activeIndex = signal(1);
}

function qAll(
  fixture: ComponentFixture<unknown>,
  selector: string,
): NodeListOf<HTMLElement> {
  return (fixture.nativeElement as HTMLElement).querySelectorAll(selector);
}

function configureBase() {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
}

describe('SolarisStepperComponent', () => {
  it('should render steps', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper).toBeTruthy();
  });

  it('should have default activeIndex 0', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const activeSteps = fixture.nativeElement.querySelectorAll(
      '.solaris-stepper__step--active',
    );
    expect(activeSteps.length).toBe(1);
  });

  it('should render step labels', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const labels = qAll(fixture, '.solaris-stepper__label');
    expect(labels.length).toBe(3);
    expect(labels[0].textContent?.trim()).toBe('Step 1');
    expect(labels[1].textContent?.trim()).toBe('Step 2');
    expect(labels[2].textContent?.trim()).toBe('Step 3');
  });

  it('should apply data-orientation horizontal by default', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply data-orientation vertical', () => {
    configureBase();
    const fixture = TestBed.createComponent(VerticalStepperTestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should apply data-appearance default', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-appearance')).toBe('default');
  });

  it('should apply data-appearance card', () => {
    configureBase();
    const fixture = TestBed.createComponent(CardStepperTestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-appearance')).toBe('card');
  });

  it('should apply data-appearance dashed', () => {
    configureBase();
    const fixture = TestBed.createComponent(
      DashedCompactStepperTestHostComponent,
    );
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-appearance')).toBe('dashed');
  });

  it('should emit activeIndexChange on step click', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const buttons = qAll(fixture, '.solaris-stepper__step-button');
    if (buttons.length > 2) {
      buttons[2].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.activeIndex()).toBe(2);
    }
  });

  it('should hide connectors when showConnectors is false', () => {
    configureBase();
    const fixture = TestBed.createComponent(
      NoConnectorsStepperTestHostComponent,
    );
    fixture.detectChanges();
    const connectors = fixture.nativeElement.querySelectorAll(
      '.solaris-stepper__connector',
    );
    expect(connectors.length).toBe(0);
  });

  it('should apply data-size attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(LargeStepperTestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-size')).toBe('lg');
  });

  it('should apply data-density attribute', () => {
    configureBase();
    const fixture = TestBed.createComponent(CompactStepperTestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-density')).toBe('compact');
  });

  it('should default data-density to the theme density', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('data-size')).toBe('md');
    expect(stepper.getAttribute('data-density')).toBe('normal');
  });

  it('should block navigation when canEnter denies and emit stepBlocked', () => {
    configureBase();
    const fixture = TestBed.createComponent(GuardStepperTestHostComponent);
    fixture.componentInstance.canEnter = () => false;
    fixture.detectChanges();
    const buttons = qAll(fixture, '.solaris-stepper__step-button');
    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    expect(fixture.componentInstance.lastBlocked).toEqual({
      index: 1,
      from: 0,
      reason: 'enter',
    });
  });

  it('should block navigation when canExit denies and emit stepBlocked', () => {
    configureBase();
    const fixture = TestBed.createComponent(GuardStepperTestHostComponent);
    fixture.componentInstance.canExit = () => false;
    fixture.detectChanges();
    const buttons = qAll(fixture, '.solaris-stepper__step-button');
    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
    expect(fixture.componentInstance.lastBlocked).toEqual({
      index: 1,
      from: 0,
      reason: 'exit',
    });
  });

  it('should allow navigation when guards approve', () => {
    configureBase();
    const fixture = TestBed.createComponent(GuardStepperTestHostComponent);
    fixture.componentInstance.canEnter = () => true;
    fixture.componentInstance.canExit = () => true;
    fixture.detectChanges();
    const buttons = qAll(fixture, '.solaris-stepper__step-button');
    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(fixture.componentInstance.lastBlocked).toBeUndefined();
  });

  it('should allow going back to a warning step in linear mode', () => {
    configureBase();
    const fixture = TestBed.createComponent(
      LinearWarningStepperTestHostComponent,
    );
    fixture.detectChanges();
    const buttons = qAll(fixture, '.solaris-stepper__step-button');
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex()).toBe(0);
  });

  it('should have navigation role', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const stepper = fixture.nativeElement.querySelector('solaris-stepper');
    expect(stepper.getAttribute('role')).toBe('navigation');
  });

  it('should have aria-current on active step', () => {
    configureBase();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const activeStep = fixture.nativeElement.querySelector(
      '.solaris-stepper__step--active',
    );
    expect(activeStep).toBeTruthy();
    const indicator = activeStep?.querySelector(
      '.solaris-stepper__step-button',
    );
    if (indicator) {
      expect(indicator.getAttribute('aria-current')).toBe('step');
    }
  });
});
