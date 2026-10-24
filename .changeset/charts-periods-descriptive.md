---
'@educarehq/solaris-ui': major
---

Descriptive chart periods. `SolarisChartPeriod` renames `'1D'→'day'`, `'7D'→'week'`, `'1M'→'month'`, `'3M'→'quarter'`, `'YTD'→'year'` (`'all'` unchanged); shell default period is now `'week'`. Migration:

| before | after     |
| ------ | --------- |
| `1D`   | `day`     |
| `7D`   | `week`    |
| `1M`   | `month`   |
| `3M`   | `quarter` |
| `YTD`  | `year`    |
| `all`  | `all`     |

Update `period` models/signals, `availablePeriods` values, and `PERIOD_DATASETS` keys. Translation keys renamed: `solaris.chart.period1D→periodDay`, `period7D→periodWeek`, `period1M→periodMonth`, `period3M→periodQuarter`, `periodYTD→periodYear`; showcase keys `periodLabel1D→periodLabelDay`, `periodLabel7D→periodLabelWeek`, `periodLabel1M→periodLabelMonth`, `periodLabel3M→periodLabelQuarter`, `periodLabelYTD→periodLabelYear`, `interval1D→intervalDay`, `interval7D→intervalWeek`, `interval1M→intervalMonth`, `interval3M→intervalQuarter`, `intervalYTD→intervalYear` (`periodLabelAll`/`intervalAll` unchanged). `allowedTerms` entries `"1D"`, `"1M"`, `"3M"`, `"7D"`, `"YTD"` removed (labels now differ per locale).
