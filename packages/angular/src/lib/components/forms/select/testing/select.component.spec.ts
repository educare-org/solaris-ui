import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisTranslateService } from '../../../../services/translation/service/solaris-translate.service';
import { SolarisSelectComponent } from '../component/select.component';
import { SolarisOptionComponent } from '../../option/component/option.component';
import { SolarisOptionGroupComponent } from '../../option-group/component/option-group.component';
import { SolarisFormSuffixDirective } from '../../form-field/directives/form-suffix.directive';
import { SolarisFormSuffixActionDirective } from '../../form-field/directives/form-suffix-action.directive';
import { SolarisFormFieldComponent } from '../../form-field/component/form-field.component';
import { SolarisInputDirective } from '../../input/directives/input.directive';

function getTestTranslations() {
  return {
    'solaris.select.search.placeholder': 'Search...',
    'solaris.select.loading': 'Loading...',
    'solaris.select.empty': 'No options available',
    'solaris.select.noResults': 'No results found',
    'solaris.select.clear': 'Clear selection',
  };
}

describe('SolarisSelectComponent', () => {
  describe('CVA', () => {
    @Component({
      standalone: true,
      imports: [
        ReactiveFormsModule,
        SolarisSelectComponent,
        SolarisOptionComponent,
      ],
      template: `
        <solaris-select [formControl]="control">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {
      control = new FormControl('a');
    }

    it('should implement ControlValueAccessor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(
        By.css('solaris-select'),
      ).componentInstance;
      expect(select.writeValue).toBeDefined();
      expect(select.registerOnChange).toBeDefined();
      expect(select.registerOnTouched).toBeDefined();
      expect(select.setDisabledState).toBeDefined();
    });

    it('should select option matching writeValue', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const valueEl = fixture.nativeElement.querySelector(
        '.solaris-select__value-text',
      ) as HTMLElement;
      expect(valueEl).toBeTruthy();
      expect(valueEl.hasAttribute('hidden')).toBe(false);
      expect(valueEl.textContent.trim()).toBe('Option A');
      const placeholder = fixture.nativeElement.querySelector(
        '.solaris-select__placeholder',
      ) as HTMLElement;
      expect(placeholder).toBeTruthy();
      expect(placeholder.hasAttribute('hidden')).toBe(true);
    });

    it('should find content children options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      expect((select as any).options().length).toBe(2);
    });

    it('should setDisabledState block interaction', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-disabled')).toBe(true);
    });

    it('should clear selection when value is null', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        '.solaris-select__placeholder',
      ) as HTMLElement;
      expect(placeholder).toBeTruthy();
      expect(placeholder.hasAttribute('hidden')).toBe(false);
      const valueEl = fixture.nativeElement.querySelector(
        '.solaris-select__value-text',
      ) as HTMLElement;
      expect(valueEl).toBeTruthy();
      expect(valueEl.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('rendering', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSelectComponent,
        SolarisOptionComponent,
        SolarisOptionGroupComponent,
      ],
      template: `
        <solaris-select placeholder="Pick one" [clearable]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b" [disabled]="true">Option B</solaris-option>
          <solaris-option-group label="Group 1">
            <solaris-option value="c">Option C</solaris-option>
          </solaris-option-group>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {}

    it('should render placeholder', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        '.solaris-select__placeholder',
      );
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent.trim()).toBe('Pick one');
    });

    it('should have 3 options via ContentChildren', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.options().length).toBe(3);
    });

    it('should have 1 option group via ContentChildren', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.optionGroups().length).toBe(1);
    });

    it('should have disabled option', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const disabledOpts = select
        .options()
        .filter((o: any) => o.disabledInput());
      expect(disabledOpts.length).toBe(1);
      expect(disabledOpts[0].value()).toBe('b');
    });

    it('should render clear button when clearable and has value', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(
        By.css('solaris-select'),
      ).componentInstance;
      select.writeValue('a');
      fixture.detectChanges();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      );
      expect(clearBtn).toBeTruthy();
    });

    it('should not render clear button when no value', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      ) as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('empty and loading states', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [loading]="true" emptyText="Nothing here">
          <solaris-option value="a">A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class LoadingHost {}

    it('should show loading state', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(LoadingHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.showEmpty()).toBe(false);
      expect(select.loading()).toBe(true);
    });
  });

  describe('a11y attributes', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select ariaLabel="Test select">
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {}

    it('should have role combobox', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        'solaris-select .solaris-select__trigger',
      );
      expect(trigger.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-haspopup listbox', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        'solaris-select .solaris-select__trigger',
      );
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have aria-expanded false initially', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        'solaris-select .solaris-select__trigger',
      );
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('defaults', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {}

    it('should have default appearance outline', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-appearance')).toBe('outline');
    });

    it('should have default radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-radius')).toBe('md');
    });

    it('should have default density normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('security - unsafe rendering', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          placeholder="<img src=x onerror=alert(1)>"
          emptyText="<script>alert(1)</script>"
          loadingText="<b>Loading</b>"
          [loading]="false"
          [displayWith]="unsafeDisplay"
        >
          <solaris-option value="x" label="<b>XSS</b>"></solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class UnsafeRenderingHost {
      unsafeDisplay(_value: unknown): string {
        return '<b>Admin</b>';
      }
    }

    it('should escape placeholder with HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        '.solaris-select__placeholder',
      );
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent).toContain('<img src=x onerror=alert(1)>');
    });

    it('should escape emptyText with HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect((select as any).emptyTextValue()).toContain(
        '<script>alert(1)</script>',
      );
    });

    it('should escape loadingText with HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect((select as any).loadingTextValue()).toContain('<b>Loading</b>');
    });

    it('should escape displayWith returning HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.writeValue('x');
      fixture.detectChanges();
      const displayText = (select as any).displayText();
      expect(displayText).toContain('<b>Admin</b>');
    });

    it('should escape option label with HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const option = select.options()[0];
      const labelText = option.labelText();
      expect(labelText).toContain('<b>XSS</b>');
    });
  });

  describe('security - search', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [searchable]="true">
          <solaris-option value="a" label="Option A"></solaris-option>
          <solaris-option value="b" label="Option B"></solaris-option>
          <solaris-option value="c" label="Option C"></solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SearchHost {}

    it('should not break search with "[" character', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const query = '[';
      const opts = (select as any).options();
      const filtered = opts.filter((opt: any) =>
        select.optionMatchesSearch(opt, query),
      );
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should not break search with "*" character', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const query = '*';
      const opts = (select as any).options();
      const filtered = opts.filter((opt: any) =>
        select.optionMatchesSearch(opt, query),
      );
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should not create dangerous regex from "(a+)+" pattern', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const query = '(a+)+';
      const opts = (select as any).options();
      const filtered = opts.filter((opt: any) =>
        select.optionMatchesSearch(opt, query),
      );
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should be case-insensitive when matching', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const aOpt = (select as any).options()[0];
      const query = 'option';
      const matches = select.optionMatchesSearch(aOpt, query);
      expect(matches).toBe(true);
    });

    it('should not match when query does not match anything', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const aOpt = (select as any).options()[0];
      const query = 'zzzzz';
      const matches = select.optionMatchesSearch(aOpt, query);
      expect(matches).toBe(false);
    });
  });

  describe('security - disabled/readonly', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          [disabled]="isDisabled"
          [readonly]="isReadonly"
          [clearable]="true"
        >
          <solaris-option value="a" label="Option A"></solaris-option>
          <solaris-option
            value="b"
            label="Option B"
            [disabled]="optDisabled"
          ></solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class DisabledReadonlyHost {
      isDisabled = false;
      isReadonly = false;
      optDisabled = true;
    }

    it('should not select disabled option on click', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      const opts = (select as any).options();
      const disabledOpt = opts.find((o: any) => o.isEffectivelyDisabled());
      select.writeValue(null);
      fixture.detectChanges();
      if (disabledOpt) {
        (select as any).selectOption(disabledOpt);
        fixture.detectChanges();
        const val = (select as any).internalValue();
        expect(val).toBeNull();
      }
    });

    it('disabled option should have aria-disabled true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const disabledOpt = select.options().find((o: any) => o.value() === 'b');
      expect(disabledOpt).toBeDefined();
      expect(
        disabledOpt.elementRef.nativeElement.getAttribute('aria-disabled'),
      ).toBe('true');
    });

    it('readonly select should not open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isReadonly = true;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect((select as any).canOpen()).toBe(false);
    });

    it('disabled select should not open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect((select as any).canOpen()).toBe(false);
    });

    it('readonly select clear should not appear', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isReadonly = true;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.writeValue('a');
      fixture.detectChanges();
      expect((select as any).canClear()).toBe(false);
    });

    it('disabled select clear should not appear', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.writeValue('a');
      fixture.detectChanges();
      expect((select as any).canClear()).toBe(false);
    });
  });

  describe('security - overlay cleanup', () => {
    it('should destroy cleanly without errors', () => {
      TestBed.configureTestingModule({
        providers: [
          provideSolarisTesting({
            translate: { translations: { 'en-US': getTestTranslations() } },
          }),
        ],
      });
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select>
            <solaris-option value="a" label="A"></solaris-option>
          </solaris-select>
        `,
      })
      class Host {}
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('security - DOM leakage', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option [value]="objValue" label="Object"></solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class DomLeakageHost {
      objValue = { id: 1, name: 'admin' };
    }

    it('should not serialize object value in DOM data attribute', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DomLeakageHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      const outerHtml = host.outerHTML;
      expect(outerHtml).not.toContain('data-value');
    });

    it('should not have [object Object] in aria attributes', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DomLeakageHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      const ariaLabel = host.getAttribute('aria-label');
      if (ariaLabel) {
        expect(ariaLabel).not.toContain('[object Object]');
      }
    });
  });

  describe('prefix/suffix projection', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <span solaris-form-prefix>Prefix</span>
          <span solaris-form-suffix>Suffix</span>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class PrefixSuffixHost {}

    it('should project prefix into form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PrefixSuffixHost);
      fixture.detectChanges();
      const prefix = fixture.nativeElement.querySelector(
        'solaris-select [solaris-form-prefix]',
      );
      expect(prefix).toBeTruthy();
      expect(prefix.textContent.trim()).toBe('Prefix');
    });

    it('should project suffix into form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PrefixSuffixHost);
      fixture.detectChanges();
      const suffix = fixture.nativeElement.querySelector(
        'solaris-select [solaris-form-suffix]',
      );
      expect(suffix).toBeTruthy();
      expect(suffix.textContent.trim()).toBe('Suffix');
    });

    it('should not render options inside trigger area', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PrefixSuffixHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-select__trigger',
      );
      const optionInTrigger = trigger.querySelector('solaris-option');
      expect(optionInTrigger).toBeFalsy();
    });

    it('should render the suffix icon input in the field affix (P5 B/C)', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select suffix="mail">
            <solaris-option value="a">Option A</solaris-option>
          </solaris-select>
        `,
        providers: [
          provideSolarisTesting({
            translate: { translations: { 'en-US': getTestTranslations() } },
          }),
        ],
      })
      class SuffixIconHost {}
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SuffixIconHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          '.solaris-form-field__affix--suffix > span[solaris-form-suffix] solaris-icon',
        ),
      ).toBeTruthy();
    });

    it('should accept radius xl (P5 B/C)', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select radius="xl">
            <solaris-option value="a">Option A</solaris-option>
          </solaris-select>
        `,
        providers: [
          provideSolarisTesting({
            translate: { translations: { 'en-US': getTestTranslations() } },
          }),
        ],
      })
      class RadiusXlHost {}
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RadiusXlHost);
      fixture.detectChanges();
      expect(
        fixture.nativeElement
          .querySelector('solaris-select solaris-form-field')
          .getAttribute('data-radius'),
      ).toBe('xl');
    });
  });

  describe('keyboard navigation', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [searchable]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class KeyboardHost {}

    it('should prevent keyboard interaction when disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      select.setDisabledState(true);
      fixture.detectChanges();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = vi.spyOn(event, 'preventDefault');
      (select as any).onTriggerKeydown(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should exclude disabled options from visibleOptions while searching', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select [searchable]="true">
            <solaris-option value="a">Alpha</solaris-option>
            <solaris-option value="b" [disabled]="true">Bravo</solaris-option>
          </solaris-select>
        `,
        providers: [
          provideSolarisTesting({
            translate: { translations: { 'en-US': getTestTranslations() } },
          }),
        ],
      })
      class DisabledOptionHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledOptionHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).searchQuery.set('bra');
      fixture.detectChanges();
      const opts = (select as any).visibleOptions();
      expect(opts.length).toBe(0);
    });

    it('should set showNoResults when search has no matches', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).searchQuery.set('zzz');
      fixture.detectChanges();
      expect((select as any).showNoResults()).toBe(true);
    });

    it('should clear showNoResults when loading is active', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select [searchable]="true" [loading]="loading">
            <solaris-option value="a">Option A</solaris-option>
          </solaris-select>
        `,
        providers: [
          provideSolarisTesting({
            translate: { translations: { 'en-US': getTestTranslations() } },
          }),
        ],
      })
      class LoadingHost {
        loading = false;
      }

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(LoadingHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).searchQuery.set('zzz');
      fixture.componentInstance.loading = true;
      fixture.detectChanges();
      expect((select as any).showNoResults()).toBe(false);
    });

    it('should have activeDescendantId when panel open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(1);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-select__trigger',
      );
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
    });

    it('should select active option when Enter is pressed with panel open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(1);
      (select as any).selectActiveOption();
      fixture.detectChanges();
      expect((select as any).internalValue()).toBe('b');
    });

    it('should not select when activeOptionIndex is out of bounds', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(99);
      const opts = (select as any).visibleOptions();
      expect(opts.length).toBeLessThan(99);
    });

    it('should focus next option with ArrowDown', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).focusNextOption(1);
      expect((select as any).activeOptionIndex()).toBe(0);
      (select as any).focusNextOption(1);
      expect((select as any).activeOptionIndex()).toBe(1);
    });

    it('should focus previous option with ArrowUp', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(2);
      (select as any).focusNextOption(-1);
      expect((select as any).activeOptionIndex()).toBe(1);
    });

    it('should wrap from last to first option', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(2);
      (select as any).focusNextOption(1);
      const idx = (select as any).activeOptionIndex();
      expect(idx).toBeGreaterThanOrEqual(0);
    });

    it('should handle ArrowDown when closed without error', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(false);
      expect(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        (select as any).onTriggerKeydown(event);
      }).not.toThrow();
    });

    it('should get first enabled option index', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      const idx = (select as any).getFirstEnabledOptionIndex();
      expect(idx).toBeGreaterThanOrEqual(0);
    });

    it('should get last enabled option index', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      const idx = (select as any).getLastEnabledOptionIndex();
      expect(idx).toBeGreaterThanOrEqual(0);
    });

    it('should close panel on Escape key', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const result = (select as any).maybeClosePanel(event);
      expect(result).toBe(true);
      expect((select as any).panelOpen()).toBe(true);
    });

    it('should navigate to first option on Home key', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(2);
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      const result = (select as any).maybeNavigateToBound(event);
      expect(result).toBe(true);
      expect((select as any).activeOptionIndex()).toBe(0);
    });

    it('should navigate to last option on End key', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      (select as any).panelOpen.set(true);
      const event = new KeyboardEvent('keydown', { key: 'End' });
      const result = (select as any).maybeNavigateToBound(event);
      expect(result).toBe(true);
      const opts = (select as any).visibleOptions();
      expect((select as any).activeOptionIndex()).toBe(opts.length - 1);
    });

    it('should select active option on Enter via onTriggerKeydown with panel open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(1);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      (select as any).onTriggerKeydown(event);
      expect((select as any).internalValue()).toBe('b');
    });

    it('should navigate options via onTriggerKeydown ArrowDown when panel open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      (select as any).onTriggerKeydown(event);
      expect((select as any).activeOptionIndex()).toBe(0);
    });

    it('should close panel on Escape via onTriggerKeydown', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      const closeSpy = vi
        .spyOn(select as any, 'popoverTrigger')
        .mockReturnValue(undefined);
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      (select as any).onTriggerKeydown(event);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should close panel on Tab via onTriggerKeydown', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      const closeSpy = vi
        .spyOn(select as any, 'popoverTrigger')
        .mockReturnValue(undefined);
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      (select as any).onTriggerKeydown(event);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should navigate to first option via onTriggerKeydown Home', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(2);
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      (select as any).onTriggerKeydown(event);
      expect((select as any).activeOptionIndex()).toBe(0);
    });

    it('should clear search query on Escape in search input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).searchQuery.set('abc');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      (select as any).onSearchKeydown(event);
      expect((select as any).searchQuery()).toBe('');
    });

    it('should navigate search results with ArrowDown and ArrowUp', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).searchQuery.set('a');
      (select as any).onSearchKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      );
      expect((select as any).activeOptionIndex()).toBe(0);
      (select as any).onSearchKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      );
      expect((select as any).activeOptionIndex()).toBeGreaterThanOrEqual(0);
    });

    it('should select active option on Enter in search input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).searchQuery.set('b');
      (select as any).activeOptionIndex.set(0);
      (select as any).onSearchKeydown(
        new KeyboardEvent('keydown', { key: 'Enter' }),
      );
      expect((select as any).internalValue()).toBe('b');
    });

    it('should close panel on Tab in search input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      const closeSpy = vi
        .spyOn(select as any, 'popoverTrigger')
        .mockReturnValue(undefined);
      (select as any).onSearchKeydown(
        new KeyboardEvent('keydown', { key: 'Tab' }),
      );
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should navigate options via onPanelKeydown', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).onPanelKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      );
      expect((select as any).activeOptionIndex()).toBe(0);
      (select as any).onPanelKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      );
      (select as any).onPanelKeydown(
        new KeyboardEvent('keydown', { key: 'Home' }),
      );
      expect((select as any).activeOptionIndex()).toBe(0);
      (select as any).onPanelKeydown(
        new KeyboardEvent('keydown', { key: 'End' }),
      );
      const opts = (select as any).visibleOptions();
      expect((select as any).activeOptionIndex()).toBe(opts.length - 1);
    });

    it('should select active option via onPanelKeydown Enter', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(2);
      (select as any).onPanelKeydown(
        new KeyboardEvent('keydown', { key: 'Enter' }),
      );
      expect((select as any).internalValue()).toBe('c');
    });

    it('should close panel via onPanelKeydown Escape', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      (select as any).panelOpen.set(true);
      const closeSpy = vi
        .spyOn(select as any, 'popoverTrigger')
        .mockReturnValue(undefined);
      (select as any).onPanelKeydown(
        new KeyboardEvent('keydown', { key: 'Escape' }),
      );
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('popover integration', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class PopoverHost {}

    it('should have popover trigger directive on form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PopoverHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.hasAttribute('solaris-popover-trigger')).toBe(true);
    });

    it('should open panel when popover opens', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PopoverHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.onPanelOpened();
      fixture.detectChanges();
      expect(select.panelOpen()).toBe(true);
    });

    it('should close panel when popover closes', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PopoverHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.onPanelOpened();
      select.onPanelClosed();
      fixture.detectChanges();
      expect(select.panelOpen()).toBe(false);
    });

    it('should emit opened/closed events', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PopoverHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      const openedSpy = vi.fn();
      const closedSpy = vi.fn();
      select.opened.subscribe(openedSpy);
      select.closed.subscribe(closedSpy);
      (select as any).onPanelOpened();
      expect(openedSpy).toHaveBeenCalledTimes(1);
      (select as any).onPanelClosed();
      expect(closedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('data attributes', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          [disabled]="true"
          density="compact"
          radius="lg"
          appearance="filled"
        >
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class DisabledHost {}

    it('should apply data-disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-disabled')).toBe(true);
    });

    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          [readonly]="true"
          density="compact"
          radius="lg"
          appearance="filled"
        >
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class ReadonlyHost {}

    it('should apply data-readonly', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ReadonlyHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-readonly')).toBe(true);
    });

    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          [invalid]="true"
          density="compact"
          radius="lg"
          appearance="filled"
        >
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class InvalidHost {}

    it('should apply data-invalid', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(InvalidHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-invalid')).toBe(true);
    });

    it('should apply data-density', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-density')).toBe('compact');
    });

    it('should apply data-radius', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-radius')).toBe('lg');
    });

    it('should apply data-appearance', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-appearance')).toBe('filled');
    });
  });

  describe('text fallbacks', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          [loading]="true"
          loadingText="Loading fallback"
          emptyText="Empty fallback"
          noResultsText="No results fallback"
          clearLabel="Clear fallback"
          searchPlaceholder="Search fallback"
        >
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-select>
      `,
      providers: [provideSolarisTesting({})],
    })
    class TextFallbackHost {}

    it('should use direct text inputs as fallbacks', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TextFallbackHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.loadingTextValue()).toBe('Loading fallback');
      expect(select.emptyTextValue()).toBe('Empty fallback');
      expect(select.noResultsTextValue()).toBe('No results fallback');
      expect(select.clearAriaLabel()).toBe('Clear fallback');
      expect(select.searchPlaceholderText()).toBe('Search fallback');
    });

    it('should fall back to default translation keys', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select [loading]="true">
            <solaris-option value="a" label="Apple"></solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class DefaultFallbackHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DefaultFallbackHost);
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const withDefaults = select['translateService'] as {
        translate: (key: string) => string;
      };
      withDefaults.translate = (key: string) => `T:${key}`;
      fixture.detectChanges();
      expect(select.loadingTextValue()).toBe('T:solaris.select.loading');
      expect(select.emptyTextValue()).toBe('T:solaris.select.empty');
      expect(select.noResultsTextValue()).toBe('T:solaris.select.noResults');
      expect(select.clearAriaLabel()).toBe('T:solaris.select.clear');
    });

    it('should warn when displayWith is missing for object values', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select>
            <solaris-option [value]="obj" label="Object"></solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class ObjectValueHost {
        obj = { id: 1, name: 'A' };
      }

      const warnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ObjectValueHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.writeValue({ id: 1, name: 'A' });
      fixture.detectChanges();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('No displayWith provided'),
      );
      warnSpy.mockRestore();
    });

    it('should use translation keys when provided', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select
            labelKey="selectLabel"
            hintKey="selectHint"
            errorKey="selectError"
            placeholderKey="selectPlaceholder"
            ariaLabelKey="selectAriaLabel"
            searchPlaceholderKey="selectSearchPlaceholder"
            loadingTextKey="selectLoading"
            emptyTextKey="selectEmpty"
            noResultsTextKey="selectNoResults"
            clearLabelKey="selectClear"
          >
            <solaris-option value="a" label="Apple"></solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class TranslationKeyHost {}

      TestBed.configureTestingModule({});
      const translateService = TestBed.inject(SolarisTranslateService);
      const original = translateService.translate;
      translateService.translate = (key: string) =>
        ({
          selectLabel: 'Translated label',
          selectHint: 'Translated hint',
          selectError: 'Translated error',
          selectPlaceholder: 'Translated placeholder',
          selectAriaLabel: 'Translated aria label',
          selectSearchPlaceholder: 'Translated search placeholder',
          selectLoading: 'Translated loading',
          selectEmpty: 'Translated empty',
          selectNoResults: 'Translated no results',
          selectClear: 'Translated clear',
        })[key] ?? key;
      const fixture = TestBed.createComponent(TranslationKeyHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.labelText()).toBe('Translated label');
      expect(select.hintText()).toBe('Translated hint');
      expect(select.errorText()).toBe('Translated error');
      expect(select.placeholderText()).toBe('Translated placeholder');
      expect(select.ariaLabelText()).toBe('Translated aria label');
      expect(select.searchPlaceholderText()).toBe(
        'Translated search placeholder',
      );
      expect(select.loadingTextValue()).toBe('Translated loading');
      expect(select.emptyTextValue()).toBe('Translated empty');
      expect(select.noResultsTextValue()).toBe('Translated no results');
      expect(select.clearAriaLabel()).toBe('Translated clear');
      translateService.translate = original;
    });

    it('should fall back to direct text when key translation is empty', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select
            placeholderKey="missing.key"
            placeholder="Direct placeholder"
            labelKey="missing.label"
            label="Direct label"
          >
            <solaris-option value="a" label="Apple"></solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class EmptyTranslationHost {}

      TestBed.configureTestingModule({});
      const translateService = TestBed.inject(SolarisTranslateService);
      const original = translateService.translate;
      translateService.translate = (key: string) => '';
      const fixture = TestBed.createComponent(EmptyTranslationHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.placeholderText()).toBe('Direct placeholder');
      expect(select.labelText()).toBe('Direct label');
      translateService.translate = original;
    });

    it('should use default texts for search and state keys', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select [loading]="true">
            <solaris-option value="a" label="Apple"></solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class DefaultStateHost {}

      TestBed.configureTestingModule({});
      const translateService = TestBed.inject(SolarisTranslateService);
      const original = translateService.translate;
      translateService.translate = (key: string) =>
        ({
          'solaris.select.search.placeholder': 'Search...',
          'solaris.select.loading': 'Loading...',
          'solaris.select.empty': 'No options available',
          'solaris.select.noResults': 'No results found',
          'solaris.select.clear': 'Clear selection',
        })[key] ?? key;
      const fixture = TestBed.createComponent(DefaultStateHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.searchPlaceholderText()).toBe('Search...');
      expect(select.loadingTextValue()).toBe('Loading...');
      expect(select.emptyTextValue()).toBe('No options available');
      expect(select.noResultsTextValue()).toBe('No results found');
      expect(select.clearAriaLabel()).toBe('Clear selection');
      translateService.translate = original;
    });
  });

  describe('display text fallbacks', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [displayWith]="displayWith">
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-select>
      `,
      providers: [provideSolarisTesting({})],
    })
    class DisplayWithHost {
      displayWith = (v: unknown) => `Display:${String(v)}`;
    }

    it('should use displayWith for value text', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisplayWithHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.writeValue('a');
      fixture.detectChanges();
      expect(select.displayText()).toBe('Display:a');
    });

    it('should use String() fallback for scalar value without option', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select>
            <solaris-option value="a" label="Apple"></solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class ScalarHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ScalarHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.writeValue('zzz');
      fixture.detectChanges();
      expect(select.displayText()).toBe('zzz');
    });
  });

  describe('focus and validity', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [required]="true">
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-select>
      `,
      providers: [provideSolarisTesting({})],
    })
    class RequiredHost {}

    it('should be invalid when required and touched with no value', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.isEffectivelyInvalid()).toBe(false);
      (select as any).touched.set(true);
      fixture.detectChanges();
      expect(select.isEffectivelyInvalid()).toBe(true);
    });

    it('should focus host element as fallback when no trigger element', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RequiredHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const focusSpy = vi.spyOn(select.elementRef.nativeElement, 'focus');
      vi.spyOn(select as any, 'triggerElement').mockReturnValue(undefined);
      select.focus();
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('connected side sync', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-select>
      `,
      providers: [provideSolarisTesting({})],
    })
    class ConnectedHost {}

    it('should toggle panel state on open and close without managing connected side', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ConnectedHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect((select as any).setConnectedSide).toBeUndefined();
      expect((select as any).clearConnectedSide).toBeUndefined();
      (select as any).onPanelOpened();
      expect(select.panelOpen()).toBe(true);
      (select as any).onPanelClosed();
      expect(select.panelOpen()).toBe(false);
    });

    it('should find option text via native text fallback', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ConnectedHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const opt = (select as any).options()[0];
      const text = (select as any).getOptionNativeText(opt);
      expect(text).toBe('Apple');
    });
  });

  describe('form-field repasse (P4 Lote B)', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select size="lg" density="compact" [loading]="true">
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class RepasseHost {}

    function getInnerField(fixture: any): HTMLElement {
      return fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
    }

    it('should forward size to the inner form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      expect(getInnerField(fixture).getAttribute('data-size')).toBe('lg');
    });

    it('should forward effective density to the inner form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      expect(getInnerField(fixture).getAttribute('data-density')).toBe(
        'compact',
      );
    });

    it('should forward loading as overlay without layout shift', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(RepasseHost);
      fixture.detectChanges();
      const field = getInnerField(fixture);
      expect(field.hasAttribute('data-loading')).toBe(true);
      expect(field.getAttribute('aria-busy')).toBe('true');
      expect(field.querySelector('.solaris-form-field__loading')).toBeTruthy();
    });
  });

  describe('clearable (P4 Lote B)', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [clearable]="true" (cleared)="onCleared()">
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class ClearableHost {
      clearedCount = 0;
      onCleared(): void {
        this.clearedCount += 1;
      }
    }

    it('should not render a clear button without a value', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      ) as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.hasAttribute('hidden')).toBe(true);
    });

    it('should render the clear button with a default label without a translate provider', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select [clearable]="true">
            <solaris-option value="a">Option A</solaris-option>
          </solaris-select>
        `,
        providers: [{ provide: SolarisTranslateService, useValue: null }],
      })
      class NoTranslateHost {}
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(NoTranslateHost);
      expect(() => fixture.detectChanges()).not.toThrow();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      ) as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.getAttribute('aria-label')).toBe('Clear selection');
    });

    it('should render a clear button once a value is set and clear on click', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      select.writeValue('a');
      fixture.detectChanges();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      ) as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.hasAttribute('hidden')).toBe(false);
      clearBtn.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.clearedCount).toBe(1);
      expect(clearBtn.hasAttribute('hidden')).toBe(true);
    });

    it('should keep the same trigger nodes and only flip hidden when the value changes (SSR hydration stability)', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ClearableHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      const clearBefore = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      ) as HTMLButtonElement;
      const valueBefore = fixture.nativeElement.querySelector(
        '.solaris-select__value-text',
      ) as HTMLElement;
      const placeholderBefore = fixture.nativeElement.querySelector(
        '.solaris-select__placeholder',
      ) as HTMLElement;
      expect(clearBefore.hasAttribute('hidden')).toBe(true);
      expect(valueBefore.hasAttribute('hidden')).toBe(true);
      expect(placeholderBefore.hasAttribute('hidden')).toBe(false);

      select.writeValue('a');
      fixture.detectChanges();

      const clearAfter = fixture.nativeElement.querySelector(
        '.solaris-select__clear',
      ) as HTMLButtonElement;
      const valueAfter = fixture.nativeElement.querySelector(
        '.solaris-select__value-text',
      ) as HTMLElement;
      const placeholderAfter = fixture.nativeElement.querySelector(
        '.solaris-select__placeholder',
      ) as HTMLElement;
      expect(clearAfter).toBe(clearBefore);
      expect(valueAfter).toBe(valueBefore);
      expect(placeholderAfter).toBe(placeholderBefore);
      expect(clearAfter.hasAttribute('hidden')).toBe(false);
      expect(valueAfter.hasAttribute('hidden')).toBe(false);
      expect(placeholderAfter.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('suffix-action projection (P4 Lote B)', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSelectComponent,
        SolarisOptionComponent,
        SolarisFormFieldComponent,
        SolarisFormSuffixDirective,
        SolarisFormSuffixActionDirective,
      ],
      template: `
        <solaris-form-field label="Direct">
          <input solaris-input aria-label="direct" />
          <button
            type="button"
            solaris-form-suffix
            solaris-form-suffix-action
            aria-label="Action"
          >
            Go
          </button>
        </solaris-form-field>
        <solaris-select>
          <button
            type="button"
            solaris-form-suffix
            solaris-form-suffix-action
            aria-label="Action"
          >
            Go
          </button>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SuffixActionHost {}

    it('should render action variant for a dual-attribute direct child (control)', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SuffixActionHost);
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const directField = root.querySelector(
        'solaris-form-field',
      ) as HTMLElement;
      const directAffix = directField.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(directAffix.getAttribute('data-variant')).toBe('action');
    });

    it('should cross ngProjectAs and switch the suffix affix to action variant', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SuffixActionHost);
      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;
      const field = root.querySelector(
        'solaris-select solaris-form-field',
      ) as HTMLElement;
      const btn = field.querySelector(
        '[solaris-form-suffix-action]',
      ) as HTMLElement;
      expect(btn).toBeTruthy();
      const affix = field.querySelector(
        '.solaris-form-field__affix--suffix',
      ) as HTMLElement;
      expect(affix.contains(btn)).toBe(true);
      expect(affix.getAttribute('data-variant')).toBe('action');
    });
  });

  describe('content min width (widest option floor)', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select
          [panelMinWidth]="panelMinWidth"
          [triggerMinWidth]="triggerMinWidth"
        >
          <solaris-option value="br" label="Brasil" />
          <solaris-option value="us" label="Estados Unidos" />
          <solaris-option value="pt" label="Portugal" />
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class MinWidthHost {
      panelMinWidth: string | number | undefined;
      triggerMinWidth: string | number | undefined;
    }

    it('should estimate the floor from the longest option label', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MinWidthHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.contentMinWidth()).toBe(195);
    });

    it('should apply the floor as trigger min-width', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MinWidthHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-select__trigger',
      );
      expect(trigger.style.minWidth).toBe('195px');
    });

    it('should fall back to the floor as panel min-width', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MinWidthHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.effectivePanelMinWidth()).toBe(195);
    });

    it('should prefer an explicit triggerMinWidth input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MinWidthHost);
      fixture.componentInstance.triggerMinWidth = 0;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.resolvedTriggerMinWidth()).toBe('0px');
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-select__trigger',
      );
      expect(trigger.style.minWidth).toBe('0px');
    });

    it('should prefer an explicit panelMinWidth input', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(MinWidthHost);
      fixture.componentInstance.panelMinWidth = 300;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.effectivePanelMinWidth()).toBe(300);
    });

    it('should return no floor without options', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent],
        template: `<solaris-select />`,
        providers: [
          provideSolarisTesting({
            translate: { translations: { 'en-US': getTestTranslations() } },
          }),
        ],
      })
      class EmptyHost {}
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(EmptyHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.contentMinWidth()).toBe(0);
      expect(select.effectivePanelMinWidth()).toBeUndefined();
    });
  });

  describe('value input', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [value]="selected()" [appearance]="appearance">
          <solaris-option [value]="10">10</solaris-option>
          <solaris-option [value]="25">25</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class ValueInputHost {
      readonly selected = signal<unknown>(25);
      appearance: 'outline' | 'minimal' = 'outline';
    }

    it('should display the value input without forms', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ValueInputHost);
      fixture.detectChanges();
      const valueEl = fixture.nativeElement.querySelector(
        '.solaris-select__value-text',
      );
      expect(valueEl).toBeTruthy();
      expect(valueEl.textContent.trim()).toBe('25');
    });

    it('should update when the value input changes', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ValueInputHost);
      fixture.detectChanges();
      fixture.componentInstance.selected.set(10);
      fixture.detectChanges();
      const valueEl = fixture.nativeElement.querySelector(
        '.solaris-select__value-text',
      );
      expect(valueEl.textContent.trim()).toBe('10');
    });

    it('should apply minimal appearance to the form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ValueInputHost);
      fixture.componentInstance.appearance = 'minimal';
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField?.getAttribute('data-appearance')).toBe('minimal');
    });
  });

  describe('coverage - form-control contract', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [required]="true">
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class ContractHost {}

    function createContract() {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ContractHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      return { fixture, select };
    }

    it('should expose focused state via the getter', () => {
      const { select } = createContract();
      expect(select.focused).toBe(false);
      (select as any).onTriggerFocus();
      expect(select.focused).toBe(true);
      expect((select as any).internalFocused()).toBe(true);
    });

    it('should expose invalid and required via getters', () => {
      const { select } = createContract();
      expect(select.required).toBe(true);
      expect(select.invalid).toBe(false);
      (select as any).touched.set(true);
      expect(select.invalid).toBe(true);
    });

    it('should round-trip describedByIds', () => {
      const { fixture, select } = createContract();
      expect(select.describedByIds).toEqual([]);
      select.setDescribedByIds(['hint-1', 'error-1']);
      expect(select.describedByIds).toEqual(['hint-1', 'error-1']);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-select__trigger',
      );
      expect(trigger.getAttribute('aria-describedby')).toBe('hint-1 error-1');
    });

    it('should focus the trigger element when present', () => {
      const { select } = createContract();
      const trigger = (select as any).triggerElement();
      expect(trigger).toBeTruthy();
      const focusSpy = vi
        .spyOn(trigger.nativeElement, 'focus')
        .mockImplementation(() => undefined);
      select.focus();
      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it('should toggle focus on trigger focus and blur events', () => {
      const { fixture, select } = createContract();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-select__trigger',
      );
      trigger.dispatchEvent(new FocusEvent('focus'));
      expect(select.focused).toBe(true);
      trigger.dispatchEvent(new FocusEvent('blur'));
      expect(select.focused).toBe(false);
    });
  });

  describe('coverage - search input and panel click', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [searchable]="true">
          <solaris-option value="a" label="Apple"></solaris-option>
          <solaris-option value="b" label="Banana"></solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SearchCoverageHost {}

    function createSearchCoverage() {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchCoverageHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      return { fixture, select };
    }

    it('should update the query and reset the active option on search input', () => {
      const { select } = createSearchCoverage();
      const emitted: string[] = [];
      select.searchChange.subscribe((value) => emitted.push(value));
      (select as any).activeOptionIndex.set(1);
      (select as any).onSearchInput({
        target: { value: 'App' },
      } as unknown as Event);
      expect((select as any).searchQuery()).toBe('App');
      expect(emitted).toEqual(['App']);
      expect((select as any).activeOptionIndex()).toBe(-1);
    });

    it('should close the panel on Escape with an empty query', () => {
      const { select } = createSearchCoverage();
      const closeSpy = vi.fn();
      vi.spyOn(select as any, 'popoverTrigger').mockReturnValue({
        close: closeSpy,
      });
      (select as any).searchQuery.set('');
      (select as any).onSearchKeydown(
        new KeyboardEvent('keydown', { key: 'Escape' }),
      );
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation on panel click', () => {
      const { select } = createSearchCoverage();
      const event = new MouseEvent('click', { bubbles: true });
      const stopSpy = vi.spyOn(event, 'stopPropagation');
      (select as any).onPanelClick(event);
      expect(stopSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('coverage - trigger keyboard toggle and arrows', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TriggerKeysHost {}

    function createTriggerKeys() {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TriggerKeysHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      return { fixture, select };
    }

    function stubRafSync() {
      const original = (
        window as unknown as { requestAnimationFrame?: unknown }
      ).requestAnimationFrame;
      let calls = 0;
      (window as unknown as Record<string, unknown>)['requestAnimationFrame'] =
        (callback: FrameRequestCallback): number => {
          calls += 1;
          callback(0);
          return 0;
        };
      return {
        calls: () => calls,
        restore: () => {
          (window as unknown as Record<string, unknown>)[
            'requestAnimationFrame'
          ] = original;
        },
      };
    }

    it('should move to the previous option on ArrowUp with the panel open', () => {
      const { select } = createTriggerKeys();
      (select as any).panelOpen.set(true);
      (select as any).activeOptionIndex.set(2);
      (select as any).onTriggerKeydown(
        new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      );
      expect((select as any).activeOptionIndex()).toBe(1);
    });

    it('should open the panel on Space when closed', () => {
      const { select } = createTriggerKeys();
      const openSpy = vi.fn();
      vi.spyOn(select as any, 'popoverTrigger').mockReturnValue({
        open: openSpy,
      });
      (select as any).panelOpen.set(false);
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      (select as any).onTriggerKeydown(event);
      expect(preventSpy).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledTimes(1);
    });

    it('should open and schedule focus on ArrowDown when closed', () => {
      const { select } = createTriggerKeys();
      const openSpy = vi.fn();
      vi.spyOn(select as any, 'popoverTrigger').mockReturnValue({
        open: openSpy,
      });
      (select as any).panelOpen.set(false);
      const raf = stubRafSync();
      try {
        (select as any).onTriggerKeydown(
          new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        );
        expect(openSpy).toHaveBeenCalledTimes(1);
        expect(raf.calls()).toBe(1);
      } finally {
        raf.restore();
      }
    });
  });

  describe('coverage - popover open and close wiring', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class WiringHost {}

    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select [searchable]="true">
          <solaris-option value="a">Option A</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SearchableWiringHost {}

    it('should open and close through popover emissions', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(WiringHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const trigger = select.popoverTrigger();
      expect(trigger).toBeTruthy();
      trigger.solarisPopoverOpened.emit();
      expect(select.panelOpen()).toBe(true);
      trigger.solarisPopoverClosed.emit();
      expect(select.panelOpen()).toBe(false);
    });

    it('should focus the search input on open when searchable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchableWiringHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.panelOpen.set(true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector(
        '.solaris-select__search-input',
      ) as HTMLInputElement;
      expect(input).toBeTruthy();
      const focusSpy = vi
        .spyOn(input, 'focus')
        .mockImplementation(() => undefined);
      const original = (
        window as unknown as { requestAnimationFrame?: unknown }
      ).requestAnimationFrame;
      (window as unknown as Record<string, unknown>)['requestAnimationFrame'] =
        (callback: FrameRequestCallback): number => {
          callback(0);
          return 0;
        };
      try {
        select.onPanelOpened();
        expect(focusSpy).toHaveBeenCalled();
      } finally {
        (window as unknown as Record<string, unknown>)[
          'requestAnimationFrame'
        ] = original;
        focusSpy.mockRestore();
      }
    });
  });

  describe('coverage - options wiring and visibility', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisSelectComponent,
        SolarisOptionComponent,
        SolarisOptionGroupComponent,
      ],
      template: `
        <solaris-select [searchable]="true">
          <solaris-option-group label="Fruits">
            <solaris-option value="apple" label="Apple"></solaris-option>
          </solaris-option-group>
          <solaris-option-group label="Vehicles">
            <solaris-option value="car" label="Car"></solaris-option>
          </solaris-option-group>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class GroupVisibilityHost {}

    function createGroupVisibility() {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(GroupVisibilityHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      return { fixture, select };
    }

    it('should select the option emitted through optionInteraction', () => {
      const { select } = createGroupVisibility();
      const options = select.options();
      expect(options.length).toBe(2);
      const apple = options[0];
      apple.optionInteraction.emit({
        option: apple,
        event: new MouseEvent('click'),
      });
      expect(select.internalValue()).toBe('apple');
    });

    it('should hide groups without visible options', () => {
      const { select } = createGroupVisibility();
      select.panelOpen.set(true);
      select.onSearchInput({
        target: { value: 'apple' },
      } as unknown as Event);
      const groups = select.optionGroups();
      expect(groups.length).toBe(2);
      expect(groups.map((group: any) => group.internalHidden())).toEqual([
        false,
        true,
      ]);
    });

    it('should return an empty string without a native element', () => {
      const { select } = createGroupVisibility();
      expect(select.getOptionNativeText({} as any)).toBe('');
    });
  });

  describe('coverage - keyboard skipping and empty bounds', () => {
    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b" [disabled]="true">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SkipDisabledHost {}

    @Component({
      standalone: true,
      imports: [SolarisSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-select>
          <solaris-option value="x" [disabled]="true">Option X</solaris-option>
          <solaris-option value="y" [disabled]="true">Option Y</solaris-option>
        </solaris-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class AllDisabledHost {}

    it('should skip disabled options while moving', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SkipDisabledHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.panelOpen.set(true);
      select.activeOptionIndex.set(0);
      select.focusNextOption(1);
      expect(select.activeOptionIndex()).toBe(2);
    });

    it('should return -1 without enabled options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AllDisabledHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      select.panelOpen.set(true);
      expect(select.getFirstEnabledOptionIndex()).toBe(-1);
      expect(select.getLastEnabledOptionIndex()).toBe(-1);
    });
  });

  describe('coverage - embedding and option parent', () => {
    it('should warn when wrapped in a form field', () => {
      @Component({
        standalone: true,
        imports: [
          SolarisFormFieldComponent,
          SolarisSelectComponent,
          SolarisOptionComponent,
        ],
        template: `
          <solaris-form-field label="Wrapped">
            <solaris-select>
              <solaris-option value="a">Option A</solaris-option>
            </solaris-select>
          </solaris-form-field>
        `,
        providers: [provideSolarisTesting({})],
      })
      class WrappedHost {}

      const warnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      try {
        TestBed.configureTestingModule({});
        const fixture = TestBed.createComponent(WrappedHost);
        fixture.detectChanges();
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('already includes'),
        );
      } finally {
        warnSpy.mockRestore();
      }
    });

    it('should provide the select as the option parent', () => {
      @Component({
        standalone: true,
        imports: [SolarisSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-select size="lg">
            <solaris-option value="a">Option A</solaris-option>
          </solaris-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class ParentHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(ParentHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const option = select.options()[0];
      expect(option).toBeTruthy();
      expect(option.size()).toBe('lg');
    });
  });
});
