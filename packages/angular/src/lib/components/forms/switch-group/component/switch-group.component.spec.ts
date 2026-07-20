import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisSwitchGroupComponent } from './switch-group.component';
import { SolarisSwitchComponent } from '../../switch/component/switch.component';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

describe('SolarisSwitchGroupComponent', () => {
  let fixture: ComponentFixture<SolarisSwitchGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchGroupComponent);
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

  it('should have default value {}', () => {
    createFixture();
    expect(fixture.componentInstance['_value']()).toEqual({});
  });

  it('should have default orientation vertical', () => {
    const el = createFixture();
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should have default layout list', () => {
    const el = createFixture();
    expect(el.getAttribute('data-layout')).toBe('list');
  });

  it('should have default columns 1', () => {
    const el = createFixture();
    expect(el.getAttribute('data-columns')).toBe('1');
  });

  it('should apply orientation horizontal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should apply layout grid', () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'grid');
    fixture.detectChanges();
    expect(el.getAttribute('data-layout')).toBe('grid');
  });

  it('should apply columns', () => {
    const el = createFixture();
    fixture.componentRef.setInput('columns', 3);
    fixture.detectChanges();
    expect(el.getAttribute('data-columns')).toBe('3');
  });

  it('should apply columns auto', () => {
    const el = createFixture();
    fixture.componentRef.setInput('columns', 'auto');
    fixture.detectChanges();
    expect(el.getAttribute('data-columns')).toBe('auto');
  });

  it('should apply disabled', () => {
    const el = createFixture();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('should apply invalid', () => {
    const el = createFixture();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-invalid')).toBe(true);
  });

  it('should have default density comfortable', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('comfortable');
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

  it('should support all size values', () => {
    const el = createFixture();
    const values = ['sm', 'md', 'lg'] as const;
    for (const v of values) {
      fixture.componentRef.setInput('size', v);
      fixture.detectChanges();
      expect(el.getAttribute('data-size')).toBe(v);
    }
  });
});

describe('SolarisSwitchGroupComponent with children', () => {
  @Component({
    standalone: true,
    imports: [SolarisSwitchGroupComponent, SolarisSwitchComponent],
    template: `
      <solaris-switch-group>
        <solaris-switch value="email">E-mail</solaris-switch>
        <solaris-switch value="sms">SMS</solaris-switch>
        <solaris-switch value="push">Push</solaris-switch>
      </solaris-switch-group>
    `,
  })
  class SwitchGroupWithChildrenHost {}

  let hostFixture: ComponentFixture<SwitchGroupWithChildrenHost>;

  const createHostFixture = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(SwitchGroupWithChildrenHost);
    hostFixture.detectChanges();
    return hostFixture.nativeElement;
  };

  it('should render projected content', () => {
    const el = createHostFixture();
    const switches = el.querySelectorAll('solaris-switch');
    expect(switches.length).toBe(3);
  });

  it('should have switches inside the group', () => {
    createHostFixture();
    const groupEl = hostFixture.nativeElement.querySelector(
      'solaris-switch-group',
    );
    expect(groupEl).toBeTruthy();
    const switches = groupEl.querySelectorAll('solaris-switch');
    expect(switches.length).toBe(3);
  });
});

describe('SolarisSwitchGroupComponent ControlValueAccessor', () => {
  let fixture: ComponentFixture<SolarisSwitchGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchGroupComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('writeValue should set internal value', () => {
    createFixture();
    const testValue = { email: true, sms: false };
    fixture.componentRef.instance.writeValue(testValue);
    fixture.detectChanges();
    expect(fixture.componentInstance['_value']()).toEqual(testValue);
  });

  it('writeValue(null) should set empty object', () => {
    createFixture();
    fixture.componentRef.instance.writeValue(null);
    fixture.detectChanges();
    expect(fixture.componentInstance['_value']()).toEqual({});
  });

  it('registerOnChange should set onChange callback', () => {
    createFixture();
    const fn = vi.fn();
    fixture.componentRef.instance.registerOnChange(fn);
    expect(
      (fixture.componentInstance as unknown as { onChange: typeof fn })
        .onChange,
    ).toBe(fn);
  });

  it('registerOnTouched should set onTouched callback', () => {
    createFixture();
    const fn = vi.fn();
    fixture.componentRef.instance.registerOnTouched(fn);
    expect(
      (fixture.componentInstance as unknown as { onTouched: typeof fn })
        .onTouched,
    ).toBe(fn);
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

describe('SolarisSwitchGroupComponent validation', () => {
  let fixture: ComponentFixture<SolarisSwitchGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchGroupComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('required should auto-invalidate when no switch enabled', () => {
    createFixture();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(true);
  });

  it('required should not auto-invalidate when switch enabled', () => {
    createFixture();
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.instance.writeValue({ email: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(false);
  });

  it('minEnabled should auto-invalidate below threshold', () => {
    createFixture();
    fixture.componentRef.setInput('minEnabled', 2);
    fixture.componentRef.instance.writeValue({ email: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(true);
  });

  it('minEnabled should not auto-invalidate at threshold', () => {
    createFixture();
    fixture.componentRef.setInput('minEnabled', 2);
    fixture.componentRef.instance.writeValue({ email: true, sms: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(false);
  });

  it('minEnabled should not auto-invalidate above threshold', () => {
    createFixture();
    fixture.componentRef.setInput('minEnabled', 2);
    fixture.componentRef.instance.writeValue({
      email: true,
      sms: true,
      push: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(false);
  });

  it('maxEnabled should auto-invalidate above threshold', () => {
    createFixture();
    fixture.componentRef.setInput('maxEnabled', 2);
    fixture.componentRef.instance.writeValue({
      email: true,
      sms: true,
      push: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(true);
  });

  it('maxEnabled should not auto-invalidate at threshold', () => {
    createFixture();
    fixture.componentRef.setInput('maxEnabled', 2);
    fixture.componentRef.instance.writeValue({ email: true, sms: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(false);
  });

  it('maxEnabled should not auto-disable switches', () => {
    createFixture();
    fixture.componentRef.setInput('maxEnabled', 1);
    fixture.componentRef.instance.writeValue({ email: true });
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.hasAttribute('data-disabled')).toBe(false);
  });

  it('invalid input should override auto validation', () => {
    createFixture();
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.instance.writeValue({ email: true });
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.hasAttribute('data-invalid')).toBe(true);
  });
});

describe('SolarisSwitchGroupComponent standalone label/hint/error', () => {
  let fixture: ComponentFixture<SolarisSwitchGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchGroupComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should render label text', () => {
    createFixture();
    fixture.componentRef.setInput('label', 'Notificações');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Notificações');
  });

  it('should render hint text', () => {
    createFixture();
    fixture.componentRef.setInput('hint', 'Configure os canais.');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Configure os canais.');
  });

  it('should render error text when invalid', () => {
    createFixture();
    fixture.componentRef.setInput('error', 'Selecione ao menos uma opção.');
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Selecione ao menos uma opção.');
  });

  it('should not render error text when not invalid', () => {
    createFixture();
    fixture.componentRef.setInput('error', 'Selecione ao menos uma opção.');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Selecione ao menos uma opção.');
  });
});

describe('SolarisSwitchGroupComponent a11y', () => {
  let fixture: ComponentFixture<SolarisSwitchGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchGroupComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should have role="group"', () => {
    createFixture();
    expect(fixture.nativeElement.getAttribute('role')).toBe('group');
  });

  it('should not have role="radiogroup"', () => {
    createFixture();
    expect(fixture.nativeElement.getAttribute('role')).not.toBe('radiogroup');
  });

  it('should not have role="switch" on group', () => {
    createFixture();
    expect(fixture.nativeElement.getAttribute('role')).not.toBe('switch');
  });

  it('should preserve aria-label', () => {
    createFixture();
    fixture.componentRef.setInput('ariaLabel', 'Preferências de notificação');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe(
      'Preferências de notificação',
    );
  });

  it('should apply aria-labelledby when label is provided', () => {
    createFixture();
    fixture.componentRef.setInput('label', 'Notificações');
    fixture.detectChanges();
    const labelledby = fixture.nativeElement.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
  });

  it('should apply aria-describedby when hint is provided', () => {
    createFixture();
    fixture.componentRef.setInput('hint', 'Configure os canais.');
    fixture.detectChanges();
    const describedby = fixture.nativeElement.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
  });

  it('should apply aria-describedby when error is shown', () => {
    createFixture();
    fixture.componentRef.setInput('error', 'Erro.');
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    const describedby = fixture.nativeElement.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
  });

  it('should apply aria-invalid when invalid', () => {
    createFixture();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-invalid')).toBe('true');
  });

  it('should apply aria-required when required', () => {
    createFixture();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-required')).toBe('true');
  });
});

describe('SolarisSwitchGroupComponent with Reactive Forms', () => {
  @Component({
    standalone: true,
    imports: [ReactiveFormsModule, SolarisSwitchGroupComponent],
    template: ` <solaris-switch-group [formControl]="control" /> `,
  })
  class ReactiveFormHost {
    readonly control = new FormControl<Record<string, boolean>>({});
  }

  it('should work with formControl', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ReactiveFormHost);
    hostFixture.detectChanges();
    const groupEl = hostFixture.nativeElement.querySelector(
      'solaris-switch-group',
    );
    expect(groupEl).toBeTruthy();
  });

  it('should update form control value', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(ReactiveFormHost);
    hostFixture.detectChanges();
    hostFixture.componentInstance.control.setValue({ email: true });
    hostFixture.detectChanges();
    expect(
      (hostFixture.nativeElement as HTMLElement).querySelector(
        'solaris-switch-group',
      ),
    ).toBeTruthy();
  });
});

describe('SolarisSwitchGroupComponent inside FormField', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisSwitchGroupComponent,
      SolarisSwitchComponent,
      SolarisFormFieldComponent,
    ],
    template: `
      <solaris-form-field label="Preferências">
        <solaris-switch-group>
          <solaris-switch value="email">E-mail</solaris-switch>
        </solaris-switch-group>
      </solaris-form-field>
    `,
  })
  class SwitchGroupInFormFieldHost {}

  it('should render switch group inside form field', () => {
    configureSolarisTesting();
    const hostFixture = TestBed.createComponent(SwitchGroupInFormFieldHost);
    hostFixture.detectChanges();
    const group = (hostFixture.nativeElement as HTMLElement).querySelector(
      'solaris-switch-group',
    );
    expect(group).toBeTruthy();
    const formField = (hostFixture.nativeElement as HTMLElement).querySelector(
      'solaris-form-field',
    );
    expect(formField).toBeTruthy();
  });
});

describe('SolarisSwitchGroupComponent readonly', () => {
  let fixture: ComponentFixture<SolarisSwitchGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisSwitchGroupComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should apply readonly', () => {
    const el = createFixture();
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(el.hasAttribute('data-readonly')).toBe(true);
  });
});

describe('SolarisSwitchGroupComponent child composition', () => {
  @Component({
    standalone: true,
    imports: [SolarisSwitchGroupComponent, SolarisSwitchComponent],
    template: `
      <solaris-switch-group>
        <solaris-switch value="email">E-mail</solaris-switch>
        <solaris-switch value="sms">SMS</solaris-switch>
      </solaris-switch-group>
    `,
  })
  class CompositionHost {}

  let hostFixture: ComponentFixture<CompositionHost>;

  const createHostFixture = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(CompositionHost);
    hostFixture.detectChanges();
    return hostFixture.nativeElement;
  };

  it('should sync writeValue to children', () => {
    const el = createHostFixture();
    const switches = el.querySelectorAll(
      'solaris-switch',
    ) as NodeListOf<HTMLElement>;
    const groupComponent = hostFixture.debugElement.children[0]
      .componentInstance as SolarisSwitchGroupComponent;
    groupComponent.writeValue({ email: true, sms: false });
    hostFixture.detectChanges();
    expect(switches[0].hasAttribute('data-checked')).toBe(true);
    expect(switches[1].hasAttribute('data-checked')).toBe(false);
  });
});
