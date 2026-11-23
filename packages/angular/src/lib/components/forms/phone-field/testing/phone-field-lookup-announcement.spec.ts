import '@angular/compiler';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

import { SolarisPhoneFieldComponent } from '../component/phone-field.component';
import { SOLARIS_PHONE_INITIAL_COUNTRY_LOOKUP } from '../model/phone-field.tokens';
import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';
import { assertPresent } from '../../../../testing/solaris-test-utilities';
import type {
  SolarisCountry,
  SolarisCountryCode,
} from '../model/country.types';

type PhoneFieldSeam = SolarisPhoneFieldComponent & {
  countries: () => SolarisCountry[];
  effectiveCountry: () => SolarisCountryCode;
  selectedCountry: () => SolarisCountryCode | undefined;
  displayValue: () => string;
  selectCountry: (country: SolarisCountry) => void;
};

async function setupDirect(
  inputs: Record<string, unknown> = {},
  providers: unknown[] = [],
): Promise<{
  fixture: ComponentFixture<SolarisPhoneFieldComponent>;
  component: PhoneFieldSeam;
  input: HTMLInputElement;
}> {
  await TestBed.configureTestingModule({
    imports: [SolarisPhoneFieldComponent],
    providers: [
      provideZonelessChangeDetection(),
      provideSolarisTesting(),
      ...providers,
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(SolarisPhoneFieldComponent);
  fixture.componentRef.setInput('label', 'Phone');
  fixture.componentRef.setInput('defaultCountry', 'BR');
  for (const [key, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  const input = fixture.debugElement.query(By.css('input[solaris-input]'))
    .nativeElement as HTMLInputElement;
  return {
    fixture,
    component: fixture.componentInstance as PhoneFieldSeam,
    input,
  };
}

/**
 * Simulate real typing: one input event per character, caret at the end,
 * instead of setting the full value at once (select-all + paste).
 */
function typeLikeUser(
  fixture: ComponentFixture<unknown>,
  input: HTMLInputElement,
  target: string,
): void {
  input.focus();
  for (let index = 0; index < target.length; index += 1) {
    input.value = target.slice(0, index + 1);
    try {
      input.setSelectionRange(input.value.length, input.value.length);
    } catch {
      // Caret placement is best-effort in tests.
    }
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: target[index],
        bubbles: true,
        cancelable: true,
      }),
    );
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }
}

function liveRegion(fixture: ComponentFixture<unknown>): HTMLElement | null {
  return fixture.nativeElement.querySelector('[aria-live="polite"]');
}

describe('SolarisPhoneField initialCountryLookup', () => {
  it('resolves the lookup and selects the returned country', async () => {
    const lookup = vi.fn(
      async (): Promise<SolarisCountryCode | undefined> => 'US',
    );
    const { component } = await setupDirect({ initialCountryLookup: lookup });
    await vi.waitFor(() => {
      expect(component.selectedCountry()).toBe('US');
    });
    expect(lookup).toHaveBeenCalled();
    expect(component.effectiveCountry()).toBe('US');
  });

  it('falls back to defaultCountry when the lookup rejects', async () => {
    const lookup = vi.fn(async (): Promise<SolarisCountryCode | undefined> => {
      throw new Error('Region unavailable');
    });
    const { component } = await setupDirect({ initialCountryLookup: lookup });
    await Promise.resolve();
    expect(lookup).toHaveBeenCalled();
    expect(component.effectiveCountry()).toBe('BR');
  });

  it('falls back when the lookup resolves to a disallowed country', async () => {
    const lookup = async (): Promise<SolarisCountryCode | undefined> => 'XX';
    const { component } = await setupDirect({
      initialCountryLookup: lookup,
      excludeCountries: ['XX'],
    });
    expect(component.effectiveCountry()).toBe('BR');
  });

  it('gives precedence to an explicit country over the lookup', async () => {
    const lookup = vi.fn(
      async (): Promise<SolarisCountryCode | undefined> => 'US',
    );
    const { component } = await setupDirect({
      initialCountryLookup: lookup,
      country: 'PT',
    });
    expect(lookup).not.toHaveBeenCalled();
    expect(component.effectiveCountry()).toBe('PT');
  });

  it('gives precedence to a prefilled E.164 value over the lookup', async () => {
    const lookup = vi.fn(
      async (): Promise<SolarisCountryCode | undefined> => 'US',
    );
    const { component, input } = await setupDirect({
      initialCountryLookup: lookup,
      value: '+5511999998888',
    });
    expect(lookup).not.toHaveBeenCalled();
    expect(input.value).toContain('+55');
    expect(component.getCountryData()?.code).toBe('BR');
  });

  it('resolves from the SOLARIS_PHONE_INITIAL_COUNTRY_LOOKUP token when no input is set', async () => {
    const tokenLookup = vi.fn(
      async (): Promise<SolarisCountryCode | undefined> => 'PT',
    );
    const { component } = await setupDirect(undefined, [
      { provide: SOLARIS_PHONE_INITIAL_COUNTRY_LOOKUP, useValue: tokenLookup },
    ]);
    await vi.waitFor(() => {
      expect(component.selectedCountry()).toBe('PT');
    });
    expect(tokenLookup).toHaveBeenCalled();
    expect(component.effectiveCountry()).toBe('PT');
  });

  it('does not call the resolver on the server (SSR guard)', async () => {
    const lookup = vi.fn(
      async (): Promise<SolarisCountryCode | undefined> => 'US',
    );
    await TestBed.configureTestingModule({
      imports: [SolarisPhoneFieldComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideSolarisTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(SolarisPhoneFieldComponent);
    fixture.componentRef.setInput('label', 'Phone');
    fixture.componentRef.setInput('defaultCountry', 'BR');
    fixture.componentRef.setInput('initialCountryLookup', lookup);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(lookup).not.toHaveBeenCalled();
    const component = fixture.componentInstance as PhoneFieldSeam;
    expect(component.effectiveCountry()).toBe('BR');
  });
});

describe('SolarisPhoneField imperative API', () => {
  it('isValid reports validity without side effects', async () => {
    const { fixture, component, input } = await setupDirect();
    expect(component.isValid()).toBe(true);
    typeLikeUser(fixture, input, '11999998888');
    expect(component.isValid()).toBe(true);
    expect(input.value.replace(/\D/g, '')).toBe('5511999998888');
  });

  it('isValid is false for incomplete numbers and empty required fields', async () => {
    const { fixture, component, input } = await setupDirect();
    typeLikeUser(fixture, input, '1');
    expect(component.isValid()).toBe(false);
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    component.writeValue('');
    fixture.detectChanges();
    expect(component.isValid()).toBe(false);
  });

  it('isValid honors a manual invalid override and never touches state', async () => {
    const { fixture, component } = await setupDirect();
    component.writeValue('+5511999998888');
    fixture.detectChanges();
    expect(component.isValid()).toBe(true);
    let emitted = 0;
    component.valueChange.subscribe(() => {
      emitted += 1;
    });
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(component.isValid()).toBe(false);
    expect(emitted).toBe(0);
  });

  it('getCountryData returns a read-only snapshot copy', async () => {
    const { component } = await setupDirect();
    const before = component.getCountryData();
    expect(before?.code).toBe('BR');
    expect(before?.callingCode).toBe('55');
    let emitted = 0;
    component.countryChange.subscribe(() => {
      emitted += 1;
    });
    if (before) {
      (before as { code: string }).code = 'US';
    }
    const after = component.getCountryData();
    expect(after?.code).toBe('BR');
    expect(emitted).toBe(0);
    expect(after).not.toBe(before);
    expect(after).toEqual(
      expect.objectContaining({ code: 'BR', callingCode: '55' }),
    );
  });
});

describe('SolarisPhoneField country announcement', () => {
  it('renders a discreet polite live region that is visually hidden', async () => {
    const { fixture } = await setupDirect();
    const region = assertPresent(liveRegion(fixture), 'live region');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.hasAttribute('solaris-visually-hidden')).toBe(true);
    expect(region.textContent ?? '').toContain('+');
    const countryButton = fixture.nativeElement.querySelector(
      '.solaris-phone-field__country',
    ) as HTMLElement;
    expect(countryButton.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('announces the country when typing an international number key by key', async () => {
    const { fixture, input } = await setupDirect();
    const region = assertPresent(liveRegion(fixture), 'live region');
    const before = region.textContent ?? '';
    expect(before).toContain('Brazil');
    typeLikeUser(fixture, input, '+14155552671');
    expect(input.value.startsWith('+1')).toBe(true);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(region.textContent ?? '').toContain('+1');
    expect(region.textContent ?? '').not.toBe(before);
  });

  it('announces the country on panel selection', async () => {
    const { fixture, component } = await setupDirect();
    const region = assertPresent(liveRegion(fixture), 'live region');
    const us = assertPresent(
      component.countries().find((country) => country.code === 'US'),
      'US country',
    );
    component.selectCountry(us);
    fixture.detectChanges();
    expect(region.textContent ?? '').toContain('+1');
  });

  it('announces the country on writeValue', async () => {
    const { fixture, component, input } = await setupDirect();
    const region = assertPresent(liveRegion(fixture), 'live region');
    component.writeValue('+351912345678');
    fixture.detectChanges();
    expect(input.value).toContain('+351');
    expect(region.textContent ?? '').toContain('+351');
  });

  it('keeps announcing after real backspace deletions (keyboard regression)', async () => {
    const { fixture, component, input } = await setupDirect();
    typeLikeUser(fixture, input, '11');
    fixture.detectChanges();
    expect(input.value).toBe('+55 (11)');
    const region = assertPresent(liveRegion(fixture), 'live region');
    expect(region.textContent ?? '').toContain('+55');
    const backspace = (): void => {
      const end = input.value.length;
      input.setSelectionRange(end, end);
      input.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Backspace',
          bubbles: true,
          cancelable: true,
        }),
      );
      input.value = input.value.slice(0, -1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    };
    backspace();
    expect(input.value).toBe('+55 1');
    expect(component.displayValue()).toBe('+55 1');
    backspace();
    fixture.detectChanges();
    expect(region.hasAttribute('solaris-visually-hidden')).toBe(true);
    expect(region.getAttribute('aria-live')).toBe('polite');
  });
});
