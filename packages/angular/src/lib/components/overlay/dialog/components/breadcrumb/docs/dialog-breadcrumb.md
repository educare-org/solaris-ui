# Solaris Dialog Breadcrumb

## Purpose

Wizard trail for multi-step dialogs (`Upload > Format > Voice > Pronunciation`).
Renders at the top of the dialog content and lets users navigate back to past
steps. Unlike a page breadcrumb, the current step is a `span` with
`aria-current="step"` and future steps are not clickable in linear mode.

Pairs with `solaris-dialog-flow` / `solaris-dialog-step` for the step content
and with `buildDialogWizardActions` for the `Back / Continue / Finish` footer.

## When to use

- Multi-step dialogs where the user must complete steps in order.
- Set `linear="false"` only when steps are independent and free navigation is safe.

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
<solaris-dialog-breadcrumb [(activeStep)]="step" [items]="steps" (stepChange)="onStepChange($event)" />
<solaris-dialog-flow [(activeIndex)]="step">
  <solaris-dialog-step>…upload…</solaris-dialog-step>
  <solaris-dialog-step>…format…</solaris-dialog-step>
</solaris-dialog-flow>
```

```typescript
steps = [
  { value: 'upload', label: 'Upload' },
  { value: 'format', label: 'Format' },
  { value: 'voice', label: 'Voice' },
  { value: 'pronunciation', label: 'Pronunciation' },
];
```

With translation keys (resolved through `SolarisTranslateService`):

```typescript
steps = [{ value: 'upload', labelKey: 'myApp.wizard.upload' }];
```

## API

### `SolarisDialogBreadcrumbComponent`

Selector: `solaris-dialog-breadcrumb`.

| Input          | Type                            | Default                            | Description                                 |
| -------------- | ------------------------------- | ---------------------------------- | ------------------------------------------- |
| `items`        | `SolarisDialogBreadcrumbItem[]` | required                           | Steps in display order                      |
| `activeStep`   | `model<number>`                 | `0`                                | Visible step index (two-way bindable)       |
| `linear`       | `boolean`                       | `true`                             | Future steps not clickable (except `error`) |
| `ariaLabel`    | `string`                        | -                                  | Accessible name for the `nav`               |
| `ariaLabelKey` | `string`                        | `'solaris.dialog.breadcrumbLabel'` | Translation key for the `nav` name          |

| Output       | Type                                | Description                       |
| ------------ | ----------------------------------- | --------------------------------- |
| `stepChange` | `SolarisDialogBreadcrumbStepChange` | `{ index, previousIndex, value }` |

`SolarisDialogBreadcrumbItem`: `value` (stable id), `label` / `labelKey`,
`disabled`, `error`, `completed`.

- Past steps and `completed` steps render as `<button>` and are clickable.
  Completed steps carry no icon: the button affordance (hover, focus,
  clickability) is the state channel, never color alone.
- The current step renders as `<span aria-current="step">` prefixed with a
  screen-reader-only `solaris.dialog.stepOf` (`Step X of Y`) announcement.
- Future steps render as muted text; `disabled` adds `aria-disabled="true"`.
- Steps with `error` stay clickable even when upcoming so validation can be
  fixed; error is conveyed with icon + `data-error` styling, never color alone.

Keyboard: `Tab` moves between step buttons (`Enter`/`Space` activates);
`ArrowLeft/Right/Up/Down`, `Home`, `End` move focus between enabled steps.

### `buildDialogWizardActions`

Pure helper for the wizard footer. Returns `SolarisDialogAction[]` for
`openComponent` chrome actions or `solaris-dialog-actions`:

```typescript
import { buildDialogWizardActions } from '@educarehq/solaris-ui';

const actions = buildDialogWizardActions({ activeStep: step, totalSteps: 4 });
// step 0:        [Continue]
// middle steps:  [Back ghost] [Continue solid]
// last step:     [Back ghost] [Finish solid]
```

Options: `hideBackOnFirstStep` (default `true`), `backDisabled`,
`continueDisabled`, `continueLoading`. Labels resolve via
`solaris.dialog.back` / `solaris.dialog.continue` / `solaris.dialog.finish`
(fallback English `Back` / `Continue` / `Finish`). Results are
`wizard:back` / `wizard:continue` / `wizard:finish`; the product wires
`action` callbacks or maps results to `dialogRef.close()` / step changes.
Footer alignment (`end`, `space-between`, …) stays on the consumer via
`actionsAlign`.

## Accessibility

- `nav` + `ol` / `li` structure, named via `ariaLabel` / `ariaLabelKey`.
- `aria-current="step"` on the current step; `aria-disabled` on disabled steps.
- Every interactive step is a native `<button>` with `:focus-visible` ring.
- `prefers-reduced-motion` (and `data-reduced-motion`) disables transitions.

## i18n

New keys in the `dialog` dictionary (`pt-BR` / `en-US` / `es-419`):

- `solaris.dialog.breadcrumbLabel`: `Etapas` / `Steps` / `Pasos`.
- `solaris.dialog.stepOf`: `Etapa {{current}} de {{total}}` /
  `Step {{current}} of {{total}}` / `Paso {{current}} de {{total}}`.

`Back / Continue / Finish` reuse the existing `dialog` keys.

## States

- default, hover, focus-visible, disabled (`aria-disabled`), error
  (`data-error` + `danger` icon). Completed steps have no marker.
