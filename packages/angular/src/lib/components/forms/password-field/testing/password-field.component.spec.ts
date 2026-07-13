import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SolarisPasswordFieldComponent } from '../component/password-field.component';
import { SolarisPasswordPolicy } from '../model/password-policy.types';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { provideSolarisIcons } from '../../../../services/icon/provider/provide-solaris-icons';

const defaultPolicy: SolarisPasswordPolicy = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSymbol: true,
  disallowWhitespace: true,
};

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field label="Senha"></solaris-password-field>`,
})
class BasicHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    hint="Use uma senha forte."
  ></solaris-password-field>`,
})
class HintHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    error="Erro."
    [invalid]="true"
  ></solaris-password-field>`,
})
class ErrorHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    hint="Dica"
    error="Erro."
    [invalid]="true"
  ></solaris-password-field>`,
})
class ErrorOverHintHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [showToggle]="false"
  ></solaris-password-field>`,
})
class NoToggleHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [disabled]="true"
  ></solaris-password-field>`,
})
class DisabledHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [readonly]="true"
  ></solaris-password-field>`,
})
class ReadonlyHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    autocomplete="current-password"
  ></solaris-password-field>`,
})
class AutocompleteHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    appearance="surface"
  ></solaris-password-field>`,
})
class SurfaceHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    appearance="filled"
  ></solaris-password-field>`,
})
class FilledHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    size="sm"
  ></solaris-password-field>`,
})
class SizeSmHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    size="lg"
  ></solaris-password-field>`,
})
class SizeLgHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    density="compact"
  ></solaris-password-field>`,
})
class DensityCompactHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    density="comfortable"
  ></solaris-password-field>`,
})
class DensityComfortableHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    radius="none"
  ></solaris-password-field>`,
})
class RadiusNoneHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    radius="sm"
  ></solaris-password-field>`,
})
class RadiusSmHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    radius="lg"
  ></solaris-password-field>`,
})
class RadiusLgHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [required]="true"
  ></solaris-password-field>`,
})
class RequiredHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Nickname"
    [optional]="true"
  ></solaris-password-field>`,
})
class OptionalHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<form [formGroup]="form">
    <solaris-password-field
      formControlName="password"
      label="Senha"
    ></solaris-password-field>
  </form>`,
})
class ReactiveFormsHost {
  form = new FormGroup({ password: new FormControl('', Validators.required) });
}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    (valueChange)="capturedValue = $event"
  ></solaris-password-field>`,
})
class ValueChangeHost {
  capturedValue = '';
}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    (visibleChange)="captured = $event"
  ></solaris-password-field>`,
})
class VisibleChangeHost {
  captured: boolean | undefined;
}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [showRequirements]="true"
    [policy]="policy"
  ></solaris-password-field>`,
})
class RequirementsHost {
  policy = defaultPolicy;
}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [showRequirements]="false"
    [policy]="policy"
  ></solaris-password-field>`,
})
class NoRequirementsHost {
  policy = defaultPolicy;
}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [showStrength]="true"
  ></solaris-password-field>`,
})
class StrengthHost {}

@Component({
  standalone: true,
  imports: [SolarisPasswordFieldComponent, ReactiveFormsModule],
  template: `<solaris-password-field
    label="Senha"
    [showStrength]="false"
  ></solaris-password-field>`,
})
class NoStrengthHost {}

describe('SolarisPasswordFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSolarisTesting(),
        provideSolarisIcons(),
      ],
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
      expect(label.nativeElement.textContent).toContain('Senha');
    });

    it('renders hint', () => {
      const fixture = TestBed.createComponent(HintHost);
      fixture.detectChanges();
      const hint = fixture.debugElement.query(
        By.css('.solaris-form-field__hint'),
      );
      expect(hint).toBeTruthy();
      expect(hint.nativeElement.textContent).toContain('Use uma senha forte.');
    });

    it('renders error when invalid state is visible', () => {
      const fixture = TestBed.createComponent(ErrorHost);
      fixture.detectChanges();
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(error.nativeElement.textContent).toContain('Erro.');
    });

    it('does not show hint when error is visible', () => {
      const fixture = TestBed.createComponent(ErrorOverHintHost);
      fixture.detectChanges();
      const hint = fixture.debugElement.query(
        By.css('.solaris-form-field__hint'),
      );
      const error = fixture.debugElement.query(
        By.css('.solaris-form-field__error'),
      );
      expect(error).toBeTruthy();
      expect(hint).toBeFalsy();
    });

    it('renders input type password by default', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.getAttribute('type')).toBe('password');
    });

    it('toggles input type when toggle button is clicked', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      expect(input.nativeElement.getAttribute('type')).toBe('password');

      toggle.nativeElement.click();
      fixture.detectChanges();
      expect(input.nativeElement.getAttribute('type')).toBe('text');

      toggle.nativeElement.click();
      fixture.detectChanges();
      expect(input.nativeElement.getAttribute('type')).toBe('password');
    });

    it('renders toggle button by default', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      expect(toggle).toBeTruthy();
    });

    it('hides toggle when showToggle is false', () => {
      const fixture = TestBed.createComponent(NoToggleHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      expect(toggle).toBeFalsy();
    });

    it('toggle has accessible name', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      expect(toggle.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('sets autocomplete on input', () => {
      const fixture = TestBed.createComponent(AutocompleteHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      expect(input.nativeElement.getAttribute('autocomplete')).toBe(
        'current-password',
      );
    });

    it('applies required state', () => {
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      // FormField sets data-* attributes reflecting input state
      const formField = fixture.debugElement.query(
        By.css('solaris-form-field'),
      );
      expect(formField).toBeTruthy();
      // Verify via component instance that required input was passed
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.required()).toBe(true);
    });

    it('applies optional state', () => {
      const fixture = TestBed.createComponent(OptionalHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.optional()).toBe(true);
    });

    it('supports appearance surface', () => {
      const fixture = TestBed.createComponent(SurfaceHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.appearance()).toBe('surface');
    });

    it('supports appearance filled', () => {
      const fixture = TestBed.createComponent(FilledHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.appearance()).toBe('filled');
    });

    it('supports size sm', () => {
      const fixture = TestBed.createComponent(SizeSmHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.size()).toBe('sm');
    });

    it('supports size lg', () => {
      const fixture = TestBed.createComponent(SizeLgHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.size()).toBe('lg');
    });

    it('supports density compact', () => {
      const fixture = TestBed.createComponent(DensityCompactHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.density()).toBe('compact');
    });

    it('supports density comfortable', () => {
      const fixture = TestBed.createComponent(DensityComfortableHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.density()).toBe('comfortable');
    });

    it('supports radius none', () => {
      const fixture = TestBed.createComponent(RadiusNoneHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.radius()).toBe('none');
    });

    it('supports radius sm', () => {
      const fixture = TestBed.createComponent(RadiusSmHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.radius()).toBe('sm');
    });

    it('supports radius lg', () => {
      const fixture = TestBed.createComponent(RadiusLgHost);
      fixture.detectChanges();
      const passwordField = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      );
      expect(passwordField.componentInstance.radius()).toBe('lg');
    });

    it('applies disabled to input and toggle', () => {
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      expect(input.nativeElement.disabled).toBe(true);
      expect(toggle.nativeElement.disabled).toBe(true);
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

      input.nativeElement.value = 'Teste123!';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.form.get('password')?.value).toBe(
        'Teste123!',
      );
    });

    it('updates value on input', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'myPassword123';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(input.nativeElement.value).toBe('myPassword123');
    });

    it('emits valueChange on input', () => {
      const fixture = TestBed.createComponent(ValueChangeHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'teste123';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.capturedValue).toBe('teste123');
    });

    it('setDisabledState works', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const component = fixture.debugElement.query(
        By.directive(SolarisPasswordFieldComponent),
      ).componentInstance;
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      component.setDisabledState(true);
      fixture.detectChanges();
      expect(input.nativeElement.disabled).toBe(true);

      component.setDisabledState(false);
      fixture.detectChanges();
      expect(input.nativeElement.disabled).toBe(false);
    });
  });

  describe('toggle visibility', () => {
    it('emits visibleChange', () => {
      const fixture = TestBed.createComponent(VisibleChangeHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );

      toggle.nativeElement.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.captured).toBe(true);
    });

    it('toggle has accessible name when password is hidden', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      expect(toggle.nativeElement.getAttribute('aria-label')).toBe(
        'Show password',
      );
    });

    it('toggle has accessible name when password is visible', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );

      toggle.nativeElement.click();
      fixture.detectChanges();
      expect(toggle.nativeElement.getAttribute('aria-label')).toBe(
        'Hide password',
      );
    });
  });

  describe('requirements', () => {
    it('renders requirements when showRequirements and policy exist', () => {
      const fixture = TestBed.createComponent(RequirementsHost);
      fixture.detectChanges();
      const reqList = fixture.debugElement.query(
        By.css('.solaris-password-field__requirements'),
      );
      expect(reqList).toBeTruthy();
    });

    it('does not render requirements when showRequirements is false', () => {
      const fixture = TestBed.createComponent(NoRequirementsHost);
      fixture.detectChanges();
      const reqList = fixture.debugElement.query(
        By.css('.solaris-password-field__requirements'),
      );
      expect(reqList).toBeFalsy();
    });

    it('marks requirement as met when value satisfies it', () => {
      const fixture = TestBed.createComponent(RequirementsHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'Abcdef1!';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const reqItems = fixture.debugElement.queryAll(
        By.css('.solaris-password-field__requirement'),
      );
      const allMet = reqItems.every(
        (item) => item.nativeElement.getAttribute('data-met') === 'true',
      );
      expect(allMet).toBe(true);
    });
  });

  describe('strength', () => {
    it('renders strength when showStrength is true and value is non-empty', () => {
      const fixture = TestBed.createComponent(StrengthHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'Teste123!';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const strength = fixture.debugElement.query(
        By.css('.solaris-password-field__strength'),
      );
      expect(strength).toBeTruthy();
    });

    it('does not render strength when showStrength is false', () => {
      const fixture = TestBed.createComponent(NoStrengthHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'Teste123!';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const strength = fixture.debugElement.query(
        By.css('.solaris-password-field__strength'),
      );
      expect(strength).toBeFalsy();
    });

    it('shows only first segment active for weak password', () => {
      const fixture = TestBed.createComponent(StrengthHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'abc';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const segments = fixture.debugElement.queryAll(
        By.css('.solaris-password-field__strength-segment'),
      );
      expect(segments.length).toBe(3);
      expect(segments[0].nativeElement.getAttribute('data-active')).toBe(
        'true',
      );
      expect(segments[1].nativeElement.getAttribute('data-active')).toBe(
        'false',
      );
      expect(segments[2].nativeElement.getAttribute('data-active')).toBe(
        'false',
      );
    });

    it('shows all three segments active for strong password', () => {
      const fixture = TestBed.createComponent(StrengthHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'MySecureP@ssw0rd2024!';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const segments = fixture.debugElement.queryAll(
        By.css('.solaris-password-field__strength-segment'),
      );
      expect(segments.length).toBe(3);
      expect(segments[0].nativeElement.getAttribute('data-active')).toBe(
        'true',
      );
      expect(segments[1].nativeElement.getAttribute('data-active')).toBe(
        'true',
      );
      expect(segments[2].nativeElement.getAttribute('data-active')).toBe(
        'true',
      );
    });
  });

  describe('security', () => {
    it('does not log password to console', () => {
      const consoleSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'secret123';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('does not render password value as text outside input', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[solaris-input]'));

      input.nativeElement.value = 'secret123';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const hostEl = fixture.debugElement.query(
        By.css('solaris-password-field'),
      ).nativeElement;
      const textContent = hostEl.textContent;
      expect(textContent).not.toContain('secret123');
    });
  });

  describe('a11y', () => {
    it('toggle is focusable', () => {
      const fixture = TestBed.createComponent(BasicHost);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('button.solaris-password-field__toggle'),
      );
      expect(toggle.nativeElement.getAttribute('tabindex')).not.toBe('-1');
    });
  });
});
