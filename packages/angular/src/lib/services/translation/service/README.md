# SolarisTranslateService

## Purpose

Provides runtime translation (i18n) for Solaris components and apps. Designed for component-level text, dynamic content, and quick locale switching — not a replacement for `@angular/localize`.

## Resolution flow

`translate(key, params?)`:

1. Look up `key` in current locale's map.
2. If not found, look up `key` in `fallbackLocale` map.
3. If still not found, return the raw `key`.

Never breaks at runtime due to missing translation.

## Interpolation

```
Input:   "Hello, {{name}}"
Call:    translate('greeting', { name: 'World' })
Output:  "Hello, World"
```

Parameters are regex-escaped. No ICU MessageFormat or pluralization yet.

## Locale resolution

- `useBrowserLocale: true` + browser → `navigator.language`
- Otherwise → configured `locale`

## Public API

| Export                                    | Description                        |
| ----------------------------------------- | ---------------------------------- | -------------------------- |
| `SolarisTranslateService`                 | Main service, `providedIn: 'root'` |
| `SolarisTranslatePipe`                    | Template pipe: `'key'              | solarisTranslate : params` |
| `provideSolaris({ translate })`           | Config provider                    |
| `provideSolarisTranslateTesting(config?)` | Testing provider with defaults     |

### Config

```typescript
interface SolarisTranslateConfig {
  locale: SolarisLocale;
  fallbackLocale: SolarisLocale;
  translations: SolarisTranslations;
  useBrowserLocale?: boolean;
}
```

### Built-in locales

`pt-BR`, `en-US`, `es-419`

Custom locales allowed via string — no type restriction.

## SSR safety

No direct browser API access. `navigator.language` guarded by `isPlatformBrowser`.

## Example

```typescript
provideSolaris({
  translate: {
    locale: 'pt-BR',
    fallbackLocale: 'en-US',
    useBrowserLocale: true,
    translations: {
    'pt-BR': { greeting: 'Olá, {{name}}' },
    'en-US': { greeting: 'Hello, {{name}}' },
  },
});
```

```html
<h1>{{ 'greeting' | translate : { name: 'Kaique' } }}</h1>
```
