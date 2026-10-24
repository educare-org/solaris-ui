# Charts V2 — progress log

Living log for the charts V2 workstream (branches `feature/charts-v2-*`, base `095622ea` lineage).
Update at the end of every V2 phase. No commit/push without approval.

## V2-A — hygiene — DONE

Cleanup and baseline before the V2 stack (lint/token/i18n green).

## V2-B — showcases (sparkline/shell/line) — DONE (`dc931a6b`)

Sparkline showcase plus shell and line showcase rework.

## V2-C — design system size×density + sparkline card — DONE (`3cfa5143`)

3×3 size×density matrix across chart components; `solaris-sparkline appearance="card"`.

## V2-D — motion — DONE (`095622ea`)

Staged line transitions, two-phase list animations, timeline/list display transitions.

## V2-E — fullscreen (DialogService) + combos N1 + chart cards — DONE (uncommitted, `feature/charts-v2-fullscreen-combos-cards`)

- Fullscreen via `SolarisDialogService.openComponent()` (`xl` width, `~60vh` canvas via `--solaris-chart-shell-fullscreen-height`); shell keeps emitting `actionRequest`; artisanal `div.fullscreen` removed from the shell showcase; dialog ships extended descriptions + visible totals table, focus trap, `aria-modal`, Esc/backdrop close, ink-safe print.
- Combos N1: `SolarisChartView` extended with opt-in `heatmap`/`radar` (`isChartView`, label keys, `solaris.chart.*` strings + fallbacks, defaults unchanged); showcase combos section projects heatmap/radar through the shell `<ng-content />` slot.
- Chart-card livre: documented `solaris-card` slot pattern (no new wrapper) + `charts/cards` showcase page with three Sales Report recipes; routes/sidebar/translations/prev-next chain wired.
- DoD: unit tests scoped to the phase green (`angular:test` chart-shell + chart-strings, 40 passed), `chart-shell` e2e chromium 17 passed incl. the new fullscreen dialog test (`opens fullscreen in a dialog with focus trap and closes via Escape`); `selects line dots with the keyboard` fails identically on base `095622ea` (pre-existing V2-D motion/idle timing issue in this env, not a V2-E regression — verified via `git stash`), `check-translation`/`check-tokens`/`check-docs`/`check-i18n`/eslint/stylelint green, no commit/push without approval.
