import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { configureSolarisTesting } from '../../../../testing/solaris-test-utilities';
import { SolarisCheckboxGroupComponent } from '../component/checkbox-group.component';
import { SolarisCheckboxComponent } from '../../checkbox/component/checkbox.component';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';

interface User {
  id: number;
  name: string;
}

describe('SolarisCheckboxGroupComponent', () => {
  let fixture: ComponentFixture<SolarisCheckboxGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCheckboxGroupComponent);
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

  it('should apply columns', () => {
    const el = createFixture();
    fixture.componentRef.setInput('layout', 'grid');
    fixture.componentRef.setInput('columns', 2);
    fixture.detectChanges();
    expect(el.getAttribute('data-columns')).toBe('2');
  });
});

describe('SolarisCheckboxGroupComponent with children', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group>
        <solaris-checkbox value="sports">Esportes</solaris-checkbox>
        <solaris-checkbox value="finance">Finanças</solaris-checkbox>
        <solaris-checkbox value="technology">Tecnologia</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class SimpleGroupHost {}

  let hostFixture: ComponentFixture<SimpleGroupHost>;
  let groupEl: HTMLElement;
  let checkboxes: readonly SolarisCheckboxComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(SimpleGroupHost);
    hostFixture.detectChanges();
    groupEl = hostFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    ) as HTMLElement;
    const groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    checkboxes = groupComp['checkboxes']();
    return { hostFixture, groupEl, groupComp, checkboxes };
  };

  it('should render children', () => {
    const { checkboxes } = setup();
    expect(checkboxes.length).toBe(3);
  });

  it('should have child with value sports', () => {
    const { checkboxes } = setup();
    expect(checkboxes[0].value()).toBe('sports');
  });
});

describe('SolarisCheckboxGroupComponent CVA', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group>
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class CvaHost {}

  let hostFixture: ComponentFixture<CvaHost>;
  let groupComp: SolarisCheckboxGroupComponent;
  let checkboxes: readonly SolarisCheckboxComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(CvaHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    checkboxes = (
      groupComp as unknown as {
        checkboxes: () => readonly SolarisCheckboxComponent[];
      }
    ).checkboxes();
    return { hostFixture, groupComp, checkboxes };
  };

  it('writeValue with array should check matching children', () => {
    const { groupComp, checkboxes } = setup();
    groupComp.writeValue(['a']);
    hostFixture!.detectChanges();
    expect(
      (checkboxes[0] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(true);
    expect(
      (checkboxes[1] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(false);
  });

  it('writeValue with multiple values should check multiple children', () => {
    const { groupComp, checkboxes } = setup();
    groupComp.writeValue(['a', 'b']);
    hostFixture!.detectChanges();
    expect(
      (checkboxes[0] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(true);
    expect(
      (checkboxes[1] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(true);
  });

  it('writeValue with empty array should uncheck all', () => {
    const { groupComp, checkboxes } = setup();
    groupComp.writeValue(['a']);
    hostFixture!.detectChanges();
    groupComp.writeValue([]);
    hostFixture!.detectChanges();
    expect(
      (checkboxes[0] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(false);
    expect(
      (checkboxes[1] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(false);
  });

  it('writeValue with null should set empty array', () => {
    const { groupComp, checkboxes } = setup();
    groupComp.writeValue(null);
    hostFixture!.detectChanges();
    expect(
      (checkboxes[0] as unknown as { _checked: () => boolean })._checked(),
    ).toBe(false);
  });

  it('registerOnChange should be called when child toggles', () => {
    const { groupComp, checkboxes } = setup();
    let emitted: unknown[] | undefined;
    groupComp.registerOnChange((v: unknown[]) => {
      emitted = v;
    });
    checkboxes[0].checkedChange.emit(true);
    hostFixture!.detectChanges();
    expect(emitted).toEqual(['a']);
  });

  it('registerOnChange should emit updated array on uncheck', () => {
    const { groupComp, checkboxes } = setup();
    groupComp.writeValue(['a', 'b']);
    hostFixture!.detectChanges();
    let emitted: unknown[] | undefined;
    groupComp.registerOnChange((v: unknown[]) => {
      emitted = v;
    });
    checkboxes[0].checkedChange.emit(false);
    hostFixture!.detectChanges();
    expect(emitted).toEqual(['b']);
  });

  it('registerOnTouched should be called on focusout', () => {
    const { groupComp } = setup();
    const groupEl = hostFixture!.nativeElement.querySelector(
      'solaris-checkbox-group',
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
      'solaris-checkbox-group',
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
      'solaris-checkbox-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(false);
  });
});

describe('SolarisCheckboxGroupComponent value management', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group>
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
        <solaris-checkbox value="c">C</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class ValueHost {}

  let hostFixture: ComponentFixture<ValueHost>;
  let groupComp: SolarisCheckboxGroupComponent;
  let checkboxes: readonly SolarisCheckboxComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(ValueHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    checkboxes = groupComp['checkboxes']();
    return { hostFixture, groupComp, checkboxes };
  };

  it('should add value when child is checked', () => {
    const { groupComp, checkboxes, hostFixture } = setup();
    groupComp.writeValue([]);
    hostFixture.detectChanges();
    checkboxes[0].checkedChange.emit(true);
    hostFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toEqual(['a']);
  });

  it('should remove value when child is unchecked', () => {
    const { groupComp, checkboxes, hostFixture } = setup();
    groupComp.writeValue(['a', 'b']);
    hostFixture.detectChanges();
    checkboxes[0].checkedChange.emit(false);
    hostFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toEqual(['b']);
  });

  it('should not duplicate values', () => {
    const { groupComp, checkboxes, hostFixture } = setup();
    groupComp.writeValue(['a']);
    hostFixture.detectChanges();
    checkboxes[0].checkedChange.emit(true);
    hostFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toEqual(['a']);
  });

  it('should emit valueChange on child toggle', () => {
    const { groupComp, checkboxes, hostFixture } = setup();
    let emitted: unknown[] | undefined;
    groupComp.valueChange.subscribe((v: unknown[]) => {
      emitted = v;
    });
    checkboxes[0].checkedChange.emit(true);
    hostFixture.detectChanges();
    expect(emitted).toEqual(['a']);
  });
});

describe('SolarisCheckboxGroupComponent select-all', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group [selectAll]="true">
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class SelectAllHost {}

  let hostFixture: ComponentFixture<SelectAllHost>;
  let groupComp: SolarisCheckboxGroupComponent;

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(SelectAllHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    return { hostFixture, groupComp };
  };

  it('should render select-all checkbox when selectAll is true', () => {
    const { hostFixture } = setup();
    const selectAllEl = hostFixture.nativeElement.querySelector(
      '.solaris-checkbox-group__select-all solaris-checkbox',
    );
    expect(selectAllEl).toBeTruthy();
  });

  it('select-all should be unchecked when nothing selected', () => {
    const { groupComp } = setup();
    const g = groupComp as unknown as {
      selectAllChecked: () => boolean;
      selectAllIndeterminate: () => boolean;
    };
    expect(g.selectAllChecked()).toBe(false);
    expect(g.selectAllIndeterminate()).toBe(false);
  });

  it('select-all should be indeterminate when some selected', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue(['a']);
    hostFixture.detectChanges();
    const g = groupComp as unknown as {
      selectAllChecked: () => boolean;
      selectAllIndeterminate: () => boolean;
    };
    expect(g.selectAllIndeterminate()).toBe(true);
    expect(g.selectAllChecked()).toBe(false);
  });

  it('select-all should be checked when all selected', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue(['a', 'b']);
    hostFixture.detectChanges();
    const g = groupComp as unknown as {
      selectAllChecked: () => boolean;
      selectAllIndeterminate: () => boolean;
    };
    expect(g.selectAllIndeterminate()).toBe(false);
    expect(g.selectAllChecked()).toBe(true);
  });

  it('select-all onSelectAllChange(true) should select all', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue([]);
    hostFixture.detectChanges();
    (
      groupComp as unknown as { onSelectAllChange: (v: boolean) => void }
    ).onSelectAllChange(true);
    hostFixture.detectChanges();
    const value = (
      groupComp as unknown as { _value: () => unknown[] }
    )._value();
    expect(value).toEqual(['a', 'b']);
  });

  it('select-all onSelectAllChange(false) should deselect all', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue(['a', 'b']);
    hostFixture.detectChanges();
    (
      groupComp as unknown as { onSelectAllChange: (v: boolean) => void }
    ).onSelectAllChange(false);
    hostFixture.detectChanges();
    const value = (
      groupComp as unknown as { _value: () => unknown[] }
    )._value();
    expect(value).toEqual([]);
  });

  it('select-all should not affect disabled children', () => {
    @Component({
      standalone: true,
      imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
      template: `
        <solaris-checkbox-group [selectAll]="true">
          <solaris-checkbox value="a">A</solaris-checkbox>
          <solaris-checkbox value="b" [disabled]="true">B</solaris-checkbox>
        </solaris-checkbox-group>
      `,
    })
    class DisabledChildHost {}

    configureSolarisTesting();
    const hFixture = TestBed.createComponent(DisabledChildHost);
    hFixture.detectChanges();
    const gComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;

    gComp.writeValue([]);
    hFixture.detectChanges();

    (
      gComp as unknown as { onSelectAllChange: (v: boolean) => void }
    ).onSelectAllChange(true);
    hFixture.detectChanges();
    const value = (gComp as unknown as { _value: () => unknown[] })._value();
    expect(value).toEqual(['a']);
  });
});

describe('SolarisCheckboxGroupComponent validation', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group [minSelected]="1" [maxSelected]="2">
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
        <solaris-checkbox value="c">C</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class ValidationHost {}

  let hostFixture: ComponentFixture<ValidationHost>;
  let groupComp: SolarisCheckboxGroupComponent;

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(ValidationHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    return { hostFixture, groupComp };
  };

  it('minSelected should invalidate when below minimum', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue([]);
    hostFixture.detectChanges();
    expect(groupComp['autoInvalid']()).toBe(true);
  });

  it('minSelected should validate when at minimum', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue(['a']);
    hostFixture.detectChanges();
    expect(groupComp['autoInvalid']()).toBe(false);
  });

  it('maxSelected should invalidate when above maximum', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue(['a', 'b', 'c']);
    hostFixture.detectChanges();
    expect(groupComp['autoInvalid']()).toBe(true);
  });

  it('maxSelected should validate when within maximum', () => {
    const { groupComp, hostFixture } = setup();
    groupComp.writeValue(['a', 'b']);
    hostFixture.detectChanges();
    expect(groupComp['autoInvalid']()).toBe(false);
  });

  it('should support explicit invalid override via host input', () => {
    @Component({
      standalone: true,
      imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
      template: `
        <solaris-checkbox-group [invalid]="isInvalid">
          <solaris-checkbox value="a">A</solaris-checkbox>
        </solaris-checkbox-group>
      `,
    })
    class ExplicitInvalidHost {
      isInvalid = true;
    }

    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ExplicitInvalidHost);
    hFixture.detectChanges();
    const el = hFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-invalid')).toBe(true);
  });
});

describe('SolarisCheckboxGroupComponent disabled/readonly', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group
        [disabled]="isDisabled()"
        [readonly]="isReadonly()"
      >
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class StateHost {
    readonly isDisabled = signal(false);
    readonly isReadonly = signal(false);
  }

  let hostFixture: ComponentFixture<StateHost>;
  let groupComp: SolarisCheckboxGroupComponent;
  let checkboxes: readonly SolarisCheckboxComponent[];

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(StateHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    checkboxes = groupComp['checkboxes']();
    return { hostFixture, groupComp, checkboxes };
  };

  it('disabled should propagate to children', () => {
    const { hostFixture, checkboxes, groupComp } = setup();
    hostFixture.componentInstance.isDisabled.set(true);
    hostFixture.detectChanges();
    (
      groupComp as unknown as { propagateDisabledToChildren: () => void }
    ).propagateDisabledToChildren();
    hostFixture.detectChanges();
    expect(checkboxes[0].disabled).toBe(true);
    expect(checkboxes[1].disabled).toBe(true);
  });

  it('readonly should propagate to children', () => {
    const { hostFixture, checkboxes, groupComp } = setup();
    hostFixture.componentInstance.isReadonly.set(true);
    hostFixture.detectChanges();
    (
      groupComp as unknown as { propagateReadonlyToChildren: () => void }
    ).propagateReadonlyToChildren();
    hostFixture.detectChanges();
    expect(checkboxes[0].readonly).toBe(true);
    expect(checkboxes[1].readonly).toBe(true);
  });

  it('disabled group should have data-disabled', () => {
    const { hostFixture } = setup();
    hostFixture.componentInstance.isDisabled.set(true);
    hostFixture.detectChanges();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });

  it('readonly group should have data-readonly', () => {
    const { hostFixture } = setup();
    hostFixture.componentInstance.isReadonly.set(true);
    hostFixture.detectChanges();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-readonly')).toBe(true);
  });
});

describe('SolarisCheckboxGroupComponent standalone label/hint/error', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group
        label="Test Label"
        hint="Test Hint"
        error="Test Error"
        [minSelected]="1"
      >
        <solaris-checkbox value="a">A</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class StandaloneHost {}

  let hostFixture: ComponentFixture<StandaloneHost>;
  let groupComp: SolarisCheckboxGroupComponent;

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(StandaloneHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    return { hostFixture, groupComp };
  };

  it('should render label', () => {
    const { hostFixture } = setup();
    const label = hostFixture.nativeElement.querySelector(
      '.solaris-checkbox-group__label',
    );
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Test Label');
  });

  it('should render hint', () => {
    const { hostFixture } = setup();
    const hint = hostFixture.nativeElement.querySelector(
      '.solaris-checkbox-group__hint',
    );
    expect(hint).toBeTruthy();
    expect(hint.textContent).toContain('Test Hint');
  });

  it('should render error when invalid', () => {
    const { hostFixture, groupComp } = setup();
    groupComp.writeValue([]);
    hostFixture.detectChanges();
    const error = hostFixture.nativeElement.querySelector(
      '.solaris-checkbox-group__error',
    );
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Test Error');
  });
});

describe('SolarisCheckboxGroupComponent a11y', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group label="Interests">
        <solaris-checkbox value="a">A</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class A11yHost {}

  let hostFixture: ComponentFixture<A11yHost>;
  let groupComp: SolarisCheckboxGroupComponent;

  const setup = () => {
    configureSolarisTesting();
    hostFixture = TestBed.createComponent(A11yHost);
    hostFixture.detectChanges();
    groupComp = hostFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    return { hostFixture, groupComp };
  };

  it('should have role="group"', () => {
    const { hostFixture } = setup();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    );
    expect(el.getAttribute('role')).toBe('group');
  });

  it('should have aria-labelledby when label is provided', () => {
    const { hostFixture } = setup();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    );
    const labelledby = el.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const labelEl = hostFixture.nativeElement.querySelector(
      '.solaris-checkbox-group__label',
    );
    expect(labelEl.getAttribute('id')).toBe(labelledby);
  });

  it('aria-label should be preserved', () => {
    @Component({
      standalone: true,
      imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
      template: `
        <solaris-checkbox-group ariaLabel="Custom group label">
          <solaris-checkbox value="a">A</solaris-checkbox>
        </solaris-checkbox-group>
      `,
    })
    class AriaLabelHost {}

    configureSolarisTesting();
    const hFixture = TestBed.createComponent(AriaLabelHost);
    hFixture.detectChanges();
    const el = hFixture.nativeElement.querySelector('solaris-checkbox-group');
    const ariaLabel = el.getAttribute('aria-label');
    expect(ariaLabel).toBe('Custom group label');
  });

  it('should preserve aria-label when provided', () => {
    @Component({
      standalone: true,
      imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
      template: `
        <solaris-checkbox-group ariaLabel="Custom label">
          <solaris-checkbox value="a">A</solaris-checkbox>
        </solaris-checkbox-group>
      `,
    })
    class AriaLabelHost {}

    configureSolarisTesting();
    const hFixture = TestBed.createComponent(AriaLabelHost);
    hFixture.detectChanges();
    const el = hFixture.nativeElement.querySelector('solaris-checkbox-group');
    expect(el.getAttribute('aria-label')).toBe('Custom label');
  });

  it('should not use role radiogroup', () => {
    const { hostFixture } = setup();
    const el = hostFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    );
    expect(el.getAttribute('role')).not.toBe('radiogroup');
  });
});

describe('SolarisCheckboxGroupComponent FormField integration', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisFormFieldComponent,
      SolarisCheckboxGroupComponent,
      SolarisCheckboxComponent,
    ],
    template: `
      <solaris-form-field label="Interests">
        <solaris-checkbox-group [formControl]="interests">
          <solaris-checkbox value="sports">Sports</solaris-checkbox>
          <solaris-checkbox value="finance">Finance</solaris-checkbox>
        </solaris-checkbox-group>
      </solaris-form-field>
    `,
  })
  class FormFieldHost {
    readonly interests = new FormControl(['sports']);
  }

  it('should render checkbox group inside form field', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(FormFieldHost);
    hFixture.detectChanges();
    const group = hFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    );
    expect(group).toBeTruthy();
    const formField =
      hFixture.nativeElement.querySelector('solaris-form-field');
    expect(formField).toBeTruthy();
  });
});

describe('SolarisCheckboxGroupComponent density', () => {
  let fixture: ComponentFixture<SolarisCheckboxGroupComponent>;

  const createFixture = () => {
    configureSolarisTesting();
    fixture = TestBed.createComponent(SolarisCheckboxGroupComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  };

  it('should have default density normal', () => {
    const el = createFixture();
    expect(el.getAttribute('data-density')).toBe('normal');
  });

  it('should apply compact density', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('compact');
  });

  it('should apply comfortable density', () => {
    const el = createFixture();
    fixture.componentRef.setInput('density', 'comfortable');
    fixture.detectChanges();
    expect(el.getAttribute('data-density')).toBe('comfortable');
  });
});

describe('SolarisCheckboxGroupComponent compareWith', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group [compareWith]="compareUser">
        <solaris-checkbox [value]="userA">A</solaris-checkbox>
        <solaris-checkbox [value]="userB">B</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class ComplexValueHost {
    readonly userA: User = { id: 1, name: 'Alice' };
    readonly userB: User = { id: 2, name: 'Bob' };

    compareUser(a: unknown, b: unknown): boolean {
      return (a as User).id === (b as User).id;
    }
  }

  it('should use custom compareWith', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ComplexValueHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    const checkboxes = groupComp['checkboxes']();
    const userA = hFixture.componentInstance.userA;

    groupComp.writeValue([userA]);
    hFixture.detectChanges();
    expect(checkboxes[0]['_checked']()).toBe(true);
    expect(checkboxes[1]['_checked']()).toBe(false);
  });

  it('should toggle complex values with custom compareWith', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ComplexValueHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    const checkboxes = groupComp['checkboxes']();
    const userA = hFixture.componentInstance.userA;

    groupComp.writeValue([userA]);
    hFixture.detectChanges();
    checkboxes[0].checkedChange.emit(false);
    hFixture.detectChanges();
    const value = groupComp['_value']();
    expect(value).toEqual([]);
  });

  it('should toggle complex values with custom compareWith (userB)', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ComplexValueHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    const checkboxes = groupComp['checkboxes']();
    const userB = hFixture.componentInstance.userB;

    groupComp.writeValue([userB]);
    hFixture.detectChanges();
    expect(checkboxes[0]['_checked']()).toBe(false);
    expect(checkboxes[1]['_checked']()).toBe(true);
  });
});

describe('SolarisCheckboxGroupComponent child disabled individual', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group [selectAll]="true">
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b" [disabled]="true">B</solaris-checkbox>
        <solaris-checkbox value="c" [readonly]="true">C</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class IndividualStateHost {}

  it('should preserve individual disabled', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(IndividualStateHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    const checkboxes = groupComp['checkboxes']();
    expect(checkboxes[0].disabled).toBe(false);
    expect(checkboxes[1].disabled).toBe(true);
    expect(checkboxes[2].readonly).toBe(true);
  });
});

describe('SolarisCheckboxGroupComponent reactive forms', () => {
  @Component({
    standalone: true,
    imports: [
      ReactiveFormsModule,
      SolarisCheckboxGroupComponent,
      SolarisCheckboxComponent,
    ],
    template: `
      <solaris-checkbox-group [formControl]="control">
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class ReactiveHost {
    readonly control = new FormControl(['a']);
  }

  it('should bind form control value', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ReactiveHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    const checkboxes = groupComp['checkboxes']();
    expect(checkboxes[0]['_checked']()).toBe(true);
    expect(checkboxes[1]['_checked']()).toBe(false);
  });

  it('should update form control on child toggle', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ReactiveHost);
    hFixture.detectChanges();
    const groupComp = hFixture.debugElement.query(
      By.directive(SolarisCheckboxGroupComponent),
    ).componentInstance as SolarisCheckboxGroupComponent;
    const checkboxes = groupComp['checkboxes']();
    checkboxes[1].checkedChange.emit(true);
    hFixture.detectChanges();
    expect(hFixture.componentInstance.control.value).toEqual(['a', 'b']);
  });

  it('should reflect disabled state from form control', () => {
    configureSolarisTesting();
    const hFixture = TestBed.createComponent(ReactiveHost);
    hFixture.detectChanges();
    hFixture.componentInstance.control.disable();
    hFixture.detectChanges();
    const el = hFixture.nativeElement.querySelector(
      'solaris-checkbox-group',
    ) as HTMLElement;
    expect(el.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('SolarisCheckboxGroupComponent public API surface', () => {
  @Component({
    standalone: true,
    imports: [SolarisCheckboxGroupComponent, SolarisCheckboxComponent],
    template: `
      <solaris-checkbox-group [required]="true">
        <solaris-checkbox value="a">A</solaris-checkbox>
        <solaris-checkbox value="b">B</solaris-checkbox>
      </solaris-checkbox-group>
    `,
  })
  class ApiHost {}

  function getGroup(): any {
    const f = TestBed.createComponent(ApiHost);
    f.detectChanges();
    return f.debugElement.query(By.css('solaris-checkbox-group'))
      .componentInstance as any;
  }

  it('should expose state getters', () => {
    configureSolarisTesting();
    const group = getGroup();
    expect(group.disabled).toBe(false);
    expect(group.readonly).toBe(false);
    expect(group.invalid).toBe(false);
    expect(group.required).toBe(true);
    expect(group.focused).toBe(false);
    expect(group.describedByIds).toEqual([]);
  });

  it('should set describedByIds', () => {
    configureSolarisTesting();
    const group = getGroup();
    group.setDescribedByIds(['hint-1', 'error-1']);
    expect(group.describedByIds).toEqual(['hint-1', 'error-1']);
  });

  it('should focus the first checkbox', () => {
    configureSolarisTesting();
    const group = getGroup();
    const checkbox = group.checkboxes()[0];
    const focusSpy = vi.spyOn(checkbox, 'focus');
    group.focus();
    expect(focusSpy).toHaveBeenCalled();
  });
});
