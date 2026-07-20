# Solaris UI 🌞

A comprehensive Angular component library built with accessibility, theming, and developer experience in mind.

> **Published as:** `@educarehq/solaris-ui`

---

## ✨ Features

- **40+ components** organized in 8 categories: Actions, Data Display, Feedback, Forms, Icon, Interaction, Navigation, and Overlay
- **Theming engine** — light/dark mode, configurable density (comfortable/compact), and reduced motion support
- **Built-in i18n** — built-in translations for EN-US and PT-BR with an extensible translation service
- **Accessibility first** — all components follow WCAG guidelines, with a dedicated accessibility service
- **SVG icon system** — built-in icons with a custom registry, plus CSP-friendly icon loading
- **Angular CDK powered** — leverages `@angular/cdk` for overlay, positioning, and a11y primitives

---

## 📦 Installation

```bash
npm install @educarehq/solaris-ui
# or
yarn add @educarehq/solaris-ui
# or
pnpm add @educarehq/solaris-ui
```

---

## 🚀 Quick Start

### 1. Import styles

Add the core styles to your `angular.json` or global stylesheet:

```scss
// styles.scss
@use '@educarehq/solaris-ui/styles';
```

### 2. Provide global services

```typescript
// app.config.ts
import {
  provideSolarisTheme,
  provideSolarisTranslate,
  provideSolarisAccessibility,
  provideSolarisIcons,
  provideSolarisDialog,
  provideSolarisToast,
} from '@solaris-ui/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSolarisTheme(),
    provideSolarisTranslate(),
    provideSolarisAccessibility(),
    provideSolarisIcons(),
    provideSolarisDialog(),
    provideSolarisToast(),
    // ... other providers
  ],
};
```

### 3. Use a component

```typescript
// example.component.ts
import { Component } from '@angular/core';
import { SolarisButtonDirective } from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisButtonDirective],
  template: `<button solarisButton color="primary">Click me</button>`,
})
export class ExampleComponent {}
```

---

## 🧩 Components

### Actions
| Component | Directive | Description |
|-----------|-----------|-------------|
| Button | `SolarisButtonDirective` | 6 colors, 4 appearances, multiple sizes and densities |
| Icon Button | `SolarisIconButtonDirective` | Compact icon-only button with badge support |
| Button Group | `SolarisButtonGroupComponent` | Groups buttons horizontally or vertically |

### Data Display
| Component | Description |
|-----------|-------------|
| `SolarisBadgeComponent` | Notification badge with icon directive |
| `SolarisCardComponent` | Content card with header, content, media, footer, actions, title, and description directives |
| `SolarisDividerComponent` | Horizontal/vertical separator with multiple appearances |

### Feedback
| Component | Description |
|-----------|-------------|
| `SolarisAlertComponent` | 7 variants, 2 appearances, configurable radius and density |
| `SolarisSkeletonComponent` | Loading placeholder with multiple shapes and animations |
| `SolarisToastComponent` | Toast notification system with 7 variants, countdown timer, pause-on-hover, and programmatic API via `SolarisToastService` |

### Forms
| Component | Description |
|-----------|-------------|
| `SolarisFormFieldComponent` | Wrapper with label, hint, error, prefix/suffix slots, and character counter |
| `SolarisInputDirective` | Text input with multiple appearances |
| `SolarisTextareaDirective` | Textarea with resize options |
| `SolarisSelectComponent` | Single-select dropdown |
| `SolarisMultiSelectComponent` | Multi-select dropdown with display modes |
| `SolarisOptionComponent` | Option with leading, label, description, meta, and trailing slots |
| `SolarisOptionGroupComponent` | Grouped options with label |
| `SolarisCheckboxComponent` | Checkbox with multiple colors |
| `SolarisCheckboxGroupComponent` | Grouped checkboxes with layout options |
| `SolarisRadioComponent` | Radio button |
| `SolarisRadioGroupComponent` | Grouped radio buttons |
| `SolarisSwitchComponent` | Toggle switch |
| `SolarisSwitchGroupComponent` | Grouped switches |
| `SolarisPasswordFieldComponent` | Password input with strength indicator and policy validation |
| `SolarisEmailFieldComponent` | Email input with domain allowlist/blocklist validation |

### Icon
| Component | Description |
|-----------|-------------|
| `SolarisIconComponent` | SVG icon renderer with built-in icon set |

### Interaction
| Component / Directive | Description |
|----------------------|-------------|
| `SolarisPopoverDirective` | Popover panel with multiple placements, scroll strategies, and auto-focus |
| `SolarisTooltipDirective` | Tooltip with multiple triggers, placements, and sizes |
| `SolarisDropdownMenuComponent` | Full dropdown menu with submenus, groups, labels, and items |

### Navigation
| Component | Description |
|-----------|-------------|
| `SolarisTabsComponent` | Tabs with panels, content transitions, pills, scrollable, full-width, enclosed modes |
| `SolarisStepperComponent` | Multi-step workflow with linear/non-linear, wizard, card, vertical, and icon modes |
| `SolarisSegmentedControlComponent` | Segmented control with icons, badges, and full-width modes |
| `SolarisEditableTabsComponent` | Tabs with rename, reorder, add, remove, lock, and custom actions |

### Overlay
| Component | Description |
|-----------|-------------|
| `SolarisDialogComponent` | Modal dialog with header, content, actions, alert/confirm/custom variants, flow mode, and programmatic API via `SolarisDialogService` |

---

## 🎨 Theming

Solaris UI provides a comprehensive theming system:

```typescript
// Custom theme configuration
import { provideSolarisTheme } from '@solaris-ui/angular';
import type { SolarisThemeConfig } from '@solaris-ui/angular';

const themeConfig: SolarisThemeConfig = {
  colorScheme: 'system', // 'light' | 'dark' | 'system'
  density: 'comfortable', // 'comfortable' | 'compact'
  reducedMotion: 'system', // 'system' | 'reduced' | 'no-preference'
};

export const appConfig: ApplicationConfig = {
  providers: [provideSolarisTheme(themeConfig)],
};
```

- **Color scheme**: automatic detection via `prefers-color-scheme`, or manual light/dark
- **Density**: comfortable (default) or compact for space-efficient layouts
- **Reduced motion**: respects user's `prefers-reduced-motion` setting

---

## 🌐 Internationalization

Built-in translations for **EN-US** and **PT-BR**:

```typescript
import { provideSolarisTranslate } from '@solaris-ui/angular';
import type { SolarisTranslateConfig } from '@solaris-ui/angular';

const translateConfig: SolarisTranslateConfig = {
  locale: 'pt-BR', // or 'en-US'
};

export const appConfig: ApplicationConfig = {
  providers: [provideSolarisTranslate(translateConfig)],
};
```

Use the `SolarisTranslatePipe` in templates:

```html
<label>{{ 'form.field.required' | solarisTranslate }}</label>
```

---

## ♿ Accessibility

Solaris UI is built with accessibility as a core principle:

- All components meet WCAG 2.1 AA standards
- `SolarisAccessibilityService` manages `prefers-reduced-motion` across all animated components
- `SolarisVisuallyHiddenDirective` for screen-reader-only content
- Proper ARIA attributes on all interactive components
- Focus management in dialogs, dropdowns, and popovers

---

## 🛠 Development

This project uses [Nx](https://nx.dev) as its build system.

### Prerequisites

- Node.js 22+
- pnpm 10+

### Setup

```bash
pnpm install
```

### Run the showcase app

```bash
pnpm dev
# or
pnpm nx serve showcase
```

The showcase app runs at `http://localhost:4300` and demonstrates all components with interactive examples.

### Build the library

```bash
pnpm build:lib
# or
pnpm nx build angular
```

### Run tests

```bash
# Unit tests
pnpm nx test angular

# With coverage
pnpm nx run angular:test:coverage

# E2E tests
pnpm nx e2e showcase-e2e
```

### Lint

```bash
pnpm lint
# or
pnpm nx run-many -t lint
```

### Type check

```bash
pnpm typecheck
```

### Full verification

```bash
pnpm verify
```

This runs lint, type checking, tests, and other validations — the same pipeline executed in CI.

### Release

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
# Add a changeset
pnpm changeset add

# Version packages
pnpm changeset version

# Publish
pnpm changeset publish
```

---

## 🏗 Project Structure

```
solaris-ui/
├── apps/
│   └── showcase/              # Demo application with all components
├── packages/
│   └── angular/               # The component library
│       └── src/
│           ├── lib/
│           │   ├── components/ # All components organized by category
│           │   ├── services/   # Theme, translation, accessibility, icon services
│           │   └── testing/    # Testing utilities
│           └── styles/        # Core SCSS styles
├── tools/                     # Build and validation scripts
├── .github/workflows/         # CI pipeline
└── .changeset/                # Changeset configuration
```

---

## 📄 License

MIT © [Educarehq](https://github.com/educarehq)
