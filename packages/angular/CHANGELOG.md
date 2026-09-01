# @educarehq/solaris-ui

## 0.17.1

### Patch Changes

- Preserve server-rendered button variants during hydration and render mega menu chevrons before client startup.

## 0.17.0

### Minor Changes

- 8f815c3: Add reusable animated icons and an accessible menu toggle control.

## 0.16.1

### Patch Changes

- Fix SSR compatibility for DOM adapters without `dataset` support.

## 0.16.0

### Minor Changes

- feat(alert): add textPosition input and restructure alert showcase with tabs and section-card layout

## 0.15.0

### Minor Changes

- 84347e9: Add 12 new built-in icons: `key`, `rocket`, `package`, `plane`, `squared-text`, `send`,
  `notepad`, `star`, `star-plus`, `eject`, `podium` and `save`. Sorted into the existing
  icon groups (actions, communication, data, navigation, media) and exposed in the showcase
  category filters.
- Add `textPosition` input to `SolarisAlertComponent` supporting `'start' | 'center' | 'end' | 'space-between'` alignment. Restructure AlertShowcasePage with tabs for variants/appearances and a new Text Position section. Add hover color transition to alert close button matching the dialog pattern. Rename DialogPageComponent to DialogShowcaseComponent.

## 0.14.0

### Minor Changes

- 6107105: Add the `solaris-otp-input` preset form control and fix phone-field density.
  - **otp-input**: a row of single-character boxes driven by `maxLength` (default 12) with
    `minLength` validation, automatic focus advancement, keyboard navigation, paste support,
    configurable char type, optional masking and visual grouping. Ships a reusable
    `solarisOtpValidator` and a showcase page (`/forms/otp-input`).
  - **phone-field**: prefix sizes (flag, chevron, font, padding) now scale with the field
    density.

## 0.13.0

### Minor Changes

- f8f0c68: Add the `solaris-phone-field` preset form control.
  - Wraps `solaris-form-field` with a `tel` input and as-you-type formatting via `libphonenumber-js`.
  - Exposes a searchable country selector in the prefix (flag + calling code) backed by a popover listbox.
  - Stores a single E.164 value through a `ControlValueAccessor` and ships a reusable `solarisPhoneValidator`.
  - Adds `libphonenumber-js` and `country-flag-icons` as runtime dependencies.
  - Adds a showcase page (`/forms/phone-field`) demonstrating the field.

## 0.12.0

### Minor Changes

- Polish the toast and button components and refresh the light/dark color tokens.
  - **toast**: use `fit-content` width, increase padding and add vertical spacing between stacked toasts, and add a 2px rounded accent bar colored to match the variant icon.
  - **button**: refine appearance/color defaults and borders, and rework the showcase to browse appearances per color through tabs.
  - **tokens**: update the light and dark semantic color tokens.

## 0.11.2

### Patch Changes

- 7e089b4: fix(button): apply variant attributes synchronously to avoid FOUC

  The `[solaris-button]` and `[solaris-icon-button]` directives rely on
  `data-appearance`, `data-color`, `data-radius`, and `data-shape` attributes to
  select the correct visual. These were applied only during Angular's first
  change detection, so on first paint (especially with SSR/hydration or deferred
  hydration) the element briefly showed the base style before switching to the
  configured variant — a visible color flash.

  The directives now set these attributes synchronously in the constructor, so
  the element carries the correct variant from the moment it exists in the DOM.
  Host bindings remain in place to keep them in sync when inputs change at
  runtime.

  Migration: none.

## 0.11.1

### Patch Changes

- d4411af: fix(button): prevent color flash before hydration

  The base `[solaris-button]` and `[solaris-icon-button]` styles used the
  `primary` tokens as the default, while the components' actual default is
  `color="neutral"`. During SSR/hydration (or any delayed attribute application),
  buttons rendered with the primary color for a frame before switching to their
  configured color.

  The base styles now default to the neutral/solid tokens, matching the real
  component default, so buttons with no explicit `color` render correctly on the
  first paint without flashing.

  Migration: none. Buttons without an explicit `color` input already behaved as
  `neutral` at runtime; the initial paint now matches that instead of flashing
  `primary` first.

## 0.11.0

### Minor Changes

- 85710b7: feature(forms): larger field labels, larger password toggle, label actions
  - Field labels now use `--solaris-font-size-md` for every density (one step
    above the previous `sm`), improving readability across compact, normal, and
    comfortable densities.
  - The password-field visibility toggle icon is now sized one typography step
    above the density font size for every density (`compact` → `lg`, `normal` →
    `xl`, `comfortable` → `2xl`), keeping it proportionally larger than the text.
    The password-field host now exposes `data-density`.
  - New `[solaris-form-label-action]` slot renders content (e.g. a "Forgot
    password?" link) on the same row as the label, aligned to the opposite side.
    It is forwarded by `solaris-email-field`, `solaris-password-field`,
    `solaris-select`, and `solaris-multi-select`.
  - Fixed multi-level content projection for projected affixes: `[solaris-form-prefix]`
    and `[solaris-form-suffix]` declared inside the preset fields now render in the
    affix slots (previously they fell into the control wrapper). The preset fields
    re-project these slots with `ngProjectAs`, and the new label action slot uses
    the same mechanism.

  Migration: none required. All changes are additive; existing labels and toggle
  icons simply render slightly larger.

### Patch Changes

- 85710b7: fix(icon): preserve brand colors and add inheritColor input

  Multi-color brand icons (`google`, `microsoft`, `android`) and monochrome brand
  icons (`apple`, `github`) carry their own fills. Previously the SVG root forced
  `stroke="currentColor"` on every element, so these icons gained an inherited
  outline in the surrounding text color, washing out their brand colors.

  `solaris-icon` now detects icons that define their own element fills and omits
  the inherited stroke (`stroke="none"`). A new `inheritColor` input (`true` by
  default) gives explicit control: set `[inheritColor]="false"` to render a
  line-based icon without an inherited stroke.

## 0.10.0

### Minor Changes

- e64e48d: feature(icon): add brand icons and button icon inputs

  Adds built-in provider/brand icons to the icon registry: `google`,
  `microsoft`, `apple`, `android`, and `github`. Multi-color brand icons keep
  their official brand colors; monochrome brand icons (`apple`, `github`) use
  `currentColor` so they adapt to the active theme.

  Extends the SVG icon definition model so each element (path, rect, circle,
  line, polyline, polygon) can carry its own `fill`/`stroke` attributes,
  enabling multi-color icons.

  `[solaris-button]` now accepts an `icon` input (a registered `SolarisIconName`)
  rendered inside the button, plus `iconPosition` (`'start'` | `'end'`) to place
  it before or after the text. The padding on the icon side is reduced so the
  icon sits close to the button edge, matching social login button conventions.

  Migration: none required — the `[solaris-button-icon]` projection directive
  continues to work for custom inline SVGs and content.

## 0.9.0

### Minor Changes

- f30e482: feature(data-display): add label support to divider

  `solaris-divider` now renders text between its lines via `label` or `labelKey`
  (translated with the Solaris i18n system). `textPosition` (`'center'`,
  `'start'`, `'end'`) controls the label alignment on horizontal dividers.
  - When a label is present, the divider becomes semantic: `role="separator"` is
    applied and `aria-hidden` is removed, regardless of the `decorative` input,
    so the label is announced to assistive technology.
  - Labels are ignored on vertical dividers.
  - New CSS tokens: `--solaris-divider-text-gap`, `--solaris-divider-text-color`,
    `--solaris-divider-text-font-size`.

## 0.8.0

### Minor Changes

- 8a033ee: feature(forms): unify prefix/suffix as icon inputs across form fields

  Adds `prefix` and `suffix` inputs (icon names) to `solaris-form-field`,
  `solaris-email-field`, `solaris-password-field`, `solaris-select`, and
  `solaris-multi-select`. When set, an icon is rendered in the field's affix
  slot with the correct token color and density-based size, matching the layout
  of directly projected affixes.
  - `solaris-email-field` and `solaris-password-field`: `prefixIcon` /
    `suffixIcon` renamed to `prefix` / `suffix`.
  - `solaris-select` and `solaris-multi-select`: `icon` renamed to `prefix`.
  - Manual projection via `[solaris-form-prefix]` / `[solaris-form-suffix]`
    remains supported for text, buttons, or any custom content.

  Affix icons now size with `--solaris-density-font-size` instead of a fixed
  `--solaris-font-size-lg`, and inherit the affix color on hover consistently.
  The password-field toggle gains density-based inline padding so it stays clear
  of the field border in compact density.

  Migration: replace `icon` with `prefix` on select/multi-select, and
  `prefixIcon`/`suffixIcon` with `prefix`/`suffix` on email/password fields.

## 0.7.2

### Patch Changes

- b379605: fix(forms): allow custom translation resolver and fix prefix/suffix projection
  - `SolarisTranslateConfig` now accepts an optional `resolver` function. When a
    `*Key` input (e.g. `labelKey`, `placeholderKey`, `errorKey`) resolves a key
    that is not registered in the Solaris translations, the service delegates to
    the resolver so the host app's own i18n system can translate it. Previously
    unknown keys were returned verbatim, so keys like
    `app.login.email.placeholder` showed up as raw text even when the app used
    its own `translate` pipe.
  - `solaris-email-field` and `solaris-password-field` now forward projected
    `[solaris-form-prefix]` and `[solaris-form-suffix]` content to the inner
    `solaris-form-field`, so affixes declared inside these composite fields
    render correctly.
  - The password visibility toggle icon now sizes itself with the density
    typography token (`--solaris-density-font-size`) instead of a fixed
    `--solaris-font-size-xl`, keeping it proportional across density modes.

## 0.7.1

### Patch Changes

- 13e385f: fix(theme): connect SCSS theme config to runtime density and color scheme

  Two fixes for consumers who configure Solaris exclusively through the SCSS
  `@include solaris.theme(...)` setup:
  - **Density now applies.** `SolarisThemeService.density` falls back to the
    `--solaris-density-default` CSS custom property emitted by the `theme()`
    mixin when no `density` is set in `provideSolaris`. Previously the CSS
    variable was written but never read, so components always resolved to
    `normal` even when the SCSS set `density: compact`.
  - **Forced color schemes now apply to all components.** The `theme()` mixin
    now emits the light or dark color tokens directly on
    `:root:not([data-theme])` when `color-scheme: light` or `dark` is set, so
    the explicit choice overrides `@media (prefers-color-scheme: dark)`.
    Previously `color-scheme: light` only set the CSS property while component
    tokens (buttons, form fields, etc.) still followed the OS preference.
    `color-scheme: system` keeps the previous auto behavior.

  The `solaris-light-tokens` and `solaris-dark-tokens` SCSS mixins are now
  exported so the theme mixin can reuse them.

## 0.7.0

### Minor Changes

- dd6a837: feature(dialog): add placement option for bottom-anchored panels

  Adds a `placement` option ('center' | 'bottom') to `SolarisDialogOptions` and
  `SolarisDialogComponentConfig`. When set to 'bottom', the dialog panel anchors
  to the bottom of the viewport, enabling bottom-sheet style previews without
  occupying the full height.

- ba15a08: feature(styles): standardize units to px and colors to hex

  Replaces rem-based design tokens with px so rendering is deterministic
  regardless of the consumer's root font-size. A consumer that sets a custom
  root font-size (e.g. 62.5%) will no longer silently rescale Solaris
  components.

  Token values changed:
  - spacing, radius, typography, and density tokens now use px;
  - translucent rgb()/rgba() values now use 8-digit hex (e.g. `#0000004d`);
  - default public API sizes now use px (`panelMaxHeight` and
    `solarisTooltipMaxWidth` default to `320px`);
  - `rem` is forbidden in component styles; relative units are allowed only
    where required (`vw`/`dvh`, `em` for letter-spacing).

  Page zoom still satisfies WCAG 1.4.4 (Resize Text).

- abd6ada: feature(styles): add normal density mode and make density control typography

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

- 3ad0b23: feature(icons): add 37 new built-in icons and replace loader

  Adds new built-in icons grouped into two new categories (communication and
  media) plus additions to the existing groups. Replaces the loader glyph with
  the new loader-circle path.

## 0.6.1

### Patch Changes

- f729075: Fix a circular module dependency between `SolarisAccordionComponent` and `SolarisCollapsibleComponent` that crashed the published `fesm2022` bundle at module-evaluation time in JIT/unit-test environments (`ReferenceError: Cannot access 'SolarisCollapsibleComponent' before initialization`). The collapsible component now imports the `SOLARIS_ACCORDION` token directly from `model/accordion.tokens` instead of the accordion barrel, letting the bundler emit the classes in a deterministic order. Consumers can now import any symbol from the package barrel in Vitest/Karma/JIT without evaluation errors.

## 0.6.0

### Minor Changes

- 504f8ca: feature(feedback): add loading-text component

  Adds `solaris-loading-text`, an animated loading caption that sweeps a shimmer across short text. Supports `sm`/`md`/`lg`/`xl` sizes, semantic and `custom` colors, `slow`/`normal`/`fast` speeds, i18n-enabled text, `role="status"` with `aria-live="polite"`, and reduced-motion support.

- b0c183a: feature(feedback): add progress component

  Adds `solaris-progress`, a progress indicator with determinate (`value` 0-100) and indeterminate modes, `sm`/`md`/`lg` sizes, semantic and `custom` colors, an optional i18n-enabled label and numeric percentage, `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and reduced-motion support.

- fc285b2: feature(feedback): add spinner component

  Adds `solaris-spinner`, an indeterminate loading indicator with `sm`/`md`/`lg`/`xl` sizes (thickness scales with size), semantic and `custom` colors, `speed` and `easing` motion controls, an optional full-screen `backdrop`, an optional i18n-enabled label, `role="status"` + `aria-live="polite"` announcements, and reduced-motion support. The button loading state now renders `solaris-spinner` instead of a CSS pseudo-element spinner.

- 1608f7b: feature(feedback): add spinner stacked variant, progress layout, and rounded caps

  Extends `solaris-spinner` with a `variant` input (`ring` | `stacked` | `progress`). `stacked` renders a classic radial spinner built from 8 independent rounded bars (45 degrees apart) that animate a clockwise fading trail through staggered opacity states; `progress` renders a determinate arc driven by `value` (0-100, clamped) with optional `showPercent` and `description`/`descriptionKey` lines, `role="progressbar"`, and `aria-valuenow`/`valuemin`/`valuemax`/`valuetext`. The progress percentage and label share a baseline with description lines aligned beneath. The indicator now renders as SVG with rounded stroke caps in a fixed `120` viewBox that keeps caps fully inside the canvas, and the static track uses the indicator color at reduced opacity (`--solaris-spinner-track-color` defaults to `--solaris-spinner-color`, `--solaris-spinner-track-opacity` defaults to `--solaris-opacity-20`).

## 0.5.0

### Minor Changes

- 1680e35: remove the unused `setChecked` method from `solaris-radio` (the radio group syncs checked state through `writeValue`, so the method was dead API) and the unused `isCheckSelection` computed from `solaris-option` (single-selection feedback is rendered by the trailing check indicator). Also narrow the `writeValue` parameter type in `solaris-radio-group` from `unknown | null` to `unknown`.
- 7f05f82: rename `change` output to `changeEvent` in `solaris-switch`, `solaris-checkbox`, `solaris-radio` and the `solaris-switch-group`, `solaris-checkbox-group`, `solaris-radio-group` components. The old name collided with the native DOM `change` event and was flagged by `@angular-eslint/no-output-native`. Consumers should bind `(changeEvent)` instead of `(change)`.

## 0.4.0

### Minor Changes

- Added `SolarisCollapsibleComponent`, an accessible disclosure primitive with token-driven styling, keyboard support, reduced-motion-aware animation, and showcase/documentation coverage.
- Added `SolarisAccordionComponent`, a grouped disclosure component built on top of Collapsible. It supports single and multiple expansion modes, boxed and lined appearances, controlled Collapsible items, APG-compatible semantics, and keyboard interaction.
- Added `SolarisBreadcrumbComponent` for hierarchical navigation. It supports link and text items, icon-only and icon-with-text items, slash/chevron/dot separators, start/middle/end overflow strategies, a dropdown overflow menu, optional previous/next pager controls, default translations, showcase coverage, and public exports.
- Added built-in `slash`, `dot`, and `home` icons for navigation and breadcrumb use cases.
- Added `SolarisDividerStackComponent`, a layout primitive for separating stacked content groups with token-driven spacing and inset controls.
- Added the unified `provideSolaris(config)` setup API and `SolarisSetupConfig` type. Individual setup providers remain internal and are no longer part of the public API surface.
- Added an interactive `init` schematic and updated `ng-add` to delegate to it. The schematic creates `src/styles/solaris.scss`, wires the global stylesheet, and adds `provideSolaris(...)` to the application configuration.
- Updated schematics packaging so generated schematics compile as CommonJS inside the ESM package and can be loaded by Angular CLI.
- Centralized generated component IDs through shared `nextIdFor` and `resolveElementId` utilities, removing repeated per-component ID counters.

### Patch Changes

- Excluded Storybook-only packages from the Angular library dependency checks so package validation focuses on dependencies used by the published library.

### Migration Notes

- Replace public imports of individual setup providers with `provideSolaris(config)`.
- Existing component imports remain stable unless they depended on internal setup providers that are no longer exported from the public API.

## 0.3.3

### Patch Changes

- Published component style entry points through the unified public styles API.
- Moved component SCSS entry points under `src/styles` so ng-packagr includes them in the published package assets.
- Updated the public styles index to forward all component styles from a single entry point.
- Added initial `ng-add` schematic infrastructure for automatic consumer setup.
- Added token validation exceptions for intentional hardcoded SCSS values in overlay and navigation controls.

## 0.3.2

### Patch Changes

- Updated exported style assets to make public style imports resolve consistently from the npm package.
- Added wildcard style exports so consumers can import the aggregate styles entry point or individual public style files when needed.

## 0.3.1

### Patch Changes

- Fixed missing published CSS custom properties for `--solaris-*` design tokens.
- Moved token SCSS files into the published `src/styles/token` asset tree.
- Updated the public theme entry point so calling `@include solaris.theme()` emits color, spacing, typography, density, radius, shadow, and related token variables on `:root`.

## 0.3.0

### Minor Changes

- Added `SolarisToastService` and toast UI for non-blocking notifications. Toasts support neutral, info, success, warning, danger, loading, and custom variants; surface and outline appearances; multiple positions; configurable duration; countdown progress; hover/focus pause; expandable content; action buttons; and programmatic dismissal/update APIs.
- Added dialog infrastructure for modal workflows, alerts, confirmations, and custom Angular component content. Dialogs support multiple variants and sizes, simple and component-based opening modes, configurable close behavior, focus management, action buttons, and dialog flow transitions.
- Added `SolarisStepperComponent` for multi-step flows with horizontal and vertical orientations, default/card/dashed appearances, linear and non-linear navigation, status states, content transitions, and built-in action alignment.
- Added `SolarisTabsComponent` with horizontal and vertical orientations, underline/pills/enclosed appearances, automatic or manual activation, lazy panels, animated indicators, scrollable tab bars, badges, icons, and WAI-ARIA tab semantics.
- Added `SolarisSegmentedControlComponent`, a ControlValueAccessor-compatible segmented selection control with orientation, appearance, size, density, radius, disabled, readonly, required, animated indicator, and keyboard support.
- Added `SolarisDividerComponent` for decorative or semantic separators with horizontal and vertical orientation, subtle and strong appearances, spacing controls, and inset controls.
- Added dropdown menu primitives with item, checkbox, and radio item support; none/single/multiple selection modes; color variants; submenu support; placement configuration; type-ahead; arrow/Home/End navigation; Enter/Space activation; Escape dismissal; and WAI-ARIA menu semantics.
- Added editable tabs on top of Tabs and Dropdown Menu, including inline rename, keyboard confirm/cancel, reorder guards, remove guards, default tab actions, custom actions, and configurable action visibility.
- Added Form Field character counters for projected inputs and textareas with `maxlength`, including normal, warning, and danger counter states. Email and password field presets now pass `maxlength` through to their native inputs.

## 0.2.0

### Minor Changes

- Added the forms foundation used by Solaris form controls, including shared label, hint, error, prefix, suffix, appearance, size, density, radius, invalid, and focus-ring patterns.
- Added `SolarisFormFieldComponent` for consistent field composition around native and custom controls.
- Added input and textarea directives with external Form Field integration, ControlValueAccessor support, and accessible description wiring.
- Added password and email field presets with ControlValueAccessor support, visibility toggle, strength/domain validation patterns, normalization, blocked-domain handling, and complete showcase documentation.
- Added checkbox, checkbox group, radio, radio group, switch, and switch group components with Reactive Forms integration, disabled/touched/invalid states, accessible labels, and keyboard support.
- Added option and option group primitives for reusable selection UIs with labels, icons, grouping, and slots.
- Added select and multi-select components with Form Field integration, searchable panels, keyboard navigation, popover-based overlays, i18n, ControlValueAccessor support, select-all handling, display modes, removable chips, and overflow behavior.
- Added popover and tooltip primitives for form and overlay use cases, including placement, alignment, offset, trigger behavior, keyboard dismissal, arrow rendering, delay configuration, closeable content, and i18n support.
- Added shared prefix and suffix directives compatible with Form Field, Select, and Multi Select.
- Added showcase pages and documentation for the forms release.

## 0.1.0

### Minor Changes

- Established the Angular library workspace, npm package foundation, build pipeline, test infrastructure, linting, formatting, validation scripts, and Changesets setup.
- Added the design token foundation, theme foundation, light/dark/system theme support, density primitives, high-contrast preparation, reduced-motion support, and root font-size strategy.
- Added translation, accessibility, icon registry, and testing utility foundations.
- Added the first low-risk component set: Button, Icon Button, Badge, Card, Alert, and Skeleton.
- Added initial showcase coverage and public documentation structure for the library foundation.
