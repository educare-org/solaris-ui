# @solaris-ui/angular

## 0.3.0

### Minor Changes

- ea1277f: ## `0.3.0` — Overlay and Navigation Release

  ### 🍞 Toast

  A non-blocking, auto-dismissing notification system with service-based API.
  - 7 variants: `neutral`, `info`, `success`, `warning`, `danger`, `loading`, `custom`
  - 2 appearances: `surface`, `outline`, 6 positions, configurable duration
  - Countdown timer with progress bar / text / both modes
  - Pause on hover/focus, expandable content, action buttons
  - Programmatic API via `SolarisToastService`: `show()`, `info()`, `success()`, `warning()`, `danger()`, `loading()`, `dismiss()`, `dismissAll()`, `update()`

  ### 🗂️ Dialog

  A modal overlay component for alerts, confirmations, and custom content.
  - 5 variants: `neutral`, `info`, `success`, `warning`, `danger`
  - 5 sizes: `sm`, `md`, `lg`, `xl`, `fullscreen`
  - Two open modes: `open(options)` for simple dialogs, `openComponent()` for custom Angular components
  - Dialog Flow: multi-step wizard with slide/fade/none transitions
  - Action buttons with configurable appearance and auto-close
  - Configurable close behavior: `closeOnEscape`, `closeOnBackdropClick`, `closeable`

  ### 🪜 Stepper

  A step-by-step progress indicator for multi-step workflows.
  - 2 orientations: `horizontal`, `vertical`
  - 3 appearances: `default`, `card`, `dashed`
  - Linear and non-linear navigation modes
  - 5 step statuses: `pending`, `active`, `completed`, `error`, `disabled`
  - Content transitions: `none`, `fade`, `slide`
  - Built-in action bar with configurable alignment

  ### 📑 Tabs

  A tabbed navigation component with animated indicator and keyboard support.
  - 2 orientations: `horizontal`, `vertical`
  - 3 appearances: `underline`, `pills`, `enclosed`
  - Automatic and manual activation modes
  - Content transitions with directional awareness
  - Animated sliding indicator, scrollable tab bar, badge and icon support
  - Lazy-loading panels, full WAI-ARIA compliance

  ### 🔘 Segmented Control

  A radio-group-like segmented button control for mutually exclusive options.
  - 2 orientations, 2 appearances, 3 sizes, 2 densities, 4 radius options
  - Animated sliding indicator
  - Full `ControlValueAccessor` implementation for Reactive Forms and template-driven forms
  - Keyboard navigation, disabled/readonly/required states

  ### ➖ Divider

  A lightweight visual separator for horizontal and vertical content division.
  - 2 appearances: `subtle`, `strong`
  - 4 spacing and 4 inset options
  - Decorative and semantic (`role="separator"`) modes

  ### 📋 Dropdown Menu

  A context menu with full keyboard navigation, selection modes, and submenu support.
  - Item types: `item`, `checkbox`, `radio` with `none`/`single`/`multiple` selection modes
  - 6 item colors: `neutral`, `primary`, `success`, `warning`, `danger`, `info`
  - Submenu support with `hover`/`click`/`hover-click` open modes and configurable placement
  - Keyboard navigation: Arrow keys, Home/End, type-ahead, Enter/Space, Escape
  - WAI-ARIA `role="menu"` compliance

  ### ✏️ Editable Tabs

  Extends the Tabs component with inline editing, reordering, and custom actions.
  - Inline rename with Enter to confirm, Escape to cancel
  - Reorder tabs with move guards for locked tabs
  - Remove with configurable minimum tab count
  - Set as default tab, custom actions per tab
  - Three action visibility modes: `hover`, `always`, `focus-hover`
  - Composed on top of Tabs and Dropdown Menu

  ### 🆕 Form Field — Character Counter
  - `form-field`: automatically detects `maxlength` attribute on projected input/textarea and displays a `(current/max)` counter next to the label
  - Counter has 3 severity states: normal (< 90%), warning (>= 90%), danger (100%) with color transitions
  - `email-field`: added `maxLength` input with `[attr.maxlength]` pass-through
  - `password-field`: added `[attr.maxlength]` pass-through to native input
  - Optional — only appears when maxlength is defined

## 0.1.0

### Minor Changes

- bca9fe3: Add email field preset component (`solaris-email-field`): composable form preset with CVA, built-in domain validation, normalization (trim/lowercase), and complete showcase documentation.
- 0c7e174: feat(forms): 0.2.0 Forms Release
  - **Form Field**: new component with label, hint, error, prefix/suffix, appearance, size, density, radius, invalid state, and focus ring
  - **Input**: directive with external Form Field support, CVA, icon prefix
  - **Textarea**: directive with external Form Field support, CVA, auto-resize
  - **Password Field**: preset with visibility toggle, strength meter, CVA
  - **Email Field**: preset with domain validation, blocked domains, CVA
  - **Checkbox**: standalone component, CVA, label
  - **Checkbox Group**: group with indeterminate state, select all, CVA
  - **Radio**: standalone component, CVA
  - **Radio Group**: group with orientation support, CVA
  - **Switch**: standalone component, CVA, label
  - **Switch Group**: group with select all, CVA
  - **Option + Option Group**: reusable option primitives with selection, icon, slots, group label
  - **Select**: uses Form Field internally, searchable, keyboard navigation, popover panel, i18n, CVA
  - **Multi Select**: uses Form Field internally, display modes (auto/summary/chips/comma), searchable, select all, removable chips, overflow, i18n, CVA
  - **Popover**: trigger directive + panel component, placement, align, offset, scroll strategy, keyboard dismissal
  - **Tooltip**: directive with hover/click trigger, placement, arrow, delay, closeable, i18n
  - **Accessibility**: ARIA attributes on all form controls (aria-expanded, aria-controls, aria-haspopup, aria-activedescendant, aria-multiselectable, aria-label, aria-describedby)
  - **Prefix/Suffix**: directives compatible with Form Field, Select, and Multi Select
  - **Showcase**: documentation pages for all form components with live examples
