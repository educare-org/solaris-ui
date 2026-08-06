# @educarehq/solaris-ui

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
