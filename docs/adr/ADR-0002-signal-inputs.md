# ADR-0002: Signal-based Inputs and Outputs

## Status

Accepted

## Context

Angular 17.2+ introduced signal-based inputs (`input()`, `output()`) as a reactive alternative to `@Input()` and `@Output()` decorators. The project must choose a consistent convention.

## Decision

All new components MUST use signal-based APIs:

- `input<T>()` instead of `@Input()`
- `model<T>()` for two-way binding instead of `@Input() + @Output()`
- `output<T>()` instead of `@Output()`
- Computed values via `computed()` instead of getters
- Effects via `effect()` instead of `ngDoCheck`/`ngOnChanges`

Existing `@Input()`/`@Output()` decorators in legacy components may remain but new code must follow the signal convention.

## Consequences

Positive:

- Type-safe inputs with default values
- Better change detection (OnPush by default)
- Composable reactive pipelines

Negative:

- Signal API is still evolving in Angular 21+
- Some third-party integrations may not support signals yet

## Compliance

Enforced by ESLint rules and code review.
