---
'@educarehq/solaris-ui': minor
---

Add phone-field initial-country lookup, imperative API and country announcement: `initialCountryLookup` input and `SOLARIS_PHONE_INITIAL_COUNTRY_LOOKUP` token resolve the initial country asynchronously (explicit `country` and prefilled E.164 values win; rejections and disallowed results fall back to `defaultCountry` and then to the first country; the resolver never runs on the server), public `isValid()` and `getCountryData()` snapshot methods expose read-only state, and a visually hidden `aria-live="polite"` region announces the selected country (`solaris.phone-field.countryAnnounced`) on DDI typing, panel selection and `writeValue`.
