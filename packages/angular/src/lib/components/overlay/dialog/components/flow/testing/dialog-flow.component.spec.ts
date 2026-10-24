import { TestBed } from '@angular/core/testing';
import { Component, signal, viewChild } from '@angular/core';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogFlowComponent } from '../component/dialog-flow.component';
import { SolarisDialogStepComponent } from '../../step/component/dialog-step.component';

function configureFlowTesting(): void {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
}

describe('SolarisDialogFlowComponent', () => {
  it('should create', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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

  it('should switch rendered step when activeIndex changes', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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

    let activeStep = fixture.nativeElement.querySelector(
      '.solaris-dialog-flow__step--active',
    );
    expect(activeStep.textContent).toContain('Step 1');

    fixture.componentInstance.activeIndex.set(1);
    fixture.detectChanges();

    activeStep = fixture.nativeElement.querySelector(
      '.solaris-dialog-flow__step--active',
    );
    expect(activeStep.textContent).toContain('Step 2');
  });

  it('should set animation direction to forward when activeIndex increases', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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

    fixture.componentInstance.activeIndex.set(1);
    fixture.detectChanges();

    expect(flowEl.getAttribute('data-direction')).toBe('forward');
  });

  it('should set animation direction to backward when activeIndex decreases', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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
      readonly activeIndex = signal(1);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const flowEl = fixture.nativeElement.querySelector('solaris-dialog-flow');

    fixture.componentInstance.activeIndex.set(0);
    fixture.detectChanges();

    expect(flowEl.getAttribute('data-direction')).toBe('backward');
  });

  it('should not set animation direction on initial render', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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
    expect(flowEl.getAttribute('data-direction')).toBeNull();
  });

  it('should set host data-transition attribute', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()" transition="fade">
          <solaris-dialog-step><p>Step 1</p></solaris-dialog-step>
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const flowEl = fixture.nativeElement.querySelector('solaris-dialog-flow');
    expect(flowEl.getAttribute('data-transition')).toBe('fade');
  });

  it('should update animation direction on multiple sequential navigations', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step><p>Step 1</p></solaris-dialog-step>
          <solaris-dialog-step><p>Step 2</p></solaris-dialog-step>
          <solaris-dialog-step><p>Step 3</p></solaris-dialog-step>
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const flowEl = fixture.nativeElement.querySelector('solaris-dialog-flow');

    fixture.componentInstance.activeIndex.set(1);
    fixture.detectChanges();
    expect(flowEl.getAttribute('data-direction')).toBe('forward');

    fixture.componentInstance.activeIndex.set(2);
    fixture.detectChanges();
    expect(flowEl.getAttribute('data-direction')).toBe('forward');

    fixture.componentInstance.activeIndex.set(1);
    fixture.detectChanges();
    expect(flowEl.getAttribute('data-direction')).toBe('backward');
  });

  it('should render step content correctly after switching index', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step
            ><p class="step-content">First</p></solaris-dialog-step
          >
          <solaris-dialog-step
            ><p class="step-content">Second</p></solaris-dialog-step
          >
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const steps = fixture.nativeElement.querySelectorAll(
      '.solaris-dialog-flow__step',
    );
    expect(steps.length).toBe(2);

    let activeStep = fixture.nativeElement.querySelector(
      '.solaris-dialog-flow__step--active',
    );
    expect(activeStep.textContent).toContain('First');

    fixture.componentInstance.activeIndex.set(1);
    fixture.detectChanges();

    activeStep = fixture.nativeElement.querySelector(
      '.solaris-dialog-flow__step--active',
    );
    expect(activeStep.textContent).toContain('Second');

    const exitSteps = fixture.nativeElement.querySelectorAll(
      '.solaris-dialog-flow__step--exit',
    );
    expect(exitSteps.length).toBe(1);
    expect(exitSteps[0].textContent).toContain('First');
  });

  it('should handle 3 or more steps', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step
            ><p class="step-content">Step A</p></solaris-dialog-step
          >
          <solaris-dialog-step
            ><p class="step-content">Step B</p></solaris-dialog-step
          >
          <solaris-dialog-step
            ><p class="step-content">Step C</p></solaris-dialog-step
          >
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const stepContent = fixture.nativeElement.querySelectorAll('.step-content');
    expect(stepContent.length).toBe(3);

    let activeStep = fixture.nativeElement.querySelector(
      '.solaris-dialog-flow__step--active',
    );
    expect(activeStep.textContent).toContain('Step A');

    fixture.componentInstance.activeIndex.set(2);
    fixture.detectChanges();

    activeStep = fixture.nativeElement.querySelector(
      '.solaris-dialog-flow__step--active',
    );
    expect(activeStep.textContent).toContain('Step C');
  });

  it('should update step templates when steps change', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step
            ><p class="step-content">Single</p></solaris-dialog-step
          >
        </solaris-dialog-flow>
        <solaris-dialog-flow [activeIndex]="activeIndex()">
          <solaris-dialog-step
            ><p class="step-content">First</p></solaris-dialog-step
          >
          <solaris-dialog-step
            ><p class="step-content">Second</p></solaris-dialog-step
          >
        </solaris-dialog-flow>
      `,
    })
    class TestHostComponent {
      readonly activeIndex = signal(0);
    }

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const flows = fixture.nativeElement.querySelectorAll('solaris-dialog-flow');
    expect(flows.length).toBe(2);

    const singleFlowSteps = flows[0].querySelectorAll(
      '.solaris-dialog-flow__step',
    );
    expect(singleFlowSteps.length).toBe(1);

    const multiFlowSteps = flows[1].querySelectorAll(
      '.solaris-dialog-flow__step',
    );
    expect(multiFlowSteps.length).toBe(2);
  });

  describe('programmatic navigation', () => {
    @Component({
      standalone: true,
      imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
      template: `
        <solaris-dialog-flow [(activeIndex)]="activeIndex">
          <solaris-dialog-step><p>Step 1</p></solaris-dialog-step>
          <solaris-dialog-step [disabled]="secondDisabled()"
            ><p>Step 2</p></solaris-dialog-step
          >
          <solaris-dialog-step><p>Step 3</p></solaris-dialog-step>
        </solaris-dialog-flow>
      `,
    })
    class NavigationHostComponent {
      readonly activeIndex = signal(0);
      readonly secondDisabled = signal(false);
      readonly flow = viewChild.required(SolarisDialogFlowComponent);
    }

    function createNavigationFixture(): ReturnType<
      typeof TestBed.createComponent<NavigationHostComponent>
    > {
      configureFlowTesting();
      const fixture = TestBed.createComponent(NavigationHostComponent);
      fixture.detectChanges();
      return fixture;
    }

    it('should advance with next() and retreat with previous()', () => {
      const fixture = createNavigationFixture();
      const host = fixture.componentInstance;

      host.flow().next();
      expect(host.activeIndex()).toBe(1);

      host.flow().next();
      expect(host.activeIndex()).toBe(2);

      host.flow().next();
      expect(host.activeIndex()).toBe(2);

      host.flow().previous();
      expect(host.activeIndex()).toBe(1);

      host.flow().previous();
      expect(host.activeIndex()).toBe(0);

      host.flow().previous();
      expect(host.activeIndex()).toBe(0);
    });

    it('should go to an explicit step with goTo()', () => {
      const fixture = createNavigationFixture();
      const host = fixture.componentInstance;

      host.flow().goTo(2);
      expect(host.activeIndex()).toBe(2);

      host.flow().goTo(0);
      expect(host.activeIndex()).toBe(0);
    });

    it('should ignore out-of-range goTo() targets', () => {
      const fixture = createNavigationFixture();
      const host = fixture.componentInstance;

      host.flow().goTo(-1);
      expect(host.activeIndex()).toBe(0);

      host.flow().goTo(3);
      expect(host.activeIndex()).toBe(0);
    });

    it('should skip disabled steps in next()/previous() and reject goTo()', () => {
      const fixture = createNavigationFixture();
      const host = fixture.componentInstance;
      host.secondDisabled.set(true);
      fixture.detectChanges();

      host.flow().next();
      expect(host.activeIndex()).toBe(2);

      host.flow().previous();
      expect(host.activeIndex()).toBe(0);

      host.flow().goTo(1);
      expect(host.activeIndex()).toBe(0);
    });

    it('should expose data-disabled on disabled steps', () => {
      configureFlowTesting();

      @Component({
        standalone: true,
        imports: [SolarisDialogFlowComponent, SolarisDialogStepComponent],
        template: `
          <solaris-dialog-flow [(activeIndex)]="activeIndex">
            <solaris-dialog-step><p>Step 1</p></solaris-dialog-step>
            <solaris-dialog-step disabled><p>Step 2</p></solaris-dialog-step>
          </solaris-dialog-flow>
        `,
      })
      class DisabledHostComponent {
        readonly activeIndex = signal(0);
      }

      const fixture = TestBed.createComponent(DisabledHostComponent);
      fixture.detectChanges();

      const flowEl = fixture.nativeElement.querySelector('solaris-dialog-flow');
      const steps = fixture.nativeElement.querySelectorAll(
        '.solaris-dialog-flow__step',
      );
      expect(flowEl).toBeTruthy();
      expect(steps.length).toBe(2);
      expect(steps[0].getAttribute('data-disabled')).toBeNull();
      expect(steps[1].getAttribute('data-disabled')).toBe('');
    });
  });
});
