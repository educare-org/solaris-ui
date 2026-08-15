---
'@educarehq/solaris-ui': minor
---

feature(styles): add normal density mode and make density control typography

Introduces a third density mode, `normal`, as the intermediate step between
`compact` and `comfortable`. `normal` is now the default density across the
theme and all components (`SolarisDensity`, `SolarisThemeConfig`).

Density now affects typography in addition to spacing:

- new density typography tokens `--solaris-density-font-size` and
  `--solaris-density-font-size-sm`, defined per density mode;
- inputs, textareas, buttons, and icon buttons scale their font size with
  density (compact 12px, normal 14px, comfortable 16px);
- form-field labels, hints, and errors follow the density scale.

Theme propagation fixed: components now resolve their effective density from
the configured theme density via `SolarisThemeService`, so setting
`density: compact` in the consumer setup applies to every component instead
of being ignored.

This is additive: existing `compact` and `comfortable` values keep working.
Components default to `normal` instead of `comfortable`, so consumers relying
on the previous default should explicitly set `density: comfortable`.

### Removed `size` from the form-field family

The `size` input (`sm`/`md`/`lg`) was removed from `solaris-form-field`,
`solaris-email-field`, `solaris-password-field`, `solaris-select`, and
`solaris-multi-select`. Density now controls height, padding, and typography
for these, making `size` redundant on the wrapper. The `SolarisFormFieldSize`,
`SolarisEmailFieldSize`, `SolarisPasswordFieldSize`, `SolarisSelectSize`, and
`SolarisMultiSelectSize` types were removed. Controls such as
`solaris-input`, `solaris-textarea`, and `solaris-option` keep their own
`size` input.

### Removed `size` from `solaris-tabs` and `solaris-editable-tabs`

The `size` input (`sm`/`md`/`lg`) was removed from `solaris-tabs` and
`solaris-editable-tabs`. Density now controls tab padding, gap, icon size, and
typography (`compact`/`normal`/`comfortable`), which is most visible in the
`pills` appearance. The `SolarisTabsSize` and `SolarisEditableTabsSize` types
were removed.

### Removed `size` from `solaris-button`

The `size` input (`sm`/`md`/`lg`) was removed from `solaris-button`. Density
now controls button height, padding, gap, min-width, icon size, and
typography (`compact`/`normal`/`comfortable`). The `SolarisButtonSize` type
was removed. The icon button (`solaris-icon-button`) keeps its own `size`
input.

### Removed `size` from `solaris-icon-button` and added `shape`

The `size` input (`sm`/`md`/`lg`) was removed from `solaris-icon-button`.
Density now controls icon button size and typography, matching
`solaris-button`. The `SolarisIconButtonSize` type was removed.

Both `solaris-button` and `solaris-icon-button` now expose a `shape` input
(`'normal' | 'wide'`). `shape="wide"` renders a horizontally elongated
button (wider than tall) by increasing horizontal padding and minimum width.

### Added `shape` to `solaris-tabs`

`solaris-tabs` now exposes a `shape` input (`'normal' | 'wide'`).
`shape="wide"` increases tab horizontal padding so tabs are elongated, most
visible in the `pills` appearance. The elongation scales with density via
`--solaris-density-padding-lg`, staying proportional in all modes.
`solaris-editable-tabs` also exposes `shape` and forwards it to the inner
tabs.
