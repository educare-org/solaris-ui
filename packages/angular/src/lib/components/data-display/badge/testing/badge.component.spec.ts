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
    return fixture.nativeElement;
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

describe('SolarisBadgeComponent with content projection', () => {
  @Component({
    standalone: true,
    imports: [SolarisBadgeComponent, SolarisBadgeIconDirective],
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
    expect(icons.length).toBe(1);
    expect(badge.textContent?.trim()).toContain('text');
  });

  it('should project icon after text', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconAfterHostComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('solaris-badge');
    const icons = badge.querySelectorAll('[solaris-badge-icon]');
    expect(icons.length).toBe(1);
    expect(badge.textContent?.trim()).toContain('text');
  });

  it('should project icons before and after text', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(IconBothHostComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('solaris-badge');
    const icons = badge.querySelectorAll('[solaris-badge-icon]');
    expect(icons.length).toBe(2);
  });
});
