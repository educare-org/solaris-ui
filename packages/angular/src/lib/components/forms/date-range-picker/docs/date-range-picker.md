# Solaris Date Range Picker

## Purpose

Date Range Picker collects a start and end date through a read-only trigger and
a two-month `solaris-popover` calendar. Editable locale-aware inputs are
available in the panel footer.

## Value

The ControlValueAccessor value is `{ start, end }`, where both dates are ISO
date-only strings (`YYYY-MM-DD`) or `null`.

## API

| Input           | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `locale`        | BCP 47 locale override used for display and typing.              |
| `min` / `max`   | Inclusive ISO date bounds.                                       |
| `disabledDates` | ISO dates unavailable for selection.                             |
| `presets`       | Translated or direct-text predefined ranges, shown as shortcuts. |

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
