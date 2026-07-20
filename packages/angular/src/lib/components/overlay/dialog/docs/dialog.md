# Solaris Dialog

## Purpose

Dialog blocks the flow and demands user attention. Use for confirmations, alerts, forms, previews, terms, reviews, multi-step flows, onboarding, registration, password recovery, and short checkouts.

## When to use Dialog vs Toast vs Popover

- **Dialog**: Blocks/interrupts the flow. Requires user attention and action before continuing. Use for critical confirmations, forms, multi-step processes, alerts.
- **Toast**: Informs without blocking. Does not require user action. Use for non-critical notifications, success messages, status updates.
- **Popover**: Contextualizes or offers lightweight interaction. Does not block the main flow. Use for quick actions, filters, menus.

## Installation

The Dialog module is part of the `@solaris-ui/angular` package. To use it, add the provider:

```typescript
import { provideSolarisDialog } from '@solaris-ui/angular';

bootstrapApplication(App, {
  providers: [provideSolarisDialog()],
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

| Property             | Type                                                        | Default            | Description                     |
| -------------------- | ----------------------------------------------------------- | ------------------ | ------------------------------- |
| title                | `string`                                                    | -                  | Dialog title                    |
| titleKey             | `string`                                                    | -                  | Translation key for title       |
| description          | `string`                                                    | -                  | Dialog description              |
| descriptionKey       | `string`                                                    | -                  | Translation key for description |
| icon                 | `string`                                                    | -                  | Icon name                       |
| iconDecorative       | `boolean`                                                   | `false`            | Whether icon is decorative      |
| variant              | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'`        | Semantic variant                |
| appearance           | `'surface' \| 'outline'`                                    | `'surface'`        | Visual appearance               |
| size                 | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'`              | `'md'`             | Dialog size                     |
| width                | `string`                                                    | -                  | Custom width                    |
| height               | `string`                                                    | -                  | Custom height                   |
| minWidth             | `string`                                                    | -                  | Minimum width                   |
| maxWidth             | `string`                                                    | -                  | Maximum width                   |
| minHeight            | `string`                                                    | -                  | Minimum height                  |
| maxHeight            | `string`                                                    | -                  | Maximum height                  |
| closeable            | `boolean`                                                   | `true`             | Show close button               |
| closeLabel           | `string`                                                    | `'Close'`          | Close button aria-label         |
| closeLabelKey        | `string`                                                    | -                  | Translation key for close label |
| closeOnEscape        | `boolean`                                                   | `true`             | Close on Escape key             |
| closeOnBackdropClick | `boolean`                                                   | `true`             | Close on backdrop click         |
| autoFocus            | `'first-tabbable' \| 'panel' \| false`                      | `'first-tabbable'` | Auto focus behavior             |
| restoreFocus         | `boolean`                                                   | `true`             | Restore focus on close          |
| role                 | `'dialog' \| 'alertdialog'`                                 | `'dialog'`         | ARIA role                       |
| ariaLabel            | `string`                                                    | -                  | ARIA label                      |
| ariaLabelKey         | `string`                                                    | -                  | Translation key for ARIA label  |
| ariaLabelledBy       | `string`                                                    | -                  | ARIA labelledby                 |
| ariaDescribedBy      | `string`                                                    | -                  | ARIA describedby                |
| actions              | `SolarisDialogAction[]`                                     | -                  | Action buttons                  |
| actionsAlign         | `'start' \| 'center' \| 'end' \| 'space-between'`           | `'end'`            | Actions alignment               |
| actionsStack         | `'auto' \| 'horizontal' \| 'vertical'`                      | `'auto'`           | Actions stacking                |

### SolarisDialogAction

| Property   | Type                                                                     | Description                                   |
| ---------- | ------------------------------------------------------------------------ | --------------------------------------------- |
| label      | `string`                                                                 | Button label                                  |
| labelKey   | `string`                                                                 | Translation key for label                     |
| appearance | `'solid' \| 'outline' \| 'ghost' \| 'tonal' \| 'surface'`                | Button appearance                             |
| color      | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | Button color                                  |
| disabled   | `boolean`                                                                | Whether action is disabled                    |
| close      | `boolean`                                                                | Whether clicking closes the dialog            |
| result     | `TResult`                                                                | Result to emit on close                       |
| action     | `(ref) => void \| Promise<void>`                                         | Callback before close                         |
| autoFocus  | `boolean`                                                                | Whether this action should receive auto focus |

Actions are rendered using the Solaris Button directive (`[solaris-button]`).

### SolarisDialogComponentConfig

| Property             | Type                                           | Default            | Description                            |
| -------------------- | ---------------------------------------------- | ------------------ | -------------------------------------- |
| width                | `string`                                       | -                  | Custom width                           |
| height               | `string`                                       | -                  | Custom height                          |
| minWidth             | `string`                                       | -                  | Minimum width                          |
| maxWidth             | `string`                                       | -                  | Maximum width                          |
| minHeight            | `string`                                       | -                  | Minimum height                         |
| maxHeight            | `string`                                       | -                  | Maximum height                         |
| data                 | `TData`                                        | -                  | Data to inject via SOLARIS_DIALOG_DATA |
| closeable            | `boolean`                                      | `true`             | Show close button                      |
| closeOnEscape        | `boolean`                                      | `true`             | Close on Escape key                    |
| closeOnBackdropClick | `boolean`                                      | `true`             | Close on backdrop click                |
| autoFocus            | `'first-tabbable' \| 'panel' \| false`         | `'first-tabbable'` | Auto focus behavior                    |
| restoreFocus         | `boolean`                                      | `true`             | Restore focus on close                 |
| role                 | `'dialog' \| 'alertdialog'`                    | `'dialog'`         | ARIA role                              |
| appearance           | `'surface' \| 'outline'`                       | `'surface'`        | Visual appearance                      |
| size                 | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'` | `'md'`             | Dialog size                            |

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

## Sizes

- `sm`: Quick confirmations
- `md`: Default standard dialogs
- `lg`: Forms and complex content
- `xl`: Ample content
- `fullscreen`: Full viewport, useful for complex flows on mobile

## Variants

- `neutral`: Default, no special semantics
- `info`: Informational
- `success`: Success confirmation
- `warning`: Warning about potential issues
- `danger`: Destructive action confirmation

## Appearance

- `surface`: Default. Surface/raised background with shadow, no border.
- `outline`: Surface background with visible border.

## Accessibility

- `role="dialog"` by default, `role="alertdialog"` for critical alerts
- `aria-modal="true"` on the panel
- `aria-labelledby` when title is present
- `aria-describedby` when description is present
- `aria-label` when no title is present
- Focus trap: Focus is trapped within the dialog
- Restore focus: Focus returns to the trigger element on close
- Escape closes the dialog when `closeOnEscape` is true
- Backdrop click closes when `closeOnBackdropClick` is true
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

  next(): void {
    this.activeStep.update((v) => Math.min(v + 1, 2));
  }
  previous(): void {
    this.activeStep.update((v) => Math.max(v - 1, 0));
  }
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

### Dialog Flow

```typescript
// Import DialogFlowExampleComponent (or implement inline)
this.dialog.openComponent(DialogFlowExampleComponent, {
  width: '600px',
  minHeight: '300px',
});
```

## Limitations (v1)

- No nested dialogs
- No drawer or sheet panels
- No drag or resize
- No glass appearance
- No swipe gesture support for Dialog Flow
- Dialog Flow does not include form validation integration
- Dialog Flow does not include routing integration
