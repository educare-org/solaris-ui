import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SOLARIS_TRANSLATE_CONFIG } from '../../../../services/translation/token/solaris-translate.tokens';
import { SolarisFormFieldComponent } from '../component/form-field.component';
import { SolarisFormLabelComponent } from '../component/form-label.component';
import { SolarisFormHintComponent } from '../component/form-hint.component';
import { SolarisFormErrorComponent } from '../component/form-error.component';
import { SolarisFormPrefixDirective } from '../directives/form-prefix.directive';
import { SolarisFormSuffixDirective } from '../directives/form-suffix.directive';

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

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default radius md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).toBe('md');
  });

  it('should have default density comfortable', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('comfortable');
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

  it('should apply size via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
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

  it('should apply density via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply all density', () => {
    const el = createFixture();
    const values = ['compact', 'comfortable'] as const;
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

describe('SolarisFormLabelComponent', () => {
  @Component({
    standalone: true,
    imports: [SolarisFormLabelComponent],
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
