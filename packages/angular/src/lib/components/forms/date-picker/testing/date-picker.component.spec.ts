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
  });
});
