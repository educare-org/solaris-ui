---
'@educarehq/solaris-ui': minor
---

Phase 4 ERP fit (data-display print baseline + consumer guidance): table, gradebook, record-grid, and card gain `@media print` rules (ink-safe paper/ink, scrollers expanded, sticky reset to static, pagination/draft/action chrome hidden) with `SOLARIS_TOKEN_EXCEPTION(print)` traces. Record-grid cells expose truncated text via `title` (mirroring the table; omitted for empty cells) with a regression spec. Component docs gain an "ERP operations" section each (empty/loading/error states, bulk actions, keyboard-first flows, 1000+ row paginate-not-render guidance, audit-trail hooks with ids-only/no-PII rule, pt-BR/es text-growth wrap guidance, print-from-source-rows guidance). No business logic added to the lib; no public API changed.
