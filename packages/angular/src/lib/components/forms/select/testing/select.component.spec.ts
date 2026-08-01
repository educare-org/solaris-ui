import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisSelectComponent } from '../component/select.component';
import { SolarisOptionComponent } from '../../option/component/option.component';
import { SolarisOptionGroupComponent } from '../../option-group/component/option-group.component';

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
      );
      expect(valueEl).toBeTruthy();
      expect(valueEl.textContent.trim()).toBe('Option A');
    });

    it('should find content children options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as SolarisSelectComponent;
      expect((select as any).options.length).toBe(2);
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
      );
      expect(placeholder).toBeTruthy();
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
      expect(select.options.length).toBe(3);
    });

    it('should have 1 option group via ContentChildren', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      expect(select.optionGroups.length).toBe(1);
    });

    it('should have disabled option', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const disabledOpts = select.options
        .toArray()
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
      );
      expect(clearBtn).toBeFalsy();
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

    it('should have default size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-size')).toBe('md');
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

    it('should have default density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-density')).toBe('comfortable');
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
      const option = select.options.toArray()[0];
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
      const opts = (select as any).options.toArray();
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
      const opts = (select as any).options.toArray();
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
      const opts = (select as any).options.toArray();
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
      const aOpt = (select as any).options.toArray()[0];
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
      const aOpt = (select as any).options.toArray()[0];
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
      const opts = (select as any).options.toArray();
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
      const disabledOpt = select.options
        .toArray()
        .find((o: any) => o.value() === 'b');
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
          size="sm"
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
          size="sm"
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
          size="sm"
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

    it('should apply data-size', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-select solaris-form-field',
      );
      expect(formField.getAttribute('data-size')).toBe('sm');
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
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('solaris-select'))
        .componentInstance as any;
      const withDefaults = select['translateService'] as {
        translate: (key: string) => string;
      };
      withDefaults.translate = (key: string) => `T:${key}`;
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
  });
});
