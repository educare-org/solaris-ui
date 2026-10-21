# SolarisTranslateService

## Purpose

Provides runtime translation (i18n) for Solaris components and apps. Designed for component-level text, dynamic content, and quick locale switching — not a replacement for `@angular/localize`.

The active locale is a **signal**: `setLocale()` updates every template using the `translate` pipe with no reload.

## Locale resolution

`service.locale()` resolves in this order:

1. Explicit locale from `setLocale()` (normalized, in memory).
2. `localStorage` value under `persistKey` (default `'solaris:locale'`), normalized — skipped when `persistKey: false`.
3. `navigator.languages[]` + `navigator.language` (when `useBrowserLocale` is `true`, the default): first entry whose normalized form has a loaded translation map wins.
4. Configured `locale` (normalized).
5. Configured `fallbackLocale` (normalized).
6. Canonical `'en-US'`.

Steps 2–3 only run in the browser: every access to `navigator`/`localStorage` is guarded by `isPlatformBrowser` (plus `typeof` guards), so SSR resolves straight to step 4.

## Key lookup

`translate(key, params?)`:

1. Look up `key` in the current locale's map.
2. If not found, look up `key` in the `fallbackLocale` map.
3. If still not found, look up `key` in the `en-US` map.
4. If still not found, delegate to the optional `resolver`.
5. Otherwise return the raw `key`.

Never breaks at runtime due to missing translation.

## Normalization

`normalizeLocale(raw)` lowercases, converts `_` to `-`, then maps by prefix:

- `pt`, `pt-*` → `pt-BR`
- `en`, `en-*` → `en-US`
- `es`, `es-*` → `es-419`

Unknown tags (custom locales) pass through in normalized form, so `addTranslations('custom-locale', …)` keeps working. Custom map keys must use the normalized (lowercase, `-`-separated) form.

## Interpolation

```
Input:   "Hello, {{name}}"
Call:    translate('greeting', { name: 'World' })
Output:  "Hello, World"
```

Parameters are regex-escaped. No ICU MessageFormat or pluralization yet.

## Public API

| Export                                    | Description                                                                        |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `SolarisTranslateService`                 | Main service, `providedIn: 'root'`                                                 |
| `SolarisTranslatePipe`                    | Template pipe: `'key' \| translate : params` (impure, re-renders on locale change) |
| `provideSolaris({ translate })`           | Config provider                                                                    |
| `provideSolarisTranslateTesting(config?)` | Testing provider with defaults (persistence off)                                   |

### Config

```typescript
interface SolarisTranslateConfig {
  locale: SolarisLocale;
  fallbackLocale: SolarisLocale;
  translations: SolarisTranslations;
  useBrowserLocale?: boolean; // default true
  persistKey?: string | false; // default 'solaris:locale', false disables persistence
  availableLocales?: readonly SolarisLocale[]; // default: locales with loaded maps
  resolver?: (key: string, params?: SolarisTranslationParams) => string | undefined;
}
```

### Built-in locales

`pt-BR`, `en-US`, `es-419`

Custom locales allowed via string — no type restriction.

### Switching locale at runtime

```typescript
const translate = inject(SolarisTranslateService);

translate.setLocale('pt'); // normalizes to pt-BR, persists, templates update
translate.setLocale('es-MX'); // normalizes to es-419
translate.resetLocale(); // clears persistence, back to automatic resolution

translate.availableLocales(); // e.g. ['en-US', 'pt-BR', 'es-419']
translate.has('solaris.calendar.today'); // key in current locale?
translate.addTranslations('es-419', { 'my.lazy.key': 'Mi texto' }); // runtime extension
translate.instant('greeting', { name: 'Kaique' }); // alias for translate()
```

```html
<h1>{{ 'greeting' | translate: { name: 'Kaique' } }}</h1>
```

## SSR safety

No direct browser API access. `navigator`/`localStorage` guarded by `isPlatformBrowser` (plus `typeof` guards); persistence failures (private mode, quota) are swallowed — the in-memory locale still applies.

## Example

```typescript
provideSolaris({
  translate: {
    locale: 'pt-BR',
    fallbackLocale: 'en-US',
    useBrowserLocale: true,
    persistKey: 'solaris:locale',
    translations: {
      'pt-BR': { greeting: 'Olá, {{name}}' },
      'en-US': { greeting: 'Hello, {{name}}' },
    },
  },
});
```

```html
<h1>{{ 'greeting' | translate: { name: 'Kaique' } }}</h1>
```
