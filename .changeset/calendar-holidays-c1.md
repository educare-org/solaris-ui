---
'@educarehq/solaris-ui': minor
---

Add built-in calendar holiday provider (phase C1): `SolarisHolidayProvider` with `builtInHolidays()` covering pt-BR, en-US, and es national lists (fixed dates, US weekday rules with observed shifts, Easter-computus movables), per-locale lazy chunks via `preloadBuiltInHolidays()`, `extend()` for state/municipal additions, custom provider support, and warn-and-empty fallback for unsupported locales.
