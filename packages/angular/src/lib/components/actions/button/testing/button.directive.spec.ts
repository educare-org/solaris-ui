import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisButtonDirective } from '../directives/button.directive';
import { SolarisButtonIconDirective } from '../directives/button-icon.directive';

import type {
  SolarisButtonAppearance,
  SolarisButtonColor,
  SolarisButtonRadius,
  SolarisButtonDensity,
  SolarisButtonShape,
  SolarisButtonSize,
  SolarisButtonIconPosition,
} from '../model/button.types';

describe('SolarisButtonDirective', () => {
  describe('on button element', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button>Click me</button>`,
    })
    class TestHost {}

    let fixture: ComponentFixture<TestHost>;

    const createFixture = () => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('[solaris-button]');
    };

    it('should apply directive to button', () => {
      const el = createFixture();
      expect(el).toBeTruthy();
    });

    it('should render text content', () => {
      const el = createFixture();
      expect(el.textContent?.trim()).toBe('Click me');
    });

    it('should have default appearance solid', () => {
      const el = createFixture();
      expect(el.getAttribute('data-appearance')).toBe('solid');
    });

    it('should have default color neutral', () => {
      const el = createFixture();
      expect(el.getAttribute('data-color')).toBe('neutral');
    });

    it('should have default radius md', () => {
      const el = createFixture();
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should set type="button" by default', () => {
      const el = createFixture();
      expect(el.getAttribute('type')).toBe('button');
    });

    it('should render with a DOM adapter that does not implement dataset', () => {
      const descriptor = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'dataset',
      );
      Object.defineProperty(HTMLElement.prototype, 'dataset', {
        configurable: true,
        value: undefined,
      });

      try {
        const el = createFixture();
        expect(el.getAttribute('data-appearance')).toBe('solid');
      } finally {
        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, 'dataset', descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, 'dataset');
        }
      }
    });
  });

  describe('type preservation', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button type="submit">Submit</button>`,
    })
    class SubmitHost {}

    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button type="reset">Reset</button>`,
    })
    class ResetHost {}

    it('should preserve type submit', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SubmitHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('[solaris-button]')
          .getAttribute('type'),
      ).toBe('submit');
    });

    it('should preserve type reset', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ResetHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('[solaris-button]')
          .getAttribute('type'),
      ).toBe('reset');
    });
  });

  describe('on anchor element', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<a solaris-button href="/login">Entrar</a>`,
    })
    class TestHost {}

    it('should apply directive to anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el).toBeTruthy();
      expect(el.textContent?.trim()).toBe('Entrar');
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [appearance]="appearance">
        Test
      </button>`,
    })
    class TestHost {
      appearance: SolarisButtonAppearance = 'solid';
    }

    it('should support appearance solid', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-appearance')).toBe('solid');
    });

    it('should support appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'outline';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-appearance')).toBe('outline');
    });

    it('should support appearance ghost', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'ghost';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-appearance')).toBe('ghost');
    });

    it('should support appearance tonal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'tonal';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-appearance')).toBe('tonal');
    });

    it('should support appearance surface', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'surface';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-appearance')).toBe('surface');
    });

    it('should support appearance gradient', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'gradient';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-appearance')).toBe('gradient');
    });
  });

  describe('color', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [color]="color">Test</button>`,
    })
    class TestHost {
      color: SolarisButtonColor = 'neutral';
    }

    it('should support color neutral', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('neutral');
    });

    it('should support color primary', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'primary';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('primary');
    });

    it('should support color success', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'success';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('success');
    });

    it('should support color warning', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'warning';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('warning');
    });

    it('should support color danger', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'danger';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('danger');
    });

    it('should support color info', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'info';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('info');
    });

    it('should support color custom', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'custom';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-color')).toBe('custom');
    });
  });

  describe('radius', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [radius]="radius">Test</button>`,
    })
    class TestHost {
      radius: SolarisButtonRadius = 'md';
    }

    it('should support radius none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'none';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-radius')).toBe('none');
    });

    it('should support radius sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-radius')).toBe('sm');
    });

    it('should support radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should support radius lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-radius')).toBe('lg');
    });

    it('should support radius full', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'full';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-radius')).toBe('full');
    });
  });

  describe('density', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [density]="density">Test</button>`,
    })
    class TestHost {
      density: SolarisButtonDensity = 'compact';
    }

    it('should support density compact', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'compact';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-density')).toBe('compact');
    });

    it('should support density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'comfortable';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-density')).toBe('comfortable');
    });

    it('should support density normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'normal';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('size', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [size]="size">Test</button>`,
    })
    class TestHost {
      size: SolarisButtonSize = 'md';
    }

    const setup = (size: SolarisButtonSize) => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = size;
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('[solaris-button]');
    };

    it('should default to size md', () => {
      expect(setup('md').getAttribute('data-size')).toBe('md');
    });

    it('should support size sm', () => {
      expect(setup('sm').getAttribute('data-size')).toBe('sm');
    });

    it('should support size lg', () => {
      expect(setup('lg').getAttribute('data-size')).toBe('lg');
    });
  });

  describe('size x density matrix', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [size]="size" [density]="density">
        Test
      </button>`,
    })
    class TestHost {
      size: SolarisButtonSize = 'md';
      density: SolarisButtonDensity | undefined = undefined;
    }

    it.each([
      ['sm', 'compact'],
      ['md', 'compact'],
      ['lg', 'compact'],
      ['sm', 'normal'],
      ['md', 'normal'],
      ['lg', 'normal'],
      ['sm', 'comfortable'],
      ['md', 'comfortable'],
      ['lg', 'comfortable'],
    ] as Array<[SolarisButtonSize, SolarisButtonDensity]>)(
      'should expose data-size=%s and data-density=%s',
      (size, density) => {
        TestBed.configureTestingModule({});
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.size = size;
        fixture.componentInstance.density = density;
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('[solaris-button]');
        expect(el.getAttribute('data-size')).toBe(size);
        expect(el.getAttribute('data-density')).toBe(density);
      },
    );

    it('should fall back to theme density when density is unset', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = undefined;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('pressed', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [pressed]="pressed">Test</button>`,
    })
    class TestHost {
      pressed: boolean | undefined = undefined;
    }

    const setup = (pressed: boolean | undefined) => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.pressed = pressed;
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('[solaris-button]');
    };

    it('should not render aria-pressed when pressed is unset', () => {
      const el = setup(undefined);
      expect(el.hasAttribute('aria-pressed')).toBe(false);
      expect(el.hasAttribute('data-pressed')).toBe(false);
    });

    it('should render pressed state when pressed is true', () => {
      const el = setup(true);
      expect(el.getAttribute('aria-pressed')).toBe('true');
      expect(el.hasAttribute('data-pressed')).toBe(true);
    });

    it('should render unpressed state when pressed is false', () => {
      const el = setup(false);
      expect(el.getAttribute('aria-pressed')).toBe('false');
      expect(el.hasAttribute('data-pressed')).toBe(false);
    });
  });

  describe('aria-label management', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button
        solaris-button
        [loading]="loading"
        [loadingLabel]="loadingLabel"
        [ariaLabel]="ariaLabel"
        [attr.aria-label]="attrLabel"
      >
        Save
      </button>`,
    })
    class TestHost {
      loading = false;
      loadingLabel: string | undefined = 'Saving…';
      ariaLabel: string | undefined = undefined;
      attrLabel: string | null = null;
    }

    const setup = (patch?: Partial<TestHost>) => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      if (patch) {
        Object.assign(fixture.componentInstance, patch);
      }
      fixture.detectChanges();
      return {
        fixture,
        el: fixture.nativeElement.querySelector('[solaris-button]'),
      };
    };

    it('should not clobber a consumer aria-label when idle', () => {
      const { el } = setup({ attrLabel: 'Close' });
      expect(el.getAttribute('aria-label')).toBe('Close');
    });

    it('should apply the loading label while loading', () => {
      const { el } = setup({ loading: true });
      expect(el.getAttribute('aria-label')).toBe('Saving…');
    });

    it('should apply the ariaLabel input when idle', () => {
      const { el } = setup({ ariaLabel: 'Save changes' });
      expect(el.getAttribute('aria-label')).toBe('Save changes');
    });

    it('should prefer the loading label over the idle label', () => {
      const { el } = setup({ loading: true, ariaLabel: 'Save changes' });
      expect(el.getAttribute('aria-label')).toBe('Saving…');
    });
  });

  describe('icon-only a11y guard', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [attr.aria-label]="label"></button>`,
    })
    class TestHost {
      label: string | null = null;
    }

    it('should warn in dev mode when button has no text and no label', async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('should not warn when aria-label is present', async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.label = 'Close';
      fixture.detectChanges();
      await fixture.whenStable();
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });
  });

  describe('shape', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [shape]="shape">Test</button>`,
    })
    class TestHost {
      shape: SolarisButtonShape = 'normal';
    }

    it('should have default shape normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-shape')).toBe('normal');
    });

    it('should support shape wide', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.shape = 'wide';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-shape')).toBe('wide');
    });
  });

  describe('fullWidth', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [fullWidth]="fullWidth">Test</button>`,
    })
    class TestHost {
      fullWidth = true;
    }

    it('should apply data-full-width attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.hasAttribute('data-full-width')).toBe(true);
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [disabled]="disabled">Test</button>`,
    })
    class TestHost {
      disabled = true;
    }

    it('should set disabled attribute on button', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should set aria-disabled on button', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('disabled on anchor', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<a solaris-button href="/test" [disabled]="disabled">Link</a>`,
    })
    class TestHost {
      disabled = true;
    }

    it('should set aria-disabled on anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set tabindex="-1" on disabled anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('tabindex')).toBe('-1');
    });

    it('should not set disabled attribute on anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('should prevent click on disabled anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      const clickEvent = new MouseEvent('click', { cancelable: true });
      const prevented = !el.dispatchEvent(clickEvent);
      expect(prevented).toBe(true);
    });

    it('should allow click when not disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.disabled = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      const clickEvent = new MouseEvent('click', { cancelable: true });
      const prevented = !el.dispatchEvent(clickEvent);
      expect(prevented).toBe(false);
    });
  });

  describe('loading', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [loading]="loading">Save</button>`,
    })
    class ButtonTestHost {
      loading = true;
    }

    it('should set data-loading attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.hasAttribute('data-loading')).toBe(true);
    });

    it('should set aria-busy', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('aria-busy')).toBe('true');
    });

    it('should set disabled when loading', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should preserve text content when loading', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.textContent?.trim()).toBe('Save');
    });

    it('should render a spinner component when loading', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      const spinner = el.querySelector('solaris-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should remove spinner when loading ends', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.componentInstance.loading = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      const spinner = el.querySelector('solaris-spinner');
      expect(spinner).toBeFalsy();
    });

    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<a solaris-button href="/test" [loading]="loading">Link</a>`,
    })
    class AnchorTestHost {
      loading = true;
    }

    it('should prevent click on loading anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AnchorTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      const clickEvent = new MouseEvent('click', { cancelable: true });
      const prevented = !el.dispatchEvent(clickEvent);
      expect(prevented).toBe(true);
    });
  });

  describe('a11y', () => {
    it('should preserve native button semantics', () => {
      @Component({
        standalone: true,
        imports: [SolarisButtonDirective],
        template: `<button solaris-button>Test</button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should preserve native anchor semantics', () => {
      @Component({
        standalone: true,
        imports: [SolarisButtonDirective],
        template: `<a solaris-button href="/test">Link</a>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should not remove focus-visible outline', () => {
      @Component({
        standalone: true,
        imports: [SolarisButtonDirective],
        template: `<button solaris-button>Test</button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.style.outline).not.toBe('none');
    });
  });
});

describe('SolarisButtonDirective with icons', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonDirective, SolarisButtonIconDirective],
    host: { 'data-testid': 'icon-before-host' },
    template: `
      <button solaris-button>
        <span solaris-button-icon>icon</span>
        Text
      </button>
    `,
  })
  class IconBeforeHost {}

  it('should project icon before text', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(IconBeforeHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    const icon = el.querySelector('[solaris-button-icon]');
    expect(icon).toBeTruthy();
    expect(icon?.classList.contains('solaris-button-icon')).toBe(true);
    expect(el.textContent?.trim()).toContain('Text');
  });

  @Component({
    standalone: true,
    imports: [SolarisButtonDirective, SolarisButtonIconDirective],
    host: { 'data-testid': 'icon-after-host' },
    template: `
      <button solaris-button>
        Text
        <span solaris-button-icon>icon</span>
      </button>
    `,
  })
  class IconAfterHost {}

  it('should project icon after text', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(IconAfterHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    const icon = el.querySelector('[solaris-button-icon]');
    expect(icon).toBeTruthy();
    expect(icon?.classList.contains('solaris-button-icon')).toBe(true);
    expect(el.textContent?.trim()).toContain('Text');
  });
});

describe('SolarisButtonDirective with icon input', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button
      solaris-button
      [icon]="icon"
      [iconPosition]="iconPosition"
    >
      Entrar
    </button>`,
  })
  class TestHost {
    icon: string | undefined = 'google';
    iconPosition: SolarisButtonIconPosition = 'start';
  }

  it('renders an injected icon when icon input is set', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    const icon = el.querySelector('solaris-icon.solaris-button-icon');
    expect(icon).toBeTruthy();
  });

  it('applies data-icon-position start by default', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-icon-position')).toBe('start');
  });

  it('applies data-icon-position end', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.iconPosition = 'end';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-icon-position')).toBe('end');
  });

  it('does not apply data-icon-position when icon is empty', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.icon = '';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.hasAttribute('data-icon-position')).toBe(false);
    expect(el.querySelector('solaris-icon.solaris-button-icon')).toBeNull();
  });
});

describe('SolarisButtonDirective data-* aliases', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button
      solaris-button
      data-size="sm"
      data-density="compact"
      data-appearance="outline"
      data-color="primary"
      data-radius="lg"
      data-shape="wide"
    >
      Aliased
    </button>`,
  })
  class DataAliasHost {}

  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button solaris-button size="lg" data-size="sm">
      Precedence
    </button>`,
  })
  class DataPrecedenceHost {}

  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button solaris-button>Plain</button>`,
  })
  class PlainHost {}

  it('should honor data-* attributes as variant inputs', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DataAliasHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-density')).toBe('compact');
    expect(el.getAttribute('data-appearance')).toBe('outline');
    expect(el.getAttribute('data-color')).toBe('primary');
    expect(el.getAttribute('data-radius')).toBe('lg');
    expect(el.getAttribute('data-shape')).toBe('wide');
  });

  it('should prefer data-size over the size input', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DataPrecedenceHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-size')).toBe('sm');
  });

  it('should not stamp variant attributes before the first change detection', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(PlainHost);
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.hasAttribute('data-appearance')).toBe(false);
    expect(el.hasAttribute('data-size')).toBe(false);
    expect(el.hasAttribute('data-density')).toBe(false);
  });

  it('should apply input defaults on the first change detection', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(PlainHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-appearance')).toBe('solid');
    expect(el.getAttribute('data-size')).toBe('md');
  });
});

describe('SolarisButtonDirective first-paint stamping', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button solaris-button appearance="ghost" size="sm">
      Clear
    </button>`,
  })
  class StaticGhostHost {}

  it('should stamp static variant attributes so no solid flash paints', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(StaticGhostHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-appearance')).toBe('ghost');
    expect(el.getAttribute('data-size')).toBe('sm');
  });
});

describe('SolarisButtonDirective hydration marker', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonDirective],
    template: `<button solaris-button appearance="ghost" size="sm">
      Clear
    </button>`,
  })
  class HydrationHost {}

  it('should stamp data-hydrated after the first render with variants resolved', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(HydrationHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-appearance')).toBe('ghost');
    expect(el.getAttribute('data-size')).toBe('sm');
    expect(el.getAttribute('data-density')).toBe('normal');
    expect(el.hasAttribute('data-hydrated')).toBe(true);
  });

  it('should keep variant attributes stable when hydrated', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(HydrationHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-appearance')).toBe('ghost');
    expect(el.hasAttribute('data-hydrated')).toBe(true);
  });
});

describe('SolarisButtonIconDirective', () => {
  @Component({
    standalone: true,
    imports: [SolarisButtonIconDirective],
    template: `<span solaris-button-icon>icon</span>`,
  })
  class TestHost {}

  it('should apply solaris-button-icon class', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button-icon]');
    expect(el).toBeTruthy();
    expect(el.classList.contains('solaris-button-icon')).toBe(true);
  });
});
