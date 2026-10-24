import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';

import { SolarisAccordionComponent } from '../../accordion/component/accordion.component';
import { SolarisCollapsibleInputComponent } from '../component/collapsible-input.component';

describe('SolarisCollapsibleInputComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisCollapsibleInputComponent],
    template: `
      <solaris-collapsible-input
        value="ask"
        placeholder="Ask anything else"
        [(query)]="query"
        [loading]="loading"
        [disabled]="disabled"
        (submitted)="onSubmit($event)"
        (cancelled)="onCancel()"
      >
        <div>Answer body</div>
      </solaris-collapsible-input>
    `,
  })
  class TestHostComponent {
    query = '';
    loading = false;
    disabled = false;
    lastSubmitted: string | undefined;
    cancelled = false;

    onSubmit(value: string): void {
      this.lastSubmitted = value;
    }

    onCancel(): void {
      this.cancelled = true;
    }
  }

  let fixture: ComponentFixture<TestHostComponent>;

  const getHost = (): HTMLElement =>
    fixture.nativeElement.querySelector('solaris-collapsible-input');
  const getInput = (): HTMLInputElement =>
    fixture.nativeElement.querySelector('.solaris-collapsible-input__field');
  const getAction = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.solaris-collapsible-input__action');
  const getPanel = (): HTMLElement =>
    fixture.nativeElement.querySelector('.solaris-collapsible-input__panel');

  beforeEach(() => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the placeholder and the default leading icon', () => {
    expect(getInput().placeholder).toBe('Ask anything else');
    expect(
      getHost().querySelector('.solaris-collapsible-input__leading-icon'),
    ).toBeTruthy();
  });

  it('should disable the action while the query is empty', () => {
    expect(getAction().disabled).toBe(true);
  });

  it('should emit submitted with the trimmed query', () => {
    getInput().value = '  can i do evals?  ';
    getInput().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    getAction().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastSubmitted).toBe('can i do evals?');
    expect(getHost().hasAttribute('data-open')).toBe(true);
    expect(getPanel().getAttribute('aria-hidden')).toBeNull();
  });

  it('should not submit an empty query', () => {
    getInput().value = '   ';
    getInput().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    getAction().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastSubmitted).toBeUndefined();
  });

  it('should expose loading status with a stop action', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();

    @Component({
      standalone: true,
      imports: [SolarisCollapsibleInputComponent],
      template: `
        <solaris-collapsible-input
          value="ask"
          placeholder="Ask anything else"
          [loading]="true"
          (cancelled)="onCancel()"
        />
      `,
    })
    class LoadingHost {
      cancelled = false;
      onCancel(): void {
        this.cancelled = true;
      }
    }

    const loadingFixture = TestBed.createComponent(LoadingHost);
    loadingFixture.detectChanges();
    expect(
      loadingFixture.nativeElement.querySelector(
        '.solaris-collapsible-input__status',
      )?.textContent,
    ).toContain('Reading the docs');
    const action = loadingFixture.nativeElement.querySelector(
      '.solaris-collapsible-input__action',
    ) as HTMLButtonElement;
    expect(action.getAttribute('aria-label')).toBe('Stop');
    action.click();
    loadingFixture.detectChanges();
    expect((loadingFixture.componentInstance as LoadingHost).cancelled).toBe(
      true,
    );
  });

  it('should disable the field and action when disabled', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();

    @Component({
      standalone: true,
      imports: [SolarisCollapsibleInputComponent],
      template: `
        <solaris-collapsible-input
          value="ask"
          placeholder="Ask anything else"
          [disabled]="true"
        />
      `,
    })
    class DisabledInputHost {}

    const disabledFixture = TestBed.createComponent(DisabledInputHost);
    disabledFixture.detectChanges();
    expect(
      (
        disabledFixture.nativeElement.querySelector(
          '.solaris-collapsible-input__field',
        ) as HTMLInputElement
      ).disabled,
    ).toBe(true);
    expect(
      (
        disabledFixture.nativeElement.querySelector(
          '.solaris-collapsible-input__action',
        ) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });

  it('should project the answer in the region labelled by the trigger', () => {
    expect(getPanel().getAttribute('role')).toBe('region');
    expect(getPanel().getAttribute('aria-labelledby')).toBe(getInput().id);
    expect(getPanel().textContent).toContain('Answer body');
  });
});

describe('SolarisCollapsibleInputComponent inside accordion', () => {
  @Component({
    standalone: true,
    imports: [SolarisAccordionComponent, SolarisCollapsibleInputComponent],
    template: `
      <solaris-accordion [(value)]="value">
        <solaris-collapsible-input value="ask" placeholder="Ask">
          <div>Answer</div>
        </solaris-collapsible-input>
      </solaris-accordion>
    `,
  })
  class AccordionHost {
    value: string | undefined;
  }

  it('should project inside the accordion and open on submit', () => {
    TestBed.resetTestingModule();
    configureSolarisTesting();
    const accordionFixture = TestBed.createComponent(AccordionHost);
    accordionFixture.detectChanges();
    const input = accordionFixture.nativeElement.querySelector(
      'solaris-collapsible-input',
    ) as HTMLElement;
    expect(input).toBeTruthy();
    const field = accordionFixture.nativeElement.querySelector(
      '.solaris-collapsible-input__field',
    ) as HTMLInputElement;
    field.value = 'can i do evals?';
    field.dispatchEvent(new Event('input'));
    accordionFixture.detectChanges();
    (
      accordionFixture.nativeElement.querySelector(
        '.solaris-collapsible-input__action',
      ) as HTMLButtonElement
    ).click();
    accordionFixture.detectChanges();
    expect(accordionFixture.componentInstance.value).toBe('ask');
    expect(input.hasAttribute('data-open')).toBe(true);
  });
});
