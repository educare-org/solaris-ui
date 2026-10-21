---
'@educarehq/solaris-ui': minor
---

Add charts model foundation (`data-display/charts`, phase H0): `SolarisChartSeries`/`SolarisChartPoint`/`SolarisChartSlice` types, pure scale utils (`resolveChartDomain`, `resolveChartTicks`, `normalizeStacked100`, `groupSmallChartSlices`, `isChartSeriesEmpty`/`visibleChartSeries`), categorical token palette (`SOLARIS_CHART_PALETTE` + `resolveChartSeriesColor`, no raw colors), and `solaris.chart.*` strings (en-US/pt-BR/es-419 + service fallback). Lib never fetches or mutates consumer data. Follow-ups: H1 chart-shell, H2 line+sparkline.
