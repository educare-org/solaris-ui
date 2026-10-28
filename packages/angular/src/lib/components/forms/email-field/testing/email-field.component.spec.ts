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
import { SolarisFormSuffixActionDirective } from '../../form-field/directives/form-suffix-action.directive';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisTranslateService } from '../../../../services/translation';

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
  imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
  template: `<solaris-email-field
    label="E-mail"
    prefix="search"
    suffix="info"
  ></solaris-email-field>`,
})
class IconAffixHost {}

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

    it('forwards described-by ids from the field to the inner input (control contract)', () => {
      const fixture = TestBed.createComponent(HintHost);
      fixture.detectChanges();
      const hint = fixture.debugElement.query(
        By.css('.solaris-form-field__hint'),
      );
      const input = fixture.debugElement.query(By.css('input[type="email"]'));
      expect(hint).toBeTruthy();
      expect(input.nativeElement.getAttribute('aria-describedby')).toContain(
        hint.nativeElement.id,
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

      const formField = fixture.debugElement.query(
        By.css('solaris-form-field'),
      );
      expect(formField.nativeElement.hasAttribute('data-has-prefix')).toBe(
        true,
      );
      expect(formField.nativeElement.hasAttribute('data-has-suffix')).toBe(
        true,
      );
    });

    it('renders prefix and suffix icons via inputs', () => {
      const fixture = TestBed.createComponent(IconAffixHost);
      fixture.detectChanges();
      const prefix = fixture.debugElement.query(
        By.css('[solaris-form-prefix]'),
      );
      const suffix = fixture.debugElement.query(
        By.css('[solaris-form-suffix]'),
      );
      expect(prefix).toBeTruthy();
      expect(suffix).toBeTruthy();
      const formField = fixture.debugElement.query(
        By.css('solaris-form-field'),
      );
      expect(formField.nativeElement.hasAttribute('data-has-prefix')).toBe(
        true,
      );
      expect(formField.nativeElement.hasAttribute('data-has-suffix')).toBe(
        true,
      );

      const affixPrefix = formField.query(
        By.css('.solaris-form-field__affix--prefix'),
      );
      expect(affixPrefix).toBeTruthy();
      expect(affixPrefix.query(By.css('[solaris-form-prefix]'))).toBeTruthy();
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
      expect(emailField.componentInstance.requiredInput()).toBe(true);
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

    it('has default radius md', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const emailField = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      );
      expect(emailField.componentInstance.radius()).toBe('md');
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

  describe('form-field repasse (P4 Lote C)', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisEmailFieldComponent,
        ReactiveFormsModule,
        SolarisFormSuffixDirective,
        SolarisFormSuffixActionDirective,
      ],
      template: `<solaris-email-field
        label="E-mail"
        size="lg"
        density="compact"
      >
        <button
          type="button"
          solaris-form-suffix
          solaris-form-suffix-action
          aria-label="Action"
        >
          Go
        </button>
      </solaris-email-field>`,
    })
    class RepasseHost {}

    @Component({
      standalone: true,
      imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
      template: `<solaris-email-field
        label="E-mail"
        [loading]="true"
      ></solaris-email-field>`,
    })
    class LoadingHost {}

    function getInnerField(fixture: any): HTMLElement {
      return fixture.nativeElement.querySelector(
        'solaris-email-field solaris-form-field',
      );
    }

    it('forwards size and effective density to the inner form field', () => {
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      expect(field.getAttribute('data-size')).toBe('lg');
      expect(field.getAttribute('data-density')).toBe('compact');
    });

    it('forwards loading as overlay without layout shift', () => {
      const fixture = TestBed.createComponent(LoadingHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      expect(field.hasAttribute('data-loading')).toBe(true);
      expect(field.getAttribute('aria-busy')).toBe('true');
      expect(field.querySelector('.solaris-form-field__loading')).toBeTruthy();
    });

    it('keeps explicit size/density on the inner input (explicit wins)', () => {
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('data-size')).toBe('lg');
      expect(input.nativeElement.getAttribute('data-density')).toBe('compact');
    });

    it('projects suffix-action and switches the suffix affix to action variant', () => {
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      const affix = field.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(affix.getAttribute('data-variant')).toBe('action');
      expect(affix.querySelector('[solaris-form-suffix-action]')).toBeTruthy();
    });

    @Component({
      standalone: true,
      imports: [
        SolarisEmailFieldComponent,
        ReactiveFormsModule,
        SolarisFormSuffixActionDirective,
      ],
      template: `<solaris-email-field label="E-mail">
        <button type="button" solaris-form-suffix-action aria-label="Action">
          Go
        </button>
      </solaris-email-field>`,
    })
    class SingleSuffixActionHost {}

    it('projects single-attribute suffix-action without requiring solaris-form-suffix', () => {
      const fixture = TestBed.createComponent(SingleSuffixActionHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      const affix = field.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(affix.hasAttribute('data-empty')).toBe(false);
      expect(affix.getAttribute('data-variant')).toBe('action');
      expect(affix.querySelector('[solaris-form-suffix-action]')).toBeTruthy();
    });
  });

  describe('clearable (P5 B/C)', () => {
    @Component({
      standalone: true,
      imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
      template: `<solaris-email-field
        label="E-mail"
        [clearable]="true"
        (cleared)="clearedCount = clearedCount + 1"
      ></solaris-email-field>`,
    })
    class ClearableHost {
      clearedCount = 0;
    }

    it('renders a clear button with the default aria label when it has value', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      field.writeValue('user@educare.com');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.hasAttribute('hidden')).toBe(false);
      expect(button.getAttribute('aria-label')).toBe('Clear email');
    });

    it('clears the value and emits cleared on click', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      field.writeValue('user@educare.com');
      fixture.detectChanges();
      (
        fixture.nativeElement.querySelector(
          '.solaris-email-field__clear',
        ) as HTMLButtonElement
      ).click();
      fixture.detectChanges();
      expect((field as any).internalValue()).toBe('');
      expect(fixture.componentInstance.clearedCount).toBe(1);
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.hasAttribute('hidden')).toBe(true);
    });

    it('hides the clear button without value', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.hasAttribute('hidden')).toBe(true);
    });

    it('coerces null writeValue to empty without error when clearable', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      expect(() => {
        field.writeValue(null);
        fixture.detectChanges();
      }).not.toThrow();
      expect((field as any).internalValue()).toBe('');
      expect(input.nativeElement.value).toBe('');
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.hasAttribute('hidden')).toBe(true);
    });

    it('coerces undefined writeValue to empty without error when clearable', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      expect(() => {
        field.writeValue(undefined);
        fixture.detectChanges();
      }).not.toThrow();
      expect((field as any).internalValue()).toBe('');
      expect(input.nativeElement.value).toBe('');
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.hasAttribute('hidden')).toBe(true);
    });

    it('keeps the same clear-button node and only flips hidden when the value changes (SSR hydration stability)', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      const before = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(before).toBeTruthy();
      expect(before.hasAttribute('hidden')).toBe(true);

      field.writeValue('user@educare.com');
      fixture.detectChanges();
      const after = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(after).toBeTruthy();
      expect(after.hasAttribute('hidden')).toBe(false);
      expect(after).toBe(before);
    });

    it('propagates a replayed input event to the form control without replacing the clear-button node', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          [clearable]="true"
          [formControl]="control"
        ></solaris-email-field>`,
      })
      class ReplayHost {
        readonly control = new FormControl<string>('');
      }

      const fixture = TestBed.createComponent(ReplayHost);
      fixture.detectChanges();
      const before = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(before).toBeTruthy();
      expect(before.hasAttribute('hidden')).toBe(true);

      // Simulates an event-replay `input` dispatched before hydration
      // completes: the value must reach onChange/ngModel and only flip the
      // `hidden` attribute, never add/remove the button node (NG0502).
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      input.nativeElement.value = 'replayed@example.com';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toBe(
        'replayed@example.com',
      );
      const after = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(after).toBeTruthy();
      expect(after.hasAttribute('hidden')).toBe(false);
      expect(after).toBe(before);
    });

    it('hides the clear button via hidden when disabled', () => {
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      field.writeValue('user@educare.com');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button.hasAttribute('hidden')).toBe(false);

      field.setDisabledState(true);
      fixture.detectChanges();
      expect(button.hasAttribute('hidden')).toBe(true);
    });

    it('hides the clear button via hidden when loading', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          [clearable]="true"
          [loading]="true"
        ></solaris-email-field>`,
      })
      class LoadingClearableHost {}

      const fixture = TestBed.createComponent(LoadingClearableHost);
      fixture.detectChanges();
      const field = fixture.debugElement.query(
        By.directive(SolarisEmailFieldComponent),
      ).componentInstance as SolarisEmailFieldComponent;
      field.writeValue('user@educare.com');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.hasAttribute('hidden')).toBe(true);
    });

    it('renders the clear button with a default label without a translate provider', () => {
      @Component({
        standalone: true,
        imports: [SolarisEmailFieldComponent, ReactiveFormsModule],
        template: `<solaris-email-field
          label="E-mail"
          [clearable]="true"
        ></solaris-email-field>`,
        providers: [{ provide: SolarisTranslateService, useValue: null }],
      })
      class NoTranslateHost {}

      const fixture = TestBed.createComponent(NoTranslateHost);
      expect(() => fixture.detectChanges()).not.toThrow();
      const button = fixture.nativeElement.querySelector(
        '.solaris-email-field__clear',
      ) as HTMLButtonElement;
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Clear email');
    });
  });
});
