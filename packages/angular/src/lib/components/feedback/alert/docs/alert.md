# Alert

## Purpose

Alert is a **contextual inline message component** for communicating state, warning, promotional content, instruction, or feedback to the user.

## Definition

Alert is a **highly relevant contextual message**. It alters the user's perception of the current screen state. Unlike Toast, Alert lives inline in the document flow and does not overlay content.

## Card vs Alert

| Aspect      | Card              | Alert                                   |
| ----------- | ----------------- | --------------------------------------- |
| Role        | Structure         | Communication                           |
| Function    | Organizes layout  | Communicates state, risk, feedback      |
| Interaction | Non-interactive   | Non-interactive (except optional close) |
| Intent      | Neutral container | Status-aware message                    |

> **Card** structures content.  
> **Alert** communicates state, warning, or relevant context.

## When to use

- System feedback (success, error, warning)
- Contextual information (maintenance, pending, confirmation)
- Promotional banners (sign-up offers, contextual promotions)
- Security warnings
- Instructions requiring user attention

## When not to use

- As a Toast notification (use a dedicated toast component)
- As an overlay or modal
- For persistent structural layout (use Card)
- For auto-dismissing messages (v1 does not support auto-dismiss)
- With ghost or glass appearances (not available in v1)

---

## API

### SolarisAlertComponent

**Selector:** `solaris-alert`

**Inputs:**

| Input         | Type                                                                    | Default     | Description                   |
| ------------- | ----------------------------------------------------------------------- | ----------- | ----------------------------- |
| variant       | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'custom'` | `'info'`    | Semantic variant              |
| appearance    | `'tonal' \| 'outline' \| 'surface' \| 'solid'`                          | `'tonal'`   | Visual appearance             |
| radius        | `'sm' \| 'md' \| 'lg' \| 'xl'`                                          | `'md'`      | Border radius                 |
| density       | `'compact' \| 'normal' \| 'comfortable' \| undefined`                   | `undefined` | Spacing density               |
| closable      | `boolean`                                                               | `false`     | Shows close button            |
| live          | `'off' \| 'polite' \| 'assertive'`                                      | `'off'`     | Live region setting           |
| showIcon      | `boolean`                                                               | `true`      | Shows variant icon            |
| icon          | `string \| undefined`                                                   | `undefined` | Custom icon name              |
| closeLabel    | `string \| undefined`                                                   | `undefined` | Close button accessible label |
| closeLabelKey | `string \| undefined`                                                   | `undefined` | Close button i18n key         |

**Outputs:**

| Output    | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| dismissed | `void` | Emitted when close button is clicked |

### SolarisAlertActionsComponent

**Selector:** `solaris-alert-actions`

Content projection wrapper for action links or buttons.

### SolarisAlertTitleDirective

**Selector:** `[solaris-alert-title]`

Applies Alert title typography. Preserves the host element.

### SolarisAlertDescriptionDirective

**Selector:** `[solaris-alert-description]`

Applies Alert description typography. Preserves the host element.

---

## Variants

| Variant   | Usage                                                          | Default Icon |
| --------- | -------------------------------------------------------------- | ------------ |
| `neutral` | Institutional message, contextual promotion, non-critical info | `info`       |
| `info`    | Contextual information, news, guidance                         | `info`       |
| `success` | Positive confirmation, completed operation                     | `success`    |
| `warning` | Moderate risk, caution required                                | `warning`    |
| `danger`  | Error, failure, high risk, destructive action                  | `danger`     |
| `custom`  | Consumer-defined via CSS variables                             | `info`       |

---

## Appearances

| Appearance        | Visual                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `tonal` (default) | Soft variant background, semantic text, subtle border, colored icon |
| `outline`         | Transparent background, variant border, semantic text/icon          |
| `surface`         | Surface background, subtle accent border, semantic icon             |
| `solid`           | Filled background, on-solid text, high prominence                   |

> **Ghost** and **glass** are not available in Alert v1.

---

## Density

| Value         | Effect                      |
| ------------- | --------------------------- |
| `compact`     | Reduced padding and gap     |
| `comfortable` | Increased padding and gap   |
| `undefined`   | Inherits from theme density |

---

## Radius

| Value          | Token                           |
| -------------- | ------------------------------- |
| `sm`           | `--solaris-radius-sm` (0.25rem) |
| `md` (default) | `--solaris-radius-md` (0.5rem)  |
| `lg`           | `--solaris-radius-lg` (0.75rem) |
| `xl`           | `--solaris-radius-xl` (1rem)    |

> `full` radius is not supported in Alert v1.

---

## Closable

- `closable=false` (default): Close button is not rendered.
- `closable=true`: Renders a native `<button type="button">` with a `solaris-icon name="x"`.
- Close button has an accessible name via `aria-label`.
- Clicking close **emits** `dismissed` but does **not** remove the Alert from the DOM.
- The consumer is responsible for removing the Alert on `dismissed`.

---

## Dismissed

The `dismissed` output allows the consumer to react to the close action:

```html
<solaris-alert closable (dismissed)="handleDismiss()"> Message </solaris-alert>
```

```typescript
protected handleDismiss(): void {
  this.showAlert = false;
}
```

---

## Live region

| Input value     | Role     | aria-live   |
| --------------- | -------- | ----------- |
| `off` (default) | None     | None        |
| `polite`        | `status` | `polite`    |
| `assertive`     | `alert`  | `assertive` |

> Urgency is a consumer decision. Visual variant does not force assertive announcement.

---

## Icons

- Icons are rendered via `SolarisIconRegistry`.
- Default icon depends on `variant`.
- Set `showIcon=false` to hide the icon.
- Set `icon` to override the default icon name.
- The icon is decorative (`aria-hidden="true"`) when alert has text content.
- Unregistered icon names are handled safely (nothing is rendered).

---

## Title, Description, Actions

These are **optional** anatomy helpers for consistent styling:

```html
<solaris-alert variant="warning">
  <h3 solaris-alert-title>Attention</h3>
  <p solaris-alert-description>This action affects active users.</p>
  <solaris-alert-actions>
    <a href="#">Review changes</a>
  </solaris-alert-actions>
</solaris-alert>
```

- `title` and `description` are directives — they preserve the host element and heading level.
- `actions` is a component that wraps projected action content.

---

## Free content

Alert accepts free content directly without directives:

```html
<solaris-alert variant="success"> Changes saved successfully. </solaris-alert>
```

Links projected directly inside Alert are fully accessible:

```html
<solaris-alert variant="neutral" appearance="solid">
  Sign up before July 31.
  <a href="/terms">View terms.</a>
</solaris-alert>
```

---

## Custom variant

Use the `custom` variant with documented CSS variables:

```css
.custom-alert {
  --solaris-alert-custom-color: #17191e;
  --solaris-alert-custom-background: #f0f3ff;
  --solaris-alert-custom-border-color: #c9d2ff;
  --solaris-alert-custom-icon-color: #4657d9;
}
```

```html
<solaris-alert variant="custom" class="custom-alert"> Custom styled alert. </solaris-alert>
```

> Do **not** use inline `color` or `background` inputs. Customization is via CSS variables only.

---

## Accessibility

- Alert container is **non-interactive** (no tabindex, no role button).
- Close button is a native `<button type="button">` with accessible name.
- Close button is keyboard-reachable when present.
- Title directive does not alter heading level.
- Description directive does not alter semantics.
- Projected links preserve their native semantics.
- Icon is decorative (`aria-hidden="true"`) when text is present.
- Live region respects the `live` input — no automatic announcements by default.
- Do not rely solely on color to communicate meaning (icon + text support).

---

## Examples

```html
<!-- Variants -->
<solaris-alert variant="info">Changes are saved automatically.</solaris-alert>
<solaris-alert variant="success">Changes saved successfully.</solaris-alert>
<solaris-alert variant="warning">This action affects active users.</solaris-alert>
<solaris-alert variant="danger">Something went wrong.</solaris-alert>

<!-- Appearances -->
<solaris-alert appearance="tonal">Tonal alert</solaris-alert>
<solaris-alert appearance="outline">Outline alert</solaris-alert>
<solaris-alert appearance="surface">Surface alert</solaris-alert>
<solaris-alert appearance="solid">Solid alert</solaris-alert>

<!-- Density -->
<solaris-alert density="compact">Compact alert</solaris-alert>
<solaris-alert density="comfortable">Comfortable alert</solaris-alert>

<!-- Radius -->
<solaris-alert radius="sm">Small radius</solaris-alert>
<solaris-alert radius="lg">Large radius</solaris-alert>

<!-- Icon customization -->
<solaris-alert [showIcon]="false">No icon</solaris-alert>
<solaris-alert icon="check" variant="success">Custom icon</solaris-alert>

<!-- Live region -->
<solaris-alert live="assertive">Important update.</solaris-alert>
```

---

## Limitations (v1)

- Not a Toast notification.
- Not an overlay or modal.
- No auto-dismiss or timer.
- No global service or stack manager.
- No ghost or glass appearances.
- `full` radius not supported.
- No built-in Button or Icon Button.
- Custom variant requires CSS variables, not input props.

---

## CSS Variables

The following CSS variables can be customized:

| Token                                    | Purpose                                     |
| ---------------------------------------- | ------------------------------------------- |
| `--solaris-alert-background`             | Container background color                  |
| `--solaris-alert-color`                  | Text color                                  |
| `--solaris-alert-border-color`           | Border color                                |
| `--solaris-alert-border-width`           | Border width                                |
| `--solaris-alert-radius`                 | Border radius                               |
| `--solaris-alert-padding`                | Container padding                           |
| `--solaris-alert-gap`                    | Gap between icon, content, and close button |
| `--solaris-alert-icon-size`              | Icon width/height                           |
| `--solaris-alert-icon-color`             | Icon color                                  |
| `--solaris-alert-icon-offset`            | Vertical offset applied to the icon         |
| `--solaris-alert-close-size`             | Close button width/height                   |
| `--solaris-alert-close-icon-size`        | Close icon width/height                     |
| `--solaris-alert-close-color`            | Close button color                          |
| `--solaris-alert-close-background`       | Close button background                     |
| `--solaris-alert-close-hover-background` | Close button hover background               |
| `--solaris-alert-close-offset`           | Vertical offset applied to the close button |
| `--solaris-alert-title-color`            | Title text color                            |
| `--solaris-alert-description-color`      | Description text color                      |
| `--solaris-alert-content-gap`            | Gap between title, description, and actions |
| `--solaris-alert-actions-gap`            | Gap between action items                    |
| `--solaris-alert-first-line-height`      | Line height of the first content line       |
| `--solaris-alert-first-line-font-size`   | Font size of the first content line         |

### Custom variant tokens

| Token                                 | Purpose                         |
| ------------------------------------- | ------------------------------- |
| `--solaris-alert-custom-color`        | Text color for custom variant   |
| `--solaris-alert-custom-background`   | Background for custom variant   |
| `--solaris-alert-custom-border-color` | Border color for custom variant |
| `--solaris-alert-custom-icon-color`   | Icon color for custom variant   |
