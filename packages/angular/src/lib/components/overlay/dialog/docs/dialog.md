# Solaris Dialog

## Purpose

Dialog blocks the flow and demands user attention. Use for confirmations, alerts, forms, previews, terms, reviews, multi-step flows, onboarding, registration, password recovery, and short checkouts.

## When to use Dialog vs Toast vs Popover

- **Dialog**: Blocks/interrupts the flow. Requires user attention and action before continuing. Use for critical confirmations, forms, multi-step processes, alerts.
- **Toast**: Informs without blocking. Does not require user action. Use for non-critical notifications, success messages, status updates.
- **Popover**: Contextualizes or offers lightweight interaction. Does not block the main flow. Use for quick actions, filters, menus.

## Installation

The Dialog module is part of the `@educarehq/solaris-ui` package. To use it, add the provider:

```typescript
import { provideSolaris } from '@educarehq/solaris-ui';

bootstrapApplication(App, {
  providers: [provideSolaris()],
});
```

## API

### SolarisDialogService

#### `open(options): SolarisDialogRef`

Creates a simple dialog from configuration options.

```typescript
this.dialog.open({
  title: 'Discard changes?',
  description: 'You have unsaved changes. Do you want to continue?',
  variant: 'warning',
  actions: [
    { label: 'Cancel', appearance: 'ghost', close: true, result: 'cancel' },
    { label: 'Discard', color: 'danger', close: true, result: 'discard' },
  ],
});
```

#### `openComponent(component, config?): SolarisDialogRef`

Creates a dialog with an external component.

```typescript
const ref = this.dialog.openComponent(UserProfileComponent, {
  width: '600px',
  data: { userId: '123' },
});

ref.afterClosed().subscribe((result) => {
  console.log('Dialog result:', result);
});
```

### SolarisDialogRef

```typescript
interface SolarisDialogRef<TResult = unknown> {
  id: string;
  close(result?: TResult): void;
  afterClosed(): Observable<TResult | undefined>;
  componentInstance?: unknown;
}
```

- `close(result?)`: Closes the dialog and optionally emits a result.
- `afterClosed()`: Returns an Observable that emits exactly once when the dialog is closed, then completes. Emits `undefined` if no result was provided.
- `componentInstance`: The instance of the external component (when using `openComponent`).

### SOLARIS_DIALOG_DATA

Injection token for passing data to component-based dialogs.

```typescript
class UserProfileComponent {
  private readonly data = inject(SOLARIS_DIALOG_DATA) as UserData;
  private readonly dialogRef = inject(SolarisDialogRef<string>);

  save(): void {
    this.dialogRef.close('saved');
  }
}
```

### SolarisDialogOptions

| Property             | Type                                                                                                                 | Default            | Description                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------ |
| title                | `string`                                                                                                             | -                  | Dialog title                         |
| titleKey             | `string`                                                                                                             | -                  | Translation key for title            |
| description          | `string`                                                                                                             | -                  | Dialog description                   |
| descriptionKey       | `string`                                                                                                             | -                  | Translation key for description      |
| icon                 | `string`                                                                                                             | -                  | Icon name                            |
| iconDecorative       | `boolean`                                                                                                            | `false`            | Whether icon is decorative           |
| variant              | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`                                                          | `'neutral'`        | Semantic variant                     |
| appearance           | `'surface' \| 'outline'`                                                                                             | `'outline'`        | Visual appearance                    |
| fullscreen           | `boolean`                                                                                                            | `false`            | Full-viewport panel                  |
| placement            | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'center'`         | Panel position                       |
| sheet                | `boolean`                                                                                                            | `false`            | Dock to an edge placement as a sheet |
| width                | `string`                                                                                                             | -                  | Custom width                         |
| height               | `string`                                                                                                             | -                  | Custom height                        |
| minWidth             | `string`                                                                                                             | -                  | Minimum width                        |
| maxWidth             | `string`                                                                                                             | -                  | Maximum width                        |
| minHeight            | `string`                                                                                                             | -                  | Minimum height                       |
| maxHeight            | `string`                                                                                                             | -                  | Maximum height                       |
| closeable            | `boolean`                                                                                                            | `true`             | Show close button                    |
| closeLabel           | `string`                                                                                                             | `'Close'`          | Close button aria-label              |
| closeLabelKey        | `string`                                                                                                             | -                  | Translation key for close label      |
| backdrop             | `boolean`                                                                                                            | `true`             | Show the modal backdrop              |
| closeOnEscape        | `boolean`                                                                                                            | `true`             | Close on Escape key                  |
| closeOnBackdropClick | `boolean`                                                                                                            | `true`             | Close on backdrop click              |
| autoFocus            | `'first-tabbable' \| 'panel' \| false`                                                                               | `'first-tabbable'` | Auto focus behavior                  |
| restoreFocus         | `boolean`                                                                                                            | `true`             | Restore focus on close               |
| role                 | `'dialog' \| 'alertdialog'`                                                                                          | `'dialog'`         | ARIA role                            |
| ariaLabel            | `string`                                                                                                             | -                  | ARIA label                           |
| ariaLabelKey         | `string`                                                                                                             | -                  | Translation key for ARIA label       |
| ariaLabelledBy       | `string`                                                                                                             | -                  | ARIA labelledby                      |
| ariaDescribedBy      | `string`                                                                                                             | -                  | ARIA describedby                     |
| actions              | `SolarisDialogAction[]`                                                                                              | -                  | Action buttons                       |
| headerSeparator      | `boolean`                                                                                                            | `true`             | Show header separator line           |
| footerSeparator      | `boolean`                                                                                                            | `true`             | Show footer separator line           |
| radius               | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                                                           | `'lg'`             | Panel border radius                  |
| density              | `'compact' \| 'normal' \| 'comfortable'`                                                                             | theme density      | Section spacing density              |
| actionsShape         | `'normal' \| 'wide'`                                                                                                 | -                  | Default shape for action buttons     |
| actionsDensity       | `'compact' \| 'normal' \| 'comfortable'`                                                                             | -                  | Default density for action buttons   |
| actionsRadius        | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                                                           | -                  | Default radius for action buttons    |
| actionsAlign         | `'start' \| 'center' \| 'end' \| 'space-between'`                                                                    | `'end'`            | Actions alignment                    |
| actionsStack         | `'auto' \| 'horizontal' \| 'vertical'`                                                                               | `'auto'`           | Actions stacking                     |

### SolarisDialogAction

| Property     | Type                                                                     | Description                                   |
| ------------ | ------------------------------------------------------------------------ | --------------------------------------------- | ------------------------------------ |
| label        | `string`                                                                 | Button label                                  |
| labelKey     | `string`                                                                 | Translation key for label                     |
| appearance   | `'solid' \| 'outline' \| 'ghost' \| 'tonal' \| 'surface'`                | Button appearance                             |
| color        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | Button color                                  |
| shape        | `'normal' \| 'wide'`                                                     | Button shape (overrides `actionsShape`)       |
| density      | `'compact' \| 'normal' \| 'comfortable'`                                 | Button density (overrides `actionsDensity`)   |
| radius       | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                               | Button radius (overrides `actionsRadius`)     |
| icon         | `string`                                                                 | Icon name                                     |
| iconPosition | `'start' \| 'end'`                                                       | Icon position                                 |
| position     | `'start'                                                                 | 'end'`                                        | Pin to row start (splits footer 1+2) |
| loading      | `boolean`                                                                | Whether action shows loading state            |
| disabled     | `boolean`                                                                | Whether action is disabled                    |
| close        | `boolean`                                                                | Whether clicking closes the dialog            |
| result       | `TResult`                                                                | Result to emit on close                       |
| action       | `(ref) => void \| Promise<void>`                                         | Callback before close                         |
| autoFocus    | `boolean`                                                                | Whether this action should receive auto focus |

Actions are rendered using the Solaris Button directive (`[solaris-button]`).

### SolarisDialogComponentConfig

| Property             | Type                                                                                                                 | Default            | Description                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------- |
| title                | `string`                                                                                                             | -                  | Chrome header title (renders `solaris-dialog-header`) |
| titleKey             | `string`                                                                                                             | -                  | Translation key for chrome header title               |
| description          | `string`                                                                                                             | -                  | Chrome header description                             |
| descriptionKey       | `string`                                                                                                             | -                  | Translation key for chrome header description         |
| icon                 | `string`                                                                                                             | -                  | Chrome header icon name                               |
| iconDecorative       | `boolean`                                                                                                            | `false`            | Whether chrome header icon is decorative              |
| variant              | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`                                                          | -                  | Chrome header variant (also reflected on the host)    |
| width                | `string`                                                                                                             | -                  | Custom width                                          |
| height               | `string`                                                                                                             | -                  | Custom height                                         |
| minWidth             | `string`                                                                                                             | -                  | Minimum width                                         |
| maxWidth             | `string`                                                                                                             | -                  | Maximum width                                         |
| minHeight            | `string`                                                                                                             | -                  | Minimum height                                        |
| maxHeight            | `string`                                                                                                             | -                  | Maximum height                                        |
| data                 | `TData`                                                                                                              | -                  | Data to inject via SOLARIS_DIALOG_DATA                |
| closeable            | `boolean`                                                                                                            | `true`             | Show close button                                     |
| closeLabel           | `string`                                                                                                             | `'Close'`          | Close button aria-label                               |
| closeLabelKey        | `string`                                                                                                             | -                  | Translation key for close label                       |
| backdrop             | `boolean`                                                                                                            | `true`             | Show the modal backdrop                               |
| closeOnEscape        | `boolean`                                                                                                            | `true`             | Close on Escape key                                   |
| closeOnBackdropClick | `boolean`                                                                                                            | `true`             | Close on backdrop click                               |
| autoFocus            | `'first-tabbable' \| 'panel' \| false`                                                                               | `'first-tabbable'` | Auto focus behavior                                   |
| restoreFocus         | `boolean`                                                                                                            | `true`             | Restore focus on close                                |
| role                 | `'dialog' \| 'alertdialog'`                                                                                          | `'dialog'`         | ARIA role                                             |
| ariaLabel            | `string`                                                                                                             | -                  | ARIA label                                            |
| ariaLabelKey         | `string`                                                                                                             | -                  | Translation key for ARIA label                        |
| ariaLabelledBy       | `string`                                                                                                             | -                  | ARIA labelledby                                       |
| ariaDescribedBy      | `string`                                                                                                             | -                  | ARIA describedby                                      |
| appearance           | `'surface' \| 'outline'`                                                                                             | `'outline'`        | Visual appearance                                     |
| fullscreen           | `boolean`                                                                                                            | `false`            | Full-viewport panel                                   |
| placement            | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'center'`         | Panel position                                        |
| sheet                | `boolean`                                                                                                            | `false`            | Dock to an edge placement as a sheet                  |
| headerSeparator      | `boolean`                                                                                                            | `true`             | Show header separator line                            |
| footerSeparator      | `boolean`                                                                                                            | `true`             | Show footer separator line                            |
| radius               | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                                                           | `'lg'`             | Panel border radius                                   |
| density              | `'compact' \| 'normal' \| 'comfortable'`                                                                             | theme density      | Section spacing density                               |
| actionsShape         | `'normal' \| 'wide'`                                                                                                 | -                  | Default shape for chrome action buttons               |
| actionsDensity       | `'compact' \| 'normal' \| 'comfortable'`                                                                             | -                  | Default density for chrome action buttons             |
| actionsRadius        | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`                                                                           | -                  | Default radius for chrome action buttons              |
| actions              | `SolarisDialogAction[]`                                                                                              | -                  | Chrome footer action buttons                          |
| actionsAlign         | `'start' \| 'center' \| 'end' \| 'space-between'`                                                                    | `'end'`            | Chrome footer actions alignment                       |
| actionsStack         | `'auto' \| 'horizontal' \| 'vertical'`                                                                               | `'auto'`           | Chrome footer actions stacking                        |

## Actions Alignment

Actions can be aligned using `actionsAlign`:

- `start`: Align left
- `center`: Align center
- `end`: Align right (default)
- `space-between`: Distribute space between actions

```typescript
this.dialog.open({
  title: 'Confirm',
  actionsAlign: 'space-between',
  actions: [
    { label: 'Learn more', appearance: 'ghost', close: true },
    { label: 'Got it', color: 'primary', close: true },
  ],
});
```

Pin the first action to the start while the rest stays at the end with
`position: 'start'` (renders two groups with `data-split`):

```typescript
this.dialog.open({
  title: 'Split actions',
  actions: [
    { label: 'Back', appearance: 'ghost', position: 'start', close: true },
    { label: 'Help', appearance: 'ghost', close: true },
    { label: 'Verify', color: 'primary', close: true },
  ],
});
```

## Sizing

The panel adapts to its content by default (constrained by
`--solaris-dialog-panel-min-width` / `--solaris-dialog-panel-max-width` /
`--solaris-dialog-panel-max-height`). Use explicit `width` / `height` /
`minWidth` / `maxWidth` / `minHeight` / `maxHeight` for custom sizing, or
`fullscreen: true` for a full-viewport panel (useful for complex flows on
mobile).

## Variants

- `neutral`: Default, no special semantics
- `info`: Informational
- `success`: Success confirmation
- `warning`: Warning about potential issues
- `danger`: Destructive action confirmation

## Appearance

- `surface`: Borderless surface background (`--solaris-neutral-default`) with shadow, no border.
- `outline`: Default. Surface background with visible border.
- `flat`: Bordered panel like `outline`, but the header, footer and actions
  share the same background as the content (no bands). Pass `flat` implicitly
  via `appearance: 'flat'` (forwarded to the chrome header and actions);
  manual compositions set `[flat]` on each `solaris-dialog-header` /
  `solaris-dialog-footer` / `solaris-dialog-actions`. Separators and scrolled
  shadows stay off so the chrome never paints a band.

## Close button

The close button is rendered in-flow by `solaris-dialog-header` as a
`[data-dialog-close]` icon button, vertically centered with the icon and the
title on the same row. The description always renders below the title and
never shifts the close button. `solaris-dialog-container` only renders its
legacy floating (`position: absolute`) close button as a fallback when the
dialog has no header at all (component dialog without chrome
`title`/`description`/`icon`).

`solaris-dialog-header` also accepts:

| Input        | Type      | Default   | Description                                                              |
| ------------ | --------- | --------- | ------------------------------------------------------------------------ |
| `closeable`  | `boolean` | `false`   | Show the in-flow close button (managed dialogs enable it automatically)  |
| `closeLabel` | `string`  | `'Close'` | Close button `aria-label`                                                |
| `scrolled`   | `boolean` | -         | Force the scrolled elevation. When omitted, the header detects scrolling |

## Sticky header and footer

`solaris-dialog-header` is `position: sticky; top: 0` with the panel
background, so it stays pinned while the body scrolls (both in managed
dialogs, where the header sits outside the scroll region, and in manual
composition, where the header is placed inside `solaris-dialog-content`).
While scrolled (`data-scrolled`), the header gains an elevation shadow
(`--solaris-dialog-header-scrolled-shadow`) below it. In managed dialogs the
scroll state is wired automatically; in manual composition the header detects
the closest scrollable ancestor on its own.

`solaris-dialog-footer` and `solaris-dialog-actions` mirror this at the
bottom: `position: sticky; bottom: 0` with the panel background, so action
bars stay pinned in manual composition too (in managed dialogs they already
sit outside the scroll region). Their `data-scrolled` elevation
(`--solaris-dialog-footer-scrolled-shadow` /
`--solaris-dialog-actions-scrolled-shadow`) appears while there is still
content below the fold, and both accept an optional `scrolled` input to force
the state — just like the header.

## Separators

Header and footer separators mirror `solaris-card` / `solaris-selection-card`:
`headerSeparator` / `footerSeparator` default to `true` and toggle
`data-separator` on the header and actions sections. Content and actions ship
with zero `padding` / `margin` / `gap` by default; spacing is opt-in via
`density` (`compact` / `normal` / `comfortable`, falling back to the theme
density like `solaris-card`).

`solaris-dialog-content` exposes `--solaris-dialog-content-padding`
(`spacing-0/2/4/6` for default/compact/normal/comfortable). Override it
without `::ng-deep`:

```css
solaris-dialog-content {
  --solaris-dialog-content-padding: var(--solaris-spacing-8);
}
```

`solaris-dialog-header` accepts `density` (input > theme > `normal`,
forwarded by `solaris-dialog-container` chrome and by `solaris-dialog`
in simple mode) and pairs icon and title on the same scale:

| Density       | Title / icon          | Media container    |
| ------------- | --------------------- | ------------------ |
| `compact`     | `font-size-md` (18px) | `spacing-7` (16px) |
| `normal`      | `font-size-lg` (20px) | `spacing-8` (20px) |
| `comfortable` | `font-size-xl` (24px) | `spacing-9` (24px) |

## Placements

- `center`: Default. Panel is centered vertically and horizontally.
- `top` / `bottom` / `left` / `right`: Panel is anchored to one edge with 24px offset.
- `top-left` / `top-right` / `bottom-left` / `bottom-right`: Panel is anchored
  to a corner with 24px offsets. Useful for bottom-sheet style previews or
  action panels that do not need to occupy the full height.

```typescript
this.dialog.open({
  title: 'Icon usage',
  placement: 'bottom',
  width: 'min(40rem, calc(100vw - 2rem))',
  closeable: true,
});
```

For non-modal bottom sheets, set `backdrop: false` to remove the dimming
overlay. The panel keeps its own pointer events and the page behind remains
interactive.

## Sheets

Set `sheet: true` together with an edge `placement` (`top` / `bottom` /
`left` / `right`) to dock the panel to that edge: full width (bottom/top)
or full height (left/right), no 24px offset, always straight edges
(`radius` is ignored on sheets). `sheet` is ignored for `center`, corner
placements and `fullscreen`, which keep the floating panel. The container
reflects it as `data-sheet` (presence attribute).

```typescript
this.dialog.open({
  title: 'Filters',
  description: 'Refine the list below.',
  placement: 'bottom',
  sheet: true,
  actions: [{ label: 'Apply', color: 'primary', close: true }],
});
```

## Nested dialogs

Dialogs can open on top of each other (e.g. a confirmation inside a form
dialog). Each `open()` / `openComponent()` creates its own overlay; the
service tracks the stack:

- Only the topmost dialog reacts to Escape (`SolarisDialogService.isTopmost(ref)`,
  `openCount`, `topmostId`).
- Panels below the topmost get `aria-hidden="true"` so assistive
  technology only exposes the active dialog. Focus trap, initial focus and
  focus restore keep working per dialog.
- Each dialog keeps its own backdrop: clicking outside the inner panel only
  reaches the inner backdrop.

```typescript
class OuterComponent {
  confirmDelete(): void {
    this.dialog.open({
      title: 'Discard changes?',
      variant: 'warning',
      role: 'alertdialog',
      actions: [
        { label: 'Keep editing', appearance: 'ghost', close: true },
        { label: 'Discard', color: 'danger', close: true, result: 'discard' },
      ],
    });
  }
}
```

Keep nesting shallow (one level): deep stacks are hard to follow for
sighted and screen-reader users alike.

## CSS Variables

The following CSS variables can be customized. Panel and backdrop tokens are declared on the dialog container; icon and close tokens on the dialog header.

| Token                                      | Purpose                                      |
| ------------------------------------------ | -------------------------------------------- |
| `--solaris-dialog-panel-bg`                | Panel background                             |
| `--solaris-dialog-panel-padding`           | Panel inner padding                          |
| `--solaris-dialog-panel-radius`            | Panel border radius                          |
| `--solaris-dialog-panel-shadow`            | Panel box shadow                             |
| `--solaris-dialog-panel-border`            | Panel border color (outline appearance)      |
| `--solaris-dialog-panel-min-width`         | Panel minimum width                          |
| `--solaris-dialog-panel-max-width`         | Panel maximum width                          |
| `--solaris-dialog-panel-max-height`        | Panel maximum height                         |
| `--solaris-dialog-backdrop-bg`             | Backdrop background                          |
| `--solaris-dialog-backdrop-filter`         | Backdrop blur (`blur(2px)` by default)       |
| `--solaris-dialog-z-index`                 | Stack order of the overlay                   |
| `--solaris-dialog-icon-color`              | Header icon color                            |
| `--solaris-dialog-icon-size`               | Header icon size (matches title per density) |
| `--solaris-dialog-title-size`              | Header title size (md/lg/xl per density)     |
| `--solaris-dialog-content-padding`         | Dialog content padding (per density)         |
| `--solaris-dialog-close-icon-size`         | Close button icon size (header + fallback)   |
| `--solaris-dialog-media-size`              | Header icon container size                   |
| `--solaris-dialog-header-border-color`     | Header separator line color                  |
| `--solaris-dialog-header-z-index`          | Header stacking above scrolled content       |
| `--solaris-dialog-header-scrolled-shadow`  | Header elevation shadow while scrolled       |
| `--solaris-dialog-footer-z-index`          | Footer stacking above scrolled content       |
| `--solaris-dialog-footer-scrolled-shadow`  | Footer elevation shadow with content below   |
| `--solaris-dialog-actions-z-index`         | Actions stacking above scrolled content      |
| `--solaris-dialog-actions-scrolled-shadow` | Actions elevation shadow with content below  |
| `--solaris-dialog-actions-border-color`    | Footer separator line color                  |

## Accessibility

- `role="dialog"` by default, `role="alertdialog"` for critical alerts
- `aria-modal="true"` on the panel
- `aria-labelledby` points to the title element when a title is present
- `aria-describedby` points to the description element when a description is present
- `aria-label` / `ariaLabelKey` override the labelledby wiring when provided
- Title and description ids are unique per dialog (`<dialog-id>-title` /
  `<dialog-id>-description`), so stacked dialogs never share ids
- Focus trap: Focus is trapped within the dialog
- Initial focus (`autoFocus`): `'first-tabbable'` (default) focuses the first
  action button when actions are present, otherwise the first tabbable
  element, `'panel'` focuses the panel itself, `false` moves no
  focus. An action with `autoFocus: true` wins over the dialog-level setting.
- Restore focus: Focus returns to the trigger element on close (opt out with
  `restoreFocus: false`)
- Escape closes the dialog when `closeOnEscape` is true
- Backdrop click closes when `closeOnBackdropClick` is true
- Stacked dialogs: only the topmost reacts to Escape; panels below get
  `aria-hidden="true"`
- Close button has `aria-label`
- Reduced motion respected

## Dialog Flow

Dialog Flow enables multi-step dialogs with smooth slide transitions between steps, using a single overlay (no closing/reopening).

```html
<solaris-dialog-flow [(activeIndex)]="activeStep" transition="slide">
  <solaris-dialog-step>
    <div>Step 1 content</div>
  </solaris-dialog-step>

  <solaris-dialog-step>
    <div>Step 2 content</div>
  </solaris-dialog-step>
</solaris-dialog-flow>
```

```typescript
class MyComponent {
  readonly activeStep = signal(0);
  readonly flow = viewChild.required(SolarisDialogFlowComponent);

  next(): void {
    this.flow().next();
  }
  previous(): void {
    this.flow().previous();
  }
}
```

### Programmatic navigation

`SolarisDialogFlowComponent` exposes `next()`, `previous()` and
`goTo(index)`. Navigation is disabled-aware: `next()` / `previous()` skip
disabled steps, and `goTo()` ignores out-of-range and disabled targets, so
callers can bind these directly to buttons without extra guards.

### Gating steps on form validity

Mark a step `[disabled]` from a form's validity signal. The step is skipped
by `next()` / `previous()`, rejected by `goTo()`, and exposed as
`data-disabled` on the rendered step wrapper for styling (step hosts are
not projected into the DOM — only the footer slot is):

```html
<solaris-dialog-flow [(activeIndex)]="activeStep">
  <solaris-dialog-step>
    <form>…account fields…</form>
  </solaris-dialog-step>

  <solaris-dialog-step [disabled]="accountForm.invalid">
    <form>…institution fields…</form>
  </solaris-dialog-step>
</solaris-dialog-flow>
```

### Syncing with the router

The flow is router-agnostic by design; sync `activeIndex` with a query
param when deep-linking matters:

```typescript
readonly activeStep = signal(
  Number(this.route.snapshot.queryParamMap.get('step') ?? 0),
);

goToStep(index: number): void {
  this.flow().goTo(index);
  void this.router.navigate([], { queryParams: { step: index } });
}
```

## Examples

### Simple dialog

```typescript
this.dialog.open({
  title: 'Dialog Title',
  description: 'This is a basic dialog.',
  actions: [
    { label: 'Cancel', appearance: 'ghost', close: true },
    { label: 'Confirm', color: 'primary', close: true },
  ],
});
```

### Component dialog

```typescript
const ref = this.dialog.openComponent(MyComponent, {
  width: '500px',
  data: { someValue: 42 },
});

ref.afterClosed().subscribe((result) => {
  console.log('Closed with:', result);
});
```

Inside MyComponent:

```typescript
class MyComponent {
  private readonly data = inject(SOLARIS_DIALOG_DATA) as MyData;
  private readonly dialogRef = inject(SolarisDialogRef<string>);

  submit(): void {
    this.dialogRef.close('submitted');
  }
}
```

### Component dialog with chrome (header/footer via config)

Pass `title`, `description`, `icon` and `actions` in the component config and
the container renders `solaris-dialog-header` above and
`solaris-dialog-actions` below your component. The custom component keeps only
its body content; the panel body scrolls while header and footer stay fixed.

```typescript
const ref = this.dialog.openComponent(MyFormComponent, {
  title: 'Edit user',
  description: 'Changes are saved immediately.',
  variant: 'info',
  width: '500px',
  data: { userId: '123' },
  actions: [
    { label: 'Cancel', appearance: 'ghost', close: true },
    { label: 'Save', color: 'primary', close: true, result: 'saved' },
  ],
});
```

When a chrome title/description is present, `aria-labelledby` /
`aria-describedby` point to the header ids (`<dialog-id>-title` /
`<dialog-id>-description`), like the simple dialog. Explicit `ariaLabel`,
`ariaLabelledBy` and `ariaDescribedBy` always win.

### Manual composition inside a component dialog

For full control, compose the dialog parts inside your component template.
`solaris-dialog-content` is the only scrollable region;
`solaris-dialog-footer` is a generic footer slot for arbitrary content
(while `solaris-dialog-actions` renders buttons from an `actions` array).
`solarisDialogClose` closes the dialog with an optional result, without
injecting `SolarisDialogRef` for that button.

```html
<solaris-dialog-header title="Edit user" description="..." closeable />
<solaris-dialog-content>
  <form>...</form>
</solaris-dialog-content>
<solaris-dialog-footer align="end">
  <button type="button" solaris-button appearance="ghost" solaris-dialog-close>Cancel</button>
  <button type="button" solaris-button color="primary" (click)="save()">Save</button>
</solaris-dialog-footer>
```

Do not combine chrome-via-config with manual `solaris-dialog-header` /
`solaris-dialog-actions` in the same dialog: prefer one approach per dialog
to avoid duplicated headers or footers.

When composing manually, add `closeable` to `solaris-dialog-header` to keep
the X button (in-flow, centered with the title). The container only renders
its floating fallback close button when the dialog has no header at all —
neither chrome nor a manual `solaris-dialog-header` inside the content.

### Dialog Flow

```typescript
// Import DialogFlowExampleComponent (or implement inline)
this.dialog.openComponent(DialogFlowExampleComponent, {
  width: '600px',
  minHeight: '300px',
});
```

## Limitations (v1)

- No drag or resize
- No swipe gesture support for Dialog Flow
