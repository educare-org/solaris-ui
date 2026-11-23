---
'@educarehq/solaris-ui': minor
---

Add phone-field country filtering and granular validation: `excludeCountries` removes countries from the picker (deny wins over `countryList`, effective country falls back to an allowed one), `preferredCountries` pins countries to the top of the list in order above a divider, and incomplete numbers report `tooShort`/`tooLong` errors (new `tooShortError`/`tooLongError` inputs and `solaris.phone-field.tooShort`/`tooLong` keys) instead of a single invalid message.
