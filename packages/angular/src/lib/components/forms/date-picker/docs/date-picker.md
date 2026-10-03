# Solaris Date Picker

## Purpose

Date Picker collects one calendar date using a locale-aware text field and a
`solaris-popover` calendar.

## Value

The ControlValueAccessor value is a date-only ISO string (`YYYY-MM-DD`). The
visible format follows `locale`, then the configured Solaris locale.

## API

| Input                    | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `locale`                 | BCP 47 locale override used for display and typing.                                         |
| `min` / `max`            | Inclusive ISO date bounds.                                                                  |
| `disabledDates`          | ISO dates unavailable for selection.                                                        |
| `label`, `hint`, `error` | Form Field text, with matching `*Key` inputs.                                               |
| `appearance`             | `'outline'` (default) / `'surface'` / `'filled'`.                                           |
| `size`                   | `'sm'` / `'md'` (default) / `'lg'`.                                                         |
| `density`                | `'compact'` / `'normal'` / `'comfortable'` (default: inherited theme density).              |
| `radius`                 | `'none'` / `'sm'` (default) / `'md'` / `'lg'`.                                              |
| `loading`                | Shows the field skeleton while dates resolve.                                               |
| `calendarButtonLabel`    | Accessible label override for the calendar trigger, with matching `calendarButtonLabelKey`. |

Type aliases: `SolarisDatePickerAppearance`, `SolarisDatePickerSize`,
`SolarisDatePickerDensity`, `SolarisDatePickerRadius`.

## Size and density repasse

`size` and `density` are repassed together to the inner `solaris-form-field`
and `solaris-input`, so label, field shell, and calendar trigger stay in
sync. When omitted, density is inherited from the theme. The host exposes
`data-size` and `data-density`.

## Loading

```html
<solaris-date-picker label="Invoice date" [loading]="true" />
```

`loading` forwards to Form Field, which renders the skeleton shell and
blocks interaction until dates resolve.

## Suffix actions

The built-in calendar trigger button is itself a suffix action (it carries
both `solaris-form-suffix` and `solaris-form-suffix-action` attributes).
Extra suffix actions compose beside it and are detected via
`projectedSuffixAction` (`hasSuffixAction` on Form Field):

```html
<solaris-date-picker label="Invoice date" [formControl]="dateControl">
  <button type="button" solaris-icon-button solaris-form-suffix-action aria-label="Clear date" (click)="clearDate()">
    <solaris-icon name="x" [decorative]="true" />
  </button>
</solaris-date-picker>
```

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
