# Solaris UI — AI Phase Plan

> Read this entire document before starting any phase.
> Fill in the checklist below at the end of each phase.

---

## Macro view

The goal of this plan is to build guardrails, documentation, and tests solid enough that AI-generated code needs minimal human review.

Each phase builds on the previous one.

| Phase | Name               | Focus                                      | Status  |
| ----- | ------------------ | ------------------------------------------ | ------- |
| A     | Tools & Guardrails | Validation scripts, hooks, CI              | ✅ 100% |
| B     | Tests              | Real coverage (E2E, services, integration) | ✅ 100% |
| C     | Documentation      | Storybook, ADRs, guides                    | ✅ 100% |
| D     | AI Dev Flow        | Scaffold, templates, automated validation  | ✅ 100% |

---

## Known tech debt

Issues accepted consciously to keep velocity. Each entry has a decision, reason, and a path to resolution.

| #   | Item                                                                                                                                                                                                                                                                                | Decided    | Why kept                                                                                      | Resolution path                                                                                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 7 components with inline `template` passthrough: `'<ng-content />'` (form-error, form-hint, form-label, alert-actions), `'<ng-template><ng-content /></ng-template>'` (dialog-step), empty `''` + `contentChild(TemplateRef)` (editable-tab), `'<ng-content />'` (dropdown-submenu) | 2026-07-31 | Validated as legitimate passthrough/placeholder patterns; allowed by `validate-component.mjs` | Extract to `templateUrl` if the component ever grows logic                                                                                           |
| 2   | OnPush `changeDetection` missing on 32 components                                                                                                                                                                                                                                   | resolved   | —                                                                                             | **DONE** — batch applied + enforced by component template                                                                                            |
| 3   | Global branch coverage at `83%` (goal `85%`) — gap concentrated in `multi-select`, `select`, `dropdown-submenu` integration branches (hover/placement/keyboard/overlay)                                                                                                             | resolved   | —                                                                                             | **DONE** — integration branch tests added for select, multi-select, dropdown-submenu; threshold raised to `85%` (85.07%)                             |
| 4   | Decorator queries (`@ViewChild`/`@ContentChild`) still in `select`, `multi-select`, `form-field` (3 components, ~14 queries) — the largest and most central form components                                                                                                         | resolved   | —                                                                                             | **DONE** — migrated to `viewChild()`/`contentChild()` following the established pattern; `@HostListener` stays (no signal alternative in Angular 21) |
| 5   | `check-i18n.mjs` flags hardcoded text in `.stories.ts` files (56 warnings) — story demo text, not shipped strings; the check only excludes `.spec.ts`/`.test.ts`                                                                                                                    | resolved   | —                                                                                             | **DONE** — `.stories.ts` excluded from the `check-i18n.mjs` scan (i18n check clean)                                                                  |
| 6   | `autoprefixer` root devDependency is unused — no `postcss.config`, no imports; present since first commit                                                                                                                                                                           | resolved   | —                                                                                             | **DONE** — removed unused `autoprefixer` devDependency (still available transitively via build-angular)                                              |

The debt list must be updated whenever an accepted deviation is created or resolved. Do not add new deviations silently — record them here first.

---

## Phase A — Tools & Guardrails

### Objective

Ensure every automated validation exists, is active in CI, and blocks out-of-standard code before it reaches human review.

### Tasks

#### A1 — Fix `check-token-references.mjs` and integrate into `verify`

**Context:** The script exists at `tools/scripts/check-token-references.mjs` but is not referenced in any `package.json` script. It also does not run in `verify.mjs`.

**What to do:**

1. Add the `"check:token-references"` script to `package.json` pointing to `tools/scripts/check-token-references.mjs`
2. Add `"check:token-references"` to the `"check"` command in `package.json`
3. Add `check-token-references.mjs` to the `verify.mjs` pipeline (among the required or optional checks)
4. Ensure the script output uses `printSummary` like the other scripts
5. Verify the script scans all relevant directories (`packages/angular/src/lib/**/*.scss`, not only `components/`)

**Acceptance criteria:**

- `pnpm check:token-references` works and reports results
- `pnpm check` includes token-references
- `pnpm verify` includes token-references
- No false positives for SCSS interpolation (`#{$var}`)

#### A2 — Add `changeset:check` to verify

**Context:** The project uses Changesets for versioning, but there is no CI validation forcing a changeset to exist for package changes.

**What to do:**

1. Create `tools/scripts/check-changeset.mjs` that:
   - Checks for modified files in `packages/angular/`
   - If so, checks whether a `.md` file exists in `.changeset/` (generated by `changeset add`)
   - If not, reports an error suggesting running `pnpm changeset add`
2. Add the `"check:changeset"` script to `package.json`
3. Add it to `"check"` and `verify.mjs`

**Acceptance criteria:**

- Changes in `packages/angular/` without a changeset fail the check
- Changes in `apps/` or `tools/` without a changeset pass (they do not affect the published package)

#### A3 — Add pre-push hook

**Context:** There are pre-commit hooks (lint-staged) but no pre-push. This allows broken code to be pushed and only discovered in CI.

**What to do:**

1. Configure `simple-git-hooks` to add a `pre-push` hook that runs `pnpm verify --quick` (reduced version: lint + typecheck + tests for changed files)
2. Update `package.json` in the `"simple-git-hooks"` section

**Acceptance criteria:**

- `git push` runs validation before sending
- Push is cancelled if validation fails

#### A4 — Add bundle size check

**Context:** There is no protection against uncontrolled bundle growth. A new component can add 50KB without anyone noticing.

**What to do:**

1. Create `tools/scripts/check-bundle.mjs` that:
   - Runs `pnpm build:lib`
   - Measures the size of files in `dist/packages/angular/`
   - Compares against a baseline saved in `tools/config/bundle-baseline.json`
   - If growth > 10%, generates a warning
   - If growth > 25%, generates an error
2. Add it to `verify.mjs` as an optional step (non-blocking initially)

**Acceptance criteria:**

- Script calculates the total size of the compiled package
- Initial baseline is created on first run
- Percentage differences are reported correctly

#### A5 — Add `pnpm audit` to verify

**Context:** Vulnerabilities in dependencies are not checked automatically.

**What to do:**

1. Create `tools/scripts/check-vulnerabilities.mjs` that runs `pnpm audit --audit-level=high` and parses the output
2. If it finds high/critical vulnerabilities, reports an error
3. Add it to `verify.mjs`

**Acceptance criteria:**

- `pnpm check:vulnerabilities` works
- High/critical vulnerabilities block verify

#### A6 — Ensure `check-dependencies.mjs` runs in verify

**Context:** The `check-dependencies.mjs` script exists, has the `"check:dependencies"` script in package.json, but is not in `"check"` or `verify.mjs`.

**What to do:**

1. Add `"check:dependencies"` to the `"check"` command in `package.json`
2. Add it to `verify.mjs`

**Acceptance criteria:**

- `pnpm check` validates dependencies
- `pnpm verify` validates dependencies

#### A7 — Remove `sort-scss-properties.js`

**Context:** The script at `tools/sort-scss-properties.js` sorts by length (not alphabetically), is not referenced in any script, and has no clear purpose.

**What to do:**

1. Delete the file `tools/sort-scss-properties.js`

**Acceptance criteria:**

- File removed from disk
- No script or config references the file

---

## Phase B — Tests

### Objective

Ensure the test suite covers not just component units, but real flows (E2E), critical services, and integration cases, with fast feedback for the developer.

### Tasks

#### B1 — Add global `test-setup.ts`

**Context:** There is no global setup file for Vitest. Each spec has to configure providers manually.

**What to do:**

- Create `packages/angular/vitest.setup.ts` with:
  - Global `TestBed` configuration
  - `configureSolarisTesting()` as automatic setup
  - `vi.restoreAllMocks()` cleanup in a global `afterEach`
- Reference it in `vitest-base.config.ts` under `setupFiles`

#### B2 — Add `test:watch` script

**Context:** There is no `test:watch` in package.json, which forces the dev to run `pnpm nx test angular --watch` manually.

**What to do:**

- Add `"test:watch": "pnpm nx test angular --watch"` to `package.json`

#### B3 — E2E with interaction tests

**Context:** The current E2E only has smoke tests (29 routes, only verifies the page loads). It does not test real interaction.

**What to do:**

- Add Playwright E2E tests for:
  - Filling and submitting forms (input, select, checkbox, radio)
  - Navigating tabs and stepper
  - Opening and closing dialog, toast, tooltip, dropdown
  - Keyboard navigation (Tab, Enter, Escape, ArrowKeys)
  - Theme switching (light/dark) and visual verification
- Structure with Page Objects in `apps/showcase-e2e/src/pages/`
- Add an optional `"test:e2e"` script in `package.json`

#### B4 — Service tests (theme, accessibility, translation, icon)

**Context:** Fundamental services have no tests.

**What to do:**

- Create tests for:
  - `services/accessibility/` — focus management, reduced motion, prefers-contrast
  - `services/theme/` — theme switching, persistence, system detection
  - `services/translation/` — locale switching, fallback, pipes
  - `services/icon/` — registry, icon resolution, safe error

#### B5 — Testing utilities tests

**Context:** `configureSolarisTesting()` and `provideSolarisTesting()` themselves have no tests.

**What to do:**

- Create a spec for `packages/angular/src/lib/testing/`
- Test that `configureSolarisTesting` works with and without extra providers
- Test that `provideSolarisTesting` configures accessibility + theme + translation correctly

#### B6 — Page Objects for complex components

**Context:** Select, multi-select, and dialog tests repeat the same query + interaction logic.

**What to do:**

- Create Page Objects in `packages/angular/src/lib/testing/page-objects/`:
  - `select.po.ts`
  - `multi-select.po.ts`
  - `dialog.po.ts`
  - `dropdown-menu.po.ts`
- Each PO encapsulates queries, actions (open, close, select), and common assertions

---

## Phase C — Documentation

### Objective

Create the documentation infrastructure that lets any developer (human or AI) understand the visual system and the architecture decisions without inspecting source code.

### Tasks

#### C1 — Set up Storybook

**Context:** Storybook has been on the roadmap since Phase 0 but was never configured. There are no stories for any component.

**What to do:**

- Configure Storybook with `pnpm nx g @nx/angular:storybook-configuration angular`
- Create stories for existing components starting with the highest visual impact: Button, Card, Alert, Dialog, Select, Toast
- Each story should document: variants (appearance, size, color), states (disabled, error, loading), theme (light/dark)
- Add `"storybook"` and `"storybook:build"` scripts to `package.json`
- Document the optional Storybook build in CI

#### C2 — Create formal ADRs

**Context:** Architectural decisions are scattered in text documents without a structured format.

**What to do:**

- Create the `docs/adr/` directory
- Migrate existing decisions from `forms_foundation_contract.md` to ADR format (Nygard-style)
- Register new decisions as they arise
- ADR template at `docs/adr/template.md`

#### C3 — Tutorial guide (create a component from scratch)

**Context:** There is no step-by-step guide for creating a new component following all standards.

**What to do:**

- Create `docs/guides/creating-a-component.md` with:
  - Folder structure
  - Required files (component, spec, docs/stories, showcase)
  - Code patterns (inputs, outputs, CVA, a11y)
  - Verification checklist

#### C4 — Theme customization guide

**Context:** Consumers do not know how to override tokens or create custom themes.

**What to do:**

- Create `docs/guides/theme-customization.md` with:
  - How to override CSS tokens
  - How to create a custom dark theme
  - How to add new tokens
  - Practical example

#### C5 — Icon system documentation

**Context:** The icon system has no dedicated documentation.

**What to do:**

- Create `docs/guides/icons.md` with:
  - How to use the `<solaris-icon>` component
  - How to register new icons
  - List of available icons
  - Accessibility best practices

---

## Phase D — AI Dev Flow

### Objective

Create the ecosystem that lets AI generate complete components (code + tests + docs + showcase) with minimal human intervention, respecting all project standards.

### Tasks

#### D1 — AI prompt templates

**Context:** Each AI task needs different context. Without a template, AI omits important requirements.

**What to do:**

- Create `docs/ai/prompt-templates.md` with templates for:
  - **Create new component**: includes reference to component_standard, accessibility_standard, testing_strategy, definition_of_done
  - **Add feature**: includes impact analysis, affected files, existing contracts
  - **Fix bug**: includes diagnosis steps, cross-platform verification, regression tests
  - **Refactor**: includes boundary rules, forbidden imports, public API changes

#### D2 — Automatic component scaffold

**Context:** Creating a new component requires creating 6-8 manual files. This is repetitive and error-prone.

**What to do:**

- Create `tools/scripts/generate-component.mjs` that:
  - Takes name and category as arguments
  - Generates the complete folder and file structure:
    - `component/` with `.component.ts`, `.component.html`, `.component.scss`
    - `docs/` with `.md` stub
    - `spec` with test stub
  - Uses predefined templates in `tools/templates/component/`
  - Respects `component_standard.md` and `testing_strategy.md`
  - Generates a changeset stub automatically

#### D3 — Post-scaffold compliance validation

**Context:** Even with the scaffold, generated code can deviate from the standards.

**What to do:**

- Create `tools/scripts/validate-component.mjs` that checks:
  - Correct folder structure
  - Inputs and outputs follow naming convention
  - Tests exist
  - Documentation exists
  - Tokens are used (no fixed values)
  - Basic accessibility (aria-\*, role, focus)
  - No forbidden imports
- Integrate into `verify.mjs` as an optional check for component directories

#### D4 — Automatic changeset in scaffold

**Context:** Developers forget to create a changeset when adding a component.

**What to do:**

- The `generate-component.mjs` script already generates a changeset stub (D2)
- Add CI validation that checks whether a new component has a changeset (A2)

---

## Checklist by phase

### Phase A — Tools & Guardrails

- [x] A1: `check-token-references.mjs` integrated into `verify`
- [x] A2: `check:changeset` integrated into `verify`
- [x] A3: Pre-push hook configured (`"pre-push": "pnpm verify"`)
- [x] A4: `check-bundle.mjs` created and integrated (optional in verify)
- [x] A5: `check:vulnerabilities` integrated into `verify`
- [x] A6: `check:dependencies` integrated into `check` and `verify`
- [x] A7: `sort-scss-properties.js` removed
- [x] `pnpm verify` passes clean
- [x] CI pipeline updated with all new checks

### Phase B — Tests

- [x] B1: Global `vitest.setup.ts` created (`packages/angular/src/vitest.setup.ts`)
- [x] B2: `test:watch` in package.json
- [x] B3: E2E with interaction (forms, overlay, keyboard) - 138 tests passing
- [x] B4: Service tests (theme ✅, accessibility ✅, translation ✅, icon ✅)
- [x] B5: Testing utilities tests
- [x] B6: Page Objects for complex components — dialog, select, dropdown-menu, toast, popover, tabs, tooltip, button
- [x] Service coverage reaches 85%+ (statements 85%, threshold 85%)
- [x] Branch coverage reaches 85%+ (branches 85.07%, threshold 85%)
- [x] E2E passes on 3 browsers (Chromium, Firefox, WebKit) - validated 2026-07-31

### Phase C — Documentation

- [x] C1: Storybook configured with stories for core components (Button, Dialog, Select, Toast, Alert, Card)
- [x] C2: ADRs created (template + 5 ADRs: standalone, signals, tokens, directive-vs-component, i18n)
- [x] C3: Tutorial guide (create a component from scratch) — `docs/guides/creating-a-component.md`
- [x] C4: Theme customization guide — `docs/guides/theme-customization.md`
- [x] C5: Icon system documentation — `docs/guides/icons.md`
- [x] Storybook builds without errors
- [x] `/AGENTS.md` created at the root as the AI entry point
- [x] `opencode.json` configured referencing AGENTS.md

### Phase D — AI Dev Flow

- [x] D1: Prompt templates in `docs/ai/prompt-templates.md`
- [x] D2: `generate-component.mjs` functional (with templates in `tools/templates/component/`)
- [x] D3: `validate-component.mjs` functional
- [x] D4: Automatic changeset in scaffold
- [x] Complete component generation (tests + docs + changeset stub)
- [x] Blind test: AI generates a new component following the template and scaffold (divider-stack, 2026-07-31)

---

## Progression rule

- **Phase A must be 100%** before starting Phase B
- **Phase B must be 100%** before starting Phase C
- **Phase D can start in parallel with Phase C** (they are complementary)
- No phase is considered complete until every checklist item is checked
- The checklist must be filled in manually at the end of each phase
