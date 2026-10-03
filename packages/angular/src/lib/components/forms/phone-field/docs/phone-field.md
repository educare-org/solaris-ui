# Solaris Phone Field

## Purpose

`SolarisPhoneFieldComponent` (`solaris-phone-field`) is a preset form control for phone
numbers. It wraps the low-level `solaris-form-field` (like `email-field` and
`password-field`) and adds:

- a **country selector** in the prefix position (flag + calling code) that opens a
  searchable popover to pick the country;
- **as-you-type formatting** using `libphonenumber-js`;
- a **single E.164 value** (`+5511999998888`) as the model value.

## Why preset, not primitive

The field is built on top of the `SolarisFormFieldComponent` and `SolarisInputDirective`
primitives, following the same preset pattern as `email-field` and `password-field`. This
keeps the styling, density, radius, appearances, label/hint/error orchestration and
accessibility consistent across all Solaris form fields.

## Dependencies

- `libphonenumber-js` — parsing, validation, `AsYouType` formatting and country data.
- `country-flag-icons` — SVG flags rendered in the country selector.

Country names are localized with the native `Intl.DisplayNames` API (no translation table).

## Component

```html
<solaris-phone-field label="Phone" defaultCountry="BR" placeholder="(00) 00000-0000"></solaris-phone-field>
```

## When to use

- Collecting phone numbers with international dialing codes.
- When the number should be validated and normalized to a canonical format.

## When not to use

- For plain short inputs that are not phone numbers.
- When the consumer manages the country and number separately and does not want a single
  E.164 value.

## API

### Inputs

| Input                                          | Type                          | Default     | Description                                   |
| ---------------------------------------------- | ----------------------------- | ----------- | --------------------------------------------- | ------------------------ |
| `value`                                        | `string`                      | `''`        | One-way E.164 value.                          |
| `label` / `labelKey`                           | `string` / `string`           | `''`        | Field label.                                  |
| `hint` / `hintKey`                             | `string` / `string`           | `''`        | Helper text.                                  |
| `error` / `errorKey`                           | `string` / `string`           | `''`        | Manual error message.                         |
| `placeholder` / `placeholderKey`               | `string` / `string`           | —           | Placeholder. Defaults to the country example. |
| `invalidError` / `invalidErrorKey`             | `string` / `string`           | —           | Invalid number error override.                |
| `requiredError` / `requiredErrorKey`           | `string` / `string`           | —           | Required error override.                      |
| `required`                                     | `boolean`                     | `false`     | Marks required and validates emptiness.       |
| `optional`                                     | `boolean`                     | `false`     | Shows the optional marker.                    |
| `disabled`                                     | `boolean`                     | `false`     | Disables the field.                           |
| `readonly`                                     | `boolean`                     | `false`     | Read-only field.                              |
| `invalid`                                      | `boolean                      | undefined`  | —                                             | Manual invalid override. |
| `appearance`                                   | `SolarisPhoneFieldAppearance` | `'outline'` | `outline` / `surface` / `filled`.             |
| `density`                                      | `SolarisPhoneFieldDensity`    | —           | `compact` / `normal` / `comfortable`.         |
| `radius`                                       | `SolarisPhoneFieldRadius`     | `'sm'`      | `none` / `sm` / `md` / `lg`.                  |
| `id`                                           | `string`                      | —           | Native input id.                              |
| `name`                                         | `string`                      | —           | Native input name.                            |
| `autocomplete`                                 | `string`                      | `'tel'`     | Native autocomplete hint.                     |
| `maxLength`                                    | `number`                      | —           | Native max length.                            |
| `suffix`                                       | `SolarisIconName`             | —           | Suffix icon.                                  |
| `defaultCountry`                               | `SolarisCountryCode`          | —           | Initial country (ISO-3166-1 alpha-2).         |
| `country`                                      | `SolarisCountryCode`          | —           | Controlled country.                           |
| `searchable`                                   | `boolean`                     | `true`      | Show the country search box.                  |
| `allowAnyCountry`                              | `boolean`                     | `true`      | Whether the country can be changed.           |
| `countryList`                                  | `SolarisCountryCode[]`        | —           | Restrict selectable countries.                |
| `searchPlaceholder` / `searchPlaceholderKey`   | `string` / `string`           | —           | Country search placeholder.                   |
| `emptyText` / `emptyTextKey`                   | `string` / `string`           | —           | Empty list message.                           |
| `noResultsText` / `noResultsTextKey`           | `string` / `string`           | —           | No-results message.                           |
| `countryButtonLabel` / `countryButtonLabelKey` | `string` / `string`           | —           | Country button accessible label.              |
| `panelMaxWidth`                                | `string \| number`            | —           | Popover max width.                            |
| `panelMaxHeight`                               | `string \| number`            | —           | Country list max height.                      |

### Outputs

| Output          | Type                 | Description                     |
| --------------- | -------------------- | ------------------------------- |
| `valueChange`   | `string`             | Emits the E.164 value on input. |
| `countryChange` | `SolarisCountryCode` | Emits the selected country.     |

## CVA (ControlValueAccessor)

The component implements `ControlValueAccessor`, so it works with both reactive and
template-driven forms. The model value is a single **E.164** string.

```ts
// reactive forms
phone = new FormControl<string>('+5511999998888');
```

```html
<solaris-phone-field formControlName="phone" defaultCountry="BR"></solaris-phone-field>
```

## Mask / as-you-type formatting

A fixed dial-code prefix (`+55`) is rendered to the left of the placeholder and follows
the selected country. The number is formatted as the user types using `libphonenumber-js`'s
`AsYouType` in national style (`(11) 99999-8888`). When an international number with a `+`
is pasted (e.g. `+1 201-555-0123`), the country is auto-detected and the dial-code prefix
updates accordingly. The model value is only set to the canonical E.164 when the number is
valid (`isValid()`). While the number is incomplete or invalid the value is `''`.

## Country selector

The prefix is a button showing the selected country's flag and a chevron. Clicking it opens
a standard `solaris-popover` with a small offset below the field, containing a searchable
`role="listbox"` of countries. Selection updates the dial-code prefix and emits
`countryChange`. The popover matches the field appearance: `outline` and `filled` render
with a border, `surface` without.

The country list is derived from `libphonenumber-js` (`getCountries()` +
`getCountryCallingCode`) with localized names from `Intl.DisplayNames` and SVG flags from
`country-flag-icons`. To customize it, override the `SOLARIS_PHONE_COUNTRY_LIST`
injection token.

## Max length

The national number is limited to the maximum length allowed for the selected country (e.g.
11 digits for Brazil, 10 for the US) using `libphonenumber-js` metadata. Typing or pasting
beyond that limit is truncated. A manual `maxLength` input overrides the country-based
limit.

## Visual variants

Like the other Solaris form fields, `solaris-phone-field` supports `appearance`
(`outline` | `surface` | `filled`), `density` (`compact` | `normal` | `comfortable`) and
`radius` (`none` | `sm` | `md` | `lg`). These are delegated to the underlying
`solaris-form-field`.

## Error behavior

Errors follow the `control.invalid && (touched || dirty) && !focused` convention. The
error priority is:

1. Manual `error` / `errorKey`.
2. `required` + empty → required error.
3. Non-empty but invalid/incomplete → invalid error.

Default messages use `solaris.phone-field.*` translation keys with English fallbacks.

## CSS Variables

`SolarisPhoneFieldComponent` defines the following tokens. The prefix sizes (flag, chevron,
font, padding) scale with the field density.

| Token                                          | Default                       | Description                             |
| ---------------------------------------------- | ----------------------------- | --------------------------------------- |
| `--solaris-phone-field-country-gap`            | `var(--solaris-spacing-1)`    | Gap inside the country button.          |
| `--solaris-phone-field-country-padding-inline` | `var(--solaris-spacing-2)`    | Country button horizontal padding.      |
| `--solaris-phone-field-country-font-size`      | `var(--solaris-font-size-sm)` | Country button and dial-code font size. |
| `--solaris-phone-field-dial-code-color`        | `var(--solaris-text-muted)`   | Dial-code prefix color.                 |
| `--solaris-phone-field-flag-size`              | `var(--solaris-font-size-sm)` | Flag size.                              |
| `--solaris-phone-field-chevron-size`           | `var(--solaris-font-size-xs)` | Country button chevron size.            |

## Accessibility

- The main input is `type="tel"` with `inputmode="tel"`.
- The country button exposes `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls`
  (managed by the popover trigger).
- The country list is a `role="listbox"` with `aria-selected` and
  `aria-activedescendant` pointing at the active option. Options are keyboard navigable
  (`ArrowUp`/`ArrowDown`, `Home`, `End`, `Enter`).
- The search input has `role="searchbox"` and is auto-focused when the popover opens. Arrow
  keys move the active option, `Enter` selects, `Escape` clears the query or closes, and
  `Tab` closes the popover.
- Focus is restored to the country button when the popover closes.

## Reusable validator

```ts
import { solarisPhoneValidator } from '@educarehq/solaris-ui';

phone = new FormControl<string>('', solarisPhoneValidator('BR'));
```

The validator returns `{ solarisPhoneInvalid: true }` for invalid numbers and `null`
otherwise (empty values pass).

## Limitations (v1)

- The model value is E.164; partial numbers are reported as `''`.
- Country names come from `Intl.DisplayNames`, which requires modern runtimes (Node ≥ 18).
- The country list is built eagerly; large custom lists may need lazy loading in a future
  version.

## Examples

```html
<solaris-phone-field label="Phone" defaultCountry="BR"></solaris-phone-field>

<solaris-phone-field label="International" [countryList]="['US', 'GB', 'BR', 'PT']" searchable="true"></solaris-phone-field>

<solaris-phone-field label="Phone" [formControl]="phoneControl" required="true" invalidError="This number looks wrong."></solaris-phone-field>
```
