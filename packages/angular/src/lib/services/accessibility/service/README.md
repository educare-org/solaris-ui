# SolarisAccessibilityService

## Purpose

Provides a11y infrastructure for Solaris components and apps: global accessibility preferences, ARIA helper utilities. Infrastructure only — does not govern specific component behavior (Dialog, Tabs, etc.).

## Reduced motion

Resolution order:

1. `forceReducedMotion: true` → `true`
2. `respectSystemPreference: true` + browser → `window.matchMedia('(prefers-reduced-motion: reduce)')`, listens for changes via `DestroyRef`
3. Otherwise → `false`

Exposed as `reducedMotion` (Signal) and `reducedMotionValue` (synchronous).

## Utilities

| Method                    | Returns          | Description                                                      |
| ------------------------- | ---------------- | ---------------------------------------------------------------- |
| `generateId(prefix)`      | `string`         | Unique ID: `{prefix}-{counter}-{timestamp}`                      |
| `generateDescriptionId()` | `string`         | Convenience: `generateId('solaris-desc')` for `aria-describedby` |
| `labelledBy(...ids)`      | `string \| null` | Space-joined IDs for `aria-labelledby`                           |

## Directive: `[solaris-visually-hidden]`

Applies screen-reader-only (sr-only) CSS to an element: visually hides it while keeping content in the DOM for assistive technologies.

- `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(...);`
- Does NOT use `display: none` or `visibility: hidden`
- Uses `[style.*]` host bindings — no `ElementRef.nativeElement`, SSR-safe

## Config

```typescript
interface SolarisAccessibilityConfig {
  respectSystemPreference?: boolean;
  forceReducedMotion?: boolean;
}
```

## SSR safety

`window.matchMedia` guarded by `isPlatformBrowser`. Directive uses host bindings only.

## Example

```typescript
provideSolarisAccessibility({ respectSystemPreference: true });
```

```html
<!-- Description for aria-describedby -->
<small id="{{ service.generateDescriptionId() }}">Format: XX-XXX</small>

<!-- Screen reader only -->
<span solaris-visually-hidden>Loading complete</span>
```
