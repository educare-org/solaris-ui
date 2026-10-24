# Solaris Date Range Picker

## Purpose

Date Range Picker collects a start and end date through a read-only trigger and
a two-month `solaris-popover` calendar. Editable locale-aware inputs are
available in the panel footer.

## Value

The ControlValueAccessor value is `{ start, end }`, where both dates are ISO
date-only strings (`YYYY-MM-DD`) or `null`.

## Typing with automatic mask

The footer inputs apply the locale date mask while typing, so separators do
not need to be typed: writing `16102026` in `pt-BR` becomes `16/10/2026`
(`dd/MM/yyyy`). The order and the separator always follow `locale` (for
example `MM/dd/yyyy` in `en-US`).

## API

| Input                           | Description                                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locale`                        | BCP 47 locale override used for display and typing.                                                                                                             |
| `min` / `max`                   | Inclusive ISO date bounds.                                                                                                                                      |
| `disabledDates`                 | ISO dates unavailable for selection.                                                                                                                            |
| `disablePast`                   | Disables dates before today.                                                                                                                                    |
| `disableFuture`                 | Disables dates after today.                                                                                                                                     |
| `weekStartsOn`                  | `0`–`6` first weekday override (default: locale first day, Sunday fallback).                                                                                    |
| `dateFormat`                    | `'2-digit'` (default) / `'numeric'` day+month display padding.                                                                                                  |
| `startDisabled` / `endDisabled` | Disables only the start or the end side (input, typing and calendar selection). Apply accepts a start-only range when the end is disabled.                      |
| `startReadonly` / `endReadonly` | Read-only variant of the per-side lock (focusable, not editable). The chart shell leaves both sides editable.                                                   |
| `inline`                        | Renders only the panel (calendars, inputs, actions) without the field trigger or popover, for hosts that own the trigger; pairs with `valueChange`/`cancelled`. |
| `clearable`                     | Shows a trigger clear (`x`) button when a range is set; emits `cleared`.                                                                                        |
| `clearLabel`                    | Accessible label override for the trigger clear button (`clearLabelKey`).                                                                                       |
| `prefix` / `suffix`             | Icon names rendered in the Form Field affixes.                                                                                                                  |
| `presets`                       | Translated or direct-text predefined ranges, shown as shortcuts.                                                                                                |
| `appearance`                    | `'outline'` (default) / `'surface'` / `'filled'`.                                                                                                               |
| `size`                          | `'sm'` / `'md'` (default) / `'lg'`.                                                                                                                             |
| `density`                       | `'compact'` / `'normal'` / `'comfortable'` (default: inherited theme density).                                                                                  |
| `radius`                        | `'none'` / `'sm'` / `'md'` (default) / `'lg'` / `'xl'` (pill).                                                                                                  |
| `loading`                       | Shows the field skeleton while dates resolve.                                                                                                                   |

Type aliases: `SolarisDateRangePickerAppearance`,
`SolarisDateRangePickerDensity`, `SolarisDateRangePickerRadius`,
`SolarisDateRangePickerSize`.

## P0-gap closure: `size` input

The `size` input (default `'md'`) closes the P0 gap where the range picker
had no size control: it is repassed to the inner `solaris-form-field` like
`density`, and the host now exposes `data-size` and `data-density`
attributes, matching the single Date Picker.

## Suffix actions

Like the single picker, the built-in calendar trigger button is a suffix
action (both `solaris-form-suffix` and `solaris-form-suffix-action`
attributes). Extra suffix actions compose beside it and set
`hasSuffixAction` on Form Field:

```html
<solaris-date-range-picker label="Reporting period" [formControl]="period">
  <button type="button" solaris-icon-button solaris-form-suffix-action aria-label="Clear period" (click)="clearPeriod()">
    <solaris-icon name="x" [decorative]="true" />
  </button>
</solaris-date-range-picker>
```

## Interaction

The panel keeps a pending range. Presets appear in a vertical shortcut
navigation when provided. The footer Clear button resets the pending range;
the trigger clear button (`clearable`) clears the applied range immediately
and emits `cleared`. Cancel and Apply use `solaris-button`; only Apply
updates the form value. `Escape` inside the footer inputs resets a dirty
query to the pending range.

## Accessibility

- Form Field associates labels, hints, and errors with the range trigger.
- The panel fields have translated labels for start and end dates.
- The calendar suffix button has a translated accessible label.
- Roving `ArrowUp`/`ArrowDown`/`Home`/`End` inside the calendar grid is a
  follow-up (keyboard moves month-by-month via the navigation buttons in v1).

## Visual Variants

`appearance`, `density`, and `radius` follow the Form Field contract.

## CSS Variables

The component relies on Solaris Form Field, Popover, and calendar tokens.

## Examples

```html
<solaris-date-range-picker [formControl]="period" />
```

## Follow-up (docs only, no implementation)

Textarea `autoGrow`/`maxRows` remains a follow-up and is unrelated to Date
Range Picker: range cells are fixed calendar units, so growing text behavior
does not apply here.
