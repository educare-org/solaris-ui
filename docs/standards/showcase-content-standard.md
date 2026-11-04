# Solaris UI — Showcase Content Standard

> Mandatory page structure for showcase docs.
> Any agent must be able to read this document and structure a new page
> without guessing. Reference pilot: `code-block`.

## 1. Page anatomy (fixed order)

```
<app-docs-page-layout [items]="tocItems">
  <app-docs-page-header
    titleKey / title
    descriptionKey / description
    [breadcrumbs]           <!-- B1 -->
    [prev] [next]           <!-- B2 -->
  />
  <app-docs-section anchor="examples">…</app-docs-section>      <!-- S1 -->
  <app-docs-section anchor="installation">…</app-docs-section>  <!-- S2 -->
  <app-docs-section anchor="props">…</app-docs-section>         <!-- S3 -->
  <app-docs-page-footer [prev] [next] />                        <!-- F1 -->
</app-docs-page-layout>
<aside> On this page (TOC) — one item per anchor, same order </aside>
```

Section order for **component** pages is fixed:

1. **Examples** (`examples`)
2. **Installation** (`installation`)
3. **Props** (`props`, table — future component)

**Index** (`Components`, `Docs`) and **conceptual** (`Docs / Introduction`)
pages follow the same header (B1), but the body is a 3-column list or prose —
see §7.

## 2. Block B1 — Breadcrumb (MUST)

- Format: `Docs / Components / <Name>` or `Docs / <Topic>`.
- Visual separator: **chevron** (`chevron-right`), never raw `/` or text.
- **Functional**: each level (except current) is a real route link:
  `Docs` → `/configuration` (or docs index when it exists),
  `Components` → 3-column index page (§7),
  current → `aria-current="page"`, no link.
- Implementation: `ShowcaseDocsBreadcrumb[]` with `{ labelKey | label, route? }`.
- A11y: `nav[aria-label=breadcrumb]` + `ol > li`; last item `aria-current="page"`;
  chevron `aria-hidden="true"`.
- i18n: always `labelKey` (e.g. `shell.sidebar.section.components`).

## 3. Block B2 — Title + button group (SHOULD)

Layout: `h1` title on the left, button group on the right (wraps on mobile).

```
<h1>Rainbow Button</h1>   [‹] [⧉ Copy Page ▾] [›]
```

- **No eyebrow.** The description below the block provides context.
- Buttons (all `icon-button` with translatable `aria-label`):
  - `‹` (`chevron-left`): goes to the **previous component** (sidebar order).
  - `Copy Page` (`copy` + `chevron-down`): main button copies the page
    as Markdown; the chevron opens `dropdown-menu` with:
    - `View as Markdown`
    - `Open in ChatGPT`
    - `Open in Claude`
  - `›` (`chevron-right`): goes to the **next component**.
- Base pattern: `solaris-button-group` (`attached`, `role="group"`) +
  `solaris-icon-button` + `dropdown-menu`. See the attached example in
  `apps/showcase/src/app/pages/actions/button-group/component/button-group-showcase.html`.
- Prev/next derive from the flat order of `SHELL_SIDEBAR_SECTIONS`.
  Cases without previous/next disable that button (`disabled` + `aria-disabled`).
- **Description** (`descriptionKey`) goes **below** this block,
  `max-width: 720px`, `text-muted`. One sentence: what the component does.
- B2 is SHOULD, not MUST: minimal pages may ship title + description only.
  When prev/next data is unavailable, omit the group rather than blocking.

## 4. Page actions — Markdown + AI (MAY)

- `Copy Page`: serializes the page (title, description, examples, installation,
  props) to Markdown and copies to clipboard. Feedback via `toast`.
- `View as Markdown`: opens the same serialization in an overlay/reader
  (read-only, with copy button).
- `Open in ChatGPT / Open in Claude`: opens `https://chat.openai.com/?...` /
  `https://claude.ai/new?...` with a pre-filled prompt.
- Incremental adoption is allowed: ship `Copy Page` first; remaining items may
  be disabled with `title="Coming soon"` until the serializer exists.

## 5. Section S1 — Examples (MUST)

- Each example = **compact preview/code block** (future component,
  queued). Until it exists, use `solaris-code-block` + live demo.
- Size: previews stay compact — `min-height: 160-240px`, never full-viewport
  heroes. This is SHOULD-level guidance; dense components may go smaller
  and complex ones larger when justified.
- Block header: `Preview | Code` tabs + `Copy Code` action on the right.
- Each example gets its own `anchor` when relevant
  (`examples`, `examples-default`, …) and joins the TOC.
- **Variation** sections (appearance, size, density, color) use
  `solaris-tabs` with one panel per value — never a stack with all values
  visible at once. Tab labels via i18n, `ariaLabel` with the section title.
- `Code` content: minimal usage snippet (import + template), never the
  whole page.

## 6. Section S2 — Installation (MUST, simple format)

- **No `CLI / Manual` tabs.** Single-block installation. The section shows:
  1. `pnpm add @educarehq/solaris-ui` (`command` variant of code-block);
  2. component import (`import { SolarisXxx } from '@solaris-ui/angular'`);
  3. setup note (`provideSolaris…` / `ng add`) when applicable.
- There is no per-component installation today (single package
  `@solaris-ui/angular`). When per-component installation exists, this
  section becomes tabs.

## 7. Section S3 — Props (MUST anchor, table when available)

- Anchor `props` is mandatory on every component page.
- Table `Prop | Type | Default | Description` renders when the table
  component exists; until then the section keeps the anchor plus a
  translated placeholder — never improvise a raw `<table>` off-pattern.
- Source of truth: `model/*.types.ts` + `docs/*.md` of the component.

## 8. Block F1 — prev/next footer (SHOULD)

- Two buttons at the page bottom: `← <Previous>` (left) and `<Next> →`
  (right), same routes as B2. When there is no previous/next, hide that side.
- Labels: `docs.page.prev / docs.page.next` + component name.
- SHOULD, not MUST: minimal pages may omit the footer.

## 9. Special pages

- **Index `Components`** (`Docs / Components`): title + short description +
  **3-column list** of all components (order = sidebar). Responsive grid
  3→2→1. Each item links to its page.
- **Index `Docs`**: same header; body with philosophy, patterns, and topics
  (links to guides/standards). Prose with `h2` per topic.
- **Conceptual** (`Docs / Introduction`): prose (philosophy, lists, links),
  each `h2` joins the TOC.

## 10. TOC — On this page (MUST)

- `tocItems: ShowcaseTocItem[]` 1:1 with section `anchor`s, **same order**.
- Component: `examples`, `installation`, `props` (+ example sub-anchors).
- Index/conceptual: one item per `h2`.
- Behavior already ready in `docs-on-this-page.ts`: IntersectionObserver +
  `prefers-reduced-motion`. Do not reinvent.

## 11. i18n (MUST)

- Pages never ship hardcoded text. Keys per page:
  `'<page>.title'`, `'<page>.description'`,
  `'<page>.section.<anchor>'`, `'<page>.<block>.note'`,
  `docs.page.prev/next`, `docs.page.copy-page`, `docs.page.view-markdown`,
  `docs.page.open-chatgpt`, `docs.page.open-claude`.
- Files: `pages/<category>/<name>/translations/` with `en-US` + `pt-BR` +
  `es-419`. All three are required for every page.

## 12. A11y + styling (MUST)

- One `h1` per page (header only); sections use `h2` via `docs-section`
  (`section[id][aria-labelledby]`).
- Breadcrumb `nav > ol`, `aria-current="page"`; chevrons `aria-hidden`.
- Icon-only buttons always carry `aria-label` (+ `ariaLabelKey` when the
  component supports it).
- Focus `:focus-visible` with `--solaris-focus-ring-*` tokens; respect
  `prefers-reduced-motion` in smooth scrolling.
- Only `--solaris-*` tokens, `px` values; no `rem`, no raw color, no
  token fallback. Vertical rhythm via `docs-page-layout__content`
  (`gap: spacing-8`); pages do not define section `margin`.
- Shared helpers: `.showcase__note`, `.showcase__row`, `.showcase__stack`.

## 13. MUST vs SHOULD vs MAY

| #                                                            | Rule                                                           | Class  |
| ------------------------------------------------------------ | -------------------------------------------------------------- | ------ |
| B1                                                           | Chevron breadcrumb with routes + `aria-current`                | MUST   |
| H1                                                           | Single `h1` + description below, no eyebrow                    | MUST   |
| S1–S3                                                        | Sections `examples → installation → props` with anchors in TOC | MUST   |
| TOC                                                          | `tocItems` 1:1 with anchors, same order                        | MUST   |
| i18n                                                         | Everything via `*Key`, `pt-BR` + `en-US` + `es-419`            | MUST   |
| A11y                                                         | Single h1, labels, focus-visible, motion                       | MUST   |
| Tokens                                                       | Only `--solaris-*`, no local rhythm styles                     | MUST   |
| B2                                                           | `h1` + button group `[‹][Copy ▾][›]`                           | SHOULD |
| F1                                                           | Footer `← Previous / Next →`                                   | SHOULD |
| Preview/code compact                                         | Contained height, tabs + Copy Code                             | SHOULD |
| Installation                                                 | Single block; no CLI/Manual tabs until decided                 | MUST   |
| Page actions Markdown + AI                                   | Copy Page real; View/ChatGPT/Claude incremental                | MAY    |
| Status badges in header                                      | `stable/new/experimental`                                      | MAY    |
| Extra API/Accessibility section linking `docs/*.md`          |                                                                | MAY    |
| Manual header `<div><header><section>` (legacy badge/button) |                                                                | NEVER  |
| Hardcoded text / raw `margin` / improvised HTML table        |                                                                | NEVER  |

## 14. Checklist for a new page (copy into the PR)

- [ ] B1 chevron breadcrumb with routes + `aria-current`
- [ ] `h1` + description below, no eyebrow
- [ ] S1 compact examples (Preview|Code + Copy)
- [ ] S2 simple installation (single package, no tabs)
- [ ] S3 props anchor (table when available)
- [ ] B2/F1 prev/next (or justified omission)
- [ ] TOC 1:1 with anchors, same order
- [ ] i18n `en-US` + `pt-BR` + `es-419`, zero hardcoded text
- [ ] A11y: single h1, labels, focus, motion
- [ ] Only tokens, no local rhythm CSS
