import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisIconButtonDirective } from '../directives/icon-button.directive';

import type {
  SolarisIconButtonAppearance,
  SolarisIconButtonColor,
  SolarisIconButtonSize,
  SolarisIconButtonRadius,
  SolarisIconButtonDensity,
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

    it('should have default size md', () => {
      const el = createFixture();
      expect(el.getAttribute('data-size')).toBe('md');
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

    it('should support appearance glass', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.appearance = 'glass';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-appearance')).toBe('glass');
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

    it('should support size sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-size')).toBe('sm');
    });

    it('should support size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-size')).toBe('md');
    });

    it('should support size lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-icon-button]');
      expect(el.getAttribute('data-size')).toBe('lg');
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
      density: SolarisIconButtonDensity | undefined = 'compact';
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

    it('should accept ariaLabel input', () => {
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
      expect(el.getAttribute('aria-label')).toBeNull();
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

    it('should preserve aria-label when loading', () => {
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
      expect(el.getAttribute('aria-label')).toBe('Save');
    });
  });
});
