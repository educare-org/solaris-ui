type LiteralUnion<T extends U, U = string> = T | (U & {});

export type SolarisBuiltInLocale =
  | 'pt-BR'
  | 'en-US'
  | 'es'
  | 'zh'
  | 'ru'
  | 'de'
  | 'fr'
  | 'ja';

export type SolarisLocale = LiteralUnion<SolarisBuiltInLocale>;
