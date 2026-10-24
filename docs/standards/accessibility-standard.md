# Solaris UI — Accessibility Standard

## Official baseline

Solaris targets WCAG 2.2 AA.

## Design principles

Accessibility is a component entry requirement, not a future improvement.
Every component must be usable by keyboard, screen reader, and voice control
out of the box.

---

## 1. Color and contrast

### Minimum contrast ratios

| Usage                               | Ratio                | WCAG SC |
| ----------------------------------- | -------------------- | ------- |
| Normal text (<18px / 14px bold)     | 4.5:1                | 1.4.3   |
| Large text (≥18px / ≥14px bold)     | 3:1                  | 1.4.3   |
| UI components and graphical objects | 3:1                  | 1.4.11  |
| Focus indicator                     | 3:1 against adjacent | 2.4.13  |

### Color tokens with known contrast issues

These tokens do NOT meet WCAG AA for certain uses:

| Token                             | Value   | Ratio vs white | Issue                                           |
| --------------------------------- | ------- | -------------- | ----------------------------------------------- |
| `--solaris-primary-solid`         | #4282fb | ~2.8:1         | Use as text on white only at ≥18px              |
| `--solaris-neutral-text-tertiary` | #7a7d84 | ~4.1:1         | Fails AA for normal text; use for captions only |
| `--solaris-info-solid`            | #5f9be4 | ~2.6:1         | Use for large UI elements or backgrounds only   |
| `--solaris-warning-solid`         | #f1d008 | ~1.1:1         | Background only; never use for text             |

### Color usage rules

- Never communicate state using color alone — always pair with icon, text, or
  ARIA attributes.
- Use `--solaris-*-surface` for backgrounds, `--solaris-*-text` for text,
  `--solaris-*-base` for interactive elements.
- High-contrast mode overrides all colors to meet 7:1 ratio minimum.

---

## 2. Focus

### Focus ring tokens

Solaris provides system-wide focus ring tokens:

| Token                         | Default                                                                 | Dark                                                                    | High-contrast                                                           |
| ----------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `--solaris-focus-ring-width`  | 2px                                                                     | 2px                                                                     | 3px                                                                     |
| `--solaris-focus-ring-offset` | 2px                                                                     | 2px                                                                     | 2px                                                                     |
| `--solaris-focus-ring-color`  | primary-base                                                            | primary-hover                                                           | #000000                                                                 |
| `--solaris-focus-ring-style`  | solid                                                                   | solid                                                                   | solid                                                                   |
| `--solaris-focus-ring-shadow` | `0 0 0 var(--solaris-focus-ring-width) var(--solaris-focus-ring-color)` | `0 0 0 var(--solaris-focus-ring-width) var(--solaris-focus-ring-color)` | `0 0 0 var(--solaris-focus-ring-width) var(--solaris-focus-ring-color)` |

### Requirements per component

All interactive components MUST use `:focus-visible` (not `:focus`) for keyboard
focus indication.

Focus management is required for these patterns:

| Pattern               | Requirement                                |
| --------------------- | ------------------------------------------ |
| Dialog                | Trap focus, restore on close               |
| Dropdown menu         | Arrow key navigation, first/last item wrap |
| Tooltip (interactive) | Focus stays within tooltip content         |
| Tabs                  | Arrow key navigation between tabs          |
| Stepper               | Enter/click activates step                 |
| Select                | Arrow key navigation, typeahead            |
| Command/search        | Arrow key navigation, escape to close      |

### Forbidden

- `outline: none` without providing an alternative focus indicator.
- `:focus` without `:focus-visible` (breaks click behavior).
- Removing focus from an element without moving it elsewhere.

---

## 3. Touch targets

### Minimum sizes (WCAG 2.2 AA + Solaris target)

| Target type                | Minimum size | Source               |
| -------------------------- | ------------ | -------------------- |
| WCAG 2.2 AA floor          | 24×24 CSS px | WCAG 2.5.8           |
| Solaris target (default)   | 44×44 CSS px | Solaris (exceeds AA) |
| Essential targets (inline) | no minimum   | WCAG exception       |

All interactive controls must target 44×44px (`--solaris-density-min-height`

- `--solaris-density-padding-*`). A 24px optical size is allowed ONLY with a
  documented 44px hit area. `compact` density is an accepted tradeoff for dense
  layouts: it may render below 44px visually, but the 44px hit area (or the
  deliberate exception) must be documented per component.

---

## 4. Keyboard

### Required keyboard behaviors

| Component         | Keys                                                |
| ----------------- | --------------------------------------------------- |
| Button            | Enter, Space                                        |
| Link (as button)  | Enter                                               |
| Checkbox / Radio  | Space                                               |
| Switch            | Enter or Space                                      |
| Select / Combobox | Enter (open), Arrow keys (navigate), Escape (close) |
| Tabs              | Arrow keys (navigate), Home/End (first/last)        |
| Dialog            | Escape (close), Tab (cycle within)                  |
| Tooltip           | Escape (close if interactive)                       |
| Dropdown menu     | Arrow keys, Enter (select), Escape (close)          |
| Stepper           | Enter (activate step)                               |

### Testing

Every interactive component MUST include keyboard interaction tests in its
spec file.

---

## 5. ARIA and labels

### Requirements

- Icon-only controls must have `aria-label` or `aria-labelledby`.
- Form controls must have associated `<label>` or `aria-label`.
- Error messages must use `aria-describedby` or `aria-errormessage`.
- Dynamic content changes must use `aria-live` regions (polite for most,
  assertive for critical).
- Status messages (success, loading, empty) must use `role="status"` or
  `aria-live="polite"`.
- Disabled state must use `aria-disabled="true"` (not just CSS opacity).
- Expanded state for menus/accordions must use `aria-expanded`.

### i18n + a11y

All `aria-label` values must be translatable. Components that accept
`ariaLabel` must also accept `ariaLabelKey` for translation keys.

---

## 6. Motion

### Reduced motion

Solaris respects `prefers-reduced-motion: reduce` at the system level:

```
@media (prefers-reduced-motion: reduce) {
  :root {
    --solaris-motion-duration-fast: 0ms;
    --solaris-motion-duration-normal: 0ms;
    --solaris-motion-duration-slow: 0ms;
    --solaris-motion-duration-slower: 0ms;
  }
}
```

Components using `--solaris-motion-duration-*` tokens automatically inherit
this. Components using `@keyframes` animation must also include:

```scss
@media (prefers-reduced-motion: reduce) {
  animation: none;
}
```

### Rules

- Animations must not be required to understand state or complete a task.
- The `spring` easing should be avoided where it might trigger motion
  sensitivity.
- Blinking or flashing content is forbidden (WCAG 2.3.1).

---

## 7. Disabled state

Disabled components must be:

- Semantically disabled (`aria-disabled="true"` or native `disabled`).
- Visually distinct (minimum `--solaris-opacity-40`).
- Non-interactive (pointer-events, tabindex, keyboard handlers removed).
- Visually consistent across all appearances (solid, outline, ghost, etc.).

---

## 8. Testing requirements

Every public component must include:

| Test type                  | Required    |
| -------------------------- | ----------- |
| Keyboard navigation        | Yes         |
| Focus management           | Yes         |
| ARIA attributes            | Yes         |
| Screen reader label        | Yes         |
| Disabled state             | Yes         |
| Reduced motion             | Yes         |
| Color contrast (automated) | Recommended |

### Tooling

Use `@testing-library/angular` queries and `axe-core` for automated
accessibility audits where possible.

---

## Forbidden patterns

- Interactive components without keyboard support.
- Focus removed without replacement.
- Icon-only buttons without accessible labels.
- Visual-only error messages (must be associated with input).
- Disabled state implemented only through opacity.
- Tooltip content required to complete a form.
- Color-only state communication.
- `innerHTML` or `bypassSecurityTrustHtml`.
- Auto-playing audio or video without user consent.
