---
'@educarehq/solaris-ui': minor
---

Make `SolarisTranslateService` reactive: `locale` is now a signal with `setLocale()`/`resetLocale()`, locale normalization (`pt*` to `pt-BR`, `en*` to `en-US`, `es*` to `es-419`), `localStorage` persistence (`persistKey`, default `'solaris:locale'`, `false` opts out), runtime `addTranslations()`, `has()` and `availableLocales()`. The `translate` pipe is impure and re-renders on locale change with no reload. Breaking: `service.locale` is now a signal, read it as `service.locale()`.
