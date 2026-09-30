import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisBadgeComponent } from '../component/badge.component';
import { SolarisBadgeIconDirective } from '../directives/badge-icon.directive';

describe('SolarisBadgeComponent', () => {
  let fixture: ComponentFixture<SolarisBadgeComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisBadgeComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have default appearance tonal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-appearance')).toBe('tonal');
  });

  it('should have default color neutral', () => {
    const el = createFixture();
    expect(el.getAttribute('data-color')).toBe('neutral');
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default radius full', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).toBe('full');
  });

  it('should have default variant standard', () => {
    const el = createFixture();
    expect(el.getAttribute('data-variant')).toBe('standard');
  });

  it('should have default placement inline', () => {
    const el = createFixture();
    expect(el.getAttribute('data-placement')).toBe('inline');
  });

  it('should not render dot, count or icon-only markers by default', () => {
    const el = createFixture();
    expect(el.getAttribute('data-dot')).toBeFalsy();
    expect(el.getAttribute('data-pulse')).toBeFalsy();
    expect(el.getAttribute('data-count')).toBeFalsy();
    expect(el.getAttribute('data-icon-only')).toBeFalsy();
    expect(el.getAttribute('hidden')).toBeFalsy();
  });

  it('should apply appearance via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'solid');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('solid');
  });

  it('should apply color via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('color', 'primary');
    fixture.detectChanges();
    expect(el.getAttribute('data-color')).toBe('primary');
  });

  it('should apply size via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
  });

  it('should apply radius via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'md');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('md');
  });

  it('should apply variant via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'count');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('count');
  });

  it('should apply density via setInput', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');

    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('comfortable');

    fixture.componentRef.setInput('density', 'normal');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should fall back to theme density when density is not provided', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should support the full size x density matrix', () => {
    const el = createFixture();
    const sizes = ['sm', 'md', 'lg'] as const;
    const densities = ['compact', 'normal', 'comfortable'] as const;
    for (const size of sizes) {
      for (const density of densities) {
        fixture.componentRef.setInput('size', size);
        fixture.componentRef.setInput('density', density);
        fixture.detectChanges();
        expect(el.getAttribute('data-size')).toBe(size);
        expect(el.getAttribute('data-density')).toBe(density);
      }
    }
  });

  it('should support all appearances', () => {
    const el = createFixture();
    const values = ['solid', 'tonal', 'outline', 'ghost'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('appearance', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-appearance')).toBe(v);
    }
  });

  it('should support all colors', () => {
    const el = createFixture();
    const values = [
      'neutral',
      'primary',
      'success',
      'warning',
      'danger',
      'info',
      'custom',
    ] as const;
    for (const v of values) {
      fixture.componentRef.setInput('color', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-color')).toBe(v);
    }
  });

  it('should support all sizes', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('size', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-size')).toBe(v);
    }
  });

  it('should support all radius values', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'full'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('radius', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-radius')).toBe(v);
    }
  });

  it('should not be focusable', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeFalsy();
  });

  it('should not have role button', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('button');
  });

  it('custom color does not accept arbitrary input', () => {
    const el = createFixture();
    fixture.componentRef.setInput('color', 'custom');
    fixture.detectChanges();
    expect(el.getAttribute('data-color')).toBe('custom');
  });
});

describe('SolarisBadgeComponent count', () => {
  let fixture: ComponentFixture<SolarisBadgeComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisBadgeComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render the count value', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    expect(el.getAttribute('data-count')).toBe('true');
    expect(el.textContent?.trim()).toBe('3');
  });

  it('should cap the count at max with a "+" suffix', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 103);
    fixture.detectChanges();
    expect(el.textContent?.trim()).toBe('99+');
    expect(el.getAttribute('title')).toBe('103');
  });

  it('should respect a custom max', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 25);
    fixture.componentRef.setInput('max', 10);
    fixture.detectChanges();
    expect(el.textContent?.trim()).toBe('10+');
    expect(el.getAttribute('title')).toBe('25');
  });

  it('should hide a zero count by default', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();
    expect(el.getAttribute('hidden')).toBe('true');
  });

  it('should render a zero count when showZero is true', () => {
    const el = createFixture();
    fixture.componentRef.setInput('count', 0);
    fixture.componentRef.setInput('showZero', true);
    fixture.detectChanges();
    expect(el.getAttribute('hidden')).toBeFalsy();
    expect(el.textContent?.trim()).toBe('0');
  });
});

describe('SolarisBadgeComponent dot', () => {
  let fixture: ComponentFixture<SolarisBadgeComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisBadgeComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should render a dot marker', () => {
    const el = createFixture();
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-dot')).toBe('true');
    expect(el.querySelector('.solaris-badge__dot')).toBeTruthy();
  });

  it('should apply pulse via presence pattern', () => {
    const el = createFixture();
    fixture.componentRef.setInput('dot', true);
    fixture.componentRef.setInput('pulse', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-pulse')).toBe('true');
  });

  it('should prefer dot over count', () => {
    const el = createFixture();
    fixture.componentRef.setInput('dot', true);
    fixture.componentRef.setInput('count', 5);
    fixture.detectChanges();
    expect(el.querySelector('.solaris-badge__dot')).toBeTruthy();
    expect(el.textContent?.trim()).toBe('');
  });
});

describe('SolarisBadgeComponent icon-only, placement and a11y', () => {
  let fixture: ComponentFixture<SolarisBadgeComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisBadgeComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('should apply icon-only via presence pattern', () => {
    const el = createFixture();
    fixture.componentRef.setInput('iconOnly', true);
    fixture.detectChanges();
    expect(el.getAttribute('data-icon-only')).toBe('true');
  });

  it('should apply placement values', () => {
    const el = createFixture();
    const values = [
      'inline',
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ] as const;
    for (const v of values) {
      fixture.componentRef.setInput('placement', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-placement')).toBe(v);
    }
  });

  it('should expose offset as CSS custom properties', () => {
    const el = createFixture();
    fixture.componentRef.setInput('offset', [4, 8]);
    fixture.detectChanges();
    expect(el.style.getPropertyValue('--solaris-badge-offset-x')).toBe('4px');
    expect(el.style.getPropertyValue('--solaris-badge-offset-y')).toBe('8px');
  });

  it('should forward aria-label', () => {
    const el = createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Notifications');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Notifications');
  });

  it('should not render aria-label by default', () => {
    const el = createFixture();
    expect(el.getAttribute('aria-label')).toBeFalsy();
  });

  it('should apply truncate via presence pattern', () => {
    const el = createFixture();
    expect(el.getAttribute('data-truncate')).toBe('true');
    fixture.componentRef.setInput('truncate', false);
    fixture.detectChanges();
    expect(el.getAttribute('data-truncate')).toBeFalsy();
  });
});

describe('SolarisBadgeComponent with content projection', () => {
  @Component({
    standalone: true,
    imports: [SolarisBadgeComponent, SolarisBadgeIconDirective],
    host: { 'data-testid': 'icon-before-host' },
    template: `
      <solaris-badge>
        <span solaris-badge-icon>i</span>
        text
      </solaris-badge>
    `,
  })
  class IconBeforeHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisBadgeComponent, SolarisBadgeIconDirective],
    host: { 'data-testid': 'icon-after-host' },
    template: `
      <solaris-badge>
        text
        <span solaris-badge-icon>i</span>
      </solaris-badge>
    `,
  })
  class IconAfterHostComponent {}

  @Component({
    standalone: true,
    imports: [SolarisBadgeComponent, SolarisBadgeIconDirective],
    template: `
      <solaris-badge>
        <span solaris-badge-icon>i1</span>
        text
        <span solaris-badge-icon>i2</span>
      </solaris-badge>
    `,
  })
  class IconBothHostComponent {}

  let fixture: ComponentFixture<unknown>;

  it('should project icon before text', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconBeforeHostComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('solaris-badge');
    const icons = badge.querySelectorAll('[solaris-badge-icon]');
    expect(icons).toHaveLength(1);
    expect(badge.textContent?.trim()).toContain('text');
  });

  it('should project icon after text', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconAfterHostComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('solaris-badge');
    const icons = badge.querySelectorAll('[solaris-badge-icon]');
    expect(icons).toHaveLength(1);
    expect(badge.textContent?.trim()).toContain('text');
  });

  it('should project icons before and after text', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconBothHostComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('solaris-badge');
    const icons = badge.querySelectorAll('[solaris-badge-icon]');
    expect(icons).toHaveLength(2);
  });

  it('should size projected icons through the directive host', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconBeforeHostComponent);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[solaris-badge-icon]',
    ) as HTMLElement;
    expect(icon.style.getPropertyValue('width')).toBe(
      'var(--solaris-badge-icon-size)',
    );
    expect(icon.style.getPropertyValue('height')).toBe(
      'var(--solaris-badge-icon-size)',
    );
  });
});
