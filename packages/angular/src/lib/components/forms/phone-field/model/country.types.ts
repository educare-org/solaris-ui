export type SolarisCountryCode = string;

export interface SolarisCountry {
  code: SolarisCountryCode;
  callingCode: string;
  name: string;
  flag: string;
}

export type SolarisCountryListFactory = (locale: string) => SolarisCountry[];
