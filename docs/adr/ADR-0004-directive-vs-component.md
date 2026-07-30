# ADR-0004: Directive vs Component Decision

## Status

Accepted

## Context

Form controls can be implemented as either directives (applied to native HTML elements) or components (custom elements with templates). The wrong choice leads to either broken native behavior or unnecessary complexity.

## Decision

- **Directive** for controls that wrap a single native HTML element and must preserve native behavior:
  - `[solaris-input]` on `<input>`
  - `[solaris-textarea]` on `<textarea>`
  - `[solaris-button]` on `<button>` or `<a>`

- **Component** for controls with:
  - Custom visual anatomy not achievable with native elements alone
  - Multiple internal sub-elements
  - Complex state management
  - Custom interactive behavior

  Examples: `solaris-select`, `solaris-checkbox`, `solaris-switch`, `solaris-dialog`

## Consequences

Positive:
- Native elements preserve autofill, keyboard, semantics, and Angular Forms integration
- Components enable rich visual customization when needed
- Clear boundary between "enhance" and "replace"

Negative:
- Some developers may choose component when directive suffices
- Testing two patterns requires different approaches

## Compliance

Enforced by code review. Documented in COMPONENT_STANDARD.md.
