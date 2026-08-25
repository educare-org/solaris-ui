import { InjectionToken } from '@angular/core';

import type { SolarisCountryListFactory } from './country.types';
import { buildCountries } from './country';

export const SOLARIS_PHONE_COUNTRY_LIST =
  new InjectionToken<SolarisCountryListFactory>('SOLARIS_PHONE_COUNTRY_LIST', {
    factory: () => buildCountries,
  });
