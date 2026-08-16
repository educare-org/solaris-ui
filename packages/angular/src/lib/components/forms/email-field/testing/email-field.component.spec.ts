import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SolarisEmailFieldComponent } from '../component/email-field.component';
import { SolarisFormPrefixDirective } from '../../form-field/directives/form-prefix.directive';
import { SolarisFormSuffixDirective } from '../../form-field/directives/form-suffix.directive';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field label="E-mail"></solaris-email-field>`,
})
class BasicHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    hint="Enter your institutional email."
  ></solaris-email-field>`,
})
class HintHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [error]="'Manual error.'"
    [invalid]="true"
  ></solaris-email-field>`,
})
class ErrorHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [disabled]="true"
  ></solaris-email-field>`,
})
class DisabledHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [readonly]="true"
  ></solaris-email-field>`,
})
class ReadonlyHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    autocomplete="off"
  ></solaris-email-field>`,
})
class AutocompleteHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    appearance="surface"
  ></solaris-email-field>`,
})
class SurfaceHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    appearance="filled"
  ></solaris-email-field>`,
})
class FilledHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    density="compact"
  ></solaris-email-field>`,
})
class DensityCompactHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    density="comfortable"
  ></solaris-email-field>`,
})
class DensityComfortableHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    density="normal"
  ></solaris-email-field>`,
})
class DensityNormalHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    radius="none"
  ></solaris-email-field>`,
})
class RadiusNoneHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    radius="sm"
  ></solaris-email-field>`,
})
class RadiusSmHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    radius="lg"
  ></solaris-email-field>`,
})
class RadiusLgHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [required]="true"
  ></solaris-email-field>`,
})
class RequiredHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="Nickname"
    [optional]="true"
  ></solaris-email-field>`,
})
class OptionalHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<form [formGroup]="form">
    <solaris-email-field
      formControlName="email"
      label="E-mail"
    ></solaris-email-field>
  </form>`,
})
class ReactiveFormsHost {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    placeholder="user@example.com"
  ></solaris-email-field>`,
})
class PlaceholderHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [trimOnBlur]="true"
  ></solaris-email-field>`,
})
class TrimOnBlurHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [normalizeLowercase]="true"
  ></solaris-email-field>`,
})
class NormalizeLowercaseHost {}

@Component({
  standalone: true,
  imports: [
    SolarisEmailFieldComponent,
    ReactiveFormsModule,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
  ],
  template: `<solaris-email-field label="E-mail">
    <span solaris-form-prefix>$</span>
    <span solaris-form-suffix>@empresa.com</span>
  </solaris-email-field>`,
})
class PrefixSuffixHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [allowedDomains]="['empresa.com.br']"
  ></solaris-email-field>`,
})
class AllowedDomainsHost {}

@Component({
  standalone: true,
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    [blockedDomains]="['tempmail.com']"
  ></solaris-email-field>`,
})
class BlockedDomainsHost {}

describe('SolarisEmailFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  describe('rendering', () => {
    it('renders label', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const label = fixture.debugElement.query(
        By.css('.solaris-form-field__label'),
      );
      expect(label).toBeTruthy();
      expect(label.nativeElement.textContent).toContain('E-mail');
    });

    it('renders hint', () => {
      const fixture = TestBed.createComponent(HintHost);
      fixture.detectChanges();
      const hint = fixture.debugElement.query(
        By.css('.solaris-form-field__hint'),
      );
      expect(hint).toBeTruthy();
      expect(hint.nativeElement.textContent).toContain(
        'Enter your institutional email.',
      );
    });

    it('projects prefix and suffix', () => {
      const fixture = TestBed.createComponent(PrefixSuffixHost);
      fixture.detectChanges();
      const prefix = fixture.debugElement.query(
        By.css('[solaris-form-prefix]'),
      );
      const suffix = fixture.debugElement.query(
        By.css('[solaris-form-suffix]'),
      );
      expect(prefix).toBeTruthy();
      expect(prefix.nativeElement.textContent).toBe('$');
      expect(suffix).toBeTruthy();
      expect(suffix.nativeElement.textContent).toBe('@empresa.com');
    });

    it('renders error when invalid state is visible', () => {
      const fixture = TestBed.createComponent(ErrorHost);
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('Manual error.');
    });

    it('renders input with type email', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('email');
    });

    it('sets autocomplete to email by default', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('autocomplete')).toBe('email');
    });

    it('sets inputmode to email', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('inputmode')).toBe('email');
    });

    it('sets autocapitalize to none', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('autocapitalize')).toBe('none');
    });

    it('sets spellcheck to false', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('spellcheck')).toBe('false');
    });

    it('allows autocomplete override', () => {
      const fixture = TestBed.createComponent(AutocompleteHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('autocomplete')).toBe('off');
    });

    it('renders placeholder', () => {
      const fixture = TestBed.createComponent(PlaceholderHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('placeholder')).toBe(
        'user@example.com',
      );
    });

    it('applies required state', () => {
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.required()).toBe(true);
    });

    it('applies optional state', () => {
      const fixture = TestBed.createComponent(OptionalHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.optional()).toBe(true);
    });

    it('supports appearance surface', () => {
      const fixture = TestBed.createComponent(SurfaceHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.appearance()).toBe('surface');
    });

    it('supports appearance filled', () => {
      const fixture = TestBed.createComponent(FilledHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.appearance()).toBe('filled');
    });

    it('supports density compact', () => {
      const fixture = TestBed.createComponent(DensityCompactHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.density()).toBe('compact');
    });

    it('supports density comfortable', () => {
      const fixture = TestBed.createComponent(DensityComfortableHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.density()).toBe('comfortable');
    });

    it('supports density normal', () => {
      const fixture = TestBed.createComponent(DensityNormalHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.density()).toBe('normal');
    });

    it('supports radius none', () => {
      const fixture = TestBed.createComponent(RadiusNoneHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.radius()).toBe('none');
    });

    it('supports radius sm', () => {
      const fixture = TestBed.createComponent(RadiusSmHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.radius()).toBe('sm');
    });

    it('supports radius lg', () => {
      const fixture = TestBed.createComponent(RadiusLgHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.radius()).toBe('lg');
    });

    it('applies disabled to input', () => {
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.disabled).toBe(true);
    });

    it('applies readonly to input', () => {
      const fixture = TestBed.createComponent(ReadonlyHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.readOnly).toBe(true);
    });
  });

  describe('CVA and Reactive Forms', () => {
    it('renders with formControlName', () => {
      const fixture = TestBed.createComponent(ReactiveFormsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input).toBeTruthy();
    });

    it('propagates value through formGroup', () => {
      const fixture = TestBed.createComponent(ReactiveFormsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@example.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.form.get('email')?.value).toBe(
        'user@example.com',
      );
    });

    it('updates value on input', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@example.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.nativeElement.value).toBe('user@example.com');
    });

    it('setDisabledState works', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const component = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      component.setDisabledState(true);
      fixture.detectChanges();
      expect(input.nativeElement.disabled).toBe(true);

      component.setDisabledState(false);
      fixture.detectChanges();
      expect(input.nativeElement.disabled).toBe(false);
    });

    it('writeValue applies initial value', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const component = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      component.writeValue('test@example.com');
      fixture.detectChanges();
      expect(input.nativeElement.value).toBe('test@example.com');
    });

    it('handles null writeValue without error', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const component = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      component.writeValue(null);
      fixture.detectChanges();
      expect(input.nativeElement.value).toBe('');
    });

    it('handles undefined writeValue without error', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const component = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      component.writeValue(undefined);
      fixture.detectChanges();
      expect(input.nativeElement.value).toBe('');
    });
  });

  describe('normalization', () => {
    it('trimOnBlur removes spaces on blur', () => {
      const fixture = TestBed.createComponent(TrimOnBlurHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = '  user@example.com  ';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(input.nativeElement.value).toBe('user@example.com');
    });

    it('normalizeLowercase converts to lowercase on blur', () => {
      const fixture = TestBed.createComponent(NormalizeLowercaseHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'USER@Example.COM';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(input.nativeElement.value).toBe('user@example.com');
    });
  });

  describe('validation', () => {
    it('shows required error when required and empty after blur', () => {
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
    });

    it('does not show required error when field is not required', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeFalsy();
    });

    it('does not show error while field is focused', () => {
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.dispatchEvent(new Event('focus'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeFalsy();
    });

    it('shows invalid email error for bad format', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'not-an-email';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('valid email');
    });

    it('shows allowed domain error', () => {
      const fixture = TestBed.createComponent(AllowedDomainsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@other.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('domain');
    });

    it('does not show allowed domain error for valid domain', () => {
      const fixture = TestBed.createComponent(AllowedDomainsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@empresa.com.br';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeFalsy();
    });

    it('shows blocked domain error', () => {
      const fixture = TestBed.createComponent(BlockedDomainsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@tempmail.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('domain');
    });

    it('does not show blocked domain error for non-blocked domain', () => {
      const fixture = TestBed.createComponent(BlockedDomainsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@example.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeFalsy();
    });

    it('does not call external APIs', () => {
      const httpSpy = vi
        .spyOn(window, 'fetch')
        .mockImplementation(() =>
          Promise.reject(new Error('should not be called')),
        );
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@example.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(httpSpy).not.toHaveBeenCalled();
      httpSpy.mockRestore();
    });
  });

  describe('error messages', () => {
    it('requiredError overrides default required message', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          [required]="true"
          requiredError="Custom required error."
        ></solaris-email-field>`,
      })
      class CustomRequiredHost {}

      const fixture = TestBed.createComponent(CustomRequiredHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain(
        'Custom required error.',
      );
    });

    it('invalidError overrides default invalid message', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          invalidError="Custom invalid error."
        ></solaris-email-field>`,
      })
      class CustomInvalidHost {}

      const fixture = TestBed.createComponent(CustomInvalidHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'bad';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain(
        'Custom invalid error.',
      );
    });

    it('allowedDomainError overrides default allowed domain message', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          [allowedDomains]="['empresa.com.br']"
          allowedDomainError="Custom domain error."
        ></solaris-email-field>`,
      })
      class CustomAllowedDomainHost {}

      const fixture = TestBed.createComponent(CustomAllowedDomainHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@other.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('Custom domain error.');
    });

    it('blockedDomainError overrides default blocked domain message', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          [blockedDomains]="['tempmail.com']"
          blockedDomainError="Custom blocked error."
        ></solaris-email-field>`,
      })
      class CustomBlockedDomainHost {}

      const fixture = TestBed.createComponent(CustomBlockedDomainHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'user@tempmail.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      input.nativeElement.dispatchEvent(new Event('focus'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain(
        'Custom blocked error.',
      );
    });
  });

  describe('a11y', () => {
    it('renders label that is associated with input', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('label'));
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(label).toBeTruthy();
      expect(input).toBeTruthy();
      const forAttr = label.nativeElement.getAttribute('for');
      const inputId = input.nativeElement.getAttribute('id');
      expect(forAttr).toBe(inputId);
    });

    it('input is focusable', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      input.nativeElement.focus();
      expect(document.activeElement).toBe(input.nativeElement);
    });
  });
});
