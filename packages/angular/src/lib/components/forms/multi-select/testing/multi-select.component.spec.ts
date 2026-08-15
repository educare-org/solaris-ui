import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisMultiSelectComponent } from '../component/multi-select.component';
import { SolarisOptionComponent } from '../../option/component/option.component';
import { SolarisOptionGroupComponent } from '../../option-group/component/option-group.component';
import type { SolarisMultiSelectDisplayMode } from '../model/multi-select.types';

function getTestProviders() {
  return provideSolarisTesting({
    translate: { translations: { 'en-US': getTestTranslations() } },
  });
}

function getTestTranslations() {
  return {
    'solaris.multiSelect.search.placeholder': 'Search...',
    'solaris.multiSelect.loading': 'Loading...',
    'solaris.multiSelect.empty': 'No options available',
    'solaris.multiSelect.noResults': 'No results found',
    'solaris.multiSelect.clear': 'Clear selection',
    'solaris.multiSelect.selectAll': 'Select all',
    'solaris.multiSelect.removeChip': 'Remove',
    'solaris.multiSelect.selectedCount.singular': '1 selected',
    'solaris.multiSelect.selectedCount.plural': '{{ count }} selected',
  };
}

describe('SolarisMultiSelectComponent', () => {
  describe('CVA', () => {
    @Component({
      standalone: true,
      imports: [
        ReactiveFormsModule,
        SolarisMultiSelectComponent,
        SolarisOptionComponent,
      ],
      template: `
        <solaris-multi-select [formControl]="control">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {
      control = new FormControl(['a']);
    }

    it('should implement ControlValueAccessor', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance;
      expect(multiSelect.writeValue).toBeDefined();
      expect(multiSelect.registerOnChange).toBeDefined();
      expect(multiSelect.registerOnTouched).toBeDefined();
      expect(multiSelect.setDisabledState).toBeDefined();
    });

    it('should writeValue with array selects correct options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.internalValue()).toEqual(['a']);
    });

    it('should writeValue with null normalize to []', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(null);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual([]);
    });

    it('should writeValue with undefined normalize to []', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(undefined);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual([]);
    });

    it('should registerOnChange emit new array', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      let emitted: unknown[] | undefined;
      multiSelect.registerOnChange((v: unknown[]) => {
        emitted = v;
      });
      multiSelect.toggleOption(multiSelect.options()[1]);
      fixture.detectChanges();
      expect(emitted).toEqual(['a', 'b']);
    });

    it('should registerOnTouched be called', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      let touched = false;
      multiSelect.registerOnTouched(() => {
        touched = true;
      });
      multiSelect.markAsTouched();
      expect(touched).toBe(true);
    });

    it('should setDisabledState work', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.setDisabledState(true);
      fixture.detectChanges();
      expect(multiSelect.isEffectivelyDisabled()).toBe(true);
    });
  });

  describe('value and selection', () => {
    @Component({
      standalone: true,
      imports: [
        ReactiveFormsModule,
        SolarisMultiSelectComponent,
        SolarisOptionComponent,
      ],
      template: `
        <solaris-multi-select [formControl]="control">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c" [disabled]="true">Option C</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {
      control = new FormControl(['a']);
    }

    it('should select multiple options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.toggleOption(multiSelect.options()[1]);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a', 'b']);
    });

    it('should deselect option', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.toggleOption(multiSelect.options()[0]);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual([]);
    });

    it('should not select disabled option', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.toggleOption(multiSelect.options()[2]);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a']);
    });

    it('should emit valueChange with new array', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      let emitted: unknown[] | undefined;
      multiSelect.valueChange.subscribe((v: unknown[]) => {
        emitted = v;
      });
      multiSelect.toggleOption(multiSelect.options()[1]);
      fixture.detectChanges();
      expect(emitted).toEqual(['a', 'b']);
    });

    it('should not mutate original array', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const original = ['a'];
      multiSelect.writeValue(original);
      fixture.detectChanges();
      multiSelect.toggleOption(multiSelect.options()[1]);
      fixture.detectChanges();
      expect(original).toEqual(['a']);
    });
  });

  describe('display', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          placeholder="Select items"
          [displayMode]="displayMode"
          [maxVisibleChips]="maxChips"
        >
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {
      displayMode = 'summary' as any;
      maxChips = 3;
    }

    it('should show placeholder without selection', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        '.solaris-multi-select__placeholder',
      );
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent.trim()).toBe('Select items');
    });

    it('should show summary count', () => {
      TestBed.configureTestingModule({
        providers: [getTestProviders()],
      });
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      fixture.detectChanges();
      const chipLabel = fixture.nativeElement.querySelector(
        '.solaris-multi-select__chip-label',
      );
      expect(chipLabel).toBeTruthy();
      expect(chipLabel.textContent.trim()).toContain('2 selected');
    });

    it('should show comma display', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.displayMode = 'comma';
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      fixture.detectChanges();
      const valueText = fixture.nativeElement.querySelector(
        '.solaris-multi-select__value-text',
      );
      expect(valueText).toBeTruthy();
      expect(valueText.textContent.trim()).toContain('Option A');
      expect(valueText.textContent.trim()).toContain('Option B');
    });

    it('should show chips display', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.displayMode = 'chips';
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      fixture.detectChanges();
      const chips = fixture.nativeElement.querySelectorAll(
        '.solaris-multi-select__chip',
      );
      expect(chips.length).toBe(2);
    });

    it('should remove chip on click', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.displayMode = 'chips';
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      fixture.detectChanges();
      const removeBtn = fixture.nativeElement.querySelector(
        '.solaris-multi-select__chip-remove',
      );
      expect(removeBtn).toBeTruthy();
      removeBtn.click();
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['b']);
    });

    it('should respect maxVisibleChips', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.displayMode = 'chips';
      fixture.componentInstance.maxChips = 2;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b', 'c']);
      fixture.detectChanges();
      const chips = fixture.nativeElement.querySelectorAll(
        '.solaris-multi-select__chip',
      );
      expect(chips.length).toBe(2);
      const overflow = fixture.nativeElement.querySelector(
        '.solaris-multi-select__chip-overflow',
      );
      expect(overflow).toBeTruthy();
      expect(overflow.textContent.trim()).toBe('+1');
    });
  });

  describe('auto display', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          placeholder="Select items"
          [displayMode]="displayMode"
        >
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
          <solaris-option value="d">Option D</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class AutoHost {
      displayMode: SolarisMultiSelectDisplayMode = 'auto';
    }

    it('should default displayMode to auto', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.displayMode()).toBe('auto');
    });

    it('should show count-only when triggerWidth is 0', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b', 'c']);
      fixture.detectChanges();
      expect(multiSelect.showCountOnly()).toBe(true);
      expect(multiSelect.autoChipCount()).toBe(0);
      expect(multiSelect.autoOverflowCount()).toBe(3);
    });

    it('should show chips when triggerWidth is sufficient', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.triggerWidth.set(500);
      multiSelect.writeValue(['a', 'b']);
      fixture.detectChanges();
      expect(multiSelect.showCountOnly()).toBe(false);
      expect(multiSelect.autoChipCount()).toBeGreaterThan(0);
      expect(multiSelect.autoVisibleChips().length).toBe(
        multiSelect.autoChipCount(),
      );
    });

    it('should show overflow +N when chips exceed available width', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.triggerWidth.set(100);
      multiSelect.writeValue(['a', 'b', 'c', 'd']);
      fixture.detectChanges();
      expect(multiSelect.autoChipCount()).toBeLessThan(4);
      expect(multiSelect.autoShowOverflow()).toBe(true);
      expect(multiSelect.autoOverflowCount()).toBe(
        4 - multiSelect.autoChipCount(),
      );
    });

    it('should compute overflow tooltip text from hidden chips labels', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.triggerWidth.set(100);
      multiSelect.writeValue(['a', 'b', 'c', 'd']);
      fixture.detectChanges();
      const hidden = multiSelect.autoOverflowCount();
      expect(multiSelect.autoOverflowTooltipText()).toBeTruthy();
      expect(multiSelect.autoOverflowTooltipText().split(',').length).toBe(
        hidden,
      );
    });

    it('should compute count tooltip text from all selected labels', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b', 'c']);
      fixture.detectChanges();
      expect(multiSelect.countTooltipText()).toBe(
        'Option A, Option B, Option C',
      );
    });

    it('should remove last chip on Backspace in search', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b', 'c']);
      fixture.detectChanges();
      expect(multiSelect.internalValue().length).toBe(3);
      const event = { key: 'Backspace', preventDefault: vi.fn() };
      multiSelect.onSearchKeydown(event as any);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a', 'b']);
    });

    it('should NOT remove chip on Backspace when searchQuery is non-empty', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b', 'c']);
      multiSelect.searchQuery.set('x');
      fixture.detectChanges();
      multiSelect.onSearchKeydown({
        key: 'Backspace',
        preventDefault: vi.fn(),
      } as any);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('search', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [searchable]="true">
          <solaris-option value="a" label="Apple"></solaris-option>
          <solaris-option value="b" label="Banana"></solaris-option>
          <solaris-option value="c" label="Cherry"></solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SearchHost {}

    it('should filter options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const opts = multiSelect.options();
      const filtered = opts.filter((o: any) =>
        multiSelect.optionMatchesSearch(o, 'app'),
      );
      expect(filtered.length).toBe(1);
      expect(filtered[0].value()).toBe('a');
    });

    it('should emit searchChange', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      let emitted = '';
      multiSelect.searchChange.subscribe((v: string) => {
        emitted = v;
      });
      multiSelect.onSearchInput({ target: { value: 'test' } } as any);
      fixture.detectChanges();
      expect(emitted).toBe('test');
    });

    it('should show empty state when no results', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.searchQuery.set('zzzzz');
      fixture.detectChanges();
      expect(multiSelect.showNoResults()).toBe(true);
    });

    it('should preserve selection when filtered out', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      fixture.detectChanges();
      multiSelect.searchQuery.set('banana');
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a']);
    });
  });

  describe('clear', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [clearable]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {}

    it('should clear selection', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      fixture.detectChanges();
      multiSelect.clearValue();
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual([]);
    });

    it('should not show clear button without selection', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-multi-select__clear',
      );
      expect(clearBtn).toBeFalsy();
    });

    it('should show clear button with selection', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      fixture.detectChanges();
      const clearBtn = fixture.nativeElement.querySelector(
        '.solaris-multi-select__clear',
      );
      expect(clearBtn).toBeTruthy();
    });

    it('should not show clear in disabled state', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      multiSelect.setDisabledState(true);
      fixture.detectChanges();
      expect(multiSelect.canClear()).toBe(false);
    });

    it('should emit cleared', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      fixture.detectChanges();
      let cleared = false;
      multiSelect.cleared.subscribe(() => {
        cleared = true;
      });
      multiSelect.clearValue();
      expect(cleared).toBe(true);
    });
  });

  describe('select all', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [selectAll]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c" [disabled]="true">Option C</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SelectAllHost {}

    it('should select all enabled options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SelectAllHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.handleSelectAll();
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a', 'b']);
    });

    it('should deselect all when already selected', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SelectAllHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.handleSelectAll();
      fixture.detectChanges();
      multiSelect.handleSelectAll();
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual([]);
    });

    it('should show partial state', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SelectAllHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      fixture.detectChanges();
      expect(multiSelect.isPartialSelected()).toBe(true);
      expect(multiSelect.isAllSelected()).toBe(false);
    });

    it('should not affect disabled options', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SelectAllHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.handleSelectAll();
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a', 'b']);
      expect(multiSelect.internalValue()).not.toContain('c');
    });
  });

  describe('validation', () => {
    @Component({
      standalone: true,
      imports: [
        ReactiveFormsModule,
        SolarisMultiSelectComponent,
        SolarisOptionComponent,
      ],
      template: `
        <solaris-multi-select
          [required]="required"
          [minSelected]="min"
          [maxSelected]="max"
          [formControl]="control"
        >
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class TestHost {
      control = new FormControl([]);
      required = false;
      min: number | undefined = undefined;
      max: number | undefined = undefined;
    }

    it('should be invalid with required and empty', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.required = true;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.markAsTouched();
      fixture.detectChanges();
      expect(multiSelect.isEffectivelyInvalid()).toBe(true);
    });

    it('should be invalid below minSelected', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.min = 2;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      multiSelect.markAsTouched();
      fixture.detectChanges();
      expect(multiSelect.isEffectivelyInvalid()).toBe(true);
    });

    it('should be valid when minSelected met', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.min = 1;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      multiSelect.markAsTouched();
      fixture.detectChanges();
      expect(multiSelect.isEffectivelyInvalid()).toBe(false);
    });

    it('should be invalid above maxSelected', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.componentInstance.max = 1;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      multiSelect.markAsTouched();
      fixture.detectChanges();
      expect(multiSelect.isEffectivelyInvalid()).toBe(true);
    });
  });

  describe('a11y attributes', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select ariaLabel="Test multi select">
          <solaris-option value="a">Option A</solaris-option>
        </solaris-multi-select>
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
        'solaris-multi-select .solaris-multi-select__trigger',
      );
      expect(trigger.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-haspopup listbox', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        'solaris-multi-select .solaris-multi-select__trigger',
      );
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have aria-expanded false initially', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        'solaris-multi-select .solaris-multi-select__trigger',
      );
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-multiselectable', async () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-multi-select__trigger',
      );
      trigger.click();
      fixture.detectChanges();
      await fixture.whenStable();
      const panel = document.querySelector('[role="listbox"]');
      expect(panel).toBeTruthy();
      expect(panel!.getAttribute('aria-multiselectable')).toBe('true');
    });
  });

  describe('defaults', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-multi-select>
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
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.getAttribute('data-appearance')).toBe('outline');
    });

    it('should have default radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.getAttribute('data-radius')).toBe('md');
    });

    it('should have default density normal', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.getAttribute('data-density')).toBe('normal');
    });
  });

  describe('data attributes', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          [disabled]="true"
          density="compact"
          radius="lg"
          appearance="filled"
        >
          <solaris-option value="a">Option A</solaris-option>
        </solaris-multi-select>
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
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-disabled')).toBe(true);
    });

    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          [readonly]="true"
          density="compact"
          radius="lg"
          appearance="filled"
        >
          <solaris-option value="a">Option A</solaris-option>
        </solaris-multi-select>
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
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-readonly')).toBe(true);
    });

    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          [invalid]="true"
          density="compact"
          radius="lg"
          appearance="filled"
        >
          <solaris-option value="a">Option A</solaris-option>
        </solaris-multi-select>
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
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.hasAttribute('data-invalid')).toBe(true);
    });

    it('should apply data-density', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.getAttribute('data-density')).toBe('compact');
    });

    it('should apply data-radius', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.getAttribute('data-radius')).toBe('lg');
    });

    it('should apply data-appearance', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const formField = fixture.nativeElement.querySelector(
        'solaris-multi-select solaris-form-field',
      );
      expect(formField.getAttribute('data-appearance')).toBe('filled');
    });
  });

  describe('security - unsafe rendering', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          placeholder="<img src=x onerror=alert(1)>"
          emptyText="<script>alert(1)</script>"
          loadingText="<b>Loading</b>"
          [loading]="false"
          [displayWith]="unsafeDisplay"
        >
          <solaris-option value="x" label="<b>XSS</b>"></solaris-option>
        </solaris-multi-select>
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
        '.solaris-multi-select__placeholder',
      );
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent).toContain('<img src=x onerror=alert(1)>');
    });

    it('should escape emptyText with HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.emptyTextValue()).toContain(
        '<script>alert(1)</script>',
      );
    });

    it('should escape displayWith returning HTML-like string', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(UnsafeRenderingHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['x']);
      fixture.detectChanges();
      const label = multiSelect.getOptionDisplayLabel(multiSelect.options()[0]);
      expect(label).toContain('<b>Admin</b>');
    });
  });

  describe('security - search', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [searchable]="true">
          <solaris-option value="a" label="Option A"></solaris-option>
          <solaris-option value="b" label="Option B"></solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SearchHost {}

    it('should not break search with special characters', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const opts = multiSelect.options();
      const filtered = opts.filter((opt: any) =>
        multiSelect.optionMatchesSearch(opt, '['),
      );
      expect(Array.isArray(filtered)).toBe(true);
    });

    it('should be case-insensitive', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SearchHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const aOpt = multiSelect.options()[0];
      expect(multiSelect.optionMatchesSearch(aOpt, 'option')).toBe(true);
    });
  });

  describe('security - disabled/readonly', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
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
        </solaris-multi-select>
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
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const disabledOpt = multiSelect
        .options()
        .find((o: any) => o.isEffectivelyDisabled());
      multiSelect.writeValue([]);
      fixture.detectChanges();
      if (disabledOpt) {
        multiSelect.toggleOption(disabledOpt);
        fixture.detectChanges();
        expect(multiSelect.internalValue()).toEqual([]);
      }
    });

    it('disabled option should have aria-disabled true', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const disabledOpt = multiSelect.options()[1] as any;
      const optEl = disabledOpt.elementRef.nativeElement;
      expect(optEl.getAttribute('aria-disabled')).toBe('true');
    });

    it('readonly should not open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isReadonly = true;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.canOpen()).toBe(false);
    });

    it('disabled should not open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.canOpen()).toBe(false);
    });

    it('readonly clear should not appear', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledReadonlyHost);
      fixture.componentInstance.isReadonly = true;
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a']);
      fixture.detectChanges();
      expect(multiSelect.canClear()).toBe(false);
    });
  });

  describe('overlay cleanup', () => {
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
        imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-multi-select>
            <solaris-option value="a" label="A"></solaris-option>
          </solaris-multi-select>
        `,
      })
      class Host {}
      const fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('prefix/suffix projection', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select>
          <span solaris-form-prefix>Prefix</span>
          <span solaris-form-suffix>Suffix</span>
          <solaris-option value="a">Option A</solaris-option>
        </solaris-multi-select>
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
        'solaris-multi-select [solaris-form-prefix]',
      );
      expect(prefix).toBeTruthy();
      expect(prefix.textContent.trim()).toBe('Prefix');
    });

    it('should project suffix into form field', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PrefixSuffixHost);
      fixture.detectChanges();
      const suffix = fixture.nativeElement.querySelector(
        'solaris-multi-select [solaris-form-suffix]',
      );
      expect(suffix).toBeTruthy();
      expect(suffix.textContent.trim()).toBe('Suffix');
    });

    it('should not render options inside trigger area', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(PrefixSuffixHost);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-multi-select__trigger',
      );
      const optionInTrigger = trigger.querySelector('solaris-option');
      expect(optionInTrigger).toBeFalsy();
    });
  });

  describe('backspace behavior', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [searchable]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class BackspaceHost {}

    it('should not toggle option when search query is non-empty', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(BackspaceHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      multiSelect.searchQuery.set('text');
      fixture.detectChanges();
      const initialLength = multiSelect.internalValue().length;
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      multiSelect.onSearchKeydown(event);
      fixture.detectChanges();
      expect(multiSelect.internalValue().length).toBe(initialLength);
    });

    it('should remove last selected option when search query is empty', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(BackspaceHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue(['a', 'b']);
      multiSelect.searchQuery.set('');
      fixture.detectChanges();
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      multiSelect.onSearchKeydown(event);
      fixture.detectChanges();
      expect(multiSelect.internalValue()).toEqual(['a']);
    });
  });

  describe('keyboard navigation', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [searchable]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
          <solaris-option value="c">Option C</solaris-option>
        </solaris-multi-select>
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
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.setDisabledState(true);
      fixture.detectChanges();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = vi.spyOn(event, 'preventDefault');
      multiSelect.onTriggerKeydown(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should have activeDescendantId when panel open', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(KeyboardHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.panelOpen.set(true);
      multiSelect.activeOptionIndex.set(1);
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '.solaris-multi-select__trigger',
      );
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
    });
  });

  describe('displayMode auto', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select displayMode="auto">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class AutoDisplayHost {}

    it('should have auto display mode set', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoDisplayHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.displayMode()).toBe('auto');
    });

    it('should show placeholder when no value', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(AutoDisplayHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      multiSelect.writeValue([]);
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        '.solaris-multi-select__placeholder',
      );
      expect(placeholder).toBeTruthy();
    });
  });

  describe('selectAll readonly guard', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [selectAll]="true" [readonly]="true">
          <solaris-option value="a">Option A</solaris-option>
          <solaris-option value="b">Option B</solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class SelectAllReadonlyHost {}

    it('should not call selectAll when readonly', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(SelectAllReadonlyHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const spy = vi.spyOn(multiSelect, 'handleSelectAll');
      multiSelect.handleSelectAll();
      expect(multiSelect.isEffectivelyReadonly()).toBe(true);
      expect(multiSelect.internalValue()).toEqual([]);
    });
  });

  describe('option groups', () => {
    @Component({
      standalone: true,
      imports: [
        SolarisMultiSelectComponent,
        SolarisOptionComponent,
        SolarisOptionGroupComponent,
      ],
      template: `
        <solaris-multi-select>
          <solaris-option-group label="Group 1">
            <solaris-option value="a">Option A</solaris-option>
          </solaris-option-group>
          <solaris-option-group label="Group 2" [disabled]="true">
            <solaris-option value="b">Option B</solaris-option>
          </solaris-option-group>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class GroupHost {}

    it('should have option groups', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(GroupHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.optionGroups().length).toBe(2);
    });

    it('should have options from groups', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(GroupHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.options().length).toBe(2);
    });

    it('should respect group disabled', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(GroupHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const groupBOpt = multiSelect.options()[1];
      expect(groupBOpt.isEffectivelyDisabled()).toBe(true);
    });
  });

  describe('text fallbacks', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select
          [loading]="true"
          loadingText="Loading fallback"
          emptyText="Empty fallback"
          noResultsText="No results fallback"
          clearLabel="Clear fallback"
          searchPlaceholder="Search fallback"
        >
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-multi-select>
      `,
      providers: [provideSolarisTesting({})],
    })
    class TextFallbackHost {}

    it('should use direct text inputs as fallbacks', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TextFallbackHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      expect(multiSelect.loadingTextValue()).toBe('Loading fallback');
      expect(multiSelect.emptyTextValue()).toBe('Empty fallback');
      expect(multiSelect.noResultsTextValue()).toBe('No results fallback');
      expect(multiSelect.clearAriaLabel()).toBe('Clear fallback');
      expect(multiSelect.searchPlaceholderText()).toBe('Search fallback');
    });

    it('should fall back to default translation keys', () => {
      @Component({
        standalone: true,
        imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
        template: `
          <solaris-multi-select [loading]="true">
            <solaris-option value="a" label="Apple"></solaris-option>
          </solaris-multi-select>
        `,
        providers: [provideSolarisTesting({})],
      })
      class DefaultFallbackHost {}

      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DefaultFallbackHost);
      fixture.detectChanges();
      const multiSelect = fixture.debugElement.query(
        By.css('solaris-multi-select'),
      ).componentInstance as any;
      const withDefaults = multiSelect['translateService'] as {
        translate: (key: string) => string;
      };
      withDefaults.translate = (key: string) => `T:${key}`;
      expect(multiSelect.emptyTextValue()).toBe('T:solaris.multiSelect.empty');
      expect(multiSelect.noResultsTextValue()).toBe(
        'T:solaris.multiSelect.noResults',
      );
      expect(multiSelect.loadingTextValue()).toBe(
        'T:solaris.multiSelect.loading',
      );
      expect(multiSelect.clearAriaLabel()).toBe('T:solaris.multiSelect.clear');
    });
  });

  describe('public API surface', () => {
    @Component({
      standalone: true,
      imports: [SolarisMultiSelectComponent, SolarisOptionComponent],
      template: `
        <solaris-multi-select [required]="true">
          <solaris-option value="a" label="Apple"></solaris-option>
        </solaris-multi-select>
      `,
      providers: [
        provideSolarisTesting({
          translate: { translations: { 'en-US': getTestTranslations() } },
        }),
      ],
    })
    class ApiSurfaceHost {}

    function getMultiSelect(): any {
      const fixture = TestBed.createComponent(ApiSurfaceHost);
      fixture.detectChanges();
      return fixture.debugElement.query(By.css('solaris-multi-select'))
        .componentInstance as any;
    }

    it('should expose state getters', () => {
      TestBed.configureTestingModule({});
      const multiSelect = getMultiSelect();
      expect(multiSelect.disabled).toBe(false);
      expect(multiSelect.readonly).toBe(false);
      expect(multiSelect.invalid).toBe(false);
      expect(multiSelect.required).toBe(true);
      expect(multiSelect.focused).toBe(false);
      expect(multiSelect.describedByIds).toEqual([]);
    });

    it('should set describedByIds', () => {
      TestBed.configureTestingModule({});
      const multiSelect = getMultiSelect();
      multiSelect.setDescribedByIds(['hint-1', 'error-1']);
      expect(multiSelect.describedByIds).toEqual(['hint-1', 'error-1']);
    });

    it('should focus the trigger element', () => {
      TestBed.configureTestingModule({});
      const multiSelect = getMultiSelect();
      const focusSpy = vi.spyOn(
        multiSelect.triggerElement().nativeElement,
        'focus',
      );
      multiSelect.focus();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should writeValue with a non-array value', () => {
      TestBed.configureTestingModule({});
      const multiSelect = getMultiSelect();
      multiSelect.writeValue('not-an-array');
      expect(multiSelect.value()).toEqual([]);
    });

    it('should writeValue with an object value', () => {
      TestBed.configureTestingModule({});
      const multiSelect = getMultiSelect();
      multiSelect.writeValue({ a: 1 });
      expect(multiSelect.value()).toEqual([]);
    });
  });
});
