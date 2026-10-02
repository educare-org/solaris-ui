import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SOLARIS_TRANSLATE_CONFIG } from '../../../../services/translation/token/solaris-translate.tokens';
import { SolarisFormFieldComponent } from '../component/form-field.component';
import { SolarisFormLabelComponent } from '../component/form-label.component';
import { SolarisFormHintComponent } from '../component/form-hint.component';
import { SolarisFormErrorComponent } from '../component/form-error.component';
import { SolarisFormPrefixDirective } from '../directives/form-prefix.directive';
import { SolarisFormSuffixDirective } from '../directives/form-suffix.directive';
import { SolarisFormLabelActionDirective } from '../directives/form-label-action.directive';

describe('SolarisFormFieldComponent', () => {
  let fixture: ComponentFixture<SolarisFormFieldComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have default appearance outline', () => {
    const el = createFixture();
    expect(el.getAttribute('data-appearance')).toBe('outline');
  });

  it('should have default radius md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).toBe('md');
  });

  it('should have default density normal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should apply all sizes', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('size', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-size')).toBe(v);
    }
  });

  it('should keep size and density independent on the host', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply appearance via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'surface');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('surface');
  });

  it('should apply all appearances', () => {
    const el = createFixture();
    const values = ['outline', 'surface', 'filled'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('appearance', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-appearance')).toBe(v);
    }
  });

  it('should apply density via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply all density', () => {
    const el = createFixture();
    const values = ['compact', 'normal', 'comfortable'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('density', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-density')).toBe(v);
    }
  });

  it('should apply radius via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('lg');
  });

  it('should apply all radius values', () => {
    const el = createFixture();
    const values = ['none', 'sm', 'md', 'lg'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('radius', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-radius')).toBe(v);
    }
  });

  it('should apply manual disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-disabled')).toBe('');
  });

  it('should not have data-disabled when disabled is false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(el.getAttribute('data-disabled')).toBeNull();
  });

  it('should apply manual readonly', () => {
    const el = createFixture();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-readonly')).toBe('');
  });

  it('should not have data-readonly when readonly is false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('readonly', false);
    fixture.detectChanges();
    expect(el.getAttribute('data-readonly')).toBeNull();
  });

  it('should have data-focused when focused', () => {
    const el = createFixture();
    expect(el.getAttribute('data-focused')).toBeNull();
  });

  it('should apply data-invalid when invalid manual is true', () => {
    const el = createFixture();
    fixture.componentRef.setInput('invalid', true);
    fixture.componentRef.setInput('error', 'Error message');
    fixture.detectChanges();
    expect(el.getAttribute('data-invalid')).toBe('');
  });

  it('should not have data-invalid when invalid is false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('invalid', false);
    fixture.detectChanges();
    expect(el.getAttribute('data-invalid')).toBeNull();
  });

  it('should not be focusable as wrapper', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeFalsy();
  });

  it('should not have role button', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('button');
  });
});

describe('SolarisFormFieldComponent with label input', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template:
      '<solaris-form-field label="Email"><input /></solaris-form-field>',
    providers: [provideSolarisTesting()],
  })
  class LabelInputHostComponent {}

  let fixture: ComponentFixture<LabelInputHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(LabelInputHostComponent);
    fixture.detectChanges();
  });

  it('should render label from input', () => {
    const label = fixture.nativeElement.querySelector(
      '.solaris-form-field__label',
    );
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('Email');
  });
});

describe('SolarisFormFieldComponent with projected label', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent, SolarisFormLabelComponent],
    template: `
      <solaris-form-field label="Input Label">
        <solaris-form-label>Projected Label</solaris-form-label>
        <input />
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class ProjectedLabelHostComponent {}

  let fixture: ComponentFixture<ProjectedLabelHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ProjectedLabelHostComponent);
    fixture.detectChanges();
  });

  it('should render projected label', () => {
    const projected = fixture.nativeElement.querySelector('solaris-form-label');
    expect(projected).toBeTruthy();
    expect(projected.textContent?.trim()).toBe('Projected Label');
  });

  it('projected label wins over input label', () => {
    const inlineLabel = fixture.nativeElement.querySelector(
      '.solaris-form-field__label',
    );
    expect(inlineLabel).toBeFalsy();
  });
});

describe('SolarisFormFieldComponent with hint input', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template:
      '<solaris-form-field label="Name" hint="Enter your full name."><input /></solaris-form-field>',
    providers: [provideSolarisTesting()],
  })
  class HintInputHostComponent {}

  let fixture: ComponentFixture<HintInputHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(HintInputHostComponent);
    fixture.detectChanges();
  });

  it('should render hint from input', () => {
    const hint = fixture.nativeElement.querySelector(
      '.solaris-form-field__hint',
    );
    expect(hint).toBeTruthy();
    expect(hint.textContent?.trim()).toBe('Enter your full name.');
  });
});

describe('SolarisFormFieldComponent with projected hint', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent, SolarisFormHintComponent],
    template: `
      <solaris-form-field label="Name" hint="Input hint">
        <input />
        <solaris-form-hint>Projected hint</solaris-form-hint>
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class ProjectedHintHostComponent {}

  let fixture: ComponentFixture<ProjectedHintHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ProjectedHintHostComponent);
    fixture.detectChanges();
  });

  it('should render projected hint', () => {
    const projected = fixture.nativeElement.querySelector('solaris-form-hint');
    expect(projected).toBeTruthy();
    expect(projected.textContent?.trim()).toBe('Projected hint');
  });

  it('projected hint wins over input hint', () => {
    const inlineHint = fixture.nativeElement.querySelector(
      '.solaris-form-field__hint',
    );
    expect(inlineHint?.textContent?.trim()).not.toBe('Input hint');
  });
});

describe('SolarisFormFieldComponent with error', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template:
      '<solaris-form-field label="Email" error="Invalid email" [invalid]="true"><input /></solaris-form-field>',
    providers: [provideSolarisTesting()],
  })
  class ErrorInputHostComponent {}

  let fixture: ComponentFixture<ErrorInputHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ErrorInputHostComponent);
    fixture.detectChanges();
  });

  it('should render error when invalid is true', () => {
    const error = fixture.nativeElement.querySelector(
      '.solaris-form-field__error',
    );
    expect(error).toBeTruthy();
    expect(error.textContent?.trim()).toBe('Invalid email');
  });
});

describe('SolarisFormFieldComponent with projected error', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent, SolarisFormErrorComponent],
    template: `
      <solaris-form-field label="Email" error="Input error" [invalid]="true">
        <input />
        <solaris-form-error>Projected error</solaris-form-error>
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class ProjectedErrorHostComponent {}

  let fixture: ComponentFixture<ProjectedErrorHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ProjectedErrorHostComponent);
    fixture.detectChanges();
  });

  it('should render projected error', () => {
    const projected = fixture.nativeElement.querySelector('solaris-form-error');
    expect(projected).toBeTruthy();
    expect(projected.textContent?.trim()).toBe('Projected error');
  });

  it('projected error wins over input error', () => {
    const inlineError = fixture.nativeElement.querySelector(
      '.solaris-form-field__error',
    );
    expect(inlineError?.textContent?.trim()).not.toBe('Input error');
  });
});

describe('SolarisFormFieldComponent error/hint visibility', () => {
  let fixture: ComponentFixture<SolarisFormFieldComponent>;

  const createWithError = () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('hint', 'Enter your email');
    fixture.componentRef.setInput('error', 'Invalid email');
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should show hint when there is no error', () => {
    const el = createWithError();
    const hint = el.querySelector('.solaris-form-field__hint');
    const error = el.querySelector('.solaris-form-field__error');
    expect(hint).toBeTruthy();
    expect(error).toBeFalsy();
  });

  it('should show error and hide hint when invalid is true', () => {
    const el = createWithError();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    const hint = el.querySelector('.solaris-form-field__hint');
    const error = el.querySelector('.solaris-form-field__error');
    expect(error).toBeTruthy();
    expect(hint).toBeFalsy();
  });

  it('should hide error when invalid is false', () => {
    const el = createWithError();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-form-field__error')).toBeTruthy();

    fixture.componentRef.setInput('invalid', false);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-form-field__error')).toBeFalsy();
  });
});

describe('SolarisFormFieldComponent optional', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template:
      '<solaris-form-field label="Name" [optional]="true"><input /></solaris-form-field>',
  })
  class OptionalHostComponent {}

  let fixture: ComponentFixture<OptionalHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SOLARIS_TRANSLATE_CONFIG,
          useValue: {
            locale: 'en-US',
            fallbackLocale: 'en-US',
            translations: {
              'en-US': { 'solaris.form-field.optional': 'Optional' },
            },
            useBrowserLocale: false,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(OptionalHostComponent);
    fixture.detectChanges();
  });

  it('should render optional marker when optional is true', () => {
    const marker = fixture.nativeElement.querySelector(
      '.solaris-form-field__optional-marker',
    );
    expect(marker).toBeTruthy();
  });

  it('should set dynamic aria-label on optional marker', () => {
    const marker = fixture.nativeElement.querySelector(
      '.solaris-form-field__optional-marker',
    );
    expect(marker.getAttribute('aria-label')).toBe('Optional');
  });
});

describe('SolarisFormFieldComponent prefix and suffix', () => {
  @Component({
    standalone: true,
    imports: [
      SolarisFormFieldComponent,
      SolarisFormPrefixDirective,
      SolarisFormSuffixDirective,
    ],
    template: `
      <solaris-form-field label="Value">
        <span solaris-form-prefix>$</span>
        <input />
        <span solaris-form-suffix>USD</span>
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class PrefixSuffixHostComponent {}

  let fixture: ComponentFixture<PrefixSuffixHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(PrefixSuffixHostComponent);
    fixture.detectChanges();
  });

  it('should render prefix', () => {
    const prefix = fixture.nativeElement.querySelector('[solaris-form-prefix]');
    expect(prefix).toBeTruthy();
    expect(prefix.textContent?.trim()).toBe('$');
  });

  it('should render suffix', () => {
    const suffix = fixture.nativeElement.querySelector('[solaris-form-suffix]');
    expect(suffix).toBeTruthy();
    expect(suffix.textContent?.trim()).toBe('USD');
  });
});

describe('SolarisFormFieldComponent prefix/suffix inputs', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template: `
      <solaris-form-field label="Value" prefix="search" suffix="info">
        <input />
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class PrefixSuffixInputHostComponent {}

  let fixture: ComponentFixture<PrefixSuffixInputHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(PrefixSuffixInputHostComponent);
    fixture.detectChanges();
  });

  it('should render prefix and suffix icons', () => {
    const prefix = fixture.nativeElement.querySelector(
      '.solaris-form-field__affix--prefix solaris-icon',
    );
    const suffix = fixture.nativeElement.querySelector(
      '.solaris-form-field__affix--suffix solaris-icon',
    );
    expect(prefix).toBeTruthy();
    expect(suffix).toBeTruthy();
  });

  it('should apply data-has-prefix and data-has-suffix', () => {
    const host = fixture.nativeElement.querySelector('solaris-form-field');
    expect(host.hasAttribute('data-has-prefix')).toBe(true);
    expect(host.hasAttribute('data-has-suffix')).toBe(true);
  });
});

describe('SolarisFormFieldComponent with Reactive Forms', () => {
  let fixture: ComponentFixture<SolarisFormFieldComponent>;

  it('should render without error initially with manual invalid', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('invalid', false);
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector(
      '.solaris-form-field__error',
    );
    expect(error).toBeFalsy();
  });
});

describe('SolarisFormFieldComponent character counter', () => {
  it('should return empty text without maxLength', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    const fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.detectChanges();
    const f = fixture.componentInstance as any;
    expect(f.characterCounterText()).toBe('');
    expect(f.characterCounterSeverity()).toBe('normal');
  });

  it('should report danger severity at or above max', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    const fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.detectChanges();
    const f = fixture.componentInstance as any;
    f.maxLength.set(10);
    f.currentLength.set(10);
    fixture.detectChanges();
    expect(f.characterCounterText()).toBe('10/10');
    expect(f.characterCounterSeverity()).toBe('danger');
  });

  it('should report warning severity above 90%', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    const fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.detectChanges();
    const f = fixture.componentInstance as any;
    f.maxLength.set(10);
    f.currentLength.set(9);
    fixture.detectChanges();
    expect(f.characterCounterSeverity()).toBe('warning');
  });
});

describe('SolarisFormFieldComponent auto invalid', () => {
  @Component({
    standalone: true,
    imports: [ReactiveFormsModule, SolarisFormFieldComponent],
    template: `
      <form [formGroup]="form">
        <solaris-form-field label="Email">
          <input [formControl]="form.controls.email" ngDefaultControl />
        </solaris-form-field>
      </form>
    `,
  })
  class AutoInvalidHost {
    form = new FormGroup({
      email: new FormControl('', Validators.required),
    });
  }

  function getField(fixture: ComponentFixture<AutoInvalidHost>): any {
    return fixture.debugElement.query(By.css('solaris-form-field'))
      .componentInstance as any;
  }

  it('should not be auto-invalid while focused', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [provideSolarisTesting()],
    });
    const fixture = TestBed.createComponent(AutoInvalidHost);
    fixture.detectChanges();
    fixture.componentInstance.form.controls['email'].setErrors({ x: true });
    fixture.componentInstance.form.controls['email'].markAsTouched();
    getField(fixture).isFocused.set(true);
    fixture.detectChanges();
    expect(getField(fixture).isAutoInvalid()).toBe(false);
  });

  it('should not be auto-invalid when control is valid', () => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [provideSolarisTesting()],
    });
    const fixture = TestBed.createComponent(AutoInvalidHost);
    fixture.detectChanges();
    fixture.componentInstance.form.controls['email'].markAsTouched();
    fixture.detectChanges();
    expect(getField(fixture).isAutoInvalid()).toBe(false);
  });
});

describe('SolarisFormFieldComponent no control warning', () => {
  it('should render safely without control and not crash', () => {
    TestBed.configureTestingModule({
      providers: [provideSolarisTesting()],
    });
    const fixture = TestBed.createComponent(SolarisFormFieldComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el).toBeTruthy();
  });
});

describe('SolarisFormFieldComponent unsafe rendering security', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template: `
      <solaris-form-field
        label="<img src=x onerror=alert(1)>"
        hint="<script>alert(1)</script>"
        error="<b>Erro</b>"
        [invalid]="true"
      >
        <input />
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class UnsafeRenderingHost {}

  it('should escape label with HTML-like string', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(UnsafeRenderingHost);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector(
      '.solaris-form-field__label',
    );
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('<img src=x onerror=alert(1)>');
    const img = label.querySelector('img');
    expect(img).toBeNull();
  });

  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template: `
      <solaris-form-field hint="<script>alert(1)</script>">
        <input />
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class HintOnlyHost {}

  it('should escape hint with HTML-like string', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(HintOnlyHost);
    fixture.detectChanges();
    const hint = fixture.nativeElement.querySelector(
      '.solaris-form-field__hint',
    );
    expect(hint).toBeTruthy();
    expect(hint.textContent).toContain('<script>alert(1)</script>');
    const script = hint.querySelector('script');
    expect(script).toBeNull();
  });

  it('should escape error with HTML-like string', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(UnsafeRenderingHost);
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector(
      '.solaris-form-field__error',
    );
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('<b>Erro</b>');
    const b = error.querySelector('b');
    expect(b).toBeNull();
  });
});

describe('SolarisFormLabelComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormLabelComponent],
    host: { 'data-testid': 'label-host' },
    template: '<solaris-form-label>Custom Label</solaris-form-label>',
  })
  class LabelHostComponent {}

  let fixture: ComponentFixture<LabelHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(LabelHostComponent);
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    expect(fixture.nativeElement.textContent?.trim()).toBe('Custom Label');
  });

  it('should have correct class', () => {
    expect(
      fixture.nativeElement
        .querySelector('solaris-form-label')
        ?.classList.contains('solaris-form-label'),
    ).toBeTruthy();
  });
});

describe('SolarisFormHintComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormHintComponent],
    host: { 'data-testid': 'hint-host' },
    template: '<solaris-form-hint>Some hint text</solaris-form-hint>',
  })
  class HintHostComponent {}

  let fixture: ComponentFixture<HintHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(HintHostComponent);
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    expect(fixture.nativeElement.textContent?.trim()).toBe('Some hint text');
  });

  it('should have correct class', () => {
    expect(
      fixture.nativeElement
        .querySelector('solaris-form-hint')
        ?.classList.contains('solaris-form-hint'),
    ).toBeTruthy();
  });
});

describe('SolarisFormErrorComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormErrorComponent],
    host: { 'data-testid': 'error-host' },
    template: '<solaris-form-error>Error message</solaris-form-error>',
  })
  class ErrorHostComponent {}

  let fixture: ComponentFixture<ErrorHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ErrorHostComponent);
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    expect(fixture.nativeElement.textContent?.trim()).toBe('Error message');
  });

  it('should have role alert', () => {
    expect(
      fixture.nativeElement
        .querySelector('solaris-form-error')
        ?.getAttribute('role'),
    ).toBe('alert');
  });
});

describe('SolarisFormPrefixDirective', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormPrefixDirective],
    template: '<span solaris-form-prefix>Prefix</span>',
  })
  class PrefixHostComponent {}

  let fixture: ComponentFixture<PrefixHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(PrefixHostComponent);
    fixture.detectChanges();
  });

  it('should render content', () => {
    expect(fixture.nativeElement.textContent?.trim()).toBe('Prefix');
  });

  it('should have correct class', () => {
    expect(
      fixture.nativeElement
        .querySelector('[solaris-form-prefix]')
        ?.classList.contains('solaris-form-prefix'),
    ).toBeTruthy();
  });
});

describe('SolarisFormSuffixDirective', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormSuffixDirective],
    template: '<span solaris-form-suffix>Suffix</span>',
  })
  class SuffixHostComponent {}

  let fixture: ComponentFixture<SuffixHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SuffixHostComponent);
    fixture.detectChanges();
  });

  it('should render content', () => {
    expect(fixture.nativeElement.textContent?.trim()).toBe('Suffix');
  });

  it('should have correct class', () => {
    expect(
      fixture.nativeElement
        .querySelector('[solaris-form-suffix]')
        ?.classList.contains('solaris-form-suffix'),
    ).toBeTruthy();
  });
});

describe('SolarisFormFieldComponent label action', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent, SolarisFormLabelActionDirective],
    template: `
      <solaris-form-field label="Password">
        <a solaris-form-label-action href="#">Esqueceu a senha?</a>
        <input type="password" />
      </solaris-form-field>
    `,
    providers: [provideSolarisTesting()],
  })
  class LabelActionHostComponent {}

  let fixture: ComponentFixture<LabelActionHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(LabelActionHostComponent);
    fixture.detectChanges();
  });

  it('should render the label action inside the label row', () => {
    const labelRow = fixture.nativeElement.querySelector(
      '.solaris-form-field__label-row',
    );
    const action = labelRow.querySelector('[solaris-form-label-action]');
    expect(action).toBeTruthy();
    expect(action.textContent?.trim()).toBe('Esqueceu a senha?');
  });

  it('should apply the label action class', () => {
    const action = fixture.nativeElement.querySelector(
      '[solaris-form-label-action]',
    );
    expect(action.classList.contains('solaris-form-label-action')).toBe(true);
  });

  it('should keep the action on the same row as the label', () => {
    const label = fixture.nativeElement.querySelector(
      '.solaris-form-field__label',
    );
    const action = fixture.nativeElement.querySelector(
      '[solaris-form-label-action]',
    );
    const labelRow = fixture.nativeElement.querySelector(
      '.solaris-form-field__label-row',
    );
    expect(labelRow.contains(label)).toBe(true);
    expect(labelRow.contains(action)).toBe(true);
  });
});

describe('SolarisFormFieldComponent control type', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template: '<solaris-form-field label="Name"><input /></solaris-form-field>',
    providers: [provideSolarisTesting()],
  })
  class InputHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisFormFieldComponent],
    template:
      '<solaris-form-field label="Description"><textarea></textarea></solaris-form-field>',
    providers: [provideSolarisTesting()],
  })
  class TextareaHostComponent {}

  it('should report other control type for input', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();
    const field = fixture.nativeElement.querySelector('solaris-form-field');
    expect(field.getAttribute('data-control-type')).toBe('other');
  });

  it('should report textarea control type for textarea', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TextareaHostComponent);
    fixture.detectChanges();
    const field = fixture.nativeElement.querySelector('solaris-form-field');
    expect(field.getAttribute('data-control-type')).toBe('textarea');
  });
});

describe('SolarisFormFieldComponent size-density matrix', () => {
  const sizes = ['sm', 'md', 'lg'] as const;
  const densities = ['compact', 'normal', 'comfortable'] as const;

  for (const size of sizes) {
    for (const density of densities) {
      it(`should reflect matrix combination ${size} + ${density}`, () => {
        TestBed.configureTestingModule({
          providers: [provideSolarisTesting()],
        });
        const fixture = TestBed.createComponent(SolarisFormFieldComponent);
        fixture.componentRef.setInput('size', size);
        fixture.componentRef.setInput('density', density);
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.getAttribute('data-size')).toBe(size);
        expect(el.getAttribute('data-density')).toBe(density);
      });
    }
  }
});
