import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { SolarisAlertComponent } from '../component/alert.component';
import { SolarisAlertTitleDirective } from '../directives/alert-title.directive';
import { SolarisAlertDescriptionDirective } from '../directives/alert-description.directive';
import { SolarisAlertActionsComponent } from '../component/alert-actions.component';
import { provideSolaris } from '../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../services/icon/icons/solaris-built-in-icons';

describe('SolarisAlertComponent', () => {
  let fixture: ComponentFixture<SolarisAlertComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    fixture = TestBed.createComponent(SolarisAlertComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have default variant info', () => {
    const el = createFixture();
    expect(el.getAttribute('data-variant')).toBe('info');
  });

  it('should have default appearance tonal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-appearance')).toBe('tonal');
  });

  it('should have default radius md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).toBe('md');
  });

  it('should not be focusable by default', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeFalsy();
  });

  it('should not have role button', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).not.toBe('button');
  });

  it('should not emit click behavior', () => {
    const el = createFixture();
    expect(el.onclick).toBeNull();
  });

  it('should apply variant neutral', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'neutral');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('neutral');
  });

  it('should apply variant info', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'info');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('info');
  });

  it('should apply variant success', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('success');
  });

  it('should apply variant warning', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('warning');
  });

  it('should apply variant danger', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('danger');
  });

  it('should apply variant custom', () => {
    const el = createFixture();
    fixture.componentRef.setInput('variant', 'custom');
    fixture.detectChanges();
    expect(el.getAttribute('data-variant')).toBe('custom');
  });

  it('should apply appearance tonal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'tonal');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('tonal');
  });

  it('should apply appearance outline', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('outline');
  });

  it('should apply appearance surface', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'surface');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('surface');
  });

  it('should apply appearance solid', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'solid');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('solid');
  });

  it('should apply radius sm', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'sm');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('sm');
  });

  it('should apply radius md', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'md');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('md');
  });

  it('should apply radius lg', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('lg');
  });

  it('should apply radius xl', () => {
    const el = createFixture();
    fixture.componentRef.setInput('radius', 'xl');
    fixture.detectChanges();
    expect(el.getAttribute('data-radius')).toBe('xl');
  });

  it('should apply density compact', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply density comfortable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });

  it('should apply density normal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'normal');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should support all variants', () => {
    const el = createFixture();
    const values = [
      'neutral',
      'info',
      'success',
      'warning',
      'danger',
      'custom',
    ] as const;
    for (const v of values) {
      fixture.componentRef.setInput('variant', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-variant')).toBe(v);
    }
  });

  it('should support all appearances', () => {
    const el = createFixture();
    const values = ['tonal', 'outline', 'surface', 'solid'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('appearance', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-appearance')).toBe(v);
    }
  });

  it('should support all radius values', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg', 'xl'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('radius', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-radius')).toBe(v);
    }
  });

  it('should not have radius full', () => {
    const el = createFixture();
    expect(el.getAttribute('data-radius')).not.toBe('full');
  });
});

describe('SolarisAlertComponent - Closable', () => {
  let fixture: ComponentFixture<SolarisAlertComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    fixture = TestBed.createComponent(SolarisAlertComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should not render close button when closable is false', () => {
    const el = createFixture();
    expect(el.querySelector('.solaris-alert__close')).toBeNull();
  });

  it('should render close button when closable is true', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    expect(btn).toBeTruthy();
  });

  it('close button should have type button', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('close button should have accessible name', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });

  it('close button should use solaris-icon', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    const icon = btn.querySelector('solaris-icon');
    expect(icon).toBeTruthy();
  });

  it('close button should not use textual "x"', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    expect(btn.textContent?.trim()).not.toBe('x');
  });

  it('should emit dismissed when close button is clicked', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    const spy = vi.spyOn(fixture.componentRef.instance.dismissed, 'emit');
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not remove content after dismissed', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    btn.click();
    fixture.detectChanges();
    expect(el.querySelector('.solaris-alert__content')).toBeTruthy();
  });
});

describe('SolarisAlertComponent - Live', () => {
  let fixture: ComponentFixture<SolarisAlertComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    fixture = TestBed.createComponent(SolarisAlertComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should not have role when live is off', () => {
    const el = createFixture();
    fixture.componentRef.setInput('live', 'off');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBeNull();
    expect(el.getAttribute('aria-live')).toBeNull();
  });

  it('should have role status when live is polite', () => {
    const el = createFixture();
    fixture.componentRef.setInput('live', 'polite');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should have role alert when live is assertive', () => {
    const el = createFixture();
    fixture.componentRef.setInput('live', 'assertive');
    fixture.detectChanges();
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.getAttribute('aria-live')).toBe('assertive');
  });
});

describe('SolarisAlertComponent - Icon', () => {
  let fixture: ComponentFixture<SolarisAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    fixture = TestBed.createComponent(SolarisAlertComponent);
    fixture.detectChanges();
  });

  it('should render icon by default', () => {
    const el = fixture.nativeElement;
    const icon = el.querySelector('.solaris-alert__icon solaris-icon');
    expect(icon).toBeTruthy();
  });

  it('should not render icon when showIcon is false', () => {
    fixture.componentRef.setInput('showIcon', false);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.solaris-alert__icon');
    expect(icon).toBeNull();
  });

  it('should use default icon for info variant', () => {
    fixture.componentRef.setInput('variant', 'info');
    fixture.detectChanges();
    expect((fixture.componentRef.instance as any).iconName()).toBe('info');
  });

  it('should use default icon for success variant', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    expect((fixture.componentRef.instance as any).iconName()).toBe('success');
  });

  it('should use default icon for warning variant', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();
    expect((fixture.componentRef.instance as any).iconName()).toBe('warning');
  });

  it('should use default icon for danger variant', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect((fixture.componentRef.instance as any).iconName()).toBe('danger');
  });

  it('should use default icon for neutral variant', () => {
    fixture.componentRef.setInput('variant', 'neutral');
    fixture.detectChanges();
    expect((fixture.componentRef.instance as any).iconName()).toBe('info');
  });

  it('should use custom icon when provided', () => {
    fixture.componentRef.setInput('icon', 'check');
    fixture.detectChanges();
    expect((fixture.componentRef.instance as any).iconName()).toBe('check');
  });

  it('should render icon element as decorative', () => {
    const svg = fixture.nativeElement.querySelector(
      '.solaris-alert__icon solaris-icon svg',
    );
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SolarisAlertComponent with content projection', () => {
  @Component({
    standalone: true,
    imports: [SolarisAlertComponent],
    template: '<solaris-alert>Free content</solaris-alert>',
    providers: [
      provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
  })
  class FreeContentHostComponent {}

  @Component({
    standalone: true,
    imports: [
      SolarisAlertComponent,
      SolarisAlertTitleDirective,
      SolarisAlertDescriptionDirective,
      SolarisAlertActionsComponent,
    ],
    providers: [
      provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    ],
    template: `
      <solaris-alert>
        <h3 solaris-alert-title>Title</h3>
        <p solaris-alert-description>Description</p>
        <solaris-alert-actions>
          <a href="#">Link</a>
        </solaris-alert-actions>
      </solaris-alert>
    `,
  })
  class FullAnatomyHostComponent {}

  let fixture: ComponentFixture<FreeContentHostComponent>;

  it('should project free content without wrappers', () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(FreeContentHostComponent);
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('solaris-alert');
    expect(alert.textContent).toContain('Free content');
  });

  it('should project all anatomy elements', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const alert = f.nativeElement.querySelector('solaris-alert');
    expect(alert.querySelector('[solaris-alert-title]')).toBeTruthy();
    expect(alert.querySelector('[solaris-alert-description]')).toBeTruthy();
    expect(alert.querySelector('solaris-alert-actions')).toBeTruthy();
  });

  it('should render title directive inside alert', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const title = f.nativeElement.querySelector('[solaris-alert-title]');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Title');
  });

  it('should render description directive inside alert', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const desc = f.nativeElement.querySelector('[solaris-alert-description]');
    expect(desc).toBeTruthy();
    expect(desc.textContent).toBe('Description');
  });

  it('should project links inside alert', () => {
    TestBed.configureTestingModule({});
    const f = TestBed.createComponent(FullAnatomyHostComponent);
    f.detectChanges();
    const link = f.nativeElement.querySelector('solaris-alert-actions a');
    expect(link).toBeTruthy();
    expect(link.textContent).toBe('Link');
  });
});

describe('SolarisAlertComponent - Accessibility', () => {
  let fixture: ComponentFixture<SolarisAlertComponent>;

  const createFixture = () => {
    TestBed.configureTestingModule({
      providers: [
        provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
      ],
    });
    fixture = TestBed.createComponent(SolarisAlertComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('container should not be tabbable', () => {
    const el = createFixture();
    expect(el.getAttribute('tabindex')).toBeFalsy();
    expect(el.getAttribute('role')).not.toBe('button');
  });

  it('close button should be in tab order when closable', () => {
    const el = createFixture();
    fixture.componentRef.setInput('closable', true);
    fixture.detectChanges();
    const btn = el.querySelector('.solaris-alert__close');
    expect(btn.getAttribute('type')).toBe('button');
  });
});
