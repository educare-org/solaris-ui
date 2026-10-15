# Solaris Holidays

## Purpose

Built-in national holiday provider for the calendar family. Consumers pass a
`SolarisHolidayProvider` to calendar views; the default covers `pt-BR`,
`en-US`, and `es` without network requests.

## API

| Export                            | Description                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `builtInHolidays()`               | Provider over the bundled national lists.                                                                        |
| `preloadBuiltInHolidays(locale)`  | Lazy-loads one locale chunk (`import()` per locale, excluded from the default bundle). Call before first render. |
| `isBuiltInHolidaysLoaded(locale)` | Whether a locale chunk is already loaded.                                                                        |
| `provider.extend([...])`          | Returns a new provider with extra (e.g. state/municipal) holidays; the base provider is never mutated.           |
| Custom provider                   | Implement `SolarisHolidayProvider` (`holidays(range, locale)`) for full control.                                 |

Holiday names ship in the locale language plus a `solaris.calendar.holidays.*`
key; consumers may override either field.

## Sources and limits

- Lists are national statutory holidays only: Brazil (incl. Consciência Negra,
  national since Lei 14.759/2023), US federal, Spain national. Movables derive
  from the C0 Easter computus (Carnival/Good Friday/Easter/Corpus Christi
  where observed).
- State/municipal holidays (Brazil has thousands) and autonomous-community
  holidays (Spain) are intentionally out; add them via `extend([...])` or a
  custom provider.
- `en-US` weekend fixed holidays shift to the observed weekday (Sat → Fri,
  Sun → Mon). Other locales keep the civil date.
- Fixed lists need review when governments change them.
- Unsupported or not-yet-preloaded locales resolve to an empty list with a
  one-time `console.warn`, never a throw.
