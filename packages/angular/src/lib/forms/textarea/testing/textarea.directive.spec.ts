import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { provideSolarisTesting } from '../../../testing/provide-solaris-testing';
import { SolarisTextareaDirective } from '../directives/textarea.directive';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

import type {
  SolarisTextareaAppearance,
  SolarisTextareaSize,
  SolarisTextareaDensity,
  SolarisTextareaRadius,
  SolarisTextareaResize,
} from '../model/textarea.types';

describe('SolarisTextareaDirective', () => {
  describe('on textarea element', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea></textarea>',
    })
    class TestHost {}

    it('should apply directive to textarea', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el).toBeTruthy();
    });

    it('should render as textarea element', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.tagName).toBe('TEXTAREA');
    });

    it('should have default appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-appearance')).toBe('outline');
    });

    it('should have default size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-size')).toBe('md');
    });

    it('should have default radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should have default density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-density')).toBe('comfortable');
    });

    it('should have default fullWidth', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('data-full-width')).toBe(true);
    });

    it('should have default resize vertical', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-resize')).toBe('vertical');
    });

    it('should generate id when none provided', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('id')).toMatch(/^solaris-textarea-\d+$/);
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template:
        '<textarea solaris-textarea [appearance]="appearance"></textarea>',
    })
    class TestHost {
      appearance: SolarisTextareaAppearance = 'outline';
    }

    it('should support appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-appearance')).toBe('outline');
    });

    it('should support appearance surface', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'surface';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-appearance')).toBe('surface');
    });

    it('should support appearance filled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'filled';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-appearance')).toBe('filled');
    });
  });

  describe('size', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea [size]="size"></textarea>',
    })
    class TestHost {
      size: SolarisTextareaSize = 'md';
    }

    it('should support size sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-size')).toBe('sm');
    });

    it('should support size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-size')).toBe('md');
    });

    it('should support size lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('density', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea [density]="density"></textarea>',
    })
    class TestHost {
      density: SolarisTextareaDensity | undefined = 'comfortable';
    }

    it('should support density compact', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'compact';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-density')).toBe('compact');
    });

    it('should support density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-density')).toBe('comfortable');
    });
  });

  describe('radius', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea [radius]="radius"></textarea>',
    })
    class TestHost {
      radius: SolarisTextareaRadius = 'md';
    }

    it('should support radius none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'none';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-radius')).toBe('none');
    });

    it('should support radius sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-radius')).toBe('sm');
    });

    it('should support radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should support radius lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-radius')).toBe('lg');
    });
  });

  describe('resize', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea [resize]="resize"></textarea>',
    })
    class TestHost {
      resize: SolarisTextareaResize = 'vertical';
    }

    it('should support resize none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.resize = 'none';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-resize')).toBe('none');
    });

    it('should support resize vertical', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-resize')).toBe('vertical');
    });

    it('should support resize horizontal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.resize = 'horizontal';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-resize')).toBe('horizontal');
    });

    it('should support resize both', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.resize = 'both';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('data-resize')).toBe('both');
    });
  });

  describe('fullWidth', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template:
        '<textarea solaris-textarea [fullWidth]="fullWidth"></textarea>',
    })
    class TestHost {
      fullWidth = true;
    }

    it('should apply data-full-width when true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('data-full-width')).toBe(true);
    });

    it('should not apply data-full-width when false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.fullWidth = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('data-full-width')).toBe(false);
    });
  });

  describe('invalid manual', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea [invalid]="invalid"></textarea>',
    })
    class TestHost {
      invalid: boolean | undefined = true;
    }

    it('should apply data-invalid when invalid is true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('data-invalid')).toBe(true);
    });

    it('should set aria-invalid when invalid is true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('aria-invalid')).toBe('true');
    });

    it('should not apply data-invalid when invalid is false', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.invalid = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('data-invalid')).toBe(false);
    });
  });

  describe('native attribute preservation', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template:
        '<textarea solaris-textarea placeholder="Description" rows="4" cols="50" maxlength="500"></textarea>',
    })
    class TestHost {}

    it('should preserve placeholder', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('placeholder')).toBe('Description');
    });

    it('should preserve rows', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('rows')).toBe('4');
    });

    it('should preserve cols', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('cols')).toBe('50');
    });

    it('should preserve maxlength', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('maxlength')).toBe('500');
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea [disabled]="disabled"></textarea>',
    })
    class TestHost {
      disabled = true;
    }

    it('should preserve disabled attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should allow enabling disabled textarea', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.disabled = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('readonly', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea readonly value="test"></textarea>',
    })
    class TestHost {}

    it('should preserve readonly attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('readonly')).toBe(true);
    });
  });

  describe('required', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea required></textarea>',
    })
    class TestHost {}

    it('should preserve required attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('required')).toBe(true);
    });
  });

  describe('id preservation', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea id="custom-id"></textarea>',
    })
    class TestHost {}

    it('should preserve provided id', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('id')).toBe('custom-id');
    });
  });

  describe('a11y', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective],
      template: '<textarea solaris-textarea></textarea>',
    })
    class TestHost {}

    it('should preserve native textarea semantics', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should not remove focus-visible outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.style.outline).not.toBe('none');
    });
  });

  describe('with Form Field', () => {
    @Component({
      standalone: true,
      imports: [SolarisTextareaDirective, SolarisFormFieldComponent],
      template: `
        <solaris-form-field label="Description" hint="Enter your description">
          <textarea solaris-textarea></textarea>
        </solaris-form-field>
      `,
      providers: [provideSolarisTesting()],
    })
    class TestHost {}

    it('should render textarea inside form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el).toBeTruthy();
    });

    it('should generate id when inside form field without id', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      const id = el.getAttribute('id');
      expect(id).toMatch(/^solaris-textarea-\d+$/);
    });

    it('should have data-appearance when inside form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('data-appearance')).toBe(true);
    });
  });

  describe('with Reactive Forms', () => {
    @Component({
      standalone: true,
      imports: [ReactiveFormsModule, SolarisTextareaDirective],
      template:
        '<textarea solaris-textarea [formControl]="control"></textarea>',
    })
    class TestHost {
      control = new FormControl('', [Validators.required]);
    }

    it('should work with formControl', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el).toBeTruthy();
    });

    it('should reflect value changes', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      fixture.componentInstance.control.setValue('test value');
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.value).toBe('test value');
    });

    it('should reflect disabled state via Angular Forms', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-textarea]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });
  });
});

describe('SolarisTextareaDirective on invalid host', () => {
  @Component({
    standalone: true,
    imports: [SolarisTextareaDirective],
    template: '<div solaris-textarea></div>',
  })
  class TestHost {}

  it('should warn in dev mode for non-textarea host', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[SolarisTextarea]'),
    );
    warnSpy.mockRestore();
  });
});
