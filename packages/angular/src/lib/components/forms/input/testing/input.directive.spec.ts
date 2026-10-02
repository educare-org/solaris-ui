import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisInputDirective } from '../directives/input.directive';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

import type {
  SolarisInputAppearance,
  SolarisInputSize,
  SolarisInputDensity,
  SolarisInputRadius,
} from '../model/input.types';

describe('SolarisInputDirective', () => {
  describe('on input element', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-element-host' },
      template: '<input solaris-input />',
    })
    class TestHost {}

    it('should apply directive to input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el).toBeTruthy();
    });

    it('should have default appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-appearance')).toBe('outline');
    });

    it('should have default size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-size')).toBe('md');
    });

    it('should have default radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should have default density normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-density')).toBe('normal');
    });

    it('should have default fullWidth', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('data-full-width')).toBe(true);
    });

    it('should generate id when none provided', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('id')).toMatch(/^solaris-input-\d+$/);
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-appearance-host' },
      template: '<input solaris-input [appearance]="appearance" />',
    })
    class TestHost {
      appearance: SolarisInputAppearance = 'outline';
    }

    it('should support appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-appearance')).toBe('outline');
    });

    it('should support appearance surface', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'surface';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-appearance')).toBe('surface');
    });

    it('should support appearance filled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'filled';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-appearance')).toBe('filled');
    });
  });

  describe('size', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-size-host' },
      template: '<input solaris-input [size]="size" />',
    })
    class TestHost {
      size: SolarisInputSize = 'md';
    }

    it('should support size sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-size')).toBe('sm');
    });

    it('should support size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-size')).toBe('md');
    });

    it('should support size lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('density', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-density-host' },
      template: '<input solaris-input [density]="density" />',
    })
    class TestHost {
      density: SolarisInputDensity | undefined = 'comfortable';
    }

    it('should support density compact', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'compact';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-density')).toBe('compact');
    });

    it('should support density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-density')).toBe('comfortable');
    });

    it('should support density normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'normal';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('radius', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-radius-host' },
      template: '<input solaris-input [radius]="radius" />',
    })
    class TestHost {
      radius: SolarisInputRadius = 'md';
    }

    it('should support radius none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'none';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-radius')).toBe('none');
    });

    it('should support radius sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-radius')).toBe('sm');
    });

    it('should support radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should support radius lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-radius')).toBe('lg');
    });
  });

  describe('fullWidth', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-fullwidth-host' },
      template: '<input solaris-input [fullWidth]="fullWidth" />',
    })
    class TestHost {
      fullWidth = true;
    }

    it('should apply data-full-width when true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('data-full-width')).toBe(true);
    });

    it('should not apply data-full-width when false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.fullWidth = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('data-full-width')).toBe(false);
    });
  });

  describe('invalid manual', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-invalid-host' },
      template: '<input solaris-input [invalid]="invalid" />',
    })
    class TestHost {
      invalid: boolean | undefined = true;
    }

    it('should apply data-invalid when invalid is true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('data-invalid')).toBe(true);
    });

    it('should set aria-invalid when invalid is true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not apply data-invalid when invalid is false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.invalid = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('data-invalid')).toBe(false);
    });
  });

  describe('native attributes preservation', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-native-attr-host' },
      template:
        '<input solaris-input type="email" placeholder="Email" autocomplete="email" inputmode="email" />',
    })
    class TestHost {}

    it('should preserve type', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('type')).toBe('email');
    });

    it('should preserve placeholder', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('placeholder')).toBe('Email');
    });

    it('should preserve autocomplete', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('autocomplete')).toBe('email');
    });

    it('should preserve inputmode', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('inputmode')).toBe('email');
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-disabled-host' },
      template: '<input solaris-input [disabled]="disabled" />',
    })
    class TestHost {
      disabled = true;
    }

    it('should preserve disabled attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should allow enabling disabled input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.disabled = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('readonly', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-readonly-host' },
      template: '<input solaris-input readonly value="test" />',
    })
    class TestHost {}

    it('should preserve readonly attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('readonly')).toBe(true);
    });
  });

  describe('required', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-required-host' },
      template: '<input solaris-input required />',
    })
    class TestHost {}

    it('should preserve required attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('required')).toBe(true);
    });
  });

  describe('id preservation', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-id-host' },
      template: '<input solaris-input id="custom-id" />',
    })
    class TestHost {}

    it('should preserve provided id', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('id')).toBe('custom-id');
    });
  });

  describe('supported types', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-types-host' },
      template: '<input solaris-input [type]="type" />',
    })
    class TestHost {
      type = 'text';
    }

    const supportedTypes = [
      'text',
      'email',
      'password',
      'search',
      'tel',
      'url',
      'number',
      'date',
      'time',
      'datetime-local',
      'month',
      'week',
    ];

    for (const type of supportedTypes) {
      it(`should accept type="${type}"`, () => {
        TestBed.configureTestingModule({});
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.type = type;
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('[solaris-input]');
        expect(el.getAttribute('type')).toBe(type);
      });
    }
  });

  describe('number type preserves min/max/step', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-number-host' },
      template:
        '<input solaris-input type="number" min="0" max="100" step="1" />',
    })
    class TestHost {}

    it('should preserve min/max/step', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('min')).toBe('0');
      expect(el.getAttribute('max')).toBe('100');
      expect(el.getAttribute('step')).toBe('1');
    });
  });

  describe('a11y', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-a11y-host' },
      template: '<input solaris-input />',
    })
    class TestHost {}

    it('should preserve native input semantics', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should not remove focus-visible outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.style.outline).not.toBe('none');
    });
  });

  describe('with Form Field', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective, SolarisFormFieldComponent],
      host: { 'data-testid': 'input-form-field-host' },
      template: `
        <solaris-form-field label="Name" hint="Enter your name">
          <input solaris-input />
        </solaris-form-field>
      `,
      providers: [provideSolarisTesting()],
    })
    class TestHost {}

    it('should render input inside form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el).toBeTruthy();
    });

    it('should generate id when inside form field without id', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      const id = el.getAttribute('id');
      expect(id).toMatch(/^solaris-input-\d+$/);
    });

    it('should have data-appearance when inside form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('data-appearance')).toBe(true);
    });
  });

  describe('size-density matrix', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective],
      host: { 'data-testid': 'input-matrix-host' },
      template: '<input solaris-input [size]="size" [density]="density" />',
    })
    class TestHost {
      size: SolarisInputSize = 'md';
      density: SolarisInputDensity | undefined = 'normal';
    }

    const sizes: SolarisInputSize[] = ['sm', 'md', 'lg'];
    const densities: SolarisInputDensity[] = [
      'compact',
      'normal',
      'comfortable',
    ];

    for (const size of sizes) {
      for (const density of densities) {
        it(`should reflect matrix combination ${size} + ${density}`, () => {
          TestBed.configureTestingModule({});
          const fixture = TestBed.createComponent(TestHost);
          fixture.componentInstance.size = size;
          fixture.componentInstance.density = density;
          fixture.detectChanges();
          const el = fixture.nativeElement.querySelector('[solaris-input]');
          expect(el.getAttribute('data-size')).toBe(size);
          expect(el.getAttribute('data-density')).toBe(density);
        });
      }
    }
  });

  describe('form-field height delegation', () => {
    @Component({
      standalone: true,
      imports: [SolarisInputDirective, SolarisFormFieldComponent],
      host: { 'data-testid': 'input-delegation-host' },
      template: `
        <solaris-form-field label="Name" size="sm" density="compact">
          <input solaris-input />
        </solaris-form-field>
      `,
      providers: [provideSolarisTesting()],
    })
    class TestHost {}

    it('should accept size on form-field (P0 foundation)', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const field = fixture.nativeElement.querySelector('solaris-form-field');
      expect(field.getAttribute('data-size')).toBe('sm');
      expect(field.getAttribute('data-density')).toBe('compact');
    });

    it('should keep input projected inside the control wrapper', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(
        '.solaris-form-field__control [solaris-input]',
      );
      expect(control).toBeTruthy();
    });

    it('should keep input standalone-capable with its own defaults', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.getAttribute('data-size')).toBe('md');
      expect(el.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('with Reactive Forms', () => {
    @Component({
      standalone: true,
      imports: [ReactiveFormsModule, SolarisInputDirective],
      host: { 'data-testid': 'input-reactive-host' },
      template: '<input solaris-input [formControl]="control" />',
    })
    class TestHost {
      control = new FormControl('', [Validators.required]);
    }

    it('should work with formControl', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el).toBeTruthy();
    });

    it('should reflect value changes', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      fixture.componentInstance.control.setValue('test value');
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.value).toBe('test value');
    });

    it('should reflect disabled state via Angular Forms', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-input]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });
  });
});

describe('SolarisInputDirective on invalid host', () => {
  @Component({
    standalone: true,
    imports: [SolarisInputDirective],
    host: { 'data-testid': 'input-invalid-host-2' },
    template: '<div solaris-input></div>',
  })
  class TestHost {}

  it('should warn in dev mode for non-input host', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[SolarisInput]'),
    );
    warnSpy.mockRestore();
  });
});
