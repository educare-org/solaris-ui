import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisDatePickerComponent } from '../component/date-picker.component';
import { SolarisFormSuffixDirective } from '../../form-field/directives/form-suffix.directive';
import { SolarisFormSuffixActionDirective } from '../../form-field/directives/form-suffix-action.directive';

describe('SolarisDatePickerComponent', () => {
  it('exists', () => expect(SolarisDatePickerComponent).toBeDefined());

  describe('form-field repasse (P4 Lote C)', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisDatePickerComponent,
        ReactiveFormsModule,
        SolarisFormSuffixDirective,
        SolarisFormSuffixActionDirective,
      ],
      template: `
        <solaris-date-picker label="Date" size="lg" density="compact">
          <button
            type="button"
            solaris-form-suffix
            solaris-form-suffix-action
            aria-label="Action"
          >
            Go
          </button>
        </solaris-date-picker>
      `,
      providers: [provideSolarisTesting()],
    })
    class RepasseHost {}

    @Component({
      standalone: true,
      imports: [SolarisDatePickerComponent, ReactiveFormsModule],
      template: `
        <solaris-date-picker
          label="Date"
          [loading]="true"
        ></solaris-date-picker>
      `,
      providers: [provideSolarisTesting()],
    })
    class LoadingHost {}

    function getInnerField(fixture: any): HTMLElement {
      return fixture.nativeElement.querySelector(
        'solaris-date-picker solaris-form-field',
      );
    }

    it('forwards size and effective density to the inner form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      expect(field.getAttribute('data-size')).toBe('lg');
      expect(field.getAttribute('data-density')).toBe('compact');
    });

    it('forwards loading as overlay without layout shift', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(LoadingHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      expect(field.hasAttribute('data-loading')).toBe(true);
      expect(field.querySelector('.solaris-form-field__loading')).toBeTruthy();
    });

    it('keeps explicit size/density on the inner input (explicit wins)', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('data-size')).toBe('lg');
      expect(input.nativeElement.getAttribute('data-density')).toBe('compact');
    });

    it('renders the calendar trigger as a suffix action', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      const trigger = field.querySelector(
        '.solaris-date-picker__calendar-trigger',
      ) as HTMLElement;
      expect(trigger).toBeTruthy();
      expect(trigger.hasAttribute('solaris-form-suffix-action')).toBe(true);
      const affix = field.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(affix.getAttribute('data-variant')).toBe('action');
    });

    it('forwards size and density to the calendar trigger', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const trigger = getInnerField(fixture).querySelector(
        '.solaris-date-picker__calendar-trigger',
      ) as HTMLElement;
      expect(trigger.getAttribute('data-size')).toBe('lg');
      expect(trigger.getAttribute('data-density')).toBe('compact');
    });
  });

  describe('clearable + dates parity (P5 B/C)', () => {
    @Component({
      standalone: true,
      imports: [SolarisDatePickerComponent, ReactiveFormsModule],
      template: `
        <solaris-date-picker
          label="Date"
          [clearable]="true"
          (cleared)="clearedCount = clearedCount + 1"
        ></solaris-date-picker>
      `,
      providers: [provideSolarisTesting()],
    })
    class ClearableHost {
      clearedCount = 0;
    }

    function setupClearable(value: string | null): {
      fixture: any;
      host: ClearableHost;
    } {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const picker = fixture.debugElement.query(
        By.directive(SolarisDatePickerComponent),
      ).componentInstance as SolarisDatePickerComponent;
      picker.writeValue(value);
      fixture.detectChanges();
      return { fixture, host: fixture.componentInstance as ClearableHost };
    }

    it('renders a clear button with the default aria label when it has value', () => {
      const { fixture } = setupClearable('2025-01-16');
      const button = fixture.nativeElement.querySelector(
        '.solaris-date-picker__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Clear date');
    });

    it('clears the value and emits cleared on click', () => {
      const { fixture, host } = setupClearable('2025-01-16');
      const button = fixture.nativeElement.querySelector(
        '.solaris-date-picker__clear',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();
      const picker = fixture.debugElement.query(
        By.directive(SolarisDatePickerComponent),
      ).componentInstance as SolarisDatePickerComponent;
      expect((picker as any).value()).toBeNull();
      expect(host.clearedCount).toBe(1);
      expect(
        fixture.nativeElement.querySelector('.solaris-date-picker__clear'),
      ).toBeNull();
    });

    it('hides the clear button without value', () => {
      const { fixture } = setupClearable(null);
      expect(
        fixture.nativeElement.querySelector('.solaris-date-picker__clear'),
      ).toBeNull();
    });

    it('hides the clear button when disabled', () => {
      @Component({
        standalone: true,
        imports: [SolarisDatePickerComponent, ReactiveFormsModule],
        template: `
          <solaris-date-picker
            label="Date"
            [clearable]="true"
            [disabled]="true"
          ></solaris-date-picker>
        `,
        providers: [provideSolarisTesting()],
      })
      class DisabledClearableHost {}
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledClearableHost);
      fixture.detectChanges();
      const picker = fixture.debugElement.query(
        By.directive(SolarisDatePickerComponent),
      ).componentInstance as SolarisDatePickerComponent;
      picker.writeValue('2025-01-16');
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.solaris-date-picker__clear'),
      ).toBeNull();
    });

    it('resets a dirty query on Escape instead of closing (P5 B/C)', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const picker = fixture.debugElement.query(
        By.directive(SolarisDatePickerComponent),
      ).componentInstance as SolarisDatePickerComponent;
      picker.writeValue('2025-01-16');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector(
        'input[solaris-input]',
      ) as HTMLInputElement;
      input.value = 'typed query';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      fixture.detectChanges();
      expect(input.value).toBe('01/16/2025');
    });

    it('renders the suffix icon and accepts radius xl (P5 B/C)', () => {
      TestBed.configureTestingModule({});
      @Component({
        standalone: true,
        imports: [SolarisDatePickerComponent, ReactiveFormsModule],
        template: `<solaris-date-picker
          label="Date"
          suffix="mail"
          radius="xl"
        ></solaris-date-picker>`,
        providers: [provideSolarisTesting()],
      })
      class SuffixHost {}
      const fixture = TestBed.createComponent(SuffixHost);
      fixture.detectChanges();
      const field = fixture.nativeElement.querySelector(
        'solaris-date-picker solaris-form-field',
      ) as HTMLElement;
      expect(field.getAttribute('data-radius')).toBe('xl');
      expect(
        field.querySelector(
          '.solaris-form-field__affix--suffix > span[solaris-form-suffix] solaris-icon',
        ),
      ).toBeTruthy();
    });
  });
});
