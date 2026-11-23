import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SolarisPhoneCountryListComponent } from '../component/country-list.component';
import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

import type { SolarisCountry } from '../model/country.types';

const COUNTRIES: SolarisCountry[] = [
  { code: 'BR', callingCode: '55', name: 'Brazil', flag: '' },
  { code: 'US', callingCode: '1', name: 'United States', flag: '' },
  { code: 'PT', callingCode: '351', name: 'Portugal', flag: '' },
];

@Component({
  standalone: true,
  imports: [SolarisPhoneCountryListComponent],
  template: `
    <solaris-phone-country-list
      [countries]="countries"
      [selectedCode]="'BR'"
    ></solaris-phone-country-list>
  `,
})
class TestHost {
  countries = COUNTRIES;
}

describe('SolarisPhoneCountryListComponent', () => {
  async function setup(): Promise<{
    fixture: ComponentFixture<TestHost>;
    component: SolarisPhoneCountryListComponent;
    list: HTMLElement;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const debug = fixture.debugElement.query(
      By.directive(SolarisPhoneCountryListComponent),
    );
    const component =
      debug.componentInstance as SolarisPhoneCountryListComponent;
    const list = debug.query(
      By.css('.solaris-phone-country-list__list'),
    ).nativeElement;
    return { fixture, component, list };
  }

  it('renders a listbox with one option per country', async () => {
    const { list } = await setup();
    expect(list.getAttribute('role')).toBe('listbox');
    expect(list.querySelectorAll('[role="option"]').length).toBe(3);
  });

  it('updates aria-activedescendant as the active option moves', async () => {
    const { fixture, list } = await setup();
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    expect(list.getAttribute('aria-activedescendant')).toContain('option-0');
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    expect(list.getAttribute('aria-activedescendant')).toContain('option-1');
  });

  it('emits closeRequest on Tab', async () => {
    const { fixture, component, list } = await setup();
    let closed = false;
    const sub = component.closeRequest.subscribe(() => (closed = true));
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
    );
    fixture.detectChanges();
    sub.unsubscribe();
    expect(closed).toBe(true);
  });

  it('emits closeRequest on Escape without a query', async () => {
    const { fixture, component, list } = await setup();
    let closed = false;
    const sub = component.closeRequest.subscribe(() => (closed = true));
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();
    sub.unsubscribe();
    expect(closed).toBe(true);
  });

  it('emits countrySelected on Enter', async () => {
    const { fixture, component, list } = await setup();
    let selected: SolarisCountry | undefined;
    const sub = component.countrySelected.subscribe((c) => (selected = c));
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    list.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    sub.unsubscribe();
    expect(selected?.code).toBe('US');
  });

  describe('preferred countries', () => {
    @Component({
      standalone: true,
      imports: [SolarisPhoneCountryListComponent],
      template: `
        <solaris-phone-country-list
          [countries]="countries"
          [selectedCode]="'BR'"
          [preferredCodes]="['PT', 'XX']"
        ></solaris-phone-country-list>
      `,
    })
    class PreferredHost {
      countries = COUNTRIES;
    }

    async function setupPreferred(): Promise<{
      fixture: ComponentFixture<PreferredHost>;
      component: SolarisPhoneCountryListComponent;
      list: HTMLElement;
    }> {
      await TestBed.configureTestingModule({
        imports: [PreferredHost],
        providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
      }).compileComponents();
      const fixture = TestBed.createComponent(PreferredHost);
      fixture.detectChanges();
      const debug = fixture.debugElement.query(
        By.directive(SolarisPhoneCountryListComponent),
      );
      const component =
        debug.componentInstance as SolarisPhoneCountryListComponent;
      const list = debug.query(
        By.css('.solaris-phone-country-list__list'),
      ).nativeElement;
      return { fixture, component, list };
    }

    it('pins preferred countries first above a separator', async () => {
      const { list } = await setupPreferred();
      const options = Array.from(
        list.querySelectorAll('[role="option"]'),
      ) as HTMLElement[];
      expect(options.map((option) => option.textContent)).toHaveLength(3);
      expect(options[0].textContent).toContain('Portugal');
      expect(
        list.querySelector('.solaris-phone-country-list__separator'),
      ).toBeTruthy();
    });

    it('emits the tapped country after the separator', async () => {
      const { fixture, component, list } = await setupPreferred();
      let selected: SolarisCountry | undefined;
      const sub = component.countrySelected.subscribe((c) => (selected = c));
      const options = list.querySelectorAll('[role="option"]');
      // BR sits after the separator; the separator must not shift the index.
      (options[1] as HTMLElement).click();
      fixture.detectChanges();
      sub.unsubscribe();
      expect(selected?.code).toBe('BR');
    });

    it('moves keyboard active state across the separator', async () => {
      const { fixture, list } = await setupPreferred();
      list.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );
      fixture.detectChanges();
      list.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );
      fixture.detectChanges();
      expect(list.getAttribute('aria-activedescendant')).toContain('option-1');
    });
  });
});
