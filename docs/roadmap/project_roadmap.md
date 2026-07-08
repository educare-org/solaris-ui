# Solaris UI — Project Roadmap

## Roadmap principle

The roadmap can be ambitious.

The delivery cannot be rushed.

Solaris must not add components faster than it can protect architecture, accessibility, tests, documentation, and public API quality.

## Versioning strategy

```txt
0.1.0 = foundation release
0.x = API maturation
1.0.0 = stable initial public API
```

Version `1.0.0` is allowed only when the public API is mature enough to support consumers without frequent breaking changes.

## Phase 0 — Repository Foundation

### Objective

Create the repository foundation before implementing public components.

### Scope

- Nx workspace.
- pnpm setup.
- Angular package structure.
- Showcase app.
- TypeScript strict mode.
- Angular strict templates.
- ESLint.
- Prettier.
- Vitest.
- Playwright.
- Storybook.
- Angular CDK baseline.
- Changesets.
- Conventional Commits.
- Git hooks.
- Cross-platform script policy.
- `pnpm doctor`.
- `pnpm verify`.
- CI foundation.
- Public API baseline.
- Documentation folder.
- Initial architecture boundaries.

### Exit criteria

- Workspace builds.
- Showcase runs.
- Library builds.
- Lint passes.
- Typecheck passes.
- Unit test baseline runs.
- E2E baseline runs.
- Storybook runs.
- Cross-platform command policy documented.
- Core documentation committed.

## Phase 1 — Foundation Release `0.1.0`

### Objective

Create the design system foundation and first low-risk components.

### Scope

- Theme foundation.
- Token foundation.
- Root font-size strategy.
- Light theme.
- Dark theme.
- System theme mode.
- Reduced motion support.
- Density foundation.
- High contrast provision.
- i18n foundation.
- A11y foundation.
- Icon registry foundation.
- Testing utilities foundation.
- Button.
- Icon Button.
- Badge.
- Card.
- Alert.
- Skeleton.

### Exit criteria

- All components have tests.
- All components have accessibility validation.
- All components have showcase examples.
- All components use tokens.
- All components are SSR-safe.
- Public API is documented.
- Package build passes.
- `pnpm verify` passes.

## Phase 2 — Forms Release `0.2.0`

### Objective

Create the core form system for ERP and institutional flows.

### Scope

- Form Field.
- Input.
- Textarea.
- Checkbox.
- Radio.
- Switch.
- Select.
- Reactive Forms integration.
- ControlValueAccessor patterns.
- Error message patterns.
- Accessible label and description patterns.
- Form validation display patterns.

### Exit criteria

- All form controls work with Reactive Forms.
- All real controls implement CVA.
- Disabled, touched, invalid, and error states are tested.
- Error messages are accessible.
- Keyboard behavior is tested.
- Showcase includes realistic form examples.

## Phase 3 — Overlay and Navigation Release `0.3.0`

### Objective

Create interaction-heavy components with strong focus, keyboard, and overlay behavior.

### Scope

- Dialog.
- Toast.
- Tooltip.
- Dropdown Menu.
- Tabs.
- Segmented Control.
- Stepper.
- Overlay primitives.
- Focus trap behavior.
- Roving tabindex behavior where applicable.
- Escape key behavior.
- Outside click behavior where applicable.

### Exit criteria

- Overlay components do not leak focus.
- Dialog focus behavior is tested.
- Keyboard navigation is documented and tested.
- ARIA roles and attributes are validated.
- Components work in showcase scenarios.
- Visual regression exists for critical states.

## Phase 4 — Data and Advanced Release `0.4.0`

### Objective

Create advanced institutional components needed by Educare and future products.

### Scope

- Table.
- Phone Input.
- Showcase command/code components.
- Data display patterns.
- Empty/loading/error data states.
- Locale-sensitive phone behavior.
- Table accessibility baseline.
- Table density support.

### Exit criteria

- Table supports accessible structure.
- Phone Input supports locale behavior and forms.
- Advanced components have harness tests.
- Showcase has real ERP-like examples.
- Public APIs remain controlled.

## Phase 5 — Consumer Setup and Schematics

### Objective

Make Solaris safe and predictable to install in consuming applications.

### Scope

- `@solaris-ui/angular:init` generator or Angular schematic.
- Consumer style setup.
- `src/styles/solaris.scss` creation.
- Global style import.
- `provideSolaris(...)` setup.
- i18n default setup.
- theme default setup.
- root font-size setup.
- no silent mutation during package install.
- clear setup output messages.

### Exit criteria

- Consumer setup works in a clean Angular app.
- Existing files are not overwritten silently.
- Generated setup is editable.
- Setup follows `CONSUMER_SETUP_POLICY.md`.
- Setup commands are cross-platform.

## Phase 6 — Hardening and Release Discipline

### Objective

Harden the package before broader use.

### Scope

- Public API diff checks.
- Package validation.
- Bundle budget.
- Dependency audit.
- Security checks.
- Supply chain hardening.
- npm trusted publishing preparation.
- provenance preparation.
- release dry-run.
- changelog validation.
- migration note template.

### Exit criteria

- Release process is documented.
- Dry-run release works.
- Package contents are validated.
- Public API is stable enough for `0.x`.
- CI enforces quality gates.

## Future Phase — Financial and Institutional Components

### Objective

Add optional components inspired by critical financial and institutional systems.

### Possible components

- Money Input.
- Currency Select.
- Amount Display.
- Sensitive Value.
- Transaction Status.
- Risk Notice.
- Balance Card.
- Status Banner.
- Datepicker.
- Calendar.
- Navbar.
- Sidebar.
- Empty State.

### Rule

These components must not enter until the foundation, forms, overlays, and public API discipline are stable.

## Priority rule

Educare defines near-term priority.

Solaris architecture must remain product-agnostic.

```txt
Educare influences priority.
Educare does not define coupling.
```

## Roadmap guardrail

No phase is complete until documentation, tests, accessibility, and public API quality are complete.

A feature that exists only visually is not delivered.
