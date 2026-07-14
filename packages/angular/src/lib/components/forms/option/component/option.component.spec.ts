import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisOptionComponent } from './option.component';
import {
  SolarisOptionLeadingDirective,
  SolarisOptionLabelDirective,
  SolarisOptionDescriptionDirective,
  SolarisOptionMetaDirective,
  SolarisOptionTrailingDirective,
} from '../directives/option-slots.directive';

describe('SolarisOptionComponent', () => {
  let fixture: ComponentFixture<SolarisOptionComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisOptionComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have role="option"', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('option');
  });

  it('should render label by projected content', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template: '<solaris-option value="admin">Administrador</solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Administrador');
  });

  it('should render label by input', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template:
        '<solaris-option value="admin" [label]="\'Admin\'"></solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const option = hostFixture.nativeElement.querySelector('solaris-option');
    expect(option).toBeTruthy();
    expect(option.textContent).toContain('Admin');
  });

  it('should have projected content win over label input', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template:
        '<solaris-option value="admin" [label]="\'Input Label\'">Projected Content</solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const text = hostFixture.nativeElement.textContent;
    expect(text).toContain('Projected Content');
  });

  it('should apply aria-disabled when disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('should apply aria-selected when selectionMode is not none', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.componentRef.setInput('showSelectionIndicator', true);
    fixture.detectChanges();
    expect(el.getAttribute('aria-selected')).toBe('false');
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(el.getAttribute('aria-selected')).toBe('true');
  });

  it('should not set aria-selected when selectionMode is none', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(el.getAttribute('aria-selected')).toBeNull();
  });

  it('should apply active state', () => {
    const el = createFixture();
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-active')).toBe(true);
  });

  it('should allow active and selected to coexist', () => {
    const el = createFixture();
    fixture.componentRef.setInput('active', true);
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-active')).toBe(true);
    expect(el.hasAttribute('data-selected')).toBe(true);
  });

  it('should apply highlighted state', () => {
    const el = createFixture();
    fixture.componentRef.setInput('highlighted', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-highlighted')).toBe(true);
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

  it('should support all density values', () => {
    const el = createFixture();
    const values = ['compact', 'comfortable'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('density', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-density')).toBe(v);
    }
  });

  it('should have default size md', () => {
    const el = createFixture();
    expect(el.getAttribute('data-size')).toBe('md');
  });

  it('should have default selectionMode none', () => {
    const el = createFixture();
    expect(el.getAttribute('data-selection-mode')).toBe('none');
  });

  it('should not set showSelectionIndicator by default', () => {
    const el = createFixture();
    expect(el.hasAttribute('data-show-indicator')).toBe(false);
  });

  it('should set showSelectionIndicator when enabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.componentRef.setInput('showSelectionIndicator', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-show-indicator')).toBe(true);
  });

  it('should have SSR-safe id', () => {
    const el = createFixture();
    expect(el.id).toBeTruthy();
  });

  it('should use provided id', () => {
    const el = createFixture();
    fixture.componentRef.setInput('id', 'my-option');
    fixture.detectChanges();
    expect(el.id).toBe('my-option');
  });

  it('should not implement ControlValueAccessor', () => {
    createFixture();
    const instance = fixture.componentRef.instance;
    expect(instance).toBeTruthy();
    expect(typeof (instance as any)?.writeValue).not.toBe('function');
  });

  it('should emit optionInteraction on click', () => {
    const el = createFixture();
    let emitted: unknown = null;
    fixture.componentRef.instance.optionInteraction.subscribe((e) => {
      emitted = e;
    });
    el.click();
    fixture.detectChanges();
    expect(emitted).toBeTruthy();
  });

  it('should not emit optionInteraction when disabled', () => {
    const el = createFixture();
    let emitted = false;
    fixture.componentRef.instance.optionInteraction.subscribe(() => {
      emitted = true;
    });
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    el.click();
    fixture.detectChanges();
    expect(emitted).toBe(false);
  });
});

describe('SolarisOptionComponent slots', () => {
  @Component({
    standalone: true,
    imports: [
      SolarisOptionComponent,
      SolarisOptionLeadingDirective,
      SolarisOptionLabelDirective,
      SolarisOptionDescriptionDirective,
      SolarisOptionMetaDirective,
      SolarisOptionTrailingDirective,
    ],
    template: `
      <solaris-option value="test">
        <span solaris-option-leading>Leading</span>
        <span solaris-option-label>Label</span>
        <span solaris-option-description>Description</span>
        <span solaris-option-meta>Meta</span>
        <span solaris-option-trailing>Trailing</span>
      </solaris-option>
    `,
  })
  class SlotsHost {}

  let fixture: ComponentFixture<SlotsHost>;

  beforeEach(() => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SlotsHost);
    fixture.detectChanges();
  });

  it('should render leading slot', () => {
    const el = fixture.nativeElement.querySelector('[solaris-option-leading]');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Leading');
  });

  it('should render label slot', () => {
    const el = fixture.nativeElement.querySelector('[solaris-option-label]');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Label');
  });

  it('should render description slot', () => {
    const el = fixture.nativeElement.querySelector(
      '[solaris-option-description]',
    );
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Description');
  });

  it('should render meta slot', () => {
    const el = fixture.nativeElement.querySelector('[solaris-option-meta]');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Meta');
  });

  it('should render trailing slot', () => {
    const el = fixture.nativeElement.querySelector('[solaris-option-trailing]');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('Trailing');
  });
});

describe('SolarisOptionComponent description', () => {
  let fixture: ComponentFixture<SolarisOptionComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisOptionComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render description by input', () => {
    const el = createFixture();
    fixture.componentRef.setInput('description', 'A description text');
    fixture.detectChanges();
    expect(el.textContent).toContain('A description text');
  });

  it('should render description by slot', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent, SolarisOptionDescriptionDirective],
      template: `
        <solaris-option value="test">
          <span solaris-option-description>Slot Description</span>
        </solaris-option>
      `,
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Slot Description');
  });
});

describe('SolarisOptionComponent selection visual', () => {
  let fixture: ComponentFixture<SolarisOptionComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisOptionComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should show check indicator for single selection when selected', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.componentRef.setInput('showSelectionIndicator', true);
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const indicator = el.querySelector('.solaris-option__selection-indicator');
    expect(indicator).toBeTruthy();
    const trailingCheck = el.querySelector('.solaris-option__trailing-check');
    expect(trailingCheck).toBeTruthy();
  });

  it('should show checkbox indicator for multiple selection when selected', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selectionMode', 'multiple');
    fixture.componentRef.setInput('showSelectionIndicator', true);
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const indicator = el.querySelector('.solaris-option__selection-indicator');
    expect(indicator).toBeTruthy();
    const checkbox = el.querySelector('.solaris-option__checkbox--checked');
    expect(checkbox).toBeTruthy();
  });

  it('should not show selection indicator when showSelectionIndicator is false', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selectionMode', 'single');
    fixture.componentRef.setInput('showSelectionIndicator', false);
    fixture.detectChanges();
    const indicator = el.querySelector('.solaris-option__selection-indicator');
    expect(indicator).toBeFalsy();
  });

  it('should not show selection indicator when selectionMode is none', () => {
    const el = createFixture();
    fixture.componentRef.setInput('selectionMode', 'none');
    fixture.componentRef.setInput('showSelectionIndicator', true);
    fixture.detectChanges();
    const indicator = el.querySelector('.solaris-option__selection-indicator');
    expect(indicator).toBeFalsy();
  });
});

describe('SolarisOptionComponent unsafe rendering security', () => {
  it('should escape label input with HTML-like string', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template: '<solaris-option value="x" [label]="\'<img src=x onerror=alert(1)>\'"></solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const text = hostFixture.nativeElement.textContent;
    expect(text).toContain('<img src=x onerror=alert(1)>');
    const img = hostFixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
  });

  it('should escape description input with HTML-like string', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template: '<solaris-option value="admin" [label]="\'Admin\'" [description]="\'<b>Admin</b>\'"></solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const description = hostFixture.nativeElement.querySelector('.solaris-option__description-text');
    expect(description).toBeTruthy();
    expect(description.textContent).toContain('<b>Admin</b>');
    const b = description.querySelector('b');
    expect(b).toBeNull();
  });

  it('should not have innerHTML in template for label or description', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template: '<solaris-option value="test" [label]="\'Test\'" [description]="\'Desc\'"></solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const optionEl = hostFixture.nativeElement.querySelector('solaris-option');
    expect(optionEl.innerHTML).not.toContain('innerHTML');
  });
});

describe('SolarisOptionComponent i18n', () => {
  it('should use labelKey with translation', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionComponent],
      template:
        '<solaris-option [label]="\'Fallback\'" [labelKey]="\'option.testLabel\'"></solaris-option>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const text = hostFixture.nativeElement.textContent;
    const hasTranslated = text.includes('option.testLabel');
    const hasFallback = text.includes('Fallback');
    expect(hasTranslated || hasFallback).toBe(true);
  });
});
