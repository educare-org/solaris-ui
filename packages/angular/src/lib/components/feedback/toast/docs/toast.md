# Toast

## Purpose

Toast is a **temporary non-blocking feedback component** that informs users about events, success, error, warning, progress, or lightweight actions without interrupting the main flow.

## Definition

Toast communicates **temporary floating feedback**. It appears as an overlay card, auto-dismisses or requires a manual close, and does not block page interaction.

## Toast vs Alert vs Dialog vs Popover

| Aspect      | Toast                                | Alert                        | Dialog                          | Popover                              |
| ----------- | ------------------------------------ | ---------------------------- | ------------------------------- | ------------------------------------ |
| Role        | Temporary feedback                   | Contextual inline message    | Decision or focus               | Structured interaction               |
| Position    | Floating overlay                     | Inline document flow         | Modal overlay                   | Near trigger element                 |
| Persistence | Auto-dismiss or manual close         | Persistent until removed     | Blocks until decision           | Closes on outside click/escape       |
| Interaction | None (except optional close/actions) | None (except optional close) | Decision, form, critical action | Menu, picker, structured interaction |

> **Toast** is not Dialog.  
> **Toast** is not Alert inline.  
> **Toast** is not Popover generic.  
> **Toast** is not Form.

## When to use

- Success confirmation after an operation
- Error or warning notification
- Progress feedback (upload, processing)
- Undo action feedback
- Lightweight non-critical information

## When not to use

- For contextual inline messages (use Alert)
- For blocking decisions (use Dialog)
- For structured interaction menus (use Popover)
- For forms or complex input
- For critical persistent warnings that require acknowledgment

---

## API

### provideSolarisToast

```typescript
import { provideSolarisToast } from '@solaris-ui/angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideSolarisToast({
      position: 'top-end',
      duration: 5000,
      limit: 5,
      appearance: 'surface',
      pauseOnHover: true,
      pauseOnFocus: true,
      newestOnTop: true,
    }),
  ],
});
```

**Config:**

| Property          | Type                                        | Default     | Description                               |
| ----------------- | ------------------------------------------- | ----------- | ----------------------------------------- |
| position          | `SolarisToastPosition`                      | `'top-end'` | Where toasts are positioned               |
| duration          | `number`                                    | `5000`      | Default auto-dismiss duration in ms       |
| limit             | `number`                                    | `5`         | Maximum visible toasts                    |
| appearance        | `SolarisToastAppearance`                    | `'surface'` | Default appearance                        |
| pauseOnHover      | `boolean`                                   | `true`      | Pause dismiss timer on hover              |
| pauseOnFocus      | `boolean`                                   | `true`      | Pause dismiss timer on focus              |
| newestOnTop       | `boolean`                                   | `true`      | Show newest toast at the top of the stack |
| showCountdown     | `boolean`                                   | `false`     | Default countdown visibility              |
| showCountdownText | `boolean`                                   | `false`     | Default countdown text visibility         |
| countdownMode     | `'bar' \| 'text' \| 'both'`                 | `'bar'`     | Default countdown display mode            |
| actionsAlign      | `'start' \| 'center' \| 'end' \| 'stretch'` | `'end'`     | Default actions alignment                 |
| iconSize          | `'sm' \| 'md' \| 'lg'`                      | `'md'`      | Default icon size                         |
| mediaShape        | `'circle' \| 'rounded' \| 'square'`         | `'circle'`  | Default media container shape             |

### SolarisToastService

**Methods:**

| Method       | Signature                                                 | Description                      |
| ------------ | --------------------------------------------------------- | -------------------------------- |
| `show`       | `(options: SolarisToastOptions): SolarisToastRef`         | Show a toast with custom variant |
| `neutral`    | `(options: SolarisToastOptions): SolarisToastRef`         | Show a neutral toast             |
| `info`       | `(options: SolarisToastOptions): SolarisToastRef`         | Show an info toast               |
| `success`    | `(options: SolarisToastOptions): SolarisToastRef`         | Show a success toast             |
| `warning`    | `(options: SolarisToastOptions): SolarisToastRef`         | Show a warning toast             |
| `danger`     | `(options: SolarisToastOptions): SolarisToastRef`         | Show a danger toast              |
| `loading`    | `(options: SolarisToastOptions): SolarisToastRef`         | Show a loading toast             |
| `dismiss`    | `(id: string): void`                                      | Dismiss a toast by ID            |
| `dismissAll` | `(): void`                                                | Dismiss all visible toasts       |
| `update`     | `(id: string, patch: Partial<SolarisToastOptions>): void` | Update an existing toast         |

### SolarisToastOptions

| Property          | Type                                        | Default          | Description                       |
| ----------------- | ------------------------------------------- | ---------------- | --------------------------------- |
| id                | `string`                                    | Auto-generated   | Unique toast identifier           |
| variant           | `SolarisToastVariant`                       | `'neutral'`      | Semantic variant                  |
| appearance        | `SolarisToastAppearance`                    | Provider default | Visual appearance                 |
| title             | `string`                                    | `undefined`      | Toast title text                  |
| titleKey          | `string`                                    | `undefined`      | Toast title i18n key              |
| description       | `string`                                    | `undefined`      | Toast description text            |
| descriptionKey    | `string`                                    | `undefined`      | Toast description i18n key        |
| icon              | `string`                                    | Variant default  | Custom icon name                  |
| iconDecorative    | `boolean`                                   | `true`           | Icon is decorative (aria-hidden)  |
| closeable         | `boolean`                                   | `true`           | Show close button                 |
| closeLabel        | `string`                                    | `'Fechar'`       | Close button accessible label     |
| closeLabelKey     | `string`                                    | `undefined`      | Close button i18n key             |
| duration          | `number`                                    | Provider default | Auto-dismiss duration (ms)        |
| persistent        | `boolean`                                   | `false`          | Prevent auto-dismiss              |
| progress          | `number`                                    | `undefined`      | Process progress 0-100            |
| showProgress      | `boolean`                                   | `false`          | Show duration progress bar        |
| actions           | `SolarisToastAction[]`                      | `undefined`      | Action buttons                    |
| data              | `unknown`                                   | `undefined`      | Arbitrary data for consumer use   |
| ariaLive          | `'polite' \| 'assertive' \| 'off'`          | Auto             | Override aria-live                |
| role              | `'status' \| 'alert'`                       | Auto             | Override role                     |
| expandable        | `boolean`                                   | `false`          | Allow description expand/collapse |
| defaultExpanded   | `boolean`                                   | `false`          | Start expanded                    |
| maxCollapsedLines | `number`                                    | `2`              | Lines to show when collapsed      |
| expandLabel       | `string`                                    | `undefined`      | Expand button accessible label    |
| expandLabelKey    | `string`                                    | `undefined`      | Expand button i18n key            |
| collapseLabel     | `string`                                    | `undefined`      | Collapse button accessible label  |
| collapseLabelKey  | `string`                                    | `undefined`      | Collapse button i18n key          |
| showCountdown     | `boolean`                                   | `false`          | Show countdown progress           |
| showCountdownText | `boolean`                                   | `false`          | Show countdown text (seconds)     |
| countdownMode     | `'bar' \| 'text' \| 'both'`                 | `'bar'`          | Countdown display mode            |
| actionsAlign      | `'start' \| 'center' \| 'end' \| 'stretch'` | `'end'`          | Action buttons alignment          |
| iconSize          | `'sm' \| 'md' \| 'lg'`                      | `'md'`           | Icon container size               |
| mediaShape        | `'circle' \| 'rounded' \| 'square'`         | `'circle'`       | Media container shape             |

### SolarisToastRef

| Method    | Signature                                     | Description             |
| --------- | --------------------------------------------- | ----------------------- |
| `dismiss` | `(): void`                                    | Dismiss this toast      |
| `update`  | `(patch: Partial<SolarisToastOptions>): void` | Update this toast       |
| `id`      | `string` (property)                           | Toast unique identifier |

### SolarisToastAction

| Property     | Type                                                                     | Default     | Description                     |
| ------------ | ------------------------------------------------------------------------ | ----------- | ------------------------------- |
| label        | `string`                                                                 | Required    | Action button text              |
| labelKey     | `string`                                                                 | `undefined` | Action button i18n key          |
| appearance   | `'solid' \| 'outline' \| 'ghost' \| 'surface'`                           | `'ghost'`   | Button appearance               |
| color        | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Button color                    |
| closeOnClick | `boolean`                                                                | `undefined` | Dismiss toast after action      |
| disabled     | `boolean`                                                                | `false`     | Disable action button           |
| action       | `(toast: SolarisToastRef) => void`                                       | Required    | Callback when action is clicked |

---

## Variants

| Variant   | Usage                              | Default Icon |
| --------- | ---------------------------------- | ------------ |
| `neutral` | General information                | `info`       |
| `info`    | Contextual information             | `info`       |
| `success` | Positive confirmation              | `success`    |
| `warning` | Moderate risk or caution           | `warning`    |
| `danger`  | Error or destructive action        | `danger`     |
| `loading` | Process in progress                | `loader`     |
| `custom`  | Consumer-defined via CSS variables | `info`       |

---

## Appearances

| Appearance | Visual                              |
| ---------- | ----------------------------------- |
| `surface`  | Raised surface, no border           |
| `outline`  | Raised surface with semantic border |

> **Glass** is not available in Toast v1. Documented as future possibility.

---

## Positions

| Position        | Placement                  |
| --------------- | -------------------------- |
| `top-start`     | Top-left corner            |
| `top-center`    | Top-center                 |
| `top-end`       | Top-right corner (default) |
| `bottom-start`  | Bottom-left corner         |
| `bottom-center` | Bottom-center              |
| `bottom-end`    | Bottom-right corner        |

---

## Auto dismiss & Countdown

- Toast closes automatically when `duration > 0` and `persistent !== true`.
- `persistent: true` prevents auto-dismiss.
- `duration: 0` is treated as persistent.
- Hover pauses the dismiss timer when `pauseOnHover: true`.
- Focus within the toast pauses the timer when `pauseOnFocus: true`.
- On hover/focus exit, the timer continues with remaining time.
- The timer is not restarted from zero.

### Countdown display

The countdown can be displayed as a **progress bar**, **text**, or **both**:

```typescript
// Bar only (default)
this.toast.info({
  title: 'Closing soon',
  showCountdown: true,
  countdownMode: 'bar',
});

// Text only
this.toast.info({
  title: 'Closing soon',
  showCountdown: true,
  countdownMode: 'text',
});

// Both bar and text
this.toast.info({
  title: 'Closing soon',
  showCountdown: true,
  countdownMode: 'both',
});
```

- `showCountdown` (or `showProgress`) enables the countdown.
- `countdownMode` controls display: `'bar'` (default), `'text'`, or `'both'`.
- `showCountdownText` also enables text display.
- Countdown starts at 100% and reduces to 0%.
- Auto-dismiss occurs when countdown reaches 0.
- Hover/focus pauses the countdown.
- Resuming continues from the remaining time, not from the start.
- The countdown is not announced by screen readers every second to avoid noise.

### Process progress vs Countdown

|                | Process progress | Countdown                   |
| -------------- | ---------------- | --------------------------- |
| Control        | `progress: 45`   | `showCountdown: true`       |
| Visual         | Bar at 45%       | Bar reduces from 100% to 0% |
| Auto-dismiss   | No               | Yes                         |
| Pause on hover | No               | Yes                         |
| Use case       | Upload, progress | Auto-dismiss remaining time |

```typescript
// Process progress (manual)
this.toast.loading({
  title: 'Uploading...',
  progress: 45,
  persistent: true, // keep visible until done
});

// Countdown (auto-dismiss)
this.toast.success({
  title: 'Saved!',
  showCountdown: true,
});
```

---

## Persistent

- `persistent: true` keeps the toast visible until manually dismissed.
- Useful for loading states, progress, or critical feedback.
- Progress updates and actions still work on persistent toasts.

---

## Expandable content

Long descriptions can be collapsed and expanded:

```typescript
this.toast.info({
  title: 'Details',
  description: 'Long description text that can be truncated...',
  expandable: true,
  maxCollapsedLines: 3, // default: 2
  defaultExpanded: false, // start collapsed
});
```

```typescript
// Start expanded
this.toast.info({
  title: 'Details',
  description: 'Long description...',
  expandable: true,
  defaultExpanded: true,
});
```

- `expandable: true` enables truncation for long descriptions.
- A chevron button toggles between expanded/collapsed states.
- `aria-expanded` and `aria-label` are set on the toggle button.
- Expanding/collapsing does not affect the countdown timer.
- Focus on the expand button pauses the countdown when `pauseOnFocus: true`.

---

## Actions

Toast can have lightweight action buttons:

```typescript
this.toast.warning({
  title: 'Unsaved changes',
  actions: [
    {
      label: 'Undo',
      color: 'primary',
      action: () => this.undo(),
    },
  ],
});
```

### Actions alignment

Control alignment with `actionsAlign`:

| Value     | Behavior                              |
| --------- | ------------------------------------- |
| `start`   | Left-aligned                          |
| `center`  | Centered                              |
| `end`     | Right-aligned (default)               |
| `stretch` | Buttons fill available width (mobile) |

```typescript
this.toast.warning({
  title: 'Confirm',
  actionsAlign: 'stretch',
  actions: [
    { label: 'Cancel', appearance: 'outline', closeOnClick: true, action: () => {} },
    { label: 'Confirm', color: 'primary', closeOnClick: true, action: () => {} },
  ],
});
```

Rules:

- Actions are optional.
- Maximum recommended: 2 actions.
- Actions must not transform toast into a form.
- No complex arbitrary content.
- For forms, lists, or critical decisions, use Dialog or Popover.

---

## Progress

### Process progress

- Set `progress` to a number between 0 and 100.
- Useful for upload, processing, loading.
- Updates via `toast.update(id, { progress: 50 })`.

### Duration progress / Countdown

- Set `showProgress: true` or `showCountdown: true` without setting `progress`.
- Shows remaining time until auto-dismiss.
- Pauses together with hover/focus.

---

## Icon & Media

The icon is rendered inside a media container that can be sized and shaped:

| Option       | Type                                | Default    | Description           |
| ------------ | ----------------------------------- | ---------- | --------------------- |
| `iconSize`   | `'sm' \| 'md' \| 'lg'`              | `'md'`     | Media container size  |
| `mediaShape` | `'circle' \| 'rounded' \| 'square'` | `'circle'` | Media container shape |

Sizes:

- `sm`: 1.75rem container, small icon
- `md`: 2.25rem container (default), large icon
- `lg`: 2.75rem container, larger icon

```typescript
this.toast.success({
  title: 'Large icon',
  iconSize: 'lg',
});

this.toast.info({
  title: 'Square media',
  iconSize: 'md',
  mediaShape: 'square',
});
```

The media area is prepared for future avatar/image support without breaking changes.

---

## Accessibility

- Success/info/neutral use `aria-live="polite"` and `role="status"`.
- Warning/danger use `aria-live="assertive"` and `role="alert"`.
- Loading uses `polite` by default.
- Override via `ariaLive` and `role` options.
- Close button has accessible name.
- Expand/collapse button has `aria-expanded` and `aria-label`.
- Action buttons are accessible.
- Focus is not automatically moved to toast.
- No focus trap.
- Toast with actions is reachable by Tab.
- Auto-dismiss pauses on focus for keyboard users.
- Countdown progress has `aria-valuenow` with correct percentage.
- Countdown text is hidden from screen readers (`aria-hidden="true"`) to avoid continuous announcements.
- Progress bar for manual process progress uses `role="progressbar"` normally.

---

## i18n

Use Solaris Translate keys:

```typescript
this.toast.success({
  titleKey: 'solaris.toast.saved',
  descriptionKey: 'solaris.toast.changesSaved',
  closeLabelKey: 'solaris.toast.close',
});
```

---

## Custom variant

Use the `custom` variant with documented CSS variables:

```css
.custom-toast {
  --solaris-toast-custom-background: #f0f3ff;
  --solaris-toast-custom-border-color: #c9d2ff;
  --solaris-toast-custom-icon-color: #4657d9;
  --solaris-toast-custom-progress-color: #4657d9;
}
```

---

## Examples

### Basic toast

```typescript
this.toast.show({
  title: 'Notification',
  description: 'This is a toast notification.',
});
```

### Success toast

```typescript
this.toast.success({
  title: 'Registration created',
  description: 'The institution has been registered successfully.',
});
```

### Warning with action

```typescript
this.toast.warning({
  title: 'Unsaved changes',
  description: 'You can still undo this action.',
  actions: [
    {
      label: 'Undo',
      color: 'primary',
      action: () => this.undo(),
    },
  ],
});
```

### Loading with progress

```typescript
const ref = this.toast.loading({
  title: 'Upload in progress',
  description: 'You can cancel at any time.',
  progress: 32,
  persistent: true,
  actions: [
    {
      label: 'Cancel',
      color: 'danger',
      closeOnClick: true,
      action: () => this.cancelUpload(),
    },
  ],
});

ref.update({
  progress: 100,
  variant: 'success',
  title: 'Upload complete',
  description: 'The file was sent successfully.',
  persistent: false,
  duration: 4000,
});
```

---

## Component CSS variables

| Variable                                | Description                             |
| --------------------------------------- | --------------------------------------- |
| `--solaris-toast-background`            | Background color                        |
| `--solaris-toast-border-color`          | Border color                            |
| `--solaris-toast-color`                 | Text color                              |
| `--solaris-toast-description-color`     | Description text color                  |
| `--solaris-toast-icon-color`            | Icon color                              |
| `--solaris-toast-title-color`           | Title text color                        |
| `--solaris-toast-shadow`                | Box shadow                              |
| `--solaris-toast-radius`                | Border radius                           |
| `--solaris-toast-padding`               | Inner padding                           |
| `--solaris-toast-gap`                   | Gap between elements                    |
| `--solaris-toast-width`                 | Toast card width                        |
| `--solaris-toast-max-width`             | Toast card max width                    |
| `--solaris-toast-z-index`               | Z-index                                 |
| `--solaris-toast-progress-color`        | Progress bar color                      |
| `--solaris-toast-media-size`            | Media container size                    |
| `--solaris-toast-icon-size`             | Icon size inside media container        |
| `--solaris-toast-media-background`      | Media container background              |
| `--solaris-toast-max-lines`             | Max lines when description is truncated |
| `--solaris-toast-custom-background`     | Background for custom variant           |
| `--solaris-toast-custom-border-color`   | Border for custom variant               |
| `--solaris-toast-custom-icon-color`     | Icon color for custom variant           |
| `--solaris-toast-custom-progress-color` | Progress color for custom variant       |

---

## Limitations (v1)

- Glass appearance not implemented.
- No custom arbitrary template content.
- No form inside toast.
- No focus trap.
- No backdrop.
- No modal behavior.
- No drag to dismiss.
- No swipe to dismiss.
- No notification center.
- No advanced grouping/dedup.
- No promise toast automation.
- No complex queue.
- No avatar/image upload (prepared via media container for future).
- No complex upload card with nested file (simple progress only).
- No HTML or markdown in description.
- No expandable title (only description).
- No custom collapse icon.
