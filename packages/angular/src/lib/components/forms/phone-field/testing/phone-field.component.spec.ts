import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SolarisPhoneFieldComponent } from '../component/phone-field.component';
import { SolarisFormSuffixDirective } from '../../form-field/directives/form-suffix.directive';
import { SolarisFormSuffixActionDirective } from '../../form-field/directives/form-suffix-action.directive';
import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field label="Phone"></solaris-phone-field>`,
})
class BasicHost {}

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    defaultCountry="BR"
  ></solaris-phone-field>`,
})
class DefaultCountryHost {}

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    defaultCountry="BR"
    [formControl]="control"
  ></solaris-phone-field>`,
})
class ReactiveFormsHost {
  control = new FormControl<string>('');
}

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    [required]="true"
    defaultCountry="BR"
  ></solaris-phone-field>`,
})
class RequiredHost {}

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    [disabled]="true"
  ></solaris-phone-field>`,
})
class DisabledHost {}

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    density="compact"
  ></solaris-phone-field>`,
})
class DensityCompactHost {}

@Component({
  standalone: true,
  imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
  template: `<solaris-phone-field
    label="Phone"
    defaultCountry="BR"
    hint="Use your mobile number."
  ></solaris-phone-field>`,
})
class HintHost {}

describe('SolarisPhoneFieldComponent', () => {
  async function setup<T>(hostType: new () => T): Promise<{
    fixture: any;
    input: HTMLInputElement;
    countryButton: HTMLButtonElement;
    component: any;
  }> {
    await TestBed.configureTestingModule({
      imports: [hostType],
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(hostType);
    fixture.detectChanges();
    const debug = fixture.debugElement.query(
      By.directive(SolarisPhoneFieldComponent),
    );
    const component = debug.componentInstance as any;
    const input = debug.query(By.css('input[solaris-input]')).nativeElement;
    const countryButton = debug.query(
      By.css('.solaris-phone-field__country'),
    ).nativeElement;
    return { fixture, input, countryButton, component };
  }

  describe('rendering', () => {
    it('renders a tel input and a country selector button', async () => {
      const { input, countryButton } = await setup(BasicHost);
      expect(input.getAttribute('type')).toBe('tel');
      expect(countryButton).toBeTruthy();
      expect(countryButton.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('forwards described-by ids from the field to the inner input (control contract)', async () => {
      const { fixture, input } = await setup(HintHost);
      const hint = fixture.debugElement.query(
        By.css('.solaris-form-field__hint'),
      );
      expect(hint).toBeTruthy();
      expect(input.getAttribute('aria-describedby')).toContain(
        hint.nativeElement.id,
      );
    });

    it('caps input length with the effective country max length', async () => {
      const { input, component } = await setup(DefaultCountryHost);
      const expected = (component as { effectiveMaxLength: () => number })
        .effectiveMaxLength()
        .toString();
      expect(input.getAttribute('maxlength')).toBe(expected);
    });

    it('applies data-density on the host', async () => {
      await TestBed.configureTestingModule({
        imports: [DensityCompactHost],
        providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
      }).compileComponents();
      const fixture = TestBed.createComponent(DensityCompactHost);
      fixture.detectChanges();
      const host = fixture.debugElement.query(By.css('solaris-phone-field'));
      expect(host.nativeElement.getAttribute('data-density')).toBe('compact');
    });

    it('shows the default country flag in the prefix', async () => {
      const { countryButton } = await setup(DefaultCountryHost);
      expect(
        countryButton.querySelector('.solaris-phone-field__flag'),
      ).toBeTruthy();
    });

    it('shows the calling code in a fixed dial-code prefix', async () => {
      const { fixture } = await setup(DefaultCountryHost);
      const dialCode = fixture.debugElement.query(
        By.css('.solaris-phone-field__dial-code'),
      ).nativeElement;
      expect(dialCode.textContent).toContain('+55');
    });

    it('shows a country-aware placeholder when none is provided', async () => {
      const { input } = await setup(DefaultCountryHost);
      expect(input.getAttribute('placeholder')).toBeTruthy();
    });

    it('has default radius sm', async () => {
      const { component } = await setup(BasicHost);
      expect(component.radius()).toBe('sm');
    });

    it('respects an explicit placeholder', async () => {
      await TestBed.configureTestingModule({
        imports: [SolarisPhoneFieldComponent],
        providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
      }).compileComponents();
      const fixture = TestBed.createComponent(SolarisPhoneFieldComponent);
      fixture.componentRef.setInput('label', 'Phone');
      fixture.componentRef.setInput('placeholder', 'Custom placeholder');
      fixture.detectChanges();
      const input = fixture.debugElement.query(
        By.css('input[solaris-input]'),
      ).nativeElement;
      expect(input.getAttribute('placeholder')).toBe('Custom placeholder');
    });
  });

  describe('CVA and Reactive Forms', () => {
    it('formats the value and stores E.164 on input', async () => {
      const { fixture, input, component } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;

      input.value = '11999998888';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      expect(component.internalValue).toBeDefined();
      const controlValue = host.control.value;
      expect(controlValue).toBe('+5511999998888');
      expect(input.value.replace(/\D/g, '')).toBe('11999998888');
    });

    it('writeValue formats the display value', async () => {
      const { fixture, input, component } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;
      host.control.setValue('+5511999998888');
      fixture.detectChanges();
      expect(input.value).toContain('99999-8888');
      expect(input.value.replace(/\D/g, '')).toBe('11999998888');
      expect(component.displayValue).toBeTruthy();
    });

    it('writeValue normalizes null to empty string', async () => {
      const { fixture, input, component } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;
      host.control.setValue('+5511999998888');
      fixture.detectChanges();
      component.writeValue(null);
      fixture.detectChanges();
      expect(component.internalValue()).toBe('');
      expect(component.displayValue()).toBe('');
      expect(input.value).toBe('');
    });

    it('clears value when input is emptied', async () => {
      const { fixture, input } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;
      input.value = '11999998888';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      expect(host.control.value).toBe('');
    });

    it('caps the input digits at the country max length', async () => {
      const { fixture, input, component } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;

      input.value = '119999988881';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      expect(component.internalValue()).toBe('+5511999998888');
      expect(input.value.replace(/\D/g, '')).toBe('11999998888');
      expect(host.control.value).toBe('+5511999998888');
    });

    it('auto-detects the country when an international number is pasted', async () => {
      const { fixture, input, component } = await setup(ReactiveFormsHost);
      const host = fixture.componentInstance as ReactiveFormsHost;

      input.value = '+14155552671';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      const dialCode = fixture.debugElement.query(
        By.css('.solaris-phone-field__dial-code'),
      ).nativeElement;
      expect(component.internalValue()).toBe('+14155552671');
      expect(dialCode.textContent).toContain('+1');
      expect(host.control.value).toBe('+14155552671');
    });
  });

  describe('country selection', () => {
    it('updates the dial-code when a country is selected', async () => {
      const { fixture, input, component } = await setup(BasicHost);
      const us = component
        .countries()
        .find((c: { code: string }) => c.code === 'US');
      expect(us).toBeTruthy();

      input.value = '2015550123';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      component.selectCountry(us);
      fixture.detectChanges();

      const dialCode = fixture.debugElement.query(
        By.css('.solaris-phone-field__dial-code'),
      ).nativeElement;
      expect(dialCode.textContent).toContain('+1');
    });

    it('emits countryChange with the selected code', async () => {
      const { component } = await setup(BasicHost);
      const pt = component
        .countries()
        .find((c: { code: string }) => c.code === 'PT');
      expect(pt).toBeTruthy();
      let emitted: string | undefined;
      const sub = component.countryChange.subscribe(
        (c: string) => (emitted = c),
      );
      component.selectCountry(pt);
      sub.unsubscribe();
      expect(emitted).toBe('PT');
    });
  });

  describe('validation', () => {
    it('shows required error on blur when empty and required', async () => {
      const { fixture, input } = await setup(RequiredHost);
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
    });

    it('shows invalid error for an incomplete number', async () => {
      const { fixture, input } = await setup(RequiredHost);
      input.value = '11';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
    });

    it('does not show an error for a valid number', async () => {
      const { fixture, input } = await setup(RequiredHost);
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.value = '11999998888';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeNull();
    });
  });

  describe('disabled', () => {
    it('disables the input and the country button', async () => {
      const { input, countryButton } = await setup(DisabledHost);
      expect(input.disabled).toBe(true);
      expect(countryButton.disabled).toBe(true);
    });
  });

  describe('a11y', () => {
    it('exposes the country button as a popup trigger', async () => {
      const { countryButton } = await setup(BasicHost);
      expect(countryButton.getAttribute('aria-haspopup')).toBe('listbox');
      expect(countryButton.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('form-field repasse (P4 Lote C)', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisPhoneFieldComponent,
        ReactiveFormsModule,
        SolarisFormSuffixDirective,
        SolarisFormSuffixActionDirective,
      ],
      template: `<solaris-phone-field label="Phone" size="lg" density="compact">
        <button
          type="button"
          solaris-form-suffix
          solaris-form-suffix-action
          aria-label="Action"
        >
          Go
        </button>
      </solaris-phone-field>`,
    })
    class RepasseHost {}

    @Component({
      standalone: true,
      imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
      template: `<solaris-phone-field
        label="Phone"
        [loading]="true"
      ></solaris-phone-field>`,
    })
    class LoadingHost {}

    it('forwards size, density and loading to the inner form field', async () => {
      const { fixture } = await setup(LoadingHost);
      const field = fixture.nativeElement.querySelector(
        'solaris-phone-field solaris-form-field',
      ) as HTMLElement;
      expect(field.hasAttribute('data-loading')).toBe(true);
      expect(field.querySelector('.solaris-form-field__loading')).toBeTruthy();
    });

    it('projects suffix-action into the action variant', async () => {
      const { fixture } = await setup(RepasseHost);
      const field = fixture.nativeElement.querySelector(
        'solaris-phone-field solaris-form-field',
      ) as HTMLElement;
      expect(field.getAttribute('data-size')).toBe('lg');
      expect(field.getAttribute('data-density')).toBe('compact');
      const affix = field.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(affix.getAttribute('data-variant')).toBe('action');
    });
  });

  describe('clearable (P5 B/C)', () => {
    @Component({
      standalone: true,
      imports: [SolarisPhoneFieldComponent, ReactiveFormsModule],
      template: `<solaris-phone-field
        label="Phone"
        defaultCountry="BR"
        [clearable]="true"
      ></solaris-phone-field>`,
    })
    class ClearableHost {}

    it('renders a clear button with the default aria label when it has value', async () => {
      const { fixture, component } = await setup(ClearableHost);
      component.writeValue('+5511987654321');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector(
        '.solaris-phone-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Clear phone number');
    });

    it('clears the value and display on click', async () => {
      const { fixture, component } = await setup(ClearableHost);
      let cleared = 0;
      component.cleared.subscribe(() => {
        cleared += 1;
      });
      component.writeValue('+5511987654321');
      fixture.detectChanges();
      (
        fixture.nativeElement.querySelector(
          '.solaris-phone-field__clear',
        ) as HTMLButtonElement
      ).click();
      fixture.detectChanges();
      expect(component.internalValue()).toBe('');
      expect(component.displayValue()).toBe('');
      expect(cleared).toBe(1);
      expect(
        fixture.nativeElement.querySelector('.solaris-phone-field__clear'),
      ).toBeNull();
    });

    it('hides the clear button without value', async () => {
      const { fixture } = await setup(ClearableHost);
      expect(
        fixture.nativeElement.querySelector('.solaris-phone-field__clear'),
      ).toBeNull();
    });
  });
});
