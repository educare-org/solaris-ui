import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisIconButtonDirective } from '../directives/icon-button.directive';

import type {
  SolarisIconButtonAppearance,
  SolarisIconButtonColor,
  SolarisIconButtonRadius,
  SolarisIconButtonDensity,
  SolarisIconButtonShape,
  SolarisIconButtonSize,
} from '../model/icon-button.types';

describe('SolarisIconButtonDirective', () => {
  describe('on button element', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button solaris-icon-button aria-label="Test">Icon</button>`,
    })
    class ButtonTestHost {}

    let fixture: ComponentFixture<ButtonTestHost>;

    const createFixture = () => {
      TestBed.configureTestingModule({});
      fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('[solaris-icon-button]');
    };

    it('should apply directive to button', () => {
      const el = createFixture();
      expect(el).toBeTruthy();
    });

    it('should render content', () => {
      const el = createFixture();
      expect(el.textContent?.trim()).toBe('Icon');
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

    it('should preserve aria-label', () => {
      const el = createFixture();
      expect(el.getAttribute('aria-label')).toBe('Test');
    });
  });

  describe('type preservation', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button solaris-icon-button type="submit" aria-label="Submit">
        Submit
      </button>`,
    })
    class SubmitHost {}

    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button solaris-icon-button type="reset" aria-label="Reset">
        Reset
      </button>`,
    })
    class ResetHost {}

    it('should preserve type submit', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SubmitHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('[solaris-icon-button]')
          .getAttribute('type'),
      ).toBe('submit');
    });

    it('should preserve type reset', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ResetHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('[solaris-icon-button]')
          .getAttribute('type'),
      ).toBe('reset');
    });
  });

  describe('on anchor element', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<a solaris-icon-button href="/settings" aria-label="Settings"
        >Icon</a
      >`,
    })
    class TestHost {}

    it('should apply directive to anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el).toBeTruthy();
      expect(el.textContent?.trim()).toBe('Icon');
    });
  });

  describe('appearance', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [appearance]="appearance"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      appearance: SolarisIconButtonAppearance = 'ghost';
    }

    it('should support appearance ghost', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-appearance')).toBe('ghost');
    });

    it('should support appearance solid', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'solid';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-appearance')).toBe('solid');
    });

    it('should support appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'outline';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-appearance')).toBe('outline');
    });

    it('should support appearance tonal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'tonal';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-appearance')).toBe('tonal');
    });

    it('should support appearance surface', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'surface';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-appearance')).toBe('surface');
    });
  });

  describe('color', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button solaris-icon-button [color]="color" aria-label="Test">
        Test
      </button>`,
    })
    class TestHost {
      color: SolarisIconButtonColor = 'neutral';
    }

    it('should support color neutral', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('neutral');
    });

    it('should support color primary', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'primary';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('primary');
    });

    it('should support color success', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'success';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('success');
    });

    it('should support color warning', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'warning';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('warning');
    });

    it('should support color danger', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'danger';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('danger');
    });

    it('should support color info', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'info';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('info');
    });

    it('should support color custom', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.color = 'custom';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-color')).toBe('custom');
    });
  });

  describe('shape', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button solaris-icon-button [shape]="shape" aria-label="Test">
        Test
      </button>`,
    })
    class TestHost {
      shape: SolarisIconButtonShape = 'normal';
    }

    it('should have default shape normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-shape')).toBe('normal');
    });

    it('should support shape wide', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.shape = 'wide';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-shape')).toBe('wide');
    });
  });

  describe('radius', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [radius]="radius"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      radius: SolarisIconButtonRadius = 'md';
    }

    it('should support radius none', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'none';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-radius')).toBe('none');
    });

    it('should support radius sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-radius')).toBe('sm');
    });

    it('should support radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-radius')).toBe('md');
    });

    it('should support radius lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-radius')).toBe('lg');
    });

    it('should support radius full', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.radius = 'full';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-radius')).toBe('full');
    });
  });

  describe('density', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [density]="density"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      density: SolarisIconButtonDensity = 'compact';
    }

    it('should support density compact', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'compact';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-density')).toBe('compact');
    });

    it('should support density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'comfortable';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-density')).toBe('comfortable');
    });

    it('should support density normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = 'normal';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('disabled', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [disabled]="disabled"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      disabled = true;
    }

    it('should set disabled attribute on button', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should set aria-disabled on button', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('disabled on anchor', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<a
        solaris-icon-button
        href="/test"
        [disabled]="disabled"
        aria-label="Test"
        >Link</a
      >`,
    })
    class TestHost {
      disabled = true;
    }

    it('should set aria-disabled on anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set tabindex="-1" on disabled anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('tabindex')).toBe('-1');
    });

    it('should not set disabled attribute on anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('should prevent click on disabled anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      const clickEvent = new MouseEvent('click', { cancelable: true });
      const prevented = !el.dispatchEvent(clickEvent);
      expect(prevented).toBe(true);
    });

    it('should allow click when not disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.disabled = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      const clickEvent = new MouseEvent('click', { cancelable: true });
      const prevented = !el.dispatchEvent(clickEvent);
      expect(prevented).toBe(false);
    });
  });

  describe('pressed', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [pressed]="pressed"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      pressed: boolean | undefined = undefined;
    }

    it('should not render aria-pressed when pressed is unset', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('aria-pressed')).toBe(false);
      expect(el.hasAttribute('data-pressed')).toBe(false);
    });

    it('should render aria-pressed true and data-pressed when pressed', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.pressed = true;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-pressed')).toBe('true');
      expect(el.hasAttribute('data-pressed')).toBe(true);
    });

    it('should render aria-pressed false without data-pressed when unpressed', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.pressed = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-pressed')).toBe('false');
      expect(el.hasAttribute('data-pressed')).toBe(false);
    });
  });

  describe('loading', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [loading]="loading"
        aria-label="Save"
      >
        Save
      </button>`,
    })
    class ButtonTestHost {
      loading = true;
    }

    it('should set data-loading attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('data-loading')).toBe(true);
    });

    it('should set aria-busy', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-busy')).toBe('true');
    });

    it('should set disabled when loading', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should preserve content when loading', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ButtonTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.textContent?.trim()).toBe('Save');
    });

    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<a
        solaris-icon-button
        href="/test"
        [loading]="loading"
        aria-label="Link"
        >Link</a
      >`,
    })
    class AnchorTestHost {
      loading = true;
    }

    it('should prevent click on loading anchor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AnchorTestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      const clickEvent = new MouseEvent('click', { cancelable: true });
      const prevented = !el.dispatchEvent(clickEvent);
      expect(prevented).toBe(true);
    });
  });

  describe('accessible name', () => {
    it('should accept native aria-label', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `<button solaris-icon-button aria-label="Close">
          Icon
        </button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-label')).toBe('Close');
    });

    it('should accept native aria-labelledby', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `
          <button solaris-icon-button aria-labelledby="label-close">
            Icon
          </button>
          <span id="label-close">Close</span>
        `,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-labelledby')).toBe('label-close');
    });

    it('should apply ariaLabel input as accessible name', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `<button solaris-icon-button [ariaLabel]="'Close'">
          Icon
        </button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-label')).toBe('Close');
    });
  });

  describe('size', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button solaris-icon-button [size]="size" aria-label="Test">
        Test
      </button>`,
    })
    class TestHost {
      size: SolarisIconButtonSize = 'md';
    }

    const setup = (size: SolarisIconButtonSize) => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = size;
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('[solaris-icon-button]');
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
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [size]="size"
        [density]="density"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      size: SolarisIconButtonSize = 'md';
      density: SolarisIconButtonDensity | undefined = undefined;
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
    ] as Array<[SolarisIconButtonSize, SolarisIconButtonDensity]>)(
      'should expose data-size=%s and data-density=%s',
      (size, density) => {
        TestBed.configureTestingModule({});
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.size = size;
        fixture.componentInstance.density = density;
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
        expect(el.getAttribute('data-size')).toBe(size);
        expect(el.getAttribute('data-density')).toBe(density);
      },
    );

    it('should fall back to theme density when density is unset', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.density = undefined;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('chromeless', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [chromeless]="chromeless"
        aria-label="Test"
      >
        Test
      </button>`,
    })
    class TestHost {
      chromeless = false;
    }

    it('should not render data-chromeless by default', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('data-chromeless')).toBe(false);
    });

    it('should render data-chromeless when enabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.chromeless = true;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.hasAttribute('data-chromeless')).toBe(true);
    });
  });

  describe('loading indicator parity with button', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [loading]="loading"
        aria-label="Save"
      >
        Save
      </button>`,
    })
    class TestHost {
      loading = true;
    }

    it('should render a spinner component when loading', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.querySelector('solaris-spinner')).toBeTruthy();
    });

    it('should remove spinner when loading ends', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.loading = false;
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.querySelector('solaris-spinner')).toBeFalsy();
    });
  });

  describe('loading aria-label management', () => {
    @Component({
      standalone: true,
      imports: [SolarisIconButtonDirective],
      template: `<button
        solaris-icon-button
        [loading]="loading"
        [loadingLabel]="loadingLabel"
        [ariaLabel]="ariaLabel"
      >
        Save
      </button>`,
    })
    class TestHost {
      loading = false;
      loadingLabel: string | undefined = 'Saving…';
      ariaLabel: string | undefined = undefined;
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
        el: fixture.nativeElement.querySelector('[solaris-icon-button]'),
      };
    };

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

  describe('a11y', () => {
    it('should preserve native button semantics', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `<button solaris-icon-button aria-label="Test">Test</button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should preserve native anchor semantics', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `<a solaris-icon-button href="/test" aria-label="Test"
          >Link</a
        >`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('role')).toBeNull();
    });

    it('should not remove focus-visible outline', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `<button solaris-icon-button aria-label="Test">Test</button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.style.outline).not.toBe('none');
    });

    it('should announce the loading label while loading', () => {
      @Component({
        standalone: true,
        imports: [SolarisIconButtonDirective],
        template: `<button
          solaris-icon-button
          aria-label="Save"
          [loading]="true"
        >
          Save
        </button>`,
      })
      class TestHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('aria-label')).toBe('Loading...');
    });
  });
});

describe('SolarisIconButtonDirective data-* aliases', () => {
  @Component({
    standalone: true,
    imports: [SolarisIconButtonDirective],
    template: `<button
      solaris-icon-button
      aria-label="Aliased"
      data-size="lg"
      data-appearance="ghost"
    >
      Aliased
    </button>`,
  })
  class DataAliasHost {}

  it('should honor data-* attributes as variant inputs', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(DataAliasHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
    expect(el.getAttribute('data-size')).toBe('lg');
    expect(el.getAttribute('data-appearance')).toBe('ghost');
  });
});
