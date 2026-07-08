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
