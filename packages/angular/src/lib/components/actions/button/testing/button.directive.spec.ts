import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisButtonDirective } from '../directives/button.directive';
import { SolarisButtonIconDirective } from '../directives/button-icon.directive';

import type {
  SolarisButtonAppearance,
  SolarisButtonColor,
  SolarisButtonSize,
  SolarisButtonRadius,
  SolarisButtonDensity,
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

  describe('size', () => {
    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button solaris-button [size]="size">Test</button>`,
    })
    class TestHost {
      size: SolarisButtonSize = 'md';
    }

    it('should support size sm', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'sm';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-size')).toBe('sm');
    });

    it('should support size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-size')).toBe('md');
    });

    it('should support size lg', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.size = 'lg';
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[solaris-button]');
      expect(el.getAttribute('data-size')).toBe('lg');
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
      density: SolarisButtonDensity | undefined = 'compact';
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
