type LiteralUnion<T extends U, U = string> = T | (U & {});

export type SolarisBuiltInLocale = 'pt-BR' | 'en-US' | 'es-419';

export type SolarisLocale = LiteralUnion<SolarisBuiltInLocale>;
