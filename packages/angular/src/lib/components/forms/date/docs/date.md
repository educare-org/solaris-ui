# Solaris Date Foundation

## Purpose

Internal locale-aware date utilities and calendar grid used by date controls.

## API

This foundation is internal and has no consumer API. The calendar grid used
by Date Picker and Date Range Picker accepts:

| Input           | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| `weekStartsOn`  | `0`–`6` first weekday override (default: locale first day, Sunday fallback). |
| `disablePast`   | Disables dates before today.                                                 |
| `disableFuture` | Disables dates after today.                                                  |

`SolarisDateFormat` (`'2-digit'` / `'numeric'`) controls day+month display
padding; `SolarisWeekStartsOn` (`0`–`6`) is shared by both pickers.

## Accessibility

The calendar grid provides semantic grid roles and delegated accessible day labels.

## CSS Variables

The calendar uses Solaris spacing, typography, surface, focus, and color tokens.

## Examples

Date Picker and Date Range Picker compose this internal foundation.
