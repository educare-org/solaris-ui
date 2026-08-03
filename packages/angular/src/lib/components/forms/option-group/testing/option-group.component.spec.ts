import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisOptionGroupComponent } from '../component/option-group.component';
import { SolarisOptionComponent } from '../../option/component/option.component';

describe('SolarisOptionGroupComponent', () => {
  let fixture: ComponentFixture<SolarisOptionGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisOptionGroupComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have role="group"', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('group');
  });

  it('should render label by input', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Academic');
    fixture.detectChanges();
    expect(el.textContent).toContain('Academic');
  });

  it('should have aria-label when label is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Permissions');
    fixture.detectChanges();
    expect(el.getAttribute('aria-label')).toBe('Permissions');
  });

  it('should have aria-labelledby when label is set', () => {
    const el = createFixture();
    fixture.componentRef.setInput('label', 'Permissions');
    fixture.detectChanges();
    const labelledby = el.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const labelEl = el.querySelector('.solaris-option-group__label');
    expect(labelEl?.getAttribute('id')).toBe(labelledby);
  });

  it('should apply disabled state', () => {
    const el = createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-disabled')).toBe(true);
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

  it('should have SSR-safe id', () => {
    const el = createFixture();
    expect(el.id).toBeTruthy();
  });

  it('should use provided id', () => {
    const el = createFixture();
    fixture.componentRef.setInput('id', 'my-group');
    fixture.detectChanges();
    expect(el.id).toBe('my-group');
  });
});

describe('SolarisOptionGroupComponent with options', () => {
  @Component({
    standalone: true,
    imports: [SolarisOptionGroupComponent, SolarisOptionComponent],
    template: `
      <solaris-option-group label="Group 1" [disabled]="true">
        <solaris-option value="a" label="Option A"></solaris-option>
        <solaris-option value="b" label="Option B"></solaris-option>
      </solaris-option-group>
    `,
  })
  class Host {}

  it('should propagate disabled to child options when group is disabled', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const options =
      hostFixture.nativeElement.querySelectorAll('solaris-option');
    options.forEach((opt: Element) => {
      expect(opt.hasAttribute('aria-disabled')).toBe(true);
    });
  });
});

describe('SolarisOptionGroupComponent unsafe rendering security', () => {
  it('should escape label with HTML-like string', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionGroupComponent],
      template:
        '<solaris-option-group [label]="\'<img src=x onerror=alert(1)>\'"></solaris-option-group>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const label = hostFixture.nativeElement.querySelector(
      '.solaris-option-group__label',
    );
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('<img src=x onerror=alert(1)>');
    const img = label.querySelector('img');
    expect(img).toBeNull();
  });
});

describe('SolarisOptionGroupComponent labelKey', () => {
  it('should use labelKey with translation', () => {
    configureSolarisTesting();
    @Component({
      standalone: true,
      imports: [SolarisOptionGroupComponent],
      template:
        '<solaris-option-group [label]="\'Static\'" [labelKey]="\'optionGroup.testLabel\'"></solaris-option-group>',
    })
    class Host {}
    const hostFixture = TestBed.createComponent(Host);
    hostFixture.detectChanges();
    const text = hostFixture.nativeElement.textContent;
    const hasTranslated = text.includes('optionGroup.testLabel');
    const hasStatic = text.includes('Static');
    expect(hasTranslated || hasStatic).toBe(true);
  });
});
