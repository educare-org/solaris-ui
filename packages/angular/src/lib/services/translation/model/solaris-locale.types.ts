type LiteralUnion<T extends U, U = string> = T | (U & {});

export type SolarisBuiltInLocale =
  | 'pt-BR'
  | 'en-US'
  | 'es-419'
  | 'zh'
  | 'ru'
  | 'de'
  | 'fr'
  | 'ja';

export type SolarisLocale = LiteralUnion<SolarisBuiltInLocale>;
