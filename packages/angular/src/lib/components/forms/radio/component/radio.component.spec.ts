import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisRadioComponent } from './radio.component';

describe('SolarisRadioComponent', () => {
  let fixture: ComponentFixture<SolarisRadioComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisRadioComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should use native input type="radio"', () => {
    createFixture();
    const input = getNativeInput();
    expect(input.getAttribute('type')).toBe('radio');
  });

  it('should have default checked false', () => {
    createFixture();
    const input = getNativeInput();
    expect(input.checked).toBe(false);
  });

  it('should apply checked true', () => {
    const el = createFixture();
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-checked')).toBe(true);
  });

  it('should apply disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-disabled')).toBe(true);
    const input = getNativeInput();
    expect(input.disabled).toBe(true);
  });

  it('should apply readonly', () => {
    const el = createFixture();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-readonly')).toBe(true);
  });

  it('should apply required', () => {
    createFixture();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const input = getNativeInput();
    expect(input.required).toBe(true);
  });

  it('should apply appearance default outline', () => {
    const el = createFixture();
    expect(el.getAttribute('data-appearance')).toBe('outline');
  });

  it('should apply appearance surface', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'surface');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('surface');
  });

  it('should support all appearances', () => {
    const el = createFixture();
    const values = ['outline', 'surface'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('appearance', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-appearance')).toBe(v);
    }
  });

  it('should have default color primary', () => {
    const el = createFixture();
    expect(el.getAttribute('data-color')).toBe('primary');
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

  it('should support all density values', () => {
    const el = createFixture();
    const values = ['compact', 'comfortable'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('density', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-density')).toBe(v);
    }
  });

  it('should have default density comfortable', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });
});

describe('SolarisRadioComponent interaction', () => {
  let fixture: ComponentFixture<SolarisRadioComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisRadioComponent);
    fixture.detectChanges();
    return fixture;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
  };

  it('should check on click when enabled', () => {
    createFixture();
    const input = getNativeInput();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true);
  });

  it('should not check when disabled', () => {
    createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const input = getNativeInput();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should not check when readonly', () => {
    createFixture();
    const input = getNativeInput();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });
});

describe('SolarisRadioComponent outputs', () => {
  let fixture: ComponentFixture<SolarisRadioComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisRadioComponent);
    fixture.detectChanges();
    return fixture;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
  };

  it('should emit checkedChange on user interaction', () => {
    createFixture();
    let emitted: boolean | undefined;
    fixture.componentRef.instance.checkedChange.subscribe((v: boolean) => {
      emitted = v;
    });
    fixture.detectChanges();
    const input = getNativeInput();
    input.click();
    fixture.detectChanges();
    expect(emitted).toBe(true);
  });

  it('should emit change on user interaction', () => {
    createFixture();
    let emitted = false;
    fixture.componentRef.instance.change.subscribe(() => {
      emitted = true;
    });
    fixture.detectChanges();
    const input = getNativeInput();
    input.click();
    fixture.detectChanges();
    expect(emitted).toBe(true);
  });

  it('should not emit checkedChange/change when disabled', () => {
    createFixture();
    let emittedChecked = false;
    let emittedChange = false;
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.instance.checkedChange.subscribe(() => {
      emittedChecked = true;
    });
    fixture.componentRef.instance.change.subscribe(() => {
      emittedChange = true;
    });
    fixture.detectChanges();
    const input = getNativeInput();
    input.click();
    fixture.detectChanges();
    expect(emittedChecked).toBe(false);
    expect(emittedChange).toBe(false);
  });
});

describe('SolarisRadioComponent ControlValueAccessor', () => {
  let fixture: ComponentFixture<SolarisRadioComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisRadioComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('writeValue(true) should mark checked', () => {
    createFixture();
    fixture.componentRef.instance.writeValue(true);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.hasAttribute('data-checked')).toBe(true);
  });

  it('writeValue(false) should uncheck', () => {
    createFixture();
    fixture.componentRef.instance.writeValue(true);
    fixture.detectChanges();
    fixture.componentRef.instance.writeValue(false);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.hasAttribute('data-checked')).toBe(false);
  });

  it('registerOnTouched should be called on blur', () => {
    createFixture();
    let touched = false;
    fixture.componentRef.instance.registerOnTouched(() => {
      touched = true;
    });
    const input = fixture.nativeElement.querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(touched).toBe(true);
  });

  it('setDisabledState(true) should disable', () => {
    createFixture();
    fixture.componentRef.instance.setDisabledState(true);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('setDisabledState(false) should enable', () => {
    createFixture();
    fixture.componentRef.instance.setDisabledState(true);
    fixture.detectChanges();
    fixture.componentRef.instance.setDisabledState(false);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.hasAttribute('data-disabled')).toBe(false);
  });
});

describe('SolarisRadioComponent label and a11y', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioComponent],
    template: ` <solaris-radio> Option A </solaris-radio> `,
  })
  class ProjectedLabelHost {}

  @Component({
    standalone: true,
    imports: [SolarisRadioComponent],
    template: ` <solaris-radio ariaLabel="Option A" /> `,
  })
  class AriaLabelHost {}

  it('should render projected content as label', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ProjectedLabelHost);
    hostFixture.detectChanges();
    const text = (hostFixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Option A');
  });

  it('should render label via input', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisRadioComponent);
    hostFixture.componentRef.setInput('label', 'Option B');
    hostFixture.detectChanges();
    const instance = hostFixture.componentRef.instance;
    expect(
      (
        instance as unknown as { labelText: () => string | undefined }
      ).labelText(),
    ).toBe('Option B');
  });

  it('should have aria-label on native input when ariaLabel is set', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(AriaLabelHost);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Option A');
  });

  it('should have native input with id', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisRadioComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });

  it('should associate label with input via for attribute', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisRadioComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="radio"]',
    ) as HTMLInputElement;
    const label = (hostFixture.nativeElement as HTMLElement).querySelector(
      '.solaris-radio__label',
    ) as HTMLLabelElement;
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('should render dot element when checked', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisRadioComponent);
    hostFixture.componentRef.setInput('checked', true);
    hostFixture.detectChanges();
    const dot = (hostFixture.nativeElement as HTMLElement).querySelector(
      '.solaris-radio__dot',
    );
    expect(dot).toBeTruthy();
  });

  it('should not render dot element when unchecked', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisRadioComponent);
    hostFixture.detectChanges();
    const dot = (hostFixture.nativeElement as HTMLElement).querySelector(
      '.solaris-radio__dot',
    );
    expect(dot).toBeFalsy();
  });
});
