# ADR-0005: Internationalization Architecture

## Status

Accepted

## Context

Components expose user-facing text (labels, hints, errors, ARIA labels). The project needs a consistent i18n strategy that works across libraries and consuming applications.

## Decision

Components with user-facing text MUST support both static strings and translation keys via dual inputs:

```typescript
readonly label = input<string>();
readonly labelKey = input<string>();
```

When both are provided, `label` takes precedence. The `SolarisTranslateService` resolves keys at runtime.

Translation files live alongside component code in `translations/en-US.ts` and are bundled with the showcase, not the library. The library provides the pipe and service; consumers provide their own translations.

## Consequences

Positive:

- Components work without i18n setup (static strings)
- i18n can be added later without component changes
- Translation files are co-located with components

Negative:

- Dual inputs increase API surface
- Library does not ship translations — consumers must provide them
- SSR requires careful translation resolution timing

## Compliance

Enforced by code review. Translation keys must match the pattern `component.field.context`.
