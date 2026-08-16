# Solaris UI — I18n Standard

## Decision

I18n is native and mandatory.

## Initial locales

```txt
pt-BR
en-US
es
```

## Future locale readiness

Solaris must be ready for locales with different character systems and layout implications:

```txt
zh
ja
ru
ar
```

RTL must be considered in future architecture.

## Text strategy

Components that expose user-facing text must support direct text and translation keys.

Examples:

```txt
label / labelKey
title / titleKey
description / descriptionKey
ariaLabel / ariaLabelKey
emptyStateText / emptyStateTextKey
```

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
