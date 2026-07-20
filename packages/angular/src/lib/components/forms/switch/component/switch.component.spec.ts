import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisSwitchComponent } from './switch.component';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

describe('SolarisSwitchComponent', () => {
  let fixture: ComponentFixture<SolarisSwitchComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchComponent);
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

  it('should use native input type="checkbox" with role="switch"', () => {
    createFixture();
    const input = getNativeInput();
    expect(input.getAttribute('type')).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');
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

  it('should apply invalid', () => {
    const el = createFixture();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-invalid')).toBe(true);
  });

  it('should have default appearance surface', () => {
    const el = createFixture();
    expect(el.getAttribute('data-appearance')).toBe('surface');
  });

  it('should apply appearance outline', () => {
    const el = createFixture();
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();
    expect(el.getAttribute('data-appearance')).toBe('outline');
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

describe('SolarisSwitchComponent interaction', () => {
  let fixture: ComponentFixture<SolarisSwitchComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchComponent);
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
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const input = getNativeInput();
    expect(input.checked).toBe(false);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });
});

describe('SolarisSwitchComponent outputs', () => {
  let fixture: ComponentFixture<SolarisSwitchComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchComponent);
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

describe('SolarisSwitchComponent ControlValueAccessor', () => {
  let fixture: ComponentFixture<SolarisSwitchComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchComponent);
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

describe('SolarisSwitchComponent label and a11y', () => {
  @Component({
    standalone: true,
    imports: [SolarisSwitchComponent],
    template: ` <solaris-switch> Receber notificacoes </solaris-switch> `,
  })
  class ProjectedLabelHost {}
  @Component({
    standalone: true,
    imports: [SolarisSwitchComponent],
    template: ` <solaris-switch ariaLabel="Receber notificacoes" /> `,
  })
  class AriaLabelHost {}

  it('should render projected content as label', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ProjectedLabelHost);
    hostFixture.detectChanges();
    const text = (hostFixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Receber notificacoes');
  });

  it('should have aria-label on native input when ariaLabel is set', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(AriaLabelHost);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Receber notificacoes');
  });

  it('should have native input with id', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisSwitchComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });

  it('should associate label with input via for attribute', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisSwitchComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    const label = (hostFixture.nativeElement as HTMLElement).querySelector(
      '.solaris-switch__label',
    ) as HTMLLabelElement;
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('should have role="switch" on the native input', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisSwitchComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('switch');
  });

  it('should reflect aria-checked via checked state when role switch is used', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SolarisSwitchComponent);
    hostFixture.detectChanges();
    const input = (hostFixture.nativeElement as HTMLElement).querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.hasAttribute('aria-checked')).toBe(false);
    hostFixture.componentRef.setInput('checked', true);
    hostFixture.detectChanges();
    expect(input.checked).toBe(true);
  });
});

describe('SolarisSwitchComponent with Reactive Forms', () => {
  @Component({
    standalone: true,
    imports: [ReactiveFormsModule, SolarisSwitchComponent],
    template: ` <solaris-switch [formControl]="control" /> `,
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
      'solaris-switch',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('SolarisSwitchComponent inside FormField', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisSwitchComponent,
      SolarisFormFieldComponent,
    ],
    template: `
      <solaris-form-field label="Preferencias">
        <solaris-switch>Receber notificacoes</solaris-switch>
      </solaris-form-field>
    `,
  })
  class SwitchInFormFieldHost {}

  it('should render switch inside form field', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SwitchInFormFieldHost);
    hostFixture.detectChanges();
    const sw = (hostFixture.nativeElement as HTMLElement).querySelector(
      'solaris-switch',
    );
    expect(sw).toBeTruthy();
    const formField = (hostFixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-field',
    );
    expect(formField).toBeTruthy();
  });
});

describe('SolarisSwitchComponent thumb visual', () => {
  let fixture: ComponentFixture<SolarisSwitchComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  const getThumb = (): HTMLElement | null => {
    return fixture.nativeElement.querySelector(
      '.solaris-switch__thumb',
    ) as HTMLElement;
  };

  const getTrack = (): HTMLElement | null => {
    return fixture.nativeElement.querySelector(
      '.solaris-switch__track',
    ) as HTMLElement;
  };

  it('should render the thumb element', () => {
    createFixture();
    const thumb = getThumb();
    expect(thumb).toBeTruthy();
  });

  it('should render the thumb inside the track', () => {
    createFixture();
    const track = getTrack();
    const thumb = getThumb();
    expect(track).toBeTruthy();
    expect(thumb).toBeTruthy();
    expect(track!.contains(thumb)).toBe(true);
  });

  it('should have thumb with border-radius 50% (circular)', () => {
    createFixture();
    const thumb = getThumb();
    const borderRadius =
      thumb!.style.borderRadius || getComputedStyle(thumb!).borderRadius;
    expect(borderRadius).toBe('50%');
  });

  it('should have thumb with z-index 1', () => {
    createFixture();
    const thumb = getThumb();
    const zIndex = thumb!.style.zIndex || getComputedStyle(thumb!).zIndex;
    expect(zIndex).toBe('1');
  });

  it('should move thumb position when checked', () => {
    createFixture();
    const thumb = getThumb();
    const uncheckedLeft = thumb!.style.left || getComputedStyle(thumb!).left;
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    const checkedLeft = thumb!.style.left || getComputedStyle(thumb!).left;
    expect(checkedLeft).not.toBe(uncheckedLeft);
  });

  it('should have thumb background color set (not transparent)', () => {
    createFixture();
    const el = fixture.nativeElement;
    const thumb = getThumb();
    el.setAttribute('data-appearance', 'surface');
    el.setAttribute('data-color', 'primary');
    fixture.detectChanges();
    const bgColor = getComputedStyle(thumb!).backgroundColor;
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('transparent');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('should have thumb visible in outline appearance', () => {
    createFixture();
    fixture.componentRef.setInput('appearance', 'outline');
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.getAttribute('data-appearance')).toBe('outline');
    const thumb = getThumb();
    const bgColor = getComputedStyle(thumb!).backgroundColor;
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('transparent');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
