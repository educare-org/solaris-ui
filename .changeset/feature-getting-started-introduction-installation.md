---
'@educarehq/solaris-ui': minor
---

feature(showcase): split Configuration into Introduction and Installation guides

Replaces the legacy `/configuration` showcase page with two Getting Started
pages following the docs-page standard (`ShowcaseDocsPageLayout`, header,
sections, TOC, footer) and the Magic UI Introduction/Installation split:

- `/introduction` (new default route): principles, the six component
  contracts, and where to go next. No live token/icon demos; it links to
  `/installation` and `/icons`.
- `/installation`: prerequisites, package install, `ng add` schematic and Nx
  generator, `solaris.scss` styles, `provideSolaris()` providers (with
  basic/theme/translate tabs), optional translation setup, and verify.

Removes the old token/typography/icon galleries (superseded by Foundation
pages), updates all breadcrumb docs-index links to `/introduction`, moves
dialog next-link to `/introduction`, and refreshes mega-menu demo links,
sidebar translations (`introduction`/`installation` in pt-BR, en-US, es-419),
and the e2e smoke routes.
