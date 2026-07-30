import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisCheckboxComponent } from '../component/checkbox.component';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

describe('SolarisCheckboxComponent', () => {
  let fixture: ComponentFixture<SolarisCheckboxComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCheckboxComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should use native input type="checkbox"', () => {
    createFixture();
    const input = getNativeInput();
    expect(input.getAttribute('type')).toBe('checkbox');
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

  it('should set indeterminate on native input', () => {
    createFixture();
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    const input = getNativeInput();
    expect(input.indeterminate).toBe(true);
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
});

describe('SolarisCheckboxComponent interaction', () => {
  let fixture: ComponentFixture<SolarisCheckboxComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCheckboxComponent);
    fixture.detectChanges();
    return fixture;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
  };

  it('should toggle checked on click when enabled', () => {
    createFixture();
    const input = getNativeInput();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should not toggle when disabled', () => {
    createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const input = getNativeInput();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should not toggle when readonly', () => {
    createFixture();
    const input = getNativeInput();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should clear indeterminate and set checked on interaction', () => {
    createFixture();
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    const input = getNativeInput();
    expect(input.indeterminate).toBe(true);
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true);
  });
});

describe('SolarisCheckboxComponent outputs', () => {
  let fixture: ComponentFixture<SolarisCheckboxComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCheckboxComponent);
    fixture.detectChanges();
    return fixture;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
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

  it('should not emit checkedChange/change when readonly', () => {
    createFixture();
    let emittedChecked = false;
    let emittedChange = false;
    fixture.componentRef.setInput('readonly', true);
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

describe('SolarisCheckboxComponent ControlValueAccessor', () => {
  let fixture: ComponentFixture<SolarisCheckboxComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCheckboxComponent);
    fixture.detectChanges();
    return fixture;
  };

  const getNativeInput = (): HTMLInputElement => {
    return fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
  };

  it('writeValue(true) should mark checked', () => {
    createFixture();
    fixture.componentRef.instance.writeValue(true);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.hasAttribute('data-checked')).toBe(true);
    const input = getNativeInput();
    expect(input.checked).toBe(true);
  });

  it('writeValue(false) should uncheck', () => {
    createFixture();
    fixture.componentRef.setInput('checked', true);
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
    const input = getNativeInput();
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

describe('SolarisCheckboxComponent label and a11y', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxComponent],
    template: ` <solaris-checkbox> Accept terms </solaris-checkbox> `,
  })
  class ProjectedLabelHost {}
  @Component({
    standalone: true,
    imports: [SolarisCheckboxComponent],
    template: ` <solaris-checkbox ariaLabel="Accept terms" /> `,
  })
  class AriaLabelHost {}

  it('should render projected content as label', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ProjectedLabelHost);
    hostFixture.detectChanges();
    const text = (hostFixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Accept terms');
  });

  it('should have aria-label on native input when ariaLabel is set', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(AriaLabelHost);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Accept terms');
  });

  it('should have native input with id', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisCheckboxComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });

  it('should associate label with input via for attribute', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisCheckboxComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    const label = (hostFixture.nativeElement as HTMLElement).querySelector(
      '.solaris-checkbox__label',
    ) as HTMLLabelElement;
    expect(label.getAttribute('for')).toBe(input.id);
  });
});

describe('SolarisCheckboxComponent with Reactive Forms', () => {
  @Component({
    standalone: true,
    imports: [ReactiveFormsModule, SolarisCheckboxComponent],
    template: ` <solaris-checkbox [formControl]="control" /> `,
  })
  class ReactiveFormHost {
    readonly control = new FormControl(false);
  }

  it('should work with formControl', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ReactiveFormHost);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(false);
    hostFixture.componentInstance.control.setValue(true);
    hostFixture.detectChanges();
    expect(input.checked).toBe(true);
  });

  it('should update form control on toggle', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ReactiveFormHost);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    input.click();
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.control.value).toBe(true);
  });

  it('should reflect disabled state from form control', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ReactiveFormHost);
    hostFixture.detectChanges();
    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-checkbox',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('SolarisCheckboxComponent inside FormField', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisCheckboxComponent,
      SolarisFormFieldComponent,
    ],
    template: `
      <solaris-form-field label="Accept terms">
        <solaris-checkbox>Accept terms</solaris-checkbox>
      </solaris-form-field>
    `,
  })
  class CheckboxInFormFieldHost {}

  it('should render checkbox inside form field', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(CheckboxInFormFieldHost);
    hostFixture.detectChanges();
    const checkbox = (hostFixture.nativeElement as HTMLElement).querySelector(
      'solaris-checkbox',
    );
    expect(checkbox).toBeTruthy();
    const formField = (hostFixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-field',
    );
    expect(formField).toBeTruthy();
  });
});
