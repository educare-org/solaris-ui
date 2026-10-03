# Solaris Date Range Picker

## Purpose

Date Range Picker collects a start and end date through a read-only trigger and
a two-month `solaris-popover` calendar. Editable locale-aware inputs are
available in the panel footer.

## Value

The ControlValueAccessor value is `{ start, end }`, where both dates are ISO
date-only strings (`YYYY-MM-DD`) or `null`.

## API

| Input           | Description                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| `locale`        | BCP 47 locale override used for display and typing.                            |
| `min` / `max`   | Inclusive ISO date bounds.                                                     |
| `disabledDates` | ISO dates unavailable for selection.                                           |
| `presets`       | Translated or direct-text predefined ranges, shown as shortcuts.               |
| `appearance`    | `'outline'` (default) / `'surface'` / `'filled'`.                              |
| `size`          | `'sm'` / `'md'` (default) / `'lg'`.                                            |
| `density`       | `'compact'` / `'normal'` / `'comfortable'` (default: inherited theme density). |
| `radius`        | `'none'` / `'sm'` (default) / `'md'` / `'lg'`.                                 |
| `loading`       | Shows the field skeleton while dates resolve.                                  |

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
navigation when provided. Clear, Cancel, and Apply use `solaris-button`; only
Apply updates the form value.

## Accessibility

- Form Field associates labels, hints, and errors with the range trigger.
- The panel fields have translated labels for start and end dates.
- The calendar suffix button has a translated accessible label.

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
