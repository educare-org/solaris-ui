# Solaris UI — I18n Standard

## Decision

I18n is native and mandatory.

## Locales

Every dictionary ships exactly three locales. No exceptions.

```txt
pt-BR
en-US
es-419
```

`es` alone is legacy and forbidden. The canonical Spanish locale is `es-419`.
`check-translation.mjs` blocks missing/extra keys per locale and blocks legacy
`es` keys. Enforced by CI.

## Component and product names

Component names, product names, proper nouns, brand terms, and established
market terms stay in English in every locale. Do not force-translate them.

Examples that stay identical: `Segmented Control`, `Zoom`, `Online`,
`Color`, `Total`, `Radar`.

Rationale: users search, discuss, and import these terms in English even
inside pt-BR and es-419 UIs. Forced translation hurts discoverability and
adds churn without user value.

## Text strategy

Components that expose user-facing text must support direct text and translation keys.

Examples:

```txt
label / labelKey
title / titleKey
description / descriptionKey
emptyStateText / emptyStateTextKey
```

## Identical values

Dictionary values identical to `en-US` are allowed without declaration only
when short (at most 30 characters after trimming and collapsing whitespace).
A `pt-BR` or `es-419` value equal to `en-US` with more than 30 characters
blocks CI unless the key carries a scoped exception in
`tools/config/translation-rules.json` (proper nouns, brand terms, or filler
text identical by nature, e.g. Lorem ipsum). Enforced by
`check-translation.mjs`.

Long user-facing sentences left untranslated must still be translated —
identical values are intended for names and short terms, not paragraphs.

## Forbidden

Public components must not contain hardcoded user-facing text.

Internal fallback text is allowed only when:

- documented;
- translatable;
- overridable;
- tested.

## Consumer overrides

Consumers must be able to provide translation overrides through a documented provider.

## Host app i18n integration

Solaris resolves `*Key` inputs (e.g. `labelKey`, `placeholderKey`) through the
`SolarisTranslateService`. Keys registered in the Solaris translation maps are
resolved directly. For keys owned by the host application, consumers may
register a `resolver` in `SolarisTranslateConfig`:

```typescript
provideSolaris({
  translate: {
    locale: 'pt-BR',
    fallbackLocale: 'en-US',
    useBrowserLocale: true,
    translations: { 'pt-BR': { 'solaris.button.loading': 'Carregando...' } },
    resolver: (key, params) => hostI18nService.translate(key, params),
  },
});
```

The resolver is only invoked when a key is not found in the Solaris
translation maps. If the resolver returns a value different from the key, that
value is used; otherwise the key is returned verbatim.

## Locale behavior

Solaris must support:

- default locale;
- fallback locale;
- browser locale detection when configured;
- consumer-provided translation maps;
- formatting adapters for dates and numbers.

## Accessibility and i18n

ARIA labels and accessible descriptions must also support translation keys.

## Tests

I18n tests must validate:

- direct text;
- translation key;
- fallback behavior;
- missing translation behavior;
- accessible label translation.
