# SolarisCollapsibleInputComponent

## Purpose

Collapsible-input is the interactive sibling of `solaris-collapsible` for
FAQ-style accordions: the last row of an accordion is a question field instead
of a static section. The user types a question, submits it, and the consumer
resolves it (typically with an AI reader over the product documentation) while
the component shows a loading status. When the answer arrives, the consumer
projects it into the expansion, which opens like a regular accordion panel
with the submitted question as its fixed label.

The library only provides the interaction shell. It never fetches, streams, or
stores answers — the consumer plugs any backend into `(submitted)` and feeds
`[loading]` plus the projected answer content.

## API

### Inputs

| Input             | Type                                                  | Default                                     | Description                                                                               |
| ----------------- | ----------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `value`           | `string \| number`                                    | —                                           | Unique identifier used by the accordion (required inside an accordion).                   |
| `query`           | `string` (model)                                      | `''`                                        | Two-way binding with the question text being typed.                                       |
| `placeholder`     | `string`                                              | i18n `solaris.collapsibleInput.placeholder` | Idle hint (`Ask anything else`).                                                          |
| `placeholderKey`  | `string`                                              | —                                           | i18n key resolved for the hint.                                                           |
| `leadingIcon`     | `string`                                              | `'file-text'`                               | Icon at the start of the row (overridable).                                               |
| `submitLabel`     | `string`                                              | i18n `solaris.collapsibleInput.submit`      | Accessible label of the submit action.                                                    |
| `submitLabelKey`  | `string`                                              | —                                           | i18n key resolved for the submit label.                                                   |
| `submitIcon`      | `string`                                              | `'right-arrow'`                             | Icon of the submit action.                                                                |
| `stopLabel`       | `string`                                              | i18n `solaris.collapsibleInput.stop`        | Accessible label of the stop action shown while loading.                                  |
| `stopLabelKey`    | `string`                                              | —                                           | i18n key resolved for the stop label.                                                     |
| `stopIcon`        | `string`                                              | `'x'`                                       | Icon of the stop action.                                                                  |
| `loadingLabel`    | `string`                                              | i18n `solaris.collapsibleInput.loading`     | Status text shown while loading (`Reading the docs`), announced via `aria-live="polite"`. |
| `loadingLabelKey` | `string`                                              | —                                           | i18n key resolved for the loading status.                                                 |
| `loading`         | `boolean`                                             | `false`                                     | Received from the consumer: `true` while the backend resolves the question.               |
| `disabled`        | `boolean`                                             | `false`                                     | Disables the field and the action.                                                        |
| `size`            | `'sm' \| 'md' \| 'lg'`                                | `'md'`                                      | Ignored inside an accordion — the container `size` wins (standalone only).                |
| `density`         | `'compact' \| 'normal' \| 'comfortable' \| undefined` | `undefined`                                 | Ignored inside an accordion — the container `density` wins (standalone only).             |
| `appearance`      | `'boxed' \| 'lined' \| 'plain'`                       | `'boxed'`                                   | Ignored inside an accordion — the container `appearance` wins (standalone only).          |

### Outputs

| Output      | Type     | Description                                                            |
| ----------- | -------- | ---------------------------------------------------------------------- |
| `submitted` | `string` | Emitted with the trimmed question on submit (`Enter` or action click). |
| `cancelled` | `void`   | Emitted when the stop action (or `Escape` while loading) is activated. |

## Behavior

1. **Idle**: row renders at the same height as the sections, with the leading
   icon, the question field (placeholder), and the submit action (`right-arrow`).
2. **Submit**: the trimmed question is frozen as the row label, `(submitted)`
   fires, the query model keeps the submitted text, and the section opens itself
   in the accordion so the status/answer is visible.
3. **Loading**: the action becomes stop (`x`), the status line
   (`solaris-spinner` + loading text) appears with `aria-live="polite"`, and the
   panel reports `aria-busy="true"`.
4. **Answered**: the consumer projects the answer into `<ng-content/>`; it
   renders in the open panel labelled by the frozen question.
5. **History**: to keep a visible history, convert each answered pair into a
   regular `solaris-collapsible` and clear `query` for the next question.

## Import rule

Like the collapsible primitive, import `SOLARIS_ACCORDION` directly from the
token module (`../../accordion/model/accordion.tokens`), never from the
accordion barrel, to avoid a circular module dependency.

## Accessibility

- The row is a `form` with a native text `input` and a `type="button"` action;
  `Enter` submits, `Escape` cancels while loading.
- The input carries `aria-expanded`/`aria-controls` for the panel and
  `aria-busy` while loading; the projected answer region has `role="region"`
  with `aria-labelledby` referencing the input.
- When collapsed, the panel is `aria-hidden` and `inert`.
- The submit action (not a chevron) never rotates with `data-open`.

## Visual variants

- **Appearance**: `boxed` (bordered card), `lined` (divider under the row) or
  `plain` (no borders) — inherited from the accordion container when projected.
- **Size × density**: same 3×3 matrix as the collapsible primitive
  (`sm`/`md`/`lg` × `compact`/`normal`/`comfortable`); the trigger `min-height`
  follows the `--solaris-control-height-<density>-<size>` ladder so the row
  aligns with sibling controls. Inside an accordion the container wins.
- **States**: `data-loading` (status line visible, stop action),
  `data-disabled` (field and action disabled), `data-open` (panel expanded).

## CSS Variables

| Variable                                           | Default                                             | Description                                                                          |
| -------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `--solaris-collapsible-input-min-height`           | `--solaris-control-height-normal-md`                | Row min-height (ladder token of the active combination).                             |
| `--solaris-collapsible-input-padding-y`            | spacing tokens                                      | Vertical padding of the row.                                                         |
| `--solaris-collapsible-input-padding-x`            | `--solaris-density-padding-md`                      | Horizontal padding of the row (and answer indent).                                   |
| `--solaris-collapsible-input-gap`                  | `--solaris-density-gap-md`                          | Gap between icon, field, and action.                                                 |
| `--solaris-collapsible-input-font-size`            | `--solaris-font-size-md`                            | Question field font size (driven by `size`).                                         |
| `--solaris-collapsible-input-color`                | `--solaris-neutral-text-secondary`                  | Row text color.                                                                      |
| `--solaris-collapsible-input-icon-size`            | `--solaris-font-size-lg`                            | Leading and action icon size (driven by `size`).                                     |
| `--solaris-collapsible-input-panel-font-size`      | `--solaris-font-size-sm`                            | Answer body font size (driven by `size`).                                            |
| `--solaris-collapsible-input-panel-padding-x`      | row horizontal padding                              | Answer horizontal indent (follows the row).                                          |
| `--solaris-collapsible-input-panel-padding-bottom` | `0` collapsed / `--solaris-density-padding-md` open | Answer bottom padding. Zero while collapsed so no content leaks from the zero track. |
| `--solaris-collapsible-input-radius`               | `--solaris-radius-md`                               | Border radius of the container.                                                      |
| `--solaris-collapsible-input-border-color`         | `--solaris-neutral-border-subtle`                   | Container border color.                                                              |

## Examples

### Basic FAQ row

```html
<solaris-accordion [(value)]="openValue">
  <solaris-collapsible value="a" label="What is Solaris?">
    <p>A design system for Educare.</p>
  </solaris-collapsible>
  <solaris-collapsible-input value="ask" [(query)]="faqQuery" [loading]="isAsking" (submitted)="askAi($event)" (cancelled)="cancelAi()">
    @if (aiAnswer) {
    <div>{{ aiAnswer }}</div>
    }
  </solaris-collapsible-input>
</solaris-accordion>
```

```ts
askAi(question: string): void {
  this.isAsking = true;
  this.aiService.ask(question).subscribe((answer) => {
    this.aiAnswer = answer;
    this.isAsking = false;
  });
}
```
