import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { SolarisSelectComponent } from './select.component';
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
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.hasAttribute('data-disabled')).toBe(true);
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
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-haspopup listbox', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have aria-expanded false initially', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('aria-expanded')).toBe('false');
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
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-appearance')).toBe('outline');
    });

    it('should have default size md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-size')).toBe('md');
    });

    it('should have default radius md', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-radius')).toBe('md');
    });

    it('should have default density comfortable', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-density')).toBe('comfortable');
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
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.hasAttribute('data-disabled')).toBe(true);
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
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.hasAttribute('data-readonly')).toBe(true);
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
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.hasAttribute('data-invalid')).toBe(true);
    });

    it('should apply data-size', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-size')).toBe('sm');
    });

    it('should apply data-density', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-density')).toBe('compact');
    });

    it('should apply data-radius', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-radius')).toBe('lg');
    });

    it('should apply data-appearance', () => {
      TestBed.configureTestingModule({});
      const fixture = TestBed.createComponent(DisabledHost);
      fixture.detectChanges();
      const host = fixture.nativeElement.querySelector('solaris-select');
      expect(host.getAttribute('data-appearance')).toBe('filled');
    });
  });
});
