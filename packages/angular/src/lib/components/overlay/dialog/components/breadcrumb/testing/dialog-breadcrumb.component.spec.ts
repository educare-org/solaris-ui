import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogBreadcrumbComponent } from '../component/dialog-breadcrumb.component';

import type {
  SolarisDialogBreadcrumbItem,
  SolarisDialogBreadcrumbStepChange,
} from '../model/dialog-breadcrumb.types';

const STEPS: SolarisDialogBreadcrumbItem[] = [
  { value: 'upload', label: 'Upload' },
  { value: 'format', label: 'Format' },
  { value: 'voice', label: 'Voice' },
  { value: 'pronunciation', label: 'Pronunciation' },
];

@Component({
  standalone: true,
  imports: [SolarisDialogBreadcrumbComponent],
  template: `
    <solaris-dialog-breadcrumb
      [items]="items"
      [(activeStep)]="activeStep"
      [linear]="linear"
      (stepChange)="onStepChange($event)"
    />
  `,
})
class TestHostComponent {
  readonly items: SolarisDialogBreadcrumbItem[] = [...STEPS];
  readonly activeStep = signal(1);
  linear = true;
  lastEvent: SolarisDialogBreadcrumbStepChange | undefined;

  onStepChange(event: SolarisDialogBreadcrumbStepChange): void {
    this.lastEvent = event;
  }
}

function createFixture(): ComponentFixture<TestHostComponent> {
  configureSolarisTesting();
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  });
  const fixture = TestBed.createComponent(TestHostComponent);
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogBreadcrumbComponent', () => {
  it('should create', () => {
    const fixture = createFixture();
    expect(
      fixture.nativeElement.querySelector('solaris-dialog-breadcrumb'),
    ).toBeTruthy();
  });

  it('should render a nav with an aria-label, ol and li per step', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const nav = el.querySelector('nav.solaris-dialog-breadcrumb__nav');
    expect(nav?.getAttribute('aria-label')).toBe('Steps');
    expect(el.querySelector('ol.solaris-dialog-breadcrumb__list')).toBeTruthy();
    expect(
      el.querySelectorAll('li.solaris-dialog-breadcrumb__item').length,
    ).toBe(4);
  });

  it('should mark the active step with aria-current="step"', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const current = el.querySelector('[aria-current="step"]');
    expect(current?.textContent).toContain('Format');
  });

  it('should announce "Step X of Y" to screen readers on the current step', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const current = el.querySelector('[aria-current="step"]');
    expect(current?.textContent).toContain('Step 2 of 4');
  });

  it('should render past steps as buttons and future steps as text', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll(
      'button.solaris-dialog-breadcrumb__button',
    );
    // activeStep = 1: only "Upload" (index 0) is clickable in linear mode.
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('Upload');
  });

  it('should navigate back and emit stepChange with previous index', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const button = fixture.nativeElement.querySelector(
      'button.solaris-dialog-breadcrumb__button',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(host.activeStep()).toBe(0);
    expect(host.lastEvent).toEqual({
      index: 0,
      previousIndex: 1,
      value: 'upload',
    });
  });

  it('should ignore clicks on future steps in linear mode', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    expect(
      fixture.nativeElement.querySelectorAll(
        'button.solaris-dialog-breadcrumb__button',
      ).length,
    ).toBe(1);
    expect(host.activeStep()).toBe(1);
    expect(host.lastEvent).toBeUndefined();
  });

  it('should allow jumping to future steps when linear is false', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogBreadcrumbComponent],
      template: `<solaris-dialog-breadcrumb
        [items]="items"
        [(activeStep)]="activeStep"
        [linear]="false"
        (stepChange)="onStepChange($event)"
      />`,
    })
    class NonLinearHostComponent {
      readonly items: SolarisDialogBreadcrumbItem[] = [...STEPS];
      readonly activeStep = signal(1);
      lastEvent: SolarisDialogBreadcrumbStepChange | undefined;

      onStepChange(event: SolarisDialogBreadcrumbStepChange): void {
        this.lastEvent = event;
      }
    }

    const nonLinearFixture = TestBed.createComponent(NonLinearHostComponent);
    nonLinearFixture.detectChanges();
    const host = nonLinearFixture.componentInstance;
    const buttons = nonLinearFixture.nativeElement.querySelectorAll(
      'button.solaris-dialog-breadcrumb__button',
    );
    expect(buttons.length).toBe(3);
    (buttons[2] as HTMLButtonElement).click();
    nonLinearFixture.detectChanges();
    expect(host.activeStep()).toBe(3);
    expect(host.lastEvent?.value).toBe('pronunciation');
  });

  it('should never render disabled steps as buttons', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogBreadcrumbComponent],
      template: `<solaris-dialog-breadcrumb
        [items]="items"
        [(activeStep)]="activeStep"
      />`,
    })
    class DisabledHostComponent {
      readonly items: SolarisDialogBreadcrumbItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ];
      readonly activeStep = signal(0);
    }

    const fixture = TestBed.createComponent(DisabledHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    // Step B is upcoming + disabled: rendered as span, not a button.
    expect(el.querySelectorAll('button').length).toBe(0);
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
  });

  it('should keep steps with error clickable even when upcoming', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogBreadcrumbComponent],
      template: `<solaris-dialog-breadcrumb
        [items]="items"
        [(activeStep)]="activeStep"
      />`,
    })
    class ErrorHostComponent {
      readonly items: SolarisDialogBreadcrumbItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', error: true },
      ];
      readonly activeStep = signal(0);
    }

    const fixture = TestBed.createComponent(ErrorHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      'button.solaris-dialog-breadcrumb__button',
    );
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('B');
  });

  it('should resolve labelKey via translations', () => {
    configureSolarisTesting({
      translate: {
        translations: { 'en-US': { 'wiz.upload': 'Upload translated' } },
      },
    });
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogBreadcrumbComponent],
      template: `<solaris-dialog-breadcrumb [items]="items" />`,
    })
    class KeyHostComponent {
      readonly items: SolarisDialogBreadcrumbItem[] = [
        { value: 'upload', label: 'Upload', labelKey: 'wiz.upload' },
      ];
    }

    const fixture = TestBed.createComponent(KeyHostComponent);
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector(
      '[aria-current="step"]',
    );
    expect(current?.textContent).toContain('Upload translated');
  });

  it('should resolve ariaLabelKey via translations', () => {
    configureSolarisTesting({
      translate: {
        translations: { 'en-US': { 'wiz.steps': 'Wizard steps' } },
      },
    });
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });

    @Component({
      standalone: true,
      imports: [SolarisDialogBreadcrumbComponent],
      template: `<solaris-dialog-breadcrumb
        [items]="items"
        ariaLabelKey="wiz.steps"
      />`,
    })
    class AriaHostComponent {
      readonly items: SolarisDialogBreadcrumbItem[] = [
        { value: 'a', label: 'A' },
      ];
    }

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('nav')?.getAttribute('aria-label'),
    ).toBe('Wizard steps');
  });
});
