# Solaris Date Picker

## Purpose

Date Picker collects one calendar date using a locale-aware text field and a
`solaris-popover` calendar.

## Value

The ControlValueAccessor value is a date-only ISO string (`YYYY-MM-DD`). The
visible format follows `locale`, then the configured Solaris locale.

## API

| Input                    | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `locale`                 | BCP 47 locale override used for display and typing. |
| `min` / `max`            | Inclusive ISO date bounds.                          |
| `disabledDates`          | ISO dates unavailable for selection.                |
| `label`, `hint`, `error` | Form Field text, with matching `*Key` inputs.       |

## Accessibility

- The suffix calendar button has a translated accessible label.
- `Alt` + `ArrowDown` opens the calendar; Escape is handled by Popover.
- Form Field associates labels, hints, and errors with the editable input.

## Visual Variants

`appearance`, `density`, and `radius` follow the Form Field contract.

## CSS Variables

The component relies on Solaris Form Field, Popover, and calendar tokens.

## Examples

```html
<solaris-date-picker label="Invoice date" locale="pt-BR" />
```
