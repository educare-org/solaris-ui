import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisRadioGroupComponent } from './radio-group.component';
import { SolarisRadioComponent } from '../../radio/component/radio.component';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

interface Plan {
  id: number;
  name: string;
}

describe('SolarisRadioGroupComponent', () => {
  let fixture: ComponentFixture<SolarisRadioGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisRadioGroupComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should render the component', () => {
    const el = createFixture();
    expect(el).toBeTruthy();
  });

  it('should have role="radiogroup"', () => {
    const el = createFixture();
    expect(el.getAttribute('role')).toBe('radiogroup');
  });

  it('should have default orientation vertical', () => {
    const el = createFixture();
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should apply orientation horizontal', () => {
    const el = createFixture();
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('should have default layout list', () => {
    const el = createFixture();
    expect(el.getAttribute('data-layout')).toBe('list');
  });

  it('should apply layout grid', () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'grid');
    fixture.detectChanges();
    expect(el.getAttribute('data-layout')).toBe('grid');
  });

  it('should have default columns 1', () => {
    const el = createFixture();
    expect(el.getAttribute('data-columns')).toBe('1');
  });

  it('should apply columns', () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 2);
    fixture.detectChanges();
    expect(el.getAttribute('data-columns')).toBe('2');
  });
});

describe('SolarisRadioGroupComponent with children', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group>
        <solaris-radio value="basic">Basic</solaris-radio>
        <solaris-radio value="pro">Pro</solaris-radio>
        <solaris-radio value="enterprise">Enterprise</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class SimpleGroupHost {}

  let hostFixture: ComponentFixture<SimpleGroupHost>;
  let groupEl: HTMLElement;
  let radios: SolarisRadioComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(SimpleGroupHost);
    hostFixture.detectChanges();
    groupEl = hostFixture.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    const groupComp = hostFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    radios = groupComp['radios'].toArray();
    return { hostFixture, groupEl, groupComp, radios };
  };

  it('should render children', () => {
    const { radios } = setup();
    expect(radios.length).toBe(3);
  });

  it('should have child with value basic', () => {
    const { radios } = setup();
    expect(radios[0].value()).toBe('basic');
  });
});

describe('SolarisRadioGroupComponent CVA', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group>
        <solaris-radio value="a">A</solaris-radio>
        <solaris-radio value="b">B</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class CvaHost {}

  let hostFixture: ComponentFixture<CvaHost>;
  let groupComp: SolarisRadioGroupComponent;
  let radios: SolarisRadioComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(CvaHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    radios = groupComp['radios'].toArray();
    return { hostFixture, groupComp, radios };
  };

  it('writeValue should check matching child', () => {
    const { groupComp, radios } = setup();
    groupComp.writeValue('a');
    hostFixture!.detectChanges();
    expect(radios[0]['_checked']()).toBe(true);
    expect(radios[1]['_checked']()).toBe(false);
  });

  it('writeValue should update when value changes', () => {
    const { groupComp, radios } = setup();
    groupComp.writeValue('a');
    hostFixture!.detectChanges();
    groupComp.writeValue('b');
    hostFixture!.detectChanges();
    expect(radios[0]['_checked']()).toBe(false);
    expect(radios[1]['_checked']()).toBe(true);
  });

  it('writeValue with null should uncheck all', () => {
    const { groupComp, radios } = setup();
    groupComp.writeValue('a');
    hostFixture!.detectChanges();
    groupComp.writeValue(null);
    hostFixture!.detectChanges();
    expect(radios[0]['_checked']()).toBe(false);
    expect(radios[1]['_checked']()).toBe(false);
  });

  it('registerOnChange should be called when child is selected', () => {
    const { groupComp, radios } = setup();
    let emitted: unknown | undefined;
    groupComp.registerOnChange((v: unknown) => {
      emitted = v;
    });
    radios[0].checkedChange.emit(true);
    hostFixture!.detectChanges();
    expect(emitted).toBe('a');
  });

  it('registerOnTouched should be called on focusout', () => {
    const { groupComp } = setup();
    const groupEl = hostFixture!.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    let touched = false;
    groupComp.registerOnTouched(() => {
      touched = true;
    });
    groupEl.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    hostFixture!.detectChanges();
    expect(touched).toBe(true);
  });

  it('setDisabledState should disable group', () => {
    const { groupComp } = setup();
    groupComp.setDisabledState(true);
    hostFixture!.detectChanges();
    const el = hostFixture!.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('setDisabledState(false) should enable group', () => {
    const { groupComp } = setup();
    groupComp.setDisabledState(true);
    hostFixture!.detectChanges();
    groupComp.setDisabledState(false);
    hostFixture!.detectChanges();
    const el = hostFixture!.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(false);
  });
});

describe('SolarisRadioGroupComponent value management', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group>
        <solaris-radio value="a">A</solaris-radio>
        <solaris-radio value="b">B</solaris-radio>
        <solaris-radio value="c">C</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class ValueHost {}

  let hostFixture: ComponentFixture<ValueHost>;
  let groupComp: SolarisRadioGroupComponent;
  let radios: SolarisRadioComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(ValueHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    radios = groupComp['radios'].toArray();
    return { hostFixture, groupComp, radios };
  };

  it('should set value when child is checked', () => {
    const { groupComp, radios, hostFixture } = setup();
    groupComp.writeValue(undefined);
    hostFixture.detectChanges();
    radios[0].checkedChange.emit(true);
    hostFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toBe('a');
  });

  it('should replace value when another child is checked', () => {
    const { groupComp, radios, hostFixture } = setup();
    groupComp.writeValue('a');
    hostFixture.detectChanges();
    radios[1].checkedChange.emit(true);
    hostFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toBe('b');
  });

  it('should not clear value when same child emits checked again', () => {
    const { groupComp, radios, hostFixture } = setup();
    groupComp.writeValue('a');
    hostFixture.detectChanges();
    radios[0].checkedChange.emit(true);
    hostFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toBe('a');
  });

  it('should emit valueChange on child selection', () => {
    const { groupComp, radios, hostFixture } = setup();
    let emitted: unknown | undefined;
    groupComp.valueChange.subscribe((v: unknown) => {
      emitted = v;
    });
    radios[0].checkedChange.emit(true);
    hostFixture.detectChanges();
    expect(emitted).toBe('a');
  });
});

describe('SolarisRadioGroupComponent disabled/readonly', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group [disabled]="isDisabled()" [readonly]="isReadonly()">
        <solaris-radio value="a">A</solaris-radio>
        <solaris-radio value="b">B</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class StateHost {
    readonly isDisabled = signal(false);
    readonly isReadonly = signal(false);
  }

  let hostFixture: ComponentFixture<StateHost>;
  let groupComp: SolarisRadioGroupComponent;
  let radios: SolarisRadioComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(StateHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    radios = groupComp['radios'].toArray();
    return { hostFixture, groupComp, radios };
  };

  it('disabled should propagate to children', () => {
    const { hostFixture, radios, groupComp } = setup();
    hostFixture.componentInstance.isDisabled.set(true);
    hostFixture.detectChanges();
    (
      groupComp as unknown as { propagateDisabledToRadios: () => void }
    ).propagateDisabledToRadios();
    hostFixture.detectChanges();
    expect(radios[0].disabled).toBe(true);
    expect(radios[1].disabled).toBe(true);
  });

  it('readonly should propagate to children', () => {
    const { hostFixture, radios, groupComp } = setup();
    hostFixture.componentInstance.isReadonly.set(true);
    hostFixture.detectChanges();
    (
      groupComp as unknown as { propagateReadonlyToRadios: () => void }
    ).propagateReadonlyToRadios();
    hostFixture.detectChanges();
    expect(radios[0].readonly).toBe(true);
    expect(radios[1].readonly).toBe(true);
  });

  it('disabled group should have data-disabled', () => {
    const { hostFixture } = setup();
    hostFixture.componentInstance.isDisabled.set(true);
    hostFixture.detectChanges();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('readonly group should have data-readonly', () => {
    const { hostFixture } = setup();
    hostFixture.componentInstance.isReadonly.set(true);
    hostFixture.detectChanges();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-readonly')).toBe(true);
  });
});

describe('SolarisRadioGroupComponent standalone label/hint/error', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group
        label="Test Label"
        hint="Test Hint"
        error="Test Error"
        [invalid]="true"
      >
        <solaris-radio value="a">A</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class StandaloneHost {}

  let hostFixture: ComponentFixture<StandaloneHost>;

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(StandaloneHost);
    hostFixture.detectChanges();
    return { hostFixture };
  };

  it('should render label', () => {
    const { hostFixture } = setup();
    const label = hostFixture.nativeElement.querySelector(
      '.solaris-radio-group__label',
    );
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Test Label');
  });

  it('should render hint', () => {
    const { hostFixture } = setup();
    const hint = hostFixture.nativeElement.querySelector(
      '.solaris-radio-group__hint',
    );
    expect(hint).toBeTruthy();
    expect(hint.textContent).toContain('Test Hint');
  });

  it('should render error when invalid', () => {
    const { hostFixture } = setup();
    const error = hostFixture.nativeElement.querySelector(
      '.solaris-radio-group__error',
    );
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Test Error');
  });
});

describe('SolarisRadioGroupComponent a11y', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group label="Plan">
        <solaris-radio value="a">A</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class A11yHost {}

  let hostFixture: ComponentFixture<A11yHost>;

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(A11yHost);
    hostFixture.detectChanges();
    return { hostFixture };
  };

  it('should have role="radiogroup"', () => {
    const { hostFixture } = setup();
    const el = hostFixture.nativeElement.querySelector('solaris-radio-group');
    expect(el.getAttribute('role')).toBe('radiogroup');
  });

  it('should have aria-labelledby when label is provided', () => {
    const { hostFixture } = setup();
    const el = hostFixture.nativeElement.querySelector('solaris-radio-group');
    const labelledby = el.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const labelEl = hostFixture.nativeElement.querySelector(
      '.solaris-radio-group__label',
    );
    expect(labelEl.getAttribute('id')).toBe(labelledby);
  });

  it('should preserve aria-label', () => {
    @Component({
      standalone: true,
      imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
      template: `
        <solaris-radio-group ariaLabel="Custom group label">
          <solaris-radio value="a">A</solaris-radio>
        </solaris-radio-group>
      `,
    })
    class AriaLabelHost {}

    configureSolarisTesting();
    const hFixture = TestBed.createComponent(AriaLabelHost);
    hFixture.detectChanges();
    const el = hFixture.nativeElement.querySelector('solaris-radio-group');
    expect(el.getAttribute('aria-label')).toBe('Custom group label');
  });
});

describe('SolarisRadioGroupComponent FormField integration', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisFormFieldComponent,
      SolarisRadioGroupComponent,
      SolarisRadioComponent,
    ],
    template: `
      <solaris-form-field label="Plan">
        <solaris-radio-group [formControl]="planControl">
          <solaris-radio value="basic">Basic</solaris-radio>
          <solaris-radio value="pro">Pro</solaris-radio>
        </solaris-radio-group>
      </solaris-form-field>
    `,
  })
  class FormFieldHost {
    readonly planControl = new FormControl('basic');
  }

  it('should render radio group inside form field', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(FormFieldHost);
    hFixture.detectChanges();
    const group = hFixture.nativeElement.querySelector('solaris-radio-group');
    expect(group).toBeTruthy();
    const formField =
      hFixture.nativeElement.querySelector('solaris-form-field');
    expect(formField).toBeTruthy();
  });
});

describe('SolarisRadioGroupComponent density', () => {
  let fixture: ComponentFixture<SolarisRadioGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisRadioGroupComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should have default density comfortable', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });

  it('should apply compact density', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });
});

describe('SolarisRadioGroupComponent compareWith', () => {
  @Component({
    standalone: true,
    imports: [SolarisRadioGroupComponent, SolarisRadioComponent],
    template: `
      <solaris-radio-group [compareWith]="comparePlan">
        <solaris-radio [value]="basicPlan">Basic</solaris-radio>
        <solaris-radio [value]="proPlan">Pro</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class ComplexValueHost {
    readonly basicPlan: Plan = { id: 1, name: 'Basic' };
    readonly proPlan: Plan = { id: 2, name: 'Pro' };

    comparePlan(a: unknown, b: unknown): boolean {
      return (a as Plan).id === (b as Plan).id;
    }
  }

  it('should use custom compareWith', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ComplexValueHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    const radios = groupComp['radios'].toArray();
    const basicPlan = hFixture.componentInstance.basicPlan;

    groupComp.writeValue(basicPlan);
    hFixture.detectChanges();
    expect(radios[0]['_checked']()).toBe(true);
    expect(radios[1]['_checked']()).toBe(false);
  });
});

describe('SolarisRadioGroupComponent reactive forms', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisRadioGroupComponent,
      SolarisRadioComponent,
    ],
    template: `
      <solaris-radio-group [formControl]="control">
        <solaris-radio value="a">A</solaris-radio>
        <solaris-radio value="b">B</solaris-radio>
      </solaris-radio-group>
    `,
  })
  class ReactiveHost {
    readonly control = new FormControl('a');
  }

  it('should bind form control value', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ReactiveHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    const radios = groupComp['radios'].toArray();
    expect(radios[0]['_checked']()).toBe(true);
    expect(radios[1]['_checked']()).toBe(false);
  });

  it('should update form control on selection', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ReactiveHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisRadioGroupComponent),
    ).componentInstance as SolarisRadioGroupComponent;
    const radios = groupComp['radios'].toArray();
    radios[1].checkedChange.emit(true);
    hFixture.detectChanges();
    expect(hFixture.componentInstance.control.value).toBe('b');
  });

  it('should reflect disabled state from form control', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ReactiveHost);
    hFixture.detectChanges();
    hFixture.componentInstance.control.disable();
    hFixture.detectChanges();
    const el = hFixture.nativeElement.querySelector(
      'solaris-radio-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });
});
