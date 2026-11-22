# Solaris Dialog Nav

## Purpose

Two-pane dialog shell: a vertical section menu on the left and the active
section content on the right. For the ElevenLabs-style "create" dialogs
(`Create audiobook`, `Publish`, `New series`, …). On narrow viewports the
side menu collapses into a borderless `solaris-select` (`appearance="minimal"`)
at the top — same items, same state.

The nav owns the section chrome only. Wizard trails inside a section use
`solaris-dialog-breadcrumb`; footer buttons use `buildDialogWizardActions`.

## When to use

- Dialogs with independent sections the user can visit in any order.
- Do not use for ordered wizard steps — use `solaris-dialog-breadcrumb`
  with `solaris-dialog-flow` instead.

## Installation

Part of `@educarehq/solaris-ui`. Add the provider once:

```typescript
import { provideSolaris } from '@educarehq/solaris-ui';

bootstrapApplication(App, {
  providers: [provideSolaris()],
});
```

## Usage

```html
<solaris-dialog-nav [items]="sections" [(activeStep)]="section">
  <button type="button" solaris-dialog-nav-footer (click)="newBlank()">New blank project</button>
  <ng-template solaris-dialog-nav-content="audiobook">
    <p>Upload content…</p>
  </ng-template>
  <ng-template solaris-dialog-nav-content="publish">
    <p>Publish content…</p>
  </ng-template>
</solaris-dialog-nav>
```

```typescript
sections = [
  { value: 'audiobook', label: 'Create audiobook', icon: 'notebook-text' },
  { value: 'publish', label: 'Publish', icon: 'up-arrow' },
];
```

## API

### `SolarisDialogNavComponent`

Selector: `solaris-dialog-nav`.

| Input            | Type                     | Default                            | Description                              |
| ---------------- | ------------------------ | ---------------------------------- | ---------------------------------------- |
| `items`          | `SolarisDialogNavItem[]` | required                           | Sections in display order                |
| `activeStep`     | `model<number>`          | `0`                                | Visible section index (two-way bindable) |
| `ariaLabel`      | `string`                 | -                                  | Accessible name for the `nav`            |
| `ariaLabelKey`   | `string`                 | `'solaris.dialog.navLabel'`        | Translation key for the `nav` name       |
| `selectLabel`    | `string`                 | -                                  | Accessible name for the mobile select    |
| `selectLabelKey` | `string`                 | `'solaris.dialog.navSectionLabel'` | Translation key for the mobile select    |

| Output       | Type                         | Description                       |
| ------------ | ---------------------------- | --------------------------------- |
| `stepChange` | `SolarisDialogNavStepChange` | `{ index, previousIndex, value }` |

`SolarisDialogNavItem`: `value` (stable id, matched with
`solaris-dialog-nav-content`), `label` / `labelKey`, `description` /
`descriptionKey` (desktop only), `icon`, `disabled`, `error`.

- Every section is freely clickable (the nav is not a linear wizard).
- The active section renders `aria-current="true"`; `disabled` uses the
  native `disabled` attribute; `error` adds icon + `data-error` styling.
- Content renders through the `ng-template` whose `solaris-dialog-nav-content`
  value matches the active item; unmatched sections render empty.
- `[solaris-dialog-nav-footer]` projects pinned content at the bottom of
  the side column (e.g. "New blank project"). Its `border-top` and padding
  mirror `solaris-dialog-actions` (`--solaris-border-width-sm`,
  `--solaris-neutral-border-default`, `--solaris-spacing-5`) so both
  borders sit on the same Y line. Keep them in sync when customizing.

Keyboard: roving tabindex (single tab stop, follows the active section);
`ArrowUp/Down/Left/Right` move focus without activating, `Home/End` jump,
`Enter`/`Space` or click activates.

Responsive: below `640px` (`@media (width <= 640px)`, same breakpoint as
the dialog panel) the side column hides and a `solaris-select` with
`appearance="minimal"` takes over — borderless trigger, same `items`,
two-way synced through `activeStep`. Disabled sections become disabled
options.

### `SolarisDialogNavContentDirective`

Selector: `[solaris-dialog-nav-content]`. Input: section `value` (alias of the
selector). Exposes the `TemplateRef` rendered when its section is active.

## Accessibility

- `nav` named via `ariaLabel` / `ariaLabelKey`; native list markup.
- When a sectioned dialog replaces the chrome header (no `title`), always
  pass `ariaLabel` / `ariaLabelKey` in the `openComponent` config so the
  panel keeps an accessible name (`aria-dialog-name` is enforced in e2e).
- `aria-current="true"` on the active section; never color alone
  (active also uses background + medium weight; error uses icon + text).
- Roving tabindex keeps a single tab stop; full keyboard support.
- Mobile select is the native accessible `solaris-select`.
- `:focus-visible` ring; `prefers-reduced-motion` disables transitions.

## i18n

Nav dictionary keys (`pt-BR` / `en-US` / `es-419`):

- `solaris.dialog.navLabel`: `Seções` / `Sections` / `Secciones`.
- `solaris.dialog.navSectionLabel`: `Seção` / `Section` / `Sección`.

Item text follows the dialog key-first convention: `labelKey` wins over
`label` (same as `solaris-dialog-actions`), falling back to direct text.

## States

- default, hover, focus-visible, active (`aria-current`), disabled
  (native, `opacity-50`), error (`data-error` + `danger` icon).
