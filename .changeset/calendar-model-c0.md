---
'@educarehq/solaris-ui': minor
---

Add calendar scheduling model (phase C0, no UI yet): `SolarisCalendarEvent`/`Task`/`Holiday`/`Recurrence` types, DST-safe datetime utilities over instants, windowed recurrence expansion for the daily/weekly/monthly/yearly subset with count/until/exception dates/single-occurrence overrides, and Gregorian Easter computus for movable holidays. Pure functions only, SSR-safe, zero dependencies.
