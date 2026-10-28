# @educarehq/solaris-ui

## 2.0.7

### Patch Changes

- c07bdf4: fix(forms): render value-driven field chrome without structural hydration gates

  The clear buttons (`solaris-email-field`, `solaris-phone-field`, `solaris-date-picker`, `solaris-date-range-picker`, `solaris-select`, `solaris-multi-select`), the select trigger value/placeholder swap, the multi-select trigger value/placeholder/chips/overflow swap and the password strength meter were wrapped in `@if` blocks gated by `hydrated()` (set in `afterNextRender`) combined with replay-mutable form state (`internalValue`/`hasValue`/`canClear`/`showValue`/`displayText`). Any server/client divergence at those anchors aborts hydration of the subtree with NG0502, leaving `onInput → onChange → ngModel` unwired (consumer CTA permanently `disabled`). Gating on `hydrated` narrowed but did not close the race, so the structural dependency is removed instead: value-driven chrome is now always rendered and its visibility is controlled via the `hidden` attribute, which flips as an attribute-only update and can never add/remove a hydration container — including under pre-hydration event replay. The `hydrated` signals and `afterNextRender` hooks are removed from these components (`showValue` in multi-select is now `hasValue()`). Visible behavior, public APIs, styles, aria labeling, focus order (`tabindex="-1"` clear actions, inert `hidden` subtrees) and `cleared` emissions are unchanged; `[hidden]` display overrides were added wherever a class sets `display` (`flex`/`inline-flex`/`inline-block`), since that overrides the UA `[hidden] { display: none }` rule.

## 2.0.6

### Patch Changes

- 69f3a03: fix(forms): keep SSR and hydrated DOM identical for value-driven field chrome

  The clear action (and value-driven trigger content in select/multi-select, strength meter in password-field) was gated by `@if` blocks depending on mutable form state (`internalValue`/`hasValue`/`canClear`). Any server/client value difference at first render broke hydration with NG0502 and left the input disconnected from its `ControlValueAccessor`. Value-driven DOM in `solaris-email-field`, `solaris-phone-field`, `solaris-password-field`, `solaris-date-picker`, `solaris-date-range-picker`, `solaris-select` and `solaris-multi-select` now renders only after hydration; visibility and validation logic are unchanged. `writeValue` in email-field and password-field also coerces `null`/`undefined` to `''` so fields bound to empty `FormControl`s cannot crash.

## 2.0.5

### Patch Changes

- 23da709: fix(phone-field): stop truncating formatted numbers and widen dial-code gap
  - Derive the native input `maxlength` from the formatted number length instead of the national digit count, so full numbers (e.g. BR `(11) 99999-8888`) can be typed. Digit capping is still enforced on input.
  - Fall back to the E.164 maximum when numbering-plan metadata has no lengths, so the field never becomes untypeable.
  - Increase the gap between the dial-code prefix and the input via the new `--solaris-phone-field-dial-code-gap` token (default `var(--solaris-spacing-3)`).

## 2.0.4

### Patch Changes

- bbe3ce8: fix(forms): count suffix-action inputs in form-field suffix visibility

  Include `hasSuffixActionInput` in `effectiveHasSuffix` so a projected suffix action keeps the suffix cell visible even when no plain suffix is present. A suffix action implies a suffix: `hasSuffixAction` already considered the input for the `action` variant, but the visibility gate did not, hiding single-attribute (`solaris-form-suffix-action`-only) actions re-projected through field presets. Adds an `email-field` regression test for the single-attribute case.

## 2.0.3

### Patch Changes

- 9c8046d: fix(forms): accept single suffix-action attribute in field presets

  Change the suffix-action forwarding slot in `email-field`, `password-field`, `phone-field`, `select`, `multi-select`, `date-picker`, `date-range-picker` and `otp-input` from `select="[solaris-form-suffix][solaris-form-suffix-action]"` to `select="[solaris-form-suffix-action]"`, matching the `solaris-form-field` primitive. Consumer elements now only need `solaris-form-suffix-action`; carrying `solaris-form-suffix` alongside keeps working for backward compatibility. Also add the missing `SolarisFormPrefixDirective` import to `password-field` and the missing `SolarisFormSuffixDirective` import to `select`/`multi-select` for their internal affix icons.

## 2.0.2

### Patch Changes

- Fix `SolarisIconComponent` SSR on Domino: render SVG nodes structurally (`@for`/`@switch` with `[attr.*]` bindings) instead of `[innerHTML]`, which Domino does not implement. Server markup is now identical to the browser markup and hydration stays clean. Also preserve `vector-effect` for `absoluteStrokeWidth`.

## 2.0.1

### Patch Changes

- Stabilize the showcase e2e suite against current pages (tab-scoped triggers, examples-scoped menus, app-locale labels, preset picker index, overflow counts, hidden radio inputs, line-chart enter-transition race) and split CI into a sharded chromium PR gate with the full 3-browser matrix on main and nightly.

## 2.0.0

### Major Changes

- 7af55c6: Descriptive chart periods. `SolarisChartPeriod` renames `'1D'→'day'`, `'7D'→'week'`, `'1M'→'month'`, `'3M'→'quarter'`, `'YTD'→'year'` (`'all'` unchanged); shell default period is now `'week'`. Migration:

  | before | after     |
  | ------ | --------- |
  | `1D`   | `day`     |
  | `7D`   | `week`    |
  | `1M`   | `month`   |
  | `3M`   | `quarter` |
  | `YTD`  | `year`    |
  | `all`  | `all`     |

  Update `period` models/signals, `availablePeriods` values, and `PERIOD_DATASETS` keys. Translation keys renamed: `solaris.chart.period1D→periodDay`, `period7D→periodWeek`, `period1M→periodMonth`, `period3M→periodQuarter`, `periodYTD→periodYear`; showcase keys `periodLabel1D→periodLabelDay`, `periodLabel7D→periodLabelWeek`, `periodLabel1M→periodLabelMonth`, `periodLabel3M→periodLabelQuarter`, `periodLabelYTD→periodLabelYear`, `interval1D→intervalDay`, `interval7D→intervalWeek`, `interval1M→intervalMonth`, `interval3M→intervalQuarter`, `intervalYTD→intervalYear` (`periodLabelAll`/`intervalAll` unchanged). `allowedTerms` entries `"1D"`, `"1M"`, `"3M"`, `"7D"`, `"YTD"` removed (labels now differ per locale).

- 994d2c6: Restructure color tokens into a semantic system (breaking). Neutrals move to `--solaris-neutral-*` (`page/default/subtle/sunken/overlay/inverse/text-heading/body/secondary/tertiary/inverse/border-*/backdrop`); semantic colors use `solid/solid-hover/solid-active/soft/border/foreground/on-solid`; `orange-*` becomes `accent-*`; new `violet-*` scale; dark page `#0a0a0a` with containers `#171717`, body text `#f2f5fb`, stronger red danger (`#f13645` dark); new `high-contrast-dark` theme (`data-theme='high-contrast-dark'`, `colorScheme: 'high-contrast' | 'high-contrast-dark'`). The `danger` icon changes from octagon-X to Lucide `circle-alert`. Migrate: `bg-page→neutral-page`, `surface-base/raised→neutral-default`, `surface-subtle→neutral-subtle`, `surface-muted→neutral-sunken`, `surface-reverse*→neutral-inverse*`, `text-strong/default/muted/subtle/inverse→neutral-text-heading/body/secondary/tertiary/inverse`, `border-*→neutral-border-*`, `backdrop→neutral-backdrop`, `*-base→*-solid`, `*-hover/active→*-solid-hover/active`, `*-surface→*-soft`, `*-text→*-foreground`, `orange-*→accent-*`.

### Minor Changes

- 0dbdbc4: Refactor alert with the size × density matrix and add the announcement banner.

  **Alert**
  - New `size` input (`sm | md | lg`, default `md`): size selects the
    padding/gap step (`--solaris-density-padding-*` /
    `--solaris-density-gap-*`) while the effective density resolves the
    value — the same tier composition as Card `data-padding`, so all 9
    `size × density` combinations resolve distinctly. Typography follows
    the pilot scale (`sm → xs`, `md → sm`, `lg → md`) with matching
    icon/close sizes. `md + normal` keeps previous visuals.
  - `hasTitle` is now an optional override (`boolean | undefined`): title
    presence is auto-detected from a projected `[solaris-alert-title]`
    (`data-has-title` + first-line typography bump work without the input).
  - `density` is explicitly `input<T | undefined>` with
    `effectiveDensity` fallback to the theme density; host uses
    `data-size` + `data-density(effective)`.
  - Boolean host bindings follow the presence pattern (`|| undefined`).
  - `radius` gains `'none'` (square, for full-bleed banners).
  - Stories rewritten against the real API (title/description directives).
  - `surface` appearance now carries the `tonal` colors (soft variant
    background + semantic text) with a visible variant border, so it no
    longer looks identical to `outline`. `tonal` is now borderless to
    keep the four appearances distinct.

  **Announcement (new `solaris-announcement`)**
  - Thin full-bleed container over `solaris-alert`: free `ng-content`
    (text, links, images, animated blocks, image backgrounds via
    `variant="custom"` + `--solaris-alert-custom-*` tokens inherited
    from the host).
  - `align` (`center` default), `sticky` (default `true`,
    `--solaris-z-index-sticky`), `size`/`density`/`variant`/`appearance`
    passthrough, `radius` default `'none'`.
  - `closable` (default `true`) stays in-flow so container padding is
    always respected; `dismissed` mirrors Alert semantics.
  - `dismissKey` persists dismissal in `localStorage` (SSR-safe,
    best-effort) with `is/persist/clearSolarisAnnouncementDismissed`
    helpers for `*ngIf` guards.
  - Polite live region by default (`role="status"`); inner alert stays silent.

  **Showcase**
  - Alert page rewritten to the pilot standard (`docs-page-layout`,
    `preview-code` per example, variant/appearance `solaris-tabs`,
    interactive size + density with computed `code()`, simple
    installation, props placeholder, mirrored `en-US`/`pt-BR`).
  - Showcase alert page: variants + appearances share one preview with two
    selector tabs (button pattern); announcement section with basic
    (Brex-style), persistent (`dismissKey`) and image-background
    (`custom` variant) examples switching through tabs; announcement
    banner content flows as a single wrapping row.

  **Follow-ups (documented only)**
  - Alert auto-dismiss timer/progress (toast owns timed messages).
  - `border-position` accent styles (`left-accent` / `top-accent`).
  - Announcement stack manager / marquee built-in (project animated content).

- 1ad956c: Upgrade to Angular 22 and fix the SSR form-suffix hydration crash. Peers move to `@angular/* ^22` with TypeScript `~6.0.3`; `model()`-owned change outputs (`viewChange`, `periodChange`, `displayModeChange`, `recordsChange`, `valueChange`, `activeIndexChange`) replace manually redeclared `output()` duplicates rejected by Angular 22 (NG1054). Projected form affix/suffix outlets are unconditional and re-projected first, fixing the prerender crash (`Cannot read properties of null (reading 'parentElement')` in `navigateBetween`) on pages composing `solaris-email-field` with a projected `solaris-form-suffix` action.
- 7d29366: Add four avatar improvements: roving `tabindex` with RTL-aware `ArrowLeft`/`ArrowRight`/`Home`/`End` navigation across member actions and the `+N` overflow in `solaris-avatar-group` (same for interactive `solaris-avatar-group-badge` members); per-member `tooltip`/`tooltipKey` on `SolarisAvatarGroupUser` reusing the Solaris tooltip without built-in overlays; `imageLoading` (default `lazy`) and `imageDecoding` (default `async`) inputs on `solaris-avatar` forwarded to the photo; and an overflow-measured `title` on the group-badge label that only appears when truncated, mirroring `solaris-avatar-profile`.
- b10731a: Add `solaris-avatar-group-badge`: a pill combining a mini overlapped member cluster with a text label. The `+N` overflow marker is static text (never a button), so the pill itself can render as a link (`href`) or a button (`actionAriaLabel`) with `badgeClick`, in any avatar `size`, without nesting interactives. It stays standalone on purpose — `solaris-badge` carries count/status semantics that don't fit an identity cluster — while every token comes from `--solaris-*`. The showcase gains a `group-badge` section with mirrored `en-US`/`pt-BR` strings.
- 7d29366: Add per-member actions and hover interaction to `solaris-avatar-group` and `solaris-avatar-group-badge`: `SolarisAvatarGroupUser` accepts `actionAriaLabel` / `actionAriaLabelKey` to render that member as an interactive avatar button, with a new `memberClick` output emitting `{ user, index }`. Badge members only render actions when the pill itself is static (never nested inside a link/button). Both clusters lift the hovered/focused avatar (`translateY(-4px)`), dim siblings to `var(--solaris-opacity-60)`, thicken the separator ring to `var(--solaris-spacing-3)`, and disable the lift under reduced motion.
- abe3158: Add the Avatar family (`solaris-avatar`, `solaris-avatar-group`, `solaris-avatar-profile`) with `SolarisAvatarPresenceService`. The base renders a photo with `onerror` fallback, deterministic mesh-gradient art (FNV-1a seed over `userId`/`name` driving blurred color spots across ten `--solaris-*` token trios and three seed-picked shape layouts — orbit, ribbon, cluster — with two-letter initials and a surface halo), `initials`/`icon`/`empty` fallbacks, fixed `xs–xl` sizes in px, `full|md|sm|square` radii via `data-*`, presence dots (`online|away|busy|`dnd` → solid danger with a white bar|`offline`, opt-in via `showStatus`) with a timezone-aware off-hours italic `z`glyph in the status color whose surface-base stroke cuts it out of the status dot (default`09:00–18:00`local, overridable via`workingHours`/`timezone`/`offHoursOverride`), badge-semantics counters (`count`/`max`/`showZero`, `99+`capping with full-value`title`, circular single-digit rendering that follows the avatar radius, `danger-on-solid`digit), a scalloped info rosette verified seal with a`text-default` check pushed outward from the edge, an organization slot, an action overlay button (`actionClick`), and thicker border states (widened primary→info gradient `active`ring, gray`loading` track with a traveling primary bar, both floating with a gap and reduced-motion safe). Every marker cuts a knockout separator into the avatar edge. The group is data-driven (`users`, `max`, `overlap`, focusable `+N`overflow with`overflowClick`); the profile pairs identity with title/subtitle/badge via `solaris-badge`, measured ellipsis tooltips, a wider identity gap, a compact avatar-only mode, and a clickable identity that renders a link when `href`is set or a button when`actionAriaLabel`is set (actions slot always stays outside,`profileClick`emitted, both modes supported). Accessibility ships composite translated`aria-label`s (`solaris.avatar.\*`keys in`en-US`/`pt-BR`), real buttons for every interactive marker, and `:focus-visible`rings; the showcase adds the`data-display/avatar`route (examples, status, count, overlays, group, profile, states, size-radius, installation, props) with mirrored translations. Follow-ups: photo editing/upload/crop, generative-art persistence, lazy-load, custom overlays,`table`/`calendar`/`file-upload`.
- 3387655: Avatar profile text size decoupled from image size. Toolbar leading and trailing slots.
- bd2e65f: Refactor `solaris-badge` onto the 3×3 `size` × `density` matrix pattern (9 explicit `[data-size][data-density]` blocks, `density` as `input<T | undefined>` with `effectiveDensity` falling back to `ThemeService.density`). Badge keeps its own compact height ladder (18–34px, display element outside `--solaris-control-height-*`), fixed-height rows with `line-height: 1` single-line math, typography `sm → xs`, `md → sm`, `lg → md`, and icon sizes following the text (`14px / 16px / 18px`). Fixes the single-digit `count` rendering as a vertical pill (circular footprint via `aspect-ratio` + `min-width` equal to the row height, growing horizontally for more digits, `tabular-nums`) and the tiny slot icons (`calc(spacing-1 * 3.5)` ≈ 3.5px, now sized per row through the `solaris-badge-icon` directive host, `::ng-deep` removed). Adds `count`/`max` (`103` → `"99+"` with `title="103"`), `showZero`, `dot` (+ `pulse` ring, reduced-motion safe), `iconOnly` square geometry, `placement` (`inline` + four corners with `offset` and raised z-index), `truncate` (ellipsis + automatic overflow `title`, opt-out available), and `ariaLabel`/`ariaLabelKey` (required for `dot`/`iconOnly`, zero counts use native `hidden`). The showcase page is rebuilt on the docs-page-layout pattern (preview-code per example, tabs for appearance/color, interactive size-density selectors, count/dot/icon/placement sections, simple installation, props placeholder, full i18n). Follow-ups: `icon-button-badge` parity with the new count/dot API, badge harness.
- aa0eeff: Add `surface` appearance to `solaris-badge`: same low-intensity background and semantic text as `tonal` but with a transparent border, for all colors (`neutral`, `primary`, `success`, `warning`, `danger`, `info`).
- 2a631a1: Add `open-ai` and `claude-code` brand icons. Both use `currentColor` fill so they inherit the surrounding text color, unlike multicolor brand icons such as `google` and `microsoft`.
- 0d6aad2: Add `density` (`compact` | `normal` | `comfortable`) to `solaris-breadcrumb` as `input<T | undefined>` with `effectiveDensity` falling back to `ThemeService.density`; the host exposes `data-density` (effective) alongside `data-size`. The SCSS now has the explicit 3x3 `size` x `density` matrix on the control host: `size` scales font, item/separator icons, pager size, and label max-width (`sm`: 120px, `md`: 200px, `lg`: 280px), while `density` controls the inter-item gap (`compact`: `spacing-2`, `normal`: `spacing-3`, `comfortable`: `spacing-4`) on its own spacing scale (breadcrumb does not derive from `--solaris-control-height-*`). Also adds label truncation (ellipsis + `max-width` per size with `min-width: 0` on flex items) with the full label exposed through the native `title` tooltip on links and text, and fixes the docs CSS-variables table to match the code (link color `text-muted`, gap `spacing-3`, icon/separator defaults) plus new `When to use / not to use` and `Limitations (v1)` sections. The showcase page is rebuilt on the docs-page-layout pattern (preview-code per example, tabs for separators and overflow positions, interactive size+ density selectors with computed code, truncation and pager examples, simple installation, props placeholder, full i18n). Follow-ups: routerLink binding on items, automatic responsive collapsing, SEO/json-ld emission.
- 7d61f13: Bring `solaris-icon-button` and `solaris-button-group` to the `solaris-button` size standard. `icon-button` gains `size` (`sm` | `md` | `lg`, default `md`) with the same 3×3 `size` × `density` matrix (outer box via `--solaris-control-height-<density>-<size>` tokens, `sm` → `xs`, `md` → `sm`, `lg` → `md` icon scale); `density` is now `input<T | undefined>` falling back to `ThemeService.density` (previously defaulted to `'compact'`); the host exposes `data-size` + effective `data-density`. Also adds a `chromeless` input (same `size` × `density` footprint with no background/border, glyph enlarged to 60% of the box, hover/active icon micro-interaction with reduced-motion support, `data-chromeless` presence attribute, `solid` icons remapped to the foreground tones so they stay visible without the filled background), `loadingLabel`/`loadingLabelKey` inputs with imperative `aria-label` save/restore parity, and replaces the CSS `::before` loading spinner with the shared `solaris-spinner` component (same indicator as `solaris-button`). `button-group` gains `size` (default `md`, forced onto every `[solaris-button]`/`[solaris-icon-button]` child together with `density` so items never render mixed heights) and exposes `data-size`; `density` also falls back to the theme. Fixes the detached (`attached=false`) gap (the gap token is now consumed via `gap`), and softens the attached dividers with new hex theme tokens (`--solaris-button-group-separator-color` for soft appearances, `--solaris-button-group-separator-on-solid` for `solid` items) instead of the destoando `border-soft`. Attached children render borderless (the group owns the outer ring and dividers, hover/active border colors neutralized) so dividers never double up on mixed appearance or button + icon-button pairs. Both showcase pages are rebuilt on the docs-page-layout pattern with interactive size/density selectors, chromeless/badge demos, and a split-button (button + chevron) preset.
- 7d61f13: Add `size` (`sm` | `md` | `lg`, default `md`) to `solaris-button`, combining with `density` into the same 3×3 `size` × `density` matrix as Tabs/Segmented Control (outer height via `--solaris-control-height-<density>-<size>` tokens, `sm` → `xs`, `md` → `sm`, `lg` → `md` typography). `density` is now `input<T | undefined>` with `effectiveDensity` falling back to `ThemeService.density` (previously defaulted to `'compact'`, shadowing the theme); the host exposes `data-size` + `data-density` (effective). Also adds a `pressed` toggle input (`data-pressed` + `aria-pressed`, Radix Toggle parity; unset renders no `aria-pressed`), `ariaLabel`/`ariaLabelKey` inputs, a dev-mode warning for text-less buttons without an accessible label (use `[solaris-icon-button]` for icon-only), boolean host attributes on the presence pattern (`data-loading`, `data-full-width`), and fixes the loading `aria-label` host binding clobbering consumer labels (now managed imperatively with save/restore), the `wide` shape being silently overridden by the size×density matrix (now sets `min-width`/`padding-inline` directly), the `warning`/`surface` hover/active pair now follows the subtle-hover system (hover stays within the color family with `*-text`, press commits to solid), and the injected `icon` input never updating after first render (now re-applied via `setInput`). The showcase page is rebuilt on the docs-page-layout pattern (single combined appearance+color preview, interactive size-density selectors without appearance, tabs for icon placement, brand icons, states and custom variants, simple installation, props placeholder, full i18n). The preview-code demo surface now wraps with gap between projected items. Follow-ups: badge/count slot parity with `icon-button-badge`, split-button preset, social-button preset, component harness.
- 89c8a23: Button SSR flash fix and button-group CSS-vars migration. `[solaris-button]` and `[solaris-icon-button]` accept `data-size`, `data-density`, `data-appearance`, `data-color`, `data-shape` and `data-radius` as inputs (attribute wins over the same-named input; the group still wins over both), so server-rendered HTML paints the right variants with CSS alone before hydration. The constructor no longer stamps variant defaults before inputs bind. `SolarisThemeService.density` reads the `data-density-default` attribute on `<html>` (exported as `SOLARIS_DENSITY_DEFAULT_ATTRIBUTE`) before falling back to the `--solaris-density-default` custom property, so SSR and client agree. `solaris-button-group` no longer uses `::ng-deep`: children in attached groups carry `data-group="horizontal|vertical"` (from the group context, which now also exposes `attached` and `orientation`) and opt into attached styling themselves — square middle, flush edge radius via `max()` of both axes, per-appearance divider color, and a subtle `brightness(1.07)` hover lift. `transition: all` narrowed to color, background-color, border-color, box-shadow and filter; `custom` color blocks consume `var()` without fallbacks. Attached buttons use `border-width: 0` so the inset divider spans the full item height.
- 727c768: Add calendar drag interactions (phase C6) to the month and week views: pointer-based drag-create (empty slots/days with snap step), drag-move (chips and blocks), edge-resize on time-grid blocks, Escape/pointer-cancel, touch pointers, and keyboard equivalents (arrows move/resize, Enter commits) with live announcements and reduced-motion support. Drag emits proposals only (`eventCreate`/`eventMove`/`eventResize` with `occurrenceScope: single | occurrence` for series — recurring occurrences move as single instances); the lib never mutates the consumer array. Shared `calendar-drag` proposal builders, per-locale `solaris.calendar.*` fallback strings (`en`/`pt-BR`/`es`), and civil date helpers are now shared model modules, and the month/week/year/schedule views no longer embed translations or helpers in their components. Year and schedule views stay click + keyboard only by design.
- 3a788e4: Add `solaris-calendar-event-editor` (phase C5): dialog-hosted event form with title, date/time via `solaris-date-picker`, all-day `solaris-checkbox` (projected label, Google parity), recurrence sub-form (daily/weekly/monthly/yearly + interval + weekday chips + count/until ends), time-zone display with change request (`timeZoneChange`, consumer-owned zone list), color dots bound to `event.color` (8 token-driven hues), and scoped delete (`this`/`following`/`all`) resolved immutably via `resolveSolarisEventDelete` (exDate/until/remove). Emits `eventSave`/`eventDelete`/`eventCancel`/`timeZoneChange`; 45 new `solaris.calendar.editor*` strings in en/pt-BR/es.
- 83984d0: feature(calendar): add extensions pack — recurrence bySetPos/byMonthDay/byMonth, attendees/resources in editor, shell calendar filtering and search, ICS import/export, availability conflicts and free-busy, pure reminder due/next utils, async holiday loader with municipal merge
- c9e96ff: Add built-in calendar holiday provider (phase C1): `SolarisHolidayProvider` with `builtInHolidays()` covering pt-BR, en-US, and es national lists (fixed dates, US weekday rules with observed shifts, Easter-computus movables), per-locale lazy chunks via `preloadBuiltInHolidays()`, `extend()` for state/municipal additions, custom provider support, and warn-and-empty fallback for unsupported locales.
- f450b47: Add Brazilian school observances to the `pt-BR` built-in holidays (Dia da Escola, Povos Indígenas, Descobrimento, Abolição, Estudante, Árvore, Professores), rendered as holiday chips for educational institutions.
- baeeccb: Add calendar scheduling model (phase C0, no UI yet): `SolarisCalendarEvent`/`Task`/`Holiday`/`Recurrence` types, DST-safe datetime utilities over instants, windowed recurrence expansion for the daily/weekly/monthly/yearly subset with count/until/exception dates/single-occurrence overrides, and Gregorian Easter computus for movable holidays. Pure functions only, SSR-safe, zero dependencies.
- f450b47: Add `solaris-calendar-month-view` (phase C2): six-week grid with event chips, all-day/task/holiday rows, `+n more` popover, weekend toggle, `aria-activedescendant` keyboard navigation with live announcements, and `compact`/`normal`/`comfortable` densities.
- 53f676d: Add occurrence-aware save to the calendar: `resolveSolarisEventSave(source, occurrenceStart, draft, scope, timeZone)` splits scoped occurrence edits immutably (`this` appends an exDate and returns a detached single event; `following` truncates via `until` and returns the following part; `all`/non-recurring returns the draft as-is; invalid returns `null`). The event editor shows the scope radios for edited occurrences and emits `{ event, scope, occurrenceStart }` with save; the shell forwards the scope to `eventSave` and the showcase applies the util on save.
- d02d973: Revamp the calendar shell chrome: view switcher becomes a labeled select, toolbar/mini-month titles use regular weight with capitalized month, mini-month label drops the "Calendar of" prefix, the time-zone control is a single labeled select with GMT offset hint, custom days only show for the custom view, and display options (weekends/holidays) move into a collapsible with a new `showHolidays` toggle. Month-view task chips can now be dragged to another day via the new `taskMove` output (forwarded by the shell).
- d02d973: Add click-to-edit to the calendar shell: `editable` opens the event editor dialog with the current data plus `eventSave`/`eventDelete`/`eventCancel` outputs (lib never mutates the consumer array).
- ba3c344: Add calendar shell with toolbar, mini-month, view switcher, and print styles plus showcase pages.
- 6aa8e5e: Add `solaris-calendar-week-view` (phase C3): time-grid with `1|3|4|7` visible days, all-day row with `+n more` popover, deterministic overlap-column layout, time-zone aware now-line (static with reduced motion), weekend toggle, `aria-activedescendant` keyboard navigation with live announcements, and `compact`/`normal`/`comfortable` hour densities.
- 33a49b1: Add `solaris-calendar-year-view` and `solaris-calendar-schedule-view` (phase C4): twelve mini-months with density dots and drill-down via `focusedDate` + `daySelect`, and a window-paginated day-grouped agenda with inline task check-off, empty states, and full keyboard parity.
- ecb66d3: Refactor `solaris-card`: remove `size` (`sm | md | lg`) and add `padding` (`none | sm | md | lg`, default `none`, zero-spacing v2 preserved). Padding selects a spacing tier that composes with `density` through the `--solaris-density-*` tokens (compact tighter, comfortable looser), so no control-height ladder is needed — card is a fluid container, not a fixed-height control. Migrate `size="sm"` to `padding="sm"`, `size="md"` to `padding="md"`, `size="lg"` to `padding="lg"`; cards without `size` already render `padding="none"` and need no change. The side-media thumb keeps its scale (`sm` tier to `spacing-10`, `lg` tier to `spacing-16`). Also adds clickable cards: setting `href` renders a native link overlay covering the whole surface (`data-clickable`, hover elevation, `focus-visible` ring via the global focus tokens, `target`/`rel` forwarding with `noopener` default for `_blank`, `disabled` removes the target and exposes `aria-disabled` + `tabindex="-1"`). The overlay is named via `ariaLabel`/`ariaLabelKey`; one card is one destination and interactive children are forbidden (use `solaris-card-actions` with explicit buttons for multi-action cards, `solaris-selection-card` for selectable options). A card with a single section (only a header or only a footer) suppresses the separator border automatically via `data-single-section` — there is nothing to separate from. The showcase page is rebuilt on the docs-page-layout pattern (preview-code per example, tabs for appearance/radius/media, interactive padding-density selectors with computed snippet, clickable demo, composition demo with a loaded/loading toggle showing the skeleton variant, simple installation, props placeholder, full en-US + pt-BR i18n). Follow-ups: media `aspect-ratio`, metric/profile/media presets, component harness.
- 7a186fa: feature(charts): chart shell interval trigger with motion-safe hover (color + underline fade via motion tokens). The picker opens in a popover anchored below the filters, aligned to the calendar option at the right edge, without shifting the chart (toggled by the interval trigger or the calendar option; clicking either while open closes it). The panel lists every period with a computable range as a preset (fixed durations anchored at the current start, plus the calendar year); applying a range matches it back to a period and falls back to a new `custom` period (`solaris.chart.intervalPlaceholder` while empty, `solaris.chart.periodCustom` label) otherwise. Both picker sides stay editable, even on closed periods; segment switches still re-anchor the end. The period filter gains a permanent icon-only calendar option in interactive mode (toggles the same popover without selecting; stays active while the period is `custom`). `SolarisChartShellPeriodOption` accepts an `icon` for custom icon-only segments.

  feature(date-range-picker): inline panel mode (`inline` renders the calendars/inputs/actions without the field trigger or popover, for hosts that own the trigger) plus per-side `startDisabled`/`endDisabled` and `startReadonly`/`endReadonly` locks and a `cancelled` output.

- ee3bee5: Add `solaris-bar-chart` (`data-display/charts`, phase H3): vertical/horizontal SVG bars in grouped, stacked and stacked-100 layouts with series-tinted gradients, the DS radius token, staggered enter choreography and layout-morph transitions, horizontal scroll for dense categories, auto-grown horizontal viewBox, category thinning, reference lines painted above the bars, tooltip with total, roving-tabindex keyboard marks emitting `pointSelect`, screen-reader data table and pure layout geometry (`buildBarChartFrame`, `resolveBarLabelEvery`, `truncateBarCategoryLabel`). Line overlays stay out by design — a future `combo-chart` will own second-axis overlays. Showcase gains `charts/` pages (shell, line, bar) with the shell projecting bars on the bar view. Follow-ups: H4 pie-chart.
- 7ded387: Add `solaris-heatmap` and `solaris-radar` (`data-display/charts`, phase H5): the heatmap renders a fixed-geometry SVG matrix of rows by columns where cell intensity mixes the primary token over the neutral surface and empty periods paint with the neutral subtle token, with a sticky row gutter under horizontal scroll, per-cell tooltips docked outside the cell on the dominant side and 2D roving-tabindex cells emitting `cellSelect`, plus an optional `showScale` intensity bar; the radar draws one polygon per series on shared axes with a filter-style legend (`Filter by:` title, hover affordance, struck-through hidden labels, stable palette slots, `seriesToggle`) and focusable vertices emitting `vertexSelect` with tooltips docked outside each vertex, growing from the center with a per-series stagger. Both reuse the chart tokens, synthesized summaries, screen-reader tables and empty states, and never mutate consumer input. Showcase gains the `charts/heatmap/` (weekly attendance plus a varied multi-class intensity-scale section) and `charts/radar/` (class competency profile plus a ten-axis six-class section) pages wired into the charts nav between pie and code-block, with light/dark/high-contrast stories. Follow-ups: H6 showcase + release.
- d79ad3f: Charts polish round 2: smoother interactions and showcase depth. `line-chart` crossfades the series group (WAAPI, `prefers-reduced-motion` aware) when the dataset changes, dots transition fill/stroke, and the selection guide fades in; axis/reference labels drop to `--solaris-font-size-2xs` and left padding grows to 56 so Y ticks like "1,5 mil" no longer clip. `chart-shell` legend buttons gain hover/focus background transitions, the empty state centers its text, and `isChartDisplayMode` is exported. Showcase: every period (1D/7D/1M/3M/YTD/all) now has its own dataset, reference average and x labels; Timeline/List swaps the chart for a totals list; the maximize button actually toggles fullscreen on the demo via the Fullscreen API (the lib still only emits `actionRequest`).
- d79ad3f: Charts line/shell refresh: add `maximize` icon; smooth line now interpolates every dot (Catmull-Rom Bézier); out-of-scale reference lines are hidden instead of clamped; series colors stay stable by original order when toggling the legend; dots are hollow with series-color stroke and fill on hover/select plus a selection guide band; tooltip gains an X heading and optional `tooltipSubtitle`; `solaris-chart-shell` gets a dedicated fullscreen `maximize` button outside the `...` menu, a `displayMode` (`timeline`/`list`) switcher beside the period filter, and legend buttons with hover/focus affordance.
- d79ad3f: Add `solaris-line-chart` and `solaris-sparkline` (`data-display/charts`, phase H2): smooth/linear/step SVG paths with series-tinted area gradients, null-gap splitting, reference lines, multi-series tooltip with total, roving-tabindex keyboard dots emitting `pointSelect`, screen-reader data tables, and shared pure geometry utils (`buildLineChartFrame`, `buildSparklineGeometry`). Showcase `/data-display/chart-shell` renders the line inside the shell with KPI deltas and period datasets. Follow-ups: H3 bar-chart, H4 pie-chart.
- 80982a5: Add charts model foundation (`data-display/charts`, phase H0): `SolarisChartSeries`/`SolarisChartPoint`/`SolarisChartSlice` types, pure scale utils (`resolveChartDomain`, `resolveChartTicks`, `normalizeStacked100`, `groupSmallChartSlices`, `isChartSeriesEmpty`/`visibleChartSeries`), categorical token palette (`SOLARIS_CHART_PALETTE` + `resolveChartSeriesColor`, no raw colors), and `solaris.chart.*` strings (en-US/pt-BR/es-419 + service fallback). Lib never fetches or mutates consumer data. Follow-ups: H1 chart-shell, H2 line+sparkline.
- f02bbfe: Add `solaris-pie-chart` (`data-display/charts`, phase H4): SVG pie, donut with the total in the center and a semicircular gauge with a min/max/target goal tick, plus a compact single-slice donut score ring. Slices fill with series-tinted radial gradients, morph between pie and donut through one shared path structure, stagger on enter and group sub-`minSlicePercent` values into a translated "Others" slice via the shared `groupSmallChartSlices` util. Pure geometry lives in `chart-pie.utils.ts` (`buildPieChartFrame`, `buildGaugeGeometry`, `pieSlicePath`, `gaugeArcPath`, `gaugeTargetTick`, `seriesToPieSlices` so the shell can project series sums). Roving-tabindex keyboard marks emit `sliceSelect(id)` for showcase drill-down, with a synthesized summary, tooltip with value/percent/total and a screen-reader data table. Showcase gains the `charts/pie-chart/` page (variants, grouping, gauge, score ring, click-to-detail drill-down, empty, props) and the shell projects the donut on the pie view. Follow-ups: H5 heatmap + radar.
- b41a0bd: Release `data-display/charts` (program H6 close-out): the shell page already projects `line|bar|pie` over the same immutable series through the view switcher (Image-3 parity), with one showcase page per type; H6 adds ink-safe `@media print` rules to `chart-shell` and every chart renderer except `sparkline` (pure inline SVG with no chrome, text or scroll, so no print rules apply) following the calendar C7 pattern — interactive chrome and hover-only tooltips hidden, horizontal scrolls flattened, chart hosts pinned to paper with axis/legend text in ink while series fills keep their data encoding — plus the family release notes in `charts/docs` and a `Print` section in the shell docs. Follow-up: none, program closed.
- d79ad3f: Charts round 3: legend becomes an explicit filter (`solaris.chart.legendFilter` in en/pt/es, visible "Filtrar por:" label with hover transitions), and month X axes thin labels instead of overlapping. Showcase: coherent per-period datasets (7-day week ending on the 4th, full 30-day April), descriptive tooltip subtitles per index ("8 de abr. de 2026"), list mode totals follow legend filters with a right-aligned Total header, and fullscreen is now a designed overlay dialog (shared chart template, backdrop/Esc/close, scroll lock) instead of a raw Fullscreen API zoom.
- d79ad3f: Charts round 4: richer motion and coherent mocks. `line-chart` draws each line from 0 to 100% (dashoffset) with a series-colored "pen" dot traveling the tip via `getPointAtLength`, staggered per series; on data changes the previous frame slides out to the right while the new one enters from the left behind it (snapshot overlay, sanitized and `aria-hidden`), with dots/areas fading in — all WAAPI with SSR, `prefers-reduced-motion` and missing-`animate` guards plus full cleanup on destroy/retrigger. X axis always renders the last label and thins long months. Showcase: coherent datasets (7-day week ending on the 4th, full 30-day April with per-day subtitles), natural consumer-owned period labels ("1 dia", "7 dias", "1 mês"…) via `availablePeriods`, and fluid list rows (fade enter, fade-out before removal, timer cleanup).
- d79ad3f: Charts round 5 (bugfixes + choreography): `line-chart` transition is now sequential — the previous frame slides out to the right first and the new one enters from the left behind it (~60ms overlap), instead of coexisting; dashes are applied synchronously to avoid a full-stroke flash. `line-chart` no longer shows dots/areas before their line is drawn — rows start hidden and each series reveals its dots (fade) and area (slide-down + fade) when its line finishes drawing, with immediate reveal fallbacks and full reset on cancel/destroy; the slide-out snapshot is sanitized (no tabindex, pens, or partial dash) with a removal safety timer; the X axis always renders the last label. Showcase: fixed the untranslated `periodLabelAll` key, natural period labels via `availablePeriods`, and fluid list rows (fade-out before removal, fade-in on return, timer cleanup).
- d79ad3f: Improve `solaris-chart-shell` hero (phase H2 follow-up): label now renders above the value (Image-2 style) and an optional consumer-owned `heroDelta` with `heroDeltaDirection: 'up' | 'down' | 'flat'` renders a semantic badge with a caret icon and translated trend `aria-label`. Also fixes component styles to `:host` so CSS variables apply, and wraps the topbar on narrow widths.
- 1a42c00: Add `solaris-chart-shell` (`data-display/charts`, phase H1): generic card wrapper with title, hero KPI, interval label, view switcher (line/bar/pie select), period segmented filter, loading/empty/error states, clickable legend with `aria-pressed`, and an actions menu emitting `actionRequest`. Two-way `view`/`period` models; emits `seriesToggle`/`retry`. The shell never fetches and never mutates the consumer `series`. Follow-ups: H2 line+sparkline.
- 3cfa514: V2-C (charts design system): real `size` (`sm/md/lg`) and `density` (`compact/normal/comfortable`) effects in all chart SCSS (`chart-shell`, `line`, `bar`, `pie`, `heatmap`, `radar`, `sparkline`) with `md`/`normal` pixel-identical to the previous rendering; `solaris-sparkline` gains `appearance="card"` (KPI trio `title`/`value`/`delta` + badge over `solaris-card`, badge color from `deltaDirection` crossed with `positiveIsGood`; card host sizes to content instead of the fixed 96px); chart palette maps `warning` to `var(--solaris-warning-foreground)` so series strokes keep 3:1 contrast on the light theme (solid `#f1d008` was 1.53:1 on white). Stories `SizeDensity` for every chart plus sparkline `Card`; showcases `charts/{shell,line-chart,bar-chart,pie-chart,heatmap,radar,sparkline}/` each gain a `Size and density` section (live size×density tabs + computed `preview-code`, icon-button/line-chart pattern; `sizes`/`density`/notes in en-US/pt-BR/es-419); sparkline page additionally gains the `Card` section (2-card grid) after the KPIs cleanup.
- 095622e: V2-D (chart motion): `line-chart` dataset transitions run as a deterministic `idle → exiting → rescaling → entering → idle` sequence over staged series and axes, so the incoming dataset never leaks into the view early and old/new curves never overlap or blank the canvas: EXIT erases each line with a pen stroke while dots/areas fade in reverse order, RESCALE swaps the staged data with axes faded out/in while the series stay hidden, ENTER redraws each line with the pen dot riding `getPointAtLength` and per-dot reveals tracking the tip instead of flashing early; rapid changes coalesce to the latest pending dataset, tooltips and the selection guide stay disabled until `idle`, and `prefers-reduced-motion` applies the new data synchronously without animation. Transition choreography constants, the dot view and the instance counter live in the new `line-chart/model/line-chart.utils.ts` (realm-robust snapshot capture; `gradientPrefix` without assignment-in-expression). Showcase `chart-shell` list rows animate in two phases inside a single `motion-duration-normal` token window (content `opacity`+`translateX(-8px)` then `scaleY` collapse, `transform`-only; enter mirrored; removal timer aligned to 300ms). Timeline ↔ list display switches fade in with `translateY(8px)` plus a short shimmer sweep masking the reflow — pure CSS on the freshly inserted `@if` nodes, zero TS. SSR-safe (platform/matchMedia/animate guards) with full cancel and cleanup on destroy/retrigger, doubled reduced-motion guard (media + `data-reduced-motion`).
- 009760a: V2-E (chart fullscreen + combos + cards): `SolarisChartView` now accepts opt-in N1 `heatmap`/`radar` values (`isChartView`, `SHELL_VIEW_LABEL_KEYS`, `solaris.chart.viewHeatmap/viewRadar` in en-US/pt-BR/es-419 with fallbacks; defaults stay `line|bar|pie`) and the shell showcase documents them in a new combos section projecting `solaris-heatmap`/`solaris-radar` through the shell `<ng-content />` slot from the same series. Fullscreen leaves the artisanal showcase overlay: `actionRequest === 'fullscreen'` now opens `SolarisDialogService.openComponent()` with an `xl` panel (`min(1120px, 100%)`), `~60vh` canvas via the new `--solaris-chart-shell-fullscreen-height` token, extended descriptions and a visible totals table; focus trap, `aria-modal`, Esc/backdrop close and restore-focus come from the dialog, with ink-safe print rules. New `charts/cards` showcase page documents the free chart-card pattern (plain `solaris-card` slots, no new wrapper) with three Sales Report recipes (Revenue KPI + sparkline, Sales by channel + bar + table, Monthly target + line + reference line), wired into routes, sidebar, translations and the sparkline/code-block prev/next chain.
- 0635780: Recalibrate `solaris-checkbox` label typography one step down across the 3x3 `size` x `density` matrix (`sm` now `xs`, `md` now `sm`, `lg` now `md`, default now `sm`) with matching line-heights. Make label and description text selectable (`user-select: text`, control box keeps `user-select: none`) so the text can be copied. Default label color is now muted (`--solaris-neutral-text-secondary`) and returns to the current text color (`inherit`) on hover or when `data-checked`/`data-indeterminate`, with a `color` transition on `--solaris-motion-duration-normal`.
- bd67c20: Recalibrate `solaris-checkbox` sizes on the new spacing scale (the previous box had shrunk to ~6-12px): explicit 3x3 `size` x `density` matrix for box/checkmark geometry (box 16px on `compact-sm` up to 24px on `comfortable-lg`, checkmark follows size only, label gap now density-owned, label line-height stays per size, checkmark 8px/12px/16px per size). The default `color` is now `neutral` instead of `primary`. `size` is now optional with an `effectiveSize` fallback chain (own input, `solaris-checkbox-group`, `'md'`) and `density` also inherits from the group, exposed through the new `SOLARIS_CHECKBOX_GROUP` token; the group label renders a `*` required marker, and the group list gap follows the recalibrated radio-group scale (6px `compact`, 8px `normal`, 12px `comfortable`) while grid row/column gaps stay tight (2px/4px/6px). Standalone checkboxes render the same `*` marker next to the label and expose `aria-required` on the native input. `solaris-selection-card` gains an explicit `md` size block plus `density` blocks (`gap` + `padding` from density, indicator/dot/media/switch from size), the radio indicator grows to 16-24px, and the internal switch is recalibrated to the P1 `solaris-switch` scale; cards also inherit `size`/`density` from an enclosing `solaris-radio-group` (`SOLARIS_RADIO_GROUP`, with `SOLARIS_RADIO_GROUP_NAME` still providing the native name) and expose `aria-required`. All `var()` fallbacks are removed from checkbox styles. The three showcase pages are rebuilt on the docs-page-layout pattern (checkbox: preview-code per example, tabs for appearance/color/radius, interactive size-density selectors, indeterminate and form demos; checkbox-group: basic/select-all examples, interactive size-density, layout tabs, states, min/max validation, form integration; selection-card: basic/cards-grid examples, interactive size-density, radio/switch mode tabs, media layouts, states, radio-group integration; simple installation, props placeholder, full i18n). Follow-ups: `checkbox-cards grid` points to `selection-card`, group keyboard roving refinement.
- 27966bd: Add `clipboard` icon to the `documents` group.
- 2261cbd: Add `SolarisCodeBlockComponent` (`solaris-code-block`) in `data-display` with block/inline layouts, code/command variants, surface/outline appearances, copy-to-clipboard, expand/collapse, and fallback regex highlighting behind the `SOLARIS_CODE_HIGHLIGHTER` adapter plus an optional lazy Shiki provider (`provideSolarisShikiHighlighter`, `shiki` optional peer). Also adds the `languages` built-in icon group (typescript, javascript, html, scss, json, shell/bash/cli, powershell, java, angular) used for the code identity.
- 2261cbd: Add editable mode to `SolarisCodeBlockComponent` (`solaris-code-block`, block layout only). With `[editable]="true"`, an edit icon-button appears next to copy; while editing it morphs into a save button emitting `codeChange` (plus `editingChange` for enter/leave), with a cancel button, `Escape` to discard, and `Ctrl`/`Cmd`+`Enter` to save. New inputs: `editable`, `editLabel`/`editLabelKey`, `saveLabel`/`saveLabelKey`, `cancelLabel`/`cancelLabelKey`.
- 34365c6: Refactor collapsible and accordion with the size x density matrix.

  **Collapsible**
  - New `density` input (`compact | normal | comfortable | undefined`, default `undefined`): standalone it falls back to the theme density; inside an accordion the container `density` always wins, matching `size` and `appearance`.
  - Full 3x3 `size x density` matrix: `size` selects the label/icon/padding step (sm: 16px label + 18px chevron, md: 18px + 20px, lg: 20px + 24px, all from `--solaris-font-size-*`), the effective density resolves the padding/gap tier (`--solaris-density-padding-*` / `--solaris-density-gap-*`), and the trigger `min-height` always equals its `--solaris-control-height-<density>-<size>` ladder token (28-52px). This fixes the disproportionate chevron left behind by the spacing rescale (the icon was pinned to `--solaris-spacing-4`, now 6px).
  - Host now exposes effective `data-size` + `data-density`, with normal-density fallbacks while density resolves.

  **Accordion**
  - New `density` input (same contract, theme fallback) exposed as `data-density`; the section gap now follows the density gap tier instead of a raw spacing token.
  - Container `size`/`density` propagate to every item and win over per-item inputs, so all sections share the same geometry; `SOLARIS_ACCORDION` exposes `effectiveDensity` for controlled items.

  The showcase gains docs-page layouts for both with interactive appearance and size x density sections, mirrored `en-US`/`pt-BR` strings.

  Panel collapse uses `minmax(0, 0fr)`/`minmax(0, 1fr)`: bare `0fr` does not
  collapse the track in Chromium (it resolves to the content height, leaking
  8px of panel padding into the closed card), while the `minmax` clamp truly
  reaches zero with the expand animation preserved.

  Removed the legacy `--solaris-collapsible-header-inset-top` top margin on the
  boxed header: with the trigger geometry now owned by the matrix it only broke
  the card's vertical symmetry (4px top, 0 bottom). The closed card is now
  symmetric (trigger + 1px borders each side).

  Fixed collapsed-panel content leak (calendar shell "Opções de exibição"):
  the zero track left `panel-inner` with an 8px border box (`content-box`
  padding-bottom), leaking the first checkbox sliver over the following
  content. `padding-bottom` is now 0 while collapsed and resolves to the
  density tier only when open (animated with the same motion tokens).

  Build note: the collapsible 3x3 matrix adds ~6kB of raw CSS to the global
  stylesheet, pushing the showcase `initial` bundle 2.37kB over the previous
  2.95mb error budget, so `maximumError` moves 2.95mb to 3mb (warning stays at
  2.5mb) — same practice as the earlier sustainable-headroom raises.

- 580fc30: Add `showAddAction` to `solaris-collapsible`: an add button before the chevron that opens `SolarisCollapsibleAddDialogComponent` (required title, required description, icon select with a `None` option) and emits `addSubmitted` with `{ label, description, leadingIcon }`.

  Add `solaris-collapsible-input`: an interactive last row for `solaris-accordion` (FAQ-style). It freezes the submitted question as its label, receives `[loading]` from the consumer, announces the loading status via `aria-live`, emits `submitted`/`cancelled`, and renders the projected answer in its expansion like a regular section.

- f5bc825: Add `leadingIcon` (`leadingIconDecorative`) to `solaris-collapsible` (also usable as accordion section). The icon renders inside the trigger label container, glued to the label text, before the expand chevron.
- 97bff82: `openComponent` now supports dialog chrome: `SolarisDialogComponentConfig` accepts `title`/`titleKey`, `description`/`descriptionKey`, `icon`/`iconDecorative`, `variant`, `actions` (+ `actionsAlign`/`actionsStack`/`actionsShape`/`actionsDensity`/`actionsRadius`) and ARIA fields (`ariaLabel`/`ariaLabelKey`/`ariaLabelledBy`/`ariaDescribedBy`). The container renders `solaris-dialog-header` and `solaris-dialog-actions` around the custom component with the header/footer separators and translated labels. Also adds `solaris-dialog-footer` (generic `ng-content` footer) and the `solaris-dialog-close` directive for closing with a result from a template.
- 95d28ca: Dialog header is now sticky with an in-flow close button: `solaris-dialog-header` accepts `closeable`/`closeLabel` and renders the `[data-dialog-close]` button vertically centered with the icon and title on the same row (description stays below the title), replacing the absolutely-positioned button that floated over scrolled content. The header sticks to the top with the panel background and gains an elevation shadow (`--solaris-dialog-header-scrolled-shadow`, `data-scrolled`) while the body scrolls; the scroll state is wired automatically in managed dialogs and self-detected from the closest scrollable ancestor in manual composition. `solaris-dialog-container` keeps the floating close button only as a fallback for component dialogs without a header (suppressed when the content renders its own manual header, which previously hid the fallback behind the sticky header background).

  `solaris-dialog-footer` and `solaris-dialog-actions` are now sticky to the bottom with the panel background as well, so action bars stay pinned while the body scrolls in manual composition. Both gain an elevation shadow (`--solaris-dialog-footer-scrolled-shadow` / `--solaris-dialog-actions-scrolled-shadow`, `data-scrolled`) while there is still content below the fold, accept an optional `scrolled` input override, and self-detect scrolling — mirroring the header behavior.

- f64a18f: Stacked (nested) dialogs, edge-docked sheets and validated dialog flows.
  - Nested dialogs: `SolarisDialogService` tracks the stack (`topmostId`, `isTopmost(ref)`, `openCount`). Only the topmost dialog reacts to Escape; panels below get `aria-hidden="true"`. Each dialog keeps its own backdrop, so backdrop clicks stay scoped to the inner dialog. Keep nesting to one level.
  - Sheet: new `sheet` option (`SolarisDialogOptions`, `SolarisDialogComponentConfig`, global config) docks the panel to an edge `placement` (`top`/`bottom`/`left`/`right`) with full-edge span and radius only on the exposed side, reflected as `data-sheet`. Ignored for `center`, corners and `fullscreen`.
  - Dialog Flow: `next()`, `previous()` and `goTo(index)` on `SolarisDialogFlowComponent`, plus `[disabled]` on `solaris-dialog-step` (skipped by navigation, exposed as `data-disabled`). Docs cover form-validity gating and a router query-param sync recipe.
  - Hygiene: `effectiveDensity` computed (option wins, then theme density) on the container, content and actions; header ids via central `nextIdFor('solaris-dialog-header')`; `data-backdrop` kept as `"true"`/`"false"` (consumed by SCSS) and the `'Close'` last-resort label kept (icon-only close button requires an accessible name) — both evaluated and intentionally unchanged. `width` stays free-form by design (no `size` presets); glass appearance evaluated and rejected for dialog semantics. Follow-ups: drag/resize, swipe gestures.
  - Fix: the close `x` icon had no explicit size and rendered at ~8px — both the header in-flow close and the container fallback close now size their `svg` via the new `--solaris-dialog-close-icon-size` token (`--solaris-font-size-md`, same as alert). Root cause included the UA button padding (`1px 6px`) shrinking the centered icon flex item, so both close buttons also reset `padding` to `var(--solaris-spacing-0)`.

- 2bb3126: Add `variant` (`solid` | `dashed` | `dotted`, default `solid`) to `solaris-divider`, composing with `appearance` (weight/color) for both orientations, and `ariaLabel` / `ariaLabelKey` / `ariaLabelledby` for an accessible name on semantic separators without visible text. Also fixes labels rendering on `vertical` dividers (now ignored, as documented — label is horizontal-only), narrows `width` / `height` to `string | undefined` (default `undefined`), and removes the `solaris-divider-stack` host `class` binding (styling is `:host` + `data-*` only). The divider showcase is rewritten to the `preview-code` standard (`docs-page-layout` + `docs-section` + `solaris-tabs` variations, extracted `basic` / `with-label` / `vertical` / `in-dropdown` examples, simple installation block, `props` placeholder, 1:1 TOC, `en-US` + `pt-BR`). Follow-ups: `divider-stack` still has no dedicated showcase page; no `size` × `density` matrix (correctly out of scope — a 1px separator has no control-height contract).
- c11765c: `SolarisEditableTabsComponent`: icon tabs now swap the icon for the action trigger with the same cross-fade + scale pattern as `SolarisCodeBlockComponent` (`clipboard` ↔ `check`) instead of an instant `display` toggle, and tabs can be reordered by opt-in drag and drop via the new `[dragToReorder]` input (default `false`, requires `movable`). Drag and drop emits the same `tabMoveRequested`/`tabMove` events as the action-menu move, shows an orientation-aware drop indicator, and keeps the menu move as the keyboard-accessible fallback. When reorder is disabled, tabs render an explicit `draggable="false"` (no grab cursor, no drop indicator, dragstart cancelled), and `dragToReorder` coerces static attribute usage (`dragToReorder`) via `booleanAttribute`. The showcase page now follows the `tabs` docs pattern (`docs-page-layout` + `preview/code`).
- 3a788e4: Event editor second overhaul: item kinds, separate time zones, description/link, pipe-based i18n.

  BREAKING: `eventSave` now emits `SolarisCalendarEvent | SolarisCalendarTask` (tasks emit a task draft with `due`/`completed`); `SolarisEventVisibility` narrowed to `'public' | 'private'` (unset/legacy values hydrate as `public`); the component fallback text files are gone (see below).
  - Item kinds: a `solaris-segmented-control` (event/task/appointment schedule) on top. Tasks hide end dates, recurrence, reminders and visibility and emit `SolarisCalendarTask`; schedules persist `scheduleSlot: true` on the event. New `itemKindChange` output; `event` input and `SolarisEventEditorData.event` accept the union.
  - Time zones: the all-day row keeps only the change-zone button (current zone no longer displayed). The picker dialog body is now a searchable `solaris-select`. A new "separate start/end time zones" checkbox reveals two searchable zone selects with a swap action; new `timeZoneEnd` input + `timeZoneEndChange` output (input-mirroring). Draft/record conversions use the start zone for the start and the end zone for the end.
  - New `description` (textarea) and `meetingUrl` fields on `SolarisCalendarEvent` (plus `description` on `SolarisCalendarTask`), persisted in drafts.
  - `visibility` offers only public/private; `color` is now a select pairing the token swatch with the color name, sharing a row with visibility.
  - i18n: removed the custom `text()` method — templates use the `translate` pipe (params included), TS-side strings call the required `SolarisTranslateService` directly like every other component; the per-component fallback files were deleted (the service-level per-locale maps remain the single source).

- 3a788e4: Event editor overhaul: stacked time-zone picker, custom recurrence mode, framework radio-group, visibility and stacked reminders.
  - Time zone: the change button now sits beside the all-day checkbox and opens `SolarisEventEditorTimezoneDialogComponent` stacked above the editor (search + listbox, curated default catalog overridable via `timeZoneOptions`). `timeZoneChange` now emits the selected zone (`output<string>`, input-mirroring); consumers write it back to `timeZone`.
  - Recurrence: `Repete` gains a `Custom` (`editorFreqCustom`) option; `Repetir a cada` and `Termina` (plus the inner `editorCustomFreq` select) only appear in custom mode. Simple frequencies imply interval 1 / never ends; existing complex series hydrate into custom.
  - Delete scope now uses the framework `solaris-radio-group` + `solaris-radio` instead of native radios.
  - New `visibility` (`default|public|private`) select and stacked `reminders` (up to 5 × presets at-start/5/10/15/30min/1h/1day + `Custom…` minutes input, add/remove), both persisted on `SolarisCalendarEvent` (`visibility?`, `reminders?: SolarisEventReminder[]`).
  - i18n: `solaris-translate-defaults.ts` split into one file per locale (`model/i18n/solaris-translate.{en-US,pt-BR,es}.ts`, re-exported for compatibility) plus new `editorFreqCustom`, `editorVisibility*`, `editorReminder*` and `editorTimezone*` keys in en-US/pt-BR/es.

- 35174f7: Add the agnostic export infrastructure: `SolarisExportService` (`exportAndDownload`, `downloadFile`, `maxRows` truncation with `SOLARIS_EXPORT_CONFIG`), the `SolarisExporter` plugin contract, built-in `createCsvExporter` (RFC 4180, BOM, `delimiter: ','` default with `SOLARIS_CSV_DELIMITER_PRESETS.semicolon` for Excel PT-BR) and `createJsonExporter`, plus `provideSolarisExport([...])` registration. New formats ship as new exporters with no consumer changes.
- 966cf0a: Redesign `variant="avatar"` of `solaris-file-upload` as a full-width dashed photo panel (2x the form-field control height, 1.5x preview circle): `user` placeholder with `camera` badge, photo headline/link (`avatarHeadline` / `avatarBrowse`, `solaris.file-upload.avatar.drop` / `.browse`), and a supports hint from `accept` + `maxSize` (`solaris.file-upload.avatar.supports`, `solaris.file-upload.avatar.images` for `image/*`). The file list stays hidden for `avatar` since the preview circle carries the single-file state. The component stays dialog-free: wire `filesChange` to `SolarisImageEditorComponent` in a dialog (`1:1`, `circle`) and `writeValue([edited])`, as shown in the new showcase avatar example (success toast without byte count). The showcase variant previews follow the shared size/density controls.
- 966cf0a: Add `dropActiveLabel` / `dropActiveLabelKey` to `solaris-file-upload`: while `dragOver()` the dropzone headline swaps to `solaris.file-upload.drop-active` (`Drop files here` / `Solte o arquivo aqui`) and hint/browse are hidden. Customizable per instance like `dropzoneLabel`.
- 966cf0a: Stabilize the `solaris-file-upload` dropzone panel and drive it from the `size` x `density` matrix (same pattern as Form Field): new `--solaris-file-upload-dropzone-min-height` (144–208px across the 9 combinations, always fitting the full idle content) and `--solaris-file-upload-dropzone-icon-size`, with padding and headline/hint/browse typography per combo. Fix the actual width shrink: the projected `.solaris-file-upload__body` is a flex item in the row-direction `solaris-form-field__control` slot, so its width resolved from content (235px idle → 138px dragging, measured in the showcase). It is now `width: 100%` with `min-width: 0` (same as `input`/`textarea` controls), and the host is `width: 100%` as well.
- 966cf0a: Add `variant="field"` to `solaris-file-upload`: single-line full-width trigger at the form-field control height for dense forms, with drag-and-drop, `fieldLabel` / `fieldLabelKey` overrides (`solaris.file-upload.field`: `Drag or browse files` / `Arraste ou procure o arquivo`), and a showcase tab.
- 966cf0a: Add the file upload family: `solaris-file-upload` (dropzone/button/avatar variants with a borderless shell, drag and drop, accept/size/count validation, per-file list with progress, retry and remove, URL attach via a full field with divider and ghost action, automatic/manual upload modes, XHR upload handler via `SOLARIS_FILE_UPLOAD_HANDLER`), `solaris-file-list` / `solaris-file-list-item` (kind-aware icons tinted by status), and `solaris-image-editor` (dialog-ready canvas editor with translucent crop mask, circular mask, zoom slider, drag and keyboard pan, 90-degree rotation, PNG/JPEG export). Ships `solaris.file-upload.*` and `solaris.image-editor.*` translation keys (`en-US`/`pt-BR`), new `upload` and `minus` built-in icons, a `forms/file-upload` showcase page, and full specs with CDK harnesses.
- 695dfcf: Finish P4 B/C parity for dates, email, and phone: `clearable` + `clearLabel`/`clearLabelKey` + `cleared` on date-picker, date-range-picker, email-field, and phone-field (same `canClear` gate as selects: clearable, has value, not disabled/readonly). Dates gain `weekStartsOn` (default: locale first day, Sunday fallback), `disablePast`/`disableFuture`, `dateFormat` (`2-digit`/`numeric`), `prefix`/`suffix` icon inputs, and `Escape` semantics (dirty query resets to the committed value, pristine closes); select/multi-select gain a `suffix` icon input and OTP accepts suffix-action projection. Follow-ups: roving `ArrowUp`/`ArrowDown`/`Home`/`End` in the calendar grid and a configurable email `mask` (documented as v1 limitations).
- 63e16a8: Verify the standalone `solaris-input` 3x3 `size` x `density` matrix against the P0 foundation: Form Field owns the outer height (`min-height` from the 9 `--solaris-control-height-*` tokens) while the projected input delegates to it (`height: auto`, only density padding applies). `size` on `solaris-form-field` is now valid and covered by regression specs (9 matrix combinations on input, textarea, and form-field hosts, plus delegation: wrapper owns `data-size`/`data-density`, `data-control-type="textarea"` detection, projected controls keep their own defaults). Uniformize `solaris-textarea` delegation to match input (`height: auto`, `min-height: 0` inside Form Field, wrapper-owned minimum height via `form-field[data-control-type='textarea']`, `horizontal`/`both` resize on the wrapper). The form-field, input, and textarea showcase pages are rebuilt on the docs-page-layout pattern (preview-code per example, tabs for appearance/radius/types/resize, interactive size-density selectors, form integration, simple installation, props placeholder, full en-US + pt-BR i18n). Follow-ups: textarea `autoGrow` + `maxRows` (v2 or separate extension directive). Lotes B (selects/options) and C (email/password/phone/date/otp) stay for the next chats.
- 680ad9b: P4 Lote B: `solaris-select` and `solaris-multi-select` forward `loading` to the inner Form Field (overlay spinner, `aria-busy`, zero layout shift) and re-project `[solaris-form-suffix]` + `[solaris-form-suffix-action]` (action requires both attributes to cross `ngProjectAs`; presets bridge the variant through a single-hop `contentChild` into the new Form Field `hasSuffixAction` input, since content queries do not see transitively projected directives). `clearable` verified on both selects (already shipped, now covered by specs). `solaris-option`/`solaris-option-group` stay `control-height`-free (font/padding only, no `var()` fallbacks) with theme-density defaults and explicit-wins specs. Re-export the missing `*Size` aliases (`Select`, `MultiSelect`, `DatePicker`, `EmailField`, `PasswordField`, `PhoneField`, `OtpInput`). Rebuild the select, multi-select, and option showcases on the docs-page-layout pattern (option-group covered as a section of the option page), with mirrored en-US + pt-BR i18n. Follow-up: textarea `autoGrow` + `maxRows` stays docs-only.
- 680ad9b: P4 Lote C: `solaris-email-field`, `solaris-password-field`, `solaris-phone-field`, `solaris-date-picker`, and `solaris-date-range-picker` gain the `loading` input (overlay via the inner Form Field) and the suffix-action passthrough (both `[solaris-form-suffix]` + `[solaris-form-suffix-action]` attributes required). The password visibility toggle and both date calendar triggers are now suffix actions (no divider); the toggle icon follows a 9-combo `size` x `density` matrix (md row preserves the previous density-only scale). Close the unaudited date-range-picker P0 gap: new `size` input, `data-size`/`data-density` host attributes, typed `SolarisDateRangePickerDensity/Radius/Size` aliases, `[size]` repasse, and suffix/label-action slots. Explicit `size`/`density` on inner inputs still wins over inheritance everywhere. Rebuild the email, password, phone, date-picker (with a date-range section), and otp showcases with mirrored i18n; otp deliberately has no `loading`. Follow-up: textarea `autoGrow` + `maxRows` stays docs-only.
- 6a221d5: Standardize the fields radius family: every text-like field now defaults to `sm` (`solaris-form-field`, `solaris-input`, `solaris-textarea`, `solaris-email-field`, `solaris-password-field`, `solaris-phone-field`, `solaris-select`, `solaris-multi-select`, `solaris-date-picker`, `solaris-date-range-picker`, `solaris-otp-input`) and follows the fields radius scale (`md` maps to the 8px token, `lg` renders as a pill; global tokens untouched). Selects, dates, email, password and phone inherit the scale through the inner Form Field; OTP's previously dead `radius` input is now wired to the boxes. Also replaces all file-level `SECURITY_EXCEPTION_FILE` blankets in forms components with precise line-level justifications at the actual flagged uses (3 files had blankets with no matching pattern at all and were simply cleaned). Docs and Lote A showcases updated (radius notes carry the fields scale; new default-`sm` specs, including OTP host reflection).
- 6a221d5: Form-field follow-ups: (1) required indicator in P3 parity — `*` marker next to inline labels plus `required` propagation to the native control with native-attribute auto-detection (`required` input is now `boolean | undefined` for manual/auto parity with disabled/readonly); (2) character counter also resolves `Validators.maxLength` from live `NgControl` errors (appears once exceeded); (3) projected `solaris-input`/`solaris-textarea` inherit `size`/`density` from the enclosing field via the new `SOLARIS_FORM_FIELD` parent token (own input wins, standalone keeps defaults; Lote A delegation specs updated to the inheritance contract); (4) full logical-property pass on field styles (counter, affix padding, loading reserve, textarea delegation) so RTL mirrors correctly — high-contrast stays token-driven. Showcase gains the required demo; docs updated.
- 6a221d5: Redesign the `solaris-form-field` styling gate before P4 Lotes B/C, keeping the P0 contract (9 size x density matrix owning the wrapper `min-height`, delegated input/textarea height, `data-control-type`/`data-control-resize`) and the Lote A regression specs green. Affix cells are now true standardised squares (`--solaris-form-field-affix-size` from the matrix, decoupled from the row height so they stay square when the inner control overflows the wrapper, top-aligned for textarea) with a symmetric layout (prefix keeps its divider, suffix has none, `padding-right: 0` mirrors `padding-left: 0`); shared density values move to the `:host` base and the triple appearance block is collapsed. Focus now renders a real ring (primary, danger when invalid) instead of an invisible outline-only change, and textarea wrapper padding is symmetric. Projected-content rules move from `::ng-deep` to the global `form-field` stylesheet. New `loading` input renders a size-mapped spinner in the suffix slot (suppresses other suffix content, sets `aria-busy`), and the new `[solaris-form-suffix-action]` directive switches the suffix cell to a hug-content variant that sizes a nested `[solaris-button]` to fit (use with `[solaris-form-suffix]` when projecting through preset fields). Showcase gains suffix-action and loading sections with full en-US + pt-BR i18n. Also corrects the in-field input vertical rhythm: a projected `solaris-input` now renders with zero vertical padding inside the field so the wrapper owns the full height and the outer box matches the matrix token exactly (previously the input's own density padding forced the wrapper taller than the token, e.g. `compact` + `sm`/`md` rendered 32.39px instead of 28/32px). Residual: with a `comfortable` theme density inside an `sm` + `compact` field the text line alone still exceeds the box and the wrapper grows gracefully. Fields also adopt their own radius scale (`md` maps to the 8px token, `lg` renders as a pill) so `sm` and `md` stay visually distinct; global radius tokens are untouched. Also replaces the 13 file-level `SECURITY_EXCEPTION_FILE` lines in the field component with 3 line-level justifications at the actual `.nativeElement` uses (host DOM queries are required to detect projected native controls; everything else never matched the security rules). Follow-ups: forward `loading`/suffix-action through preset fields (Lote C), same zero-padding treatment for `select` (Lote B), textarea `autoGrow` + `maxRows`.
- f4141a2: Align the default `radius` to `'md'` on every form-field consumer (`select` already defaulted to `'md'` since H1; now `multi-select`, `email-field`, `date-picker`, `date-range-picker`, `password-field`, `phone-field`, `file-upload`, `otp-input`, plus the `solaris-input` and `solaris-textarea` directives), matching the `solaris-form-field` default so the wrapper and its control render the same corners without an explicit input. Docs tables and default-radius specs updated; explicit `radius="sm"` keeps working unchanged. `checkbox` keeps its own box radius (not a form-field consumer).
- 695dfcf: Align field radius to the global scale and add `xl` pill (D2): `SolarisFormFieldRadius` (and input, textarea, select, multi-select, date-picker, date-range, email, password, phone, otp aliases) is now `none`/`sm`/`md`/`lg`/`xl` where `md` maps to 4px, `lg` to 8px, and `xl` renders as a pill; checkbox accepts `xl` with `full` kept as an alias. Previous `lg` pill users should move to `xl` (minor visual breaking change for `md`/`lg` consumers). Parity: standalone input/textarea focus rings use `--focus-ring-width`, appearances mirror Form Field, Switch exposes `aria-checked` (`mixed` when indeterminate), checkbox-group inner keeps a single `role=group`, groups gain `cvaReadonly`, email/phone/password extend `SolarisFormControl` with `[control]` forwarding, phone counter uses `effectiveMaxLength`, password `fullWidth` is honored, and OTP gains `loading` plus density-based gap.
- a9d44b1: P0 forms foundation: add `size` (`sm` | `md` | `lg`, default `md`) to `solaris-form-field` and every wrapper (`solaris-select`, `solaris-multi-select`, `solaris-email-field`, `solaris-password-field`, `solaris-phone-field`, `solaris-date-picker`, `solaris-otp-input`), combining with `density` into the 3x3 `size` x `density` matrix from `--solaris-control-height-*` (outer height now equals the token of its own combination instead of `spacing-10`/`density-min-height`). Form Field is the single owner of `min-height`; wrappers forward `size` + `effectiveDensity` (never raw `density`) to the inner field and inner `solaris-input` — fixing `email/password/phone/otp` passing raw `density` and `date-picker` not passing density to its inner input at all. `email-field` gains `effectiveDensity` with `ThemeService` fallback like the other wrappers. Hosts expose `data-size` + `data-density` (effective) per the tabs/segmented-control contract. `otp` boxes derive from the combination token (0.9x width, 1.15x height) instead of `density-min-height`. Adds `styles/token/sizing/_control-matrix.scss` (`solaris-control-matrix` mixin generating the 9 explicit blocks) forwarded from `sizing/_index.scss` for P1-P4 consumers. Follow-ups: P1 switch, P2 radio, P3 checkbox family, P4 fields showcase rebuilds on the docs-page-layout pattern.
- 695dfcf: Scale form typography by `size` x `density` (D1): Form Field label, hint, error, optional, and counter now resolve in 9 explicit `[data-size][data-density]` blocks (sm/xs, md/sm, lg/md with comfortable +1 notch, capped at md), all with tokenized `line-height` and a single `message-row` margin. Checkbox and Switch gain `description` + `descriptionKey` inputs (radio parity, muted `xs`/`sm` by size); radio label `line-height` follows size instead of a fixed `none`; Date Range trigger and phone country blocks move to the 9-block matrix; standalone textarea `min-height` follows the control-height ladder per combination. Follow-ups: roving keyboard in the calendar grid (docs-only), email `mask` prop.
- 23df862: feature(gradebook): add institution-agnostic configuration

  Add row-wise computed result columns (`computed: { from, by, weights? }` +
  `scoresOf`, read-only, sortable, footer-aware) so schools declare the result
  rule instead of typing it. Add scale bands (`scaleDef.bands`,
  `passingScore`, `resolveGradeBand`, `isPassingGrade`, per-column `band`) and
  configurable rounding (`rounding` input with `half-up` / `half-even` / `up` /
  `down`). Document the minimal-friction onboarding (row shape, assignments,
  result rule, scale, rounding, statuses) and specify the audit-trail and
  draft-vs-published contracts without implementing them.

- 23df862: feature(gradebook): add per-cell `editableOf` permission

  Add `editableOf: ((row, assignmentId) => boolean) | undefined` to `solaris-gradebook`. Returning `false` locks the cell to view-only (formatted text, no input, no `gradeCommit`), composing with the existing `readonly`/`disabled` and `excused` guards. Consumers can bind it to role checks (e.g. viewer vs editor) without forking the editor template.

- 23df862: feature(data-display): add gradebook component

  Add `solaris-gradebook`, a grade-matrix component composing `solaris-table`
  without copying its types, state, tokens, or density. It ships score-10,
  score-100, concept, and custom scales, per-cell status (`missing`, `late`,
  `excused`, `graded`), grouped semester headers, footer totals, a `SITUAÇÃO`
  badge cell, identity column with sticky first column, grid appearance by
  default, inline grade editing with `gradeCommit`, and server data sources.

- 23df862: feature(gradebook): add sticky last column, aggregates, bulk editing and status dots

  Add `stickyLastColumn` to `solaris-table` and `solaris-gradebook` so result
  columns stay visible in wide matrices. Add optional per-column `aggregate`
  (`average`, `sum`, `min`, `max`, `median`, `weighted`) with `aggregateGradeValues`
  helpers; explicit `footerValueOf` still wins. Add `bulkEnabled` with
  `gradeBulkCommit`, `enablePaste` with TSV paste (`gradePasteError`), clamped
  editor parsing, subtle `missing`/`late`/`excused` cell dots with screen-reader
  labels, `withMaxColumns` helper, and a single-source grid divider fix for
  grouped headers so inter-group borders keep the subtle pattern.

- 72864d3: Add `pressed` toggle state to `solaris-icon-button` (same contract as `solaris-button`: `pressed="true"` sets `data-pressed` with the active-background treatment and `aria-pressed="true"`, unset renders no `aria-pressed`). Also add the `contrast` icon to the built-in theme set.
- 1c33d07: Rework `SolarisIconComponent`: new `variant` (`outline`/`solid`/`duotone`), `size`, `strokeWidth` and `absoluteStrokeWidth` inputs with global `SOLARIS_ICONS_CONFIG` defaults, `decorative` now defaults to `true`, and rounded-square knockout/duotone fallbacks for icons without dedicated solid art (`isFallback()`).
- e777683: Add icon variant foundation: `SolarisIconVariant` (`outline`/`solid`/`duotone`), `SolarisIconMetadata` with keywords support, SSR-safe `sanitizeIconSvgInner` allowlist for icon SVG content, and global `SOLARIS_ICONS_CONFIG` defaults (`defaultVariant`, `defaultStrokeWidth`, `defaultSize`).
- afc773b: Remove legacy `groups/*.ts` icon sources and generate `SOLARIS_BUILT_IN_ICONS` from `tools/icons` SVG source via `pnpm icons:build` (`solaris-icons-generated.ts`). Remove `SOLARIS_OUTLINE_SVG` public export to keep showcase budget; outline markup is served from the registry via `iconElementsToInner`. Add 48 dedicated solid and 57 dedicated duotone artworks (60 solid / 65 duotone validated with fillable derivation), with `rss` duotone and mail/message/user/server families covered.
- 99c9a33: Refine icon variants without background squares for detail icons: dedicated solid/duotone interior art for mic, notification, monitor, maximize, share, route, pull-request, settings, command, contrast, crown, leaf, wallet, key, graduation-cap, mouse-pointer-click and link families. Fix key outline detection (mixed fill/stroke) and video solid. Keep outer stroke in solid, shrink fallback radius, and render loader/dot/slash/ellipsis outline-only. Remove showcase Adaptado badge.

  Overview batch: eye/eye-off, file/file-text/files, filter, gear, layers, columns with interior art (pupil, document bodies with fold cutout, funnel fill, gear ring with hub hole, top diamond, grid cells). Contrast duotone hollow now fully painted (r=61.44). Batch 3: folder, star, sun, moon filled; check, plus, x as stroke-only without square. Batch 4: arrows/carets/sort/expand/move/log-in/out without square; trash/home/save/download/upload/share-2/unlock like file with mask; check-check/star-plus/sparkles/trophy partial fill; headphones solid fixed to phones-only plus headphones-off.

  Fix batch: chevron-first/forward/backward/last aligned to stroke-only (no square); check/check-check reverted to standard square fallback; grip-vertical added to no-mod; showcase budget raised to 4mb.

  Fix batch 2: regenerated arrow/refresh/chart/rss solids (unclosed-tag bug fixed); key solid masks dot hollow + duotone dot stroked; grid=columns; hash/handshake/clock no-square; issue/edit/image/eject/cookie/calendar/clipboard/city/backpack/blocks interior art; check/check-check back to standard square; grip-vertical no-mod; budget 4mb.

  Batch final (40 restantes de uma vez): badge, book, book-user, calendar-sync, code, code-xml, copy, export, globe, globe-off, list, list-ordered, notebook-pen, notebook-text, notepad, open-folder, package, panel-right, plane, podium, receipt, rocket, security, shopping-bag/basket/cart, signature, square-plus/stack, squared-text, sticky-note, storage, table, timer, truck, wrench. Mantidos: check/check-check no quadrado, bookmark/contrast auto, marcas e no-mod.

- 43ed93e: Expose the icon metadata public API: `SOLARIS_ICONS_METADATA`, `SOLARIS_OUTLINE_SVG`, `SOLARIS_SOLID_SVG`, `SOLARIS_DUOTONE_SVG`, `sanitizeIconSvgInner`, `isSafeIconSvgInner`, `iconElementsToInner` and the `SolarisIconVariant`/`SolarisIconClass`/`SolarisIconMetadata` types.
- f4c835f: Add `tools/icons` SVG source of truth: 209 outline SVGs migrated from TS definitions plus per-icon metadata (categories, keywords, class), with `pnpm icons:build` validating, sanitizing and generating `SOLARIS_ICONS_METADATA` and outline SVG maps.
- 664c3de: Add dedicated solid and duotone art derivation for `fillable` icons (15 icons, auto-derived by `pnpm icons:build` with hand-drawn `src/solid|duotone` overrides supported), curated PT/EN keywords for 207 icons with name-token fallback so every icon is searchable, and `SOLARIS_SOLID_SVG`/`SOLARIS_DUOTONE_SVG` maps consumed by the icon component.
- 966cf0a: Refine `solaris-image-editor` toward the reference layout: softer translucent crop mask with no separator border and rule-of-thirds framing guides while dragging, discreet zoom/rotate/reset controls overlaid at the bottom of the photo (compact slider, single-arrow `rotate-ccw` action icon for rotation, text-only reset, drag-to-reposition hint), and fixed `aspect`/`shape` driven only by inputs or dialog data (toolbar pickers removed, `aspects` kept as a deprecated alias). The stage now fits the photo aspect (560×380 max, 320×240 floor, refit on rotation) so dialogs opened with `width: 'fit-content'` hug the image with no side gutters, and the scroll wheel zooms over the photo. Adds the `rotate-ccw` built-in icon and the `solaris.image-editor.reset` / `solaris.image-editor.drag-to-reposition` translation keys (`en-US`/`pt-BR`).
- 2a631a1: Add `markdown` icon to the languages group. It uses `currentColor` fill so it inherits the surrounding text color, like the other language icons.
- 0d6aad2: Full keyboard support for `solaris-mega-menu` triggers: `ArrowLeft`/`ArrowRight` move focus between sibling triggers within the nav or group (RTL-aware, flipping under `[dir="rtl"]`), `Home`/`End` jump to the first/last trigger, and focusing a trigger opens its panel through the existing keyboard focus path. `ArrowDown` now opens the panel and moves focus to its first link or button via the new `focusFirstPanelItem()` control API (also added to `SOLARIS_MEGA_MENU`). Docs gain `When to use / not to use` and `Limitations (v1)` sections (no size/density by design, no nesting or lazy panels, no mobile drawer fallback, panel semantics come from projected content). The showcase page is rebuilt on the docs-page-layout pattern (preview-code per example, tabs for appearance and panel width, extracted basic/behavior/controlled/keyboard examples, responsive guidance section, simple installation, props placeholder, full i18n). Follow-ups: nested or lazy panels, mobile drawer fallback, focus trap option for modal-like panels.
- cd37c58: Add institutional motion language (Phase 0 + Phase 1). New `--solaris-motion-duration-exit` and `--solaris-motion-translate-sm` tokens, shared `solaris-motion-*` keyframes emitted by `core()` with opt-in mixins (`styles/motion`), `slowest` covered by reduced-motion, and stylelint banning `transition: all` (existing usages made explicit). Overlays now animate enter and exit (`data-closing`, state/outputs stay synchronous, only CDK detach delayed 210ms = 150ms animation + 60ms buffer): popover, dropdown-menu (+submenu), tooltip, dialog (panel + backdrop + placement/sheet/fullscreen variants), mega-menu; select, multi-select, date-picker and date-range-picker share the 4px enter. Full `prefers-reduced-motion` + `data-reduced-motion` coverage. See `docs/standards/motion-standard.md`.

  Phase 2 (expand/collapse): shared `solaris-motion-expand-*`/`solaris-motion-chevron*` mixins documenting the collapsible pattern (grid 0fr→1fr + inner opacity + chevron 180°); content fade added to collapsible/collapsible-input (accordion inherits) and table detail-row; table-toolbar chips reuse the shared overlay keyframe and code-block fade reuses the shared backdrop keyframe (local per-component keyframes removed); reduced-motion mirrors completed. Code-block `command` variant replays a fast fade on the incoming content when switching commands (skipped under reduced motion). `preview-code` tab switches glide the frame height with the incoming bordered box growing in parallel (no opacity — border stays complete); uncontrolled mode, instant swap under reduced motion.

  Phase 3 (micro-interactions): new `solaris-motion-pop-in` keyframe plus `solaris-motion-press`/`solaris-motion-press-active`/`solaris-motion-pop-in` mixins; press scale (0.99, `fast`) on `solaris-button`/`solaris-icon-button` `:active` (reduced-motion guarded; chromeless icon-button treatment unchanged); check pop on the incoming checkbox icon and radio dot (nodes inserted by `@if`, zero TS); tab panels reuse the shared backdrop fade with local directional slides aligned to `both` + `decelerate` + 4px; alert enter via the shared overlay keyframe (enter-only, dismissal is consumer-owned `*ngIf`). See `docs/standards/motion-standard.md` (Micro-interactions).

  Follow-ups (reduced-motion completeness + toast enter): `segmented-control` indicator gains the `:host-context([data-reduced-motion])` mirror; checkbox/radio reduced-motion guards now cover the pre-existing control/label transitions as well as the pop animation; toast enter aligned to `decelerate` + `both` with `animation` + `transition` guards under the standard unqualified mirror (enter-only by design — `dismiss()` stays synchronous, no `data-closing` exit).

- 60f42b3: Refactor `solaris-option` onto the size x density standard (tabs/segmented-control pattern). `solaris-option` no longer takes `size`/`density` inputs: it inherits both from the closest parent (`solaris-select`, `solaris-multi-select`, `solaris-option-group`) via the new `SOLARIS_OPTION_PARENT` token, falling back to `md` and the theme density standalone. `solaris-option-group` keeps optional `size`/`density` inputs and forwards the outer selector values (skipSelf) when unset; `solaris-select` and `solaris-multi-select` now provide the token. Stylesheets carry the 9 explicit `[data-size][data-density]` combinations (option rows keep the `sm -> sm`, `md -> md`, `lg -> lg` type scale and own spacing scale with no control-height ladder; group label keeps `sm -> xs`, `md -> sm`, `lg -> md` with monotonic gaps), icons size via `1em` with `font-size` on the wrapper, and the option showcase size-density demo now drives an `option-group` to prove inheritance. Follow-ups: `comfortable` minima (`32/40/48px`) and group gap monotonicity (`0/1/2px`) intentionally change a few rows by 1-16px vs the legacy overrides.
- 99aea20: Add standalone `solaris-pagination` with first/previous/next/last controls, page size via reused `solaris-select`, known and unknown (`hasMore`) totals with full and compact range labels, clamped page index with reset to zero on page-size change, inherited density, and full `xxx/xxxKey` i18n pairs. Follow-ups: gradebook integration, persisted page state, and advanced toolbar/search filters (separate components).
- 1cf99f6: Refactor `solaris-pagination` and add an optional `solaris-table` footer slot. Pagination now ships `solaris.navigation.pagination.*` translations for `en-US` and `pt-BR` (including `Linhas por página`, `1–10 de 95`), renders the item-window range (`{{start}}–{{end}} of {{total}}`) instead of `Page x of y`, and accepts an optional `description`/`descriptionKey` leading text (when set, page-size + range + controls group on the right). Navigation buttons lose the boxed chrome (borderless, larger icons, color-only hover, focus ring kept). The page-size selector uses the new borderless `minimal` select/form-field appearance (`value` input is now honored, so the current page size displays; the bordered `surface` panel opens with a fade-in). `solaris-table` gains an optional `ng-template[solaris-table-footer]` rendered inside the frame below the viewport (nothing renders when absent), so pagination can share the table border; the `with-pagination` showcase example now projects pagination into the footer. Also migrates every raw `px` and bare `0` in the table, pagination, and select styles (plus the table selection-column width) to `--solaris-spacing-*` tokens with identical computed values; only the 720px responsive breakpoint keeps `px`. The page-size selector now uses `size="sm"` with an `xs` value in the label color, and exposes new `--solaris-select-*` hooks (trigger gap, chevron size, value min-width with tabular numerals, reserving room for 3 digits in pagination). On narrow viewports (`max-width: 720px`) pagination hides the page-size label and switches the selector to the `outline` appearance.
- c976f7a: Phase 4 ERP fit (data-display print baseline + consumer guidance): table, gradebook, record-grid, and card gain `@media print` rules (ink-safe paper/ink, scrollers expanded, sticky reset to static, pagination/draft/action chrome hidden) with `SOLARIS_TOKEN_EXCEPTION(print)` traces. Record-grid cells expose truncated text via `title` (mirroring the table; omitted for empty cells) with a regression spec. Component docs gain an "ERP operations" section each (empty/loading/error states, bulk actions, keyboard-first flows, 1000+ row paginate-not-render guidance, audit-trail hooks with ids-only/no-PII rule, pt-BR/es text-growth wrap guidance, print-from-source-rows guidance). No business logic added to the lib; no public API changed.
- 13f49a0: Popover: zero-spacing container by default (`solarisPopoverPadding` now defaults to `'none'`, like Card and Dialog), new `solarisPopoverMaxHeight` input (number treated as px, panel scrolls via `data-scrollable` instead of overflowing the viewport), and appearance alignment (removed unreachable `'filled'` option, explicit `surface` block, variant state moved to `solaris-popover-panel` host attributes). Internal consumers (Select, Multi-select, Datepicker, Date-range-picker, Phone-field) already pass explicit padding and are unaffected. Follow-ups: arrow/beak, modal focus trap, open/close animation, ARIA presets.
- 22ff327: Add SolarisPreviewCodeComponent with preview/code tabs, multi-file support, and showcase page.
- 1ecaeea: Recalibrate `solaris-radio` sizes on the new spacing scale (the previous control had shrunk to ~6-12px): explicit 3x3 `size` x `density` matrix for control/dot geometry (control 16px on `compact-sm` up to 24px on `comfortable-lg`, dot follows size only, label gap now density-owned, ring width fixed at the border token, label line-height fixed at `--solaris-line-height-none` so the `--solaris-radio-label-line-height` token is gone). Add `description` (`descriptionKey`) secondary text under the label referenced via `aria-describedby`, and `labelPosition` (`'start' | 'end'`, default `'end'`) mirroring the label row. Inside a group, unselected options render faded (label in `--solaris-text-muted`, control at `--solaris-radio-unselected-opacity`) so the current choice stands out, and the default `color` is now `neutral` instead of `primary`. `size` is now optional with an `effectiveSize` fallback chain (own input, `solaris-radio-group`, `'md'`) and `density` also inherits from the group, exposed through the new `SOLARIS_RADIO_GROUP` token (the legacy `SOLARIS_RADIO_GROUP_NAME` keeps providing the native name). Both showcase pages are rebuilt on the docs-page-layout pattern (radio: preview-code per example, tabs for appearance/color/label-position with a description demo, interactive size-density selectors; radio-group: basic/validation examples, interactive size-density, layout tabs, states, form integration; simple installation, props placeholder, full i18n). Follow-ups: card-variant input lives in `selection-card`, group keyboard roving refinement.
- 3712823: feature(data-display): add record-grid component

  Add `solaris-record-grid`, an attendance/launch sheet composing the
  `solaris-table` contracts without copying its types, state, tokens, or
  density. It ships sections with row groups and per-group footers, merged body
  cells (`rowspan` + `colspan` with continuous `aria-rowindex`/`aria-colindex`),
  controlled editing with draft, validation, and internal commit emitting an
  audit-ready `recordCommit` diff, and a reactive formula engine (`computed`
  columns resolved in topological order with cycle detection).

  Follow-ups: virtualization, column drag/reorder, inline `showAddRow`,
  server-side datasource, and sheet printing.

- dba134d: Refactor skeleton onto the explicit size × density matrix and add delay, deterministic multi-line, RTL wave, and aspect ratio.

  **Skeleton**
  - Explicit size × density × variant matrix in px (own scale — skeleton is a
    decorative placeholder, so the `--solaris-control-height-*` ladder for
    interactive controls does not apply): text 8–24px, rectangular 48–160px,
    circular 20–48px. Size and density no longer fight through cascade order;
    every cell is a dedicated rule. Multiline gap follows density
    (compact 8px, normal 12px, comfortable 16px).
  - `density` is explicitly `input<T | undefined>` with `effectiveDensity`
    fallback to the theme density; host uses `data-size` +
    `data-density(effective)`.
  - Boolean host bindings follow the presence pattern (`|| undefined`,
    including `data-multiline` and the new `data-pending`).
  - New `delay` input (ms, default `0`): postpones rendering to avoid flashing
    on fast loads. While pending the host carries `data-pending` and stays
    `visibility: hidden` (layout space preserved). SSR-safe.
  - Multi-line widths are now deterministic: first line `100%` (or custom
    `width`), fixed middle sequence, last line via the new `lastLineWidth`
    input (default `'68%'`).
  - New `aspectRatio` input for `rectangular` (e.g. `'16 / 9'`); ignored when
    `height` is set. Custom `width`/`height` still override the matrix.
  - Wave shimmer fixed: `animation-name` is now a literal (resolving it
    through `var(--solaris-skeleton-wave-name)` silently prevented the
    keyframes from running in Chromium — verified via ::after transform
    sampling). Band widened to 30–70% stops for a perceptible sweep.
  - Wave travels right-to-left under `[dir='rtl']` by mirroring the symmetric
    host (`scaleX(-1)`), without chained `:host` selectors.
  - New `duration` input (e.g. `[duration]="'400ms'"`): sets
    `--solaris-skeleton-animation-duration` inline on the host, inherited by
    the wave/pulse layers and multi-line rows.
  - Reduced motion uses `:host-context([data-reduced-motion='true'])` (the
    previous global element selector never matched under view encapsulation)
    plus `prefers-reduced-motion`.
  - Multiline host layout moved after the animation rules so `animation: none`
    wins at equal specificity (previously a multiline host kept pulsing).
  - Docs rewritten in px with the full matrix, new inputs, CSS vars, and
    composition presets. Stories rewritten against the real API (the old
    `Heading` play test asserted text the component never renders).
  - Showcase rebuilt on the docs-page layout: preview-code per example,
    variants/animations/multiline in tabs, interactive size-density selectors
    with computed snippet, preset examples (profile, dashboard, list-row,
    media-block) behind a single preset tab group with computed snippet,
    delay + aspect-ratio + duration demos behind an advanced tab group
    (duration has its own slow/default/fast selector), installation, props
    placeholder, mirrored en-US/pt-BR translations.

- d79ad3f: Add `caret-up`, `caret-down`, `caret-left` and `caret-right` filled-triangle icons (navigation group): `fill: currentColor` glyphs for trend deltas and compact direction cues, distinct from the stroked `chevron-*`/`*-arrow` families.
- 6f791c7: Refactor the loading feedback trio (`solaris-spinner`, `solaris-progress`, `solaris-loading-text`) with an adapted `size` × `density` matrix, corrected label semantics, and new loading patterns. `solaris-spinner` no longer renders a visible default label — the indicator is indicator-only unless `label`/`labelKey` is explicit (the `solaris.spinner.loading` fallback now feeds only the accessible name); adds `density` (`compact` | `normal` | `comfortable`, default from `SolarisThemeService`, adjusts the indicator-to-text gap while `size` drives the indicator geometry and the label/percent type scale), `overlay` (absolute zone-centered overlay), `lockScroll` (body scroll-lock while `backdrop` is visible), larger indicator sizes (`sm` 12px, `md` 20px, `lg` 32px, `xl` 80px), and the new `solaris-loading-zone` directive (`aria-busy` + `inert` so fields below stay disabled while loading). `solaris-progress` gains `status` (`active` | `success` | `exception`), `striped` / `animatedStripes`, `bufferValue`, and `density`; `solaris-loading-text` gains `density`, `maxLines`, and `dots`. All three showcases were rebuilt on the docs-page layout (`preview-code` per example, `solaris-tabs` variations, interactive size-density, installation, props). Follow-ups: `delay`/`minimum-duration` anti-flicker for spinner, a fullscreen `SolarisLoadingService`, progress `steps` segments, and loading-text rotating messages.
- 0d6aad2: Complete the `solaris-stepper` 3x3 `size` x `density` matrix on the control host: `size` drives the indicator circle (`sm`: `spacing-7`/16px, `md`: `spacing-9`/24px, `lg`: `spacing-10`/32px), step number and icon sizes, and label typography (`sm` -> `xs`, `md` -> `sm`, `lg` -> `md`), while `density` drives the inter-step gap (`compact`: `spacing-4`/6px, `normal`: `spacing-6`/12px, `comfortable`: `spacing-8`/20px), description visibility (hidden in `compact`), and content padding on its own spacing scale. This also fixes the connector line anchoring: rows now top-align the indicator with the label vertically centered (`min-height` on the label group), so the connector stays centered on the circle in every combination — previously only `lg` without description was exact (`sm` was off by ~4.5px, worse with descriptions). Also removes the `var(--solaris-shadow-focus, ...)` fallback on the card active step (the token does not exist; uses `focus-ring` outline like tabs) and aligns the `:host` base with the `md` + `normal` combination. New `warning` status for `solaris-step` (`warning` input or `status="warning"`, precedence disabled > error > warning > active > completed > pending, warning indicator + dashed styles, re-enterable in linear mode like completed steps). New validation hooks: per-step `canEnter`/`canExit` guards evaluated in `goToStep` before linear rules, with a new `stepBlocked` output (`{ index, from, reason: 'enter' | 'exit' }`) so consumers can flag the step; the stepper still owns no form state. Clickable steps now render a single `<button>` wrapping indicator, label, and badge (whole header is one tab stop instead of a circle-only target). New `statusText`/`statusTextKey` inputs render a badge next to the label, and the badge only renders with content — fixing a phantom empty `status-badge` span that added extra spacing on the label side of every connector. Labels truncate with ellipsis past the size max-width (`120/160/200px`) with the full label in the native `title` tooltip. Docs gain a Size and Density section, a Validation hooks section, and corrected `density` default (theme, not `'normal'`); the phantom `editable` input row is removed. The showcase page is rebuilt on the docs-page-layout pattern (preview-code per example, tabs for orientation/appearances/linear, interactive size + density selectors with computed code, new warning and validation examples, simple installation, props placeholder, full i18n). Follow-ups: nested/sub-steps, router opt-in, analytics/onboarding-shell guidance.
- ab41151: Change the default `color` of `solaris-switch` from `primary` to `neutral`. Also import `SOLARIS_SWITCH_GROUP` from the `switch-group` barrel instead of the deep token path, and simplify `thumbText` empty handling.
- 66ac14b: Recalibrate `solaris-switch` sizes on the new spacing scale (the previous track had shrunk to ~20x7px on `md`): explicit 3x3 `size` x `density` matrix for track/thumb geometry (track 16x28px on `compact-sm` up to 24x36px on `comfortable-lg`, 2px breathing room between track and thumb, label gap now density-owned). In `outline` appearance the track border stays fixed neutral (no semantic tint on checked/hover) and the thumb gains a subtle border. Add decorative `icon` (`SolarisIconName`) and `text` (max 2 characters, dev-mode warning beyond that) inputs rendered inside the thumb — `icon` wins when both are set, both are `aria-hidden` and never affect the accessible name, and both scale with the thumb via a content-size variable. `size` is now optional with an `effectiveSize` fallback chain (own input, `solaris-switch-group`, `'md'`) and `density` also inherits from the group, exposed through the new `SOLARIS_SWITCH_GROUP` token. Both showcase pages are rebuilt on the docs-page-layout pattern (switch: preview-code per example, tabs for appearance/color/thumb-content with a state-reactive icon demo, interactive size-density selectors, group inheritance demo; switch-group: basic/validation examples, interactive size-density, layout tabs, states, form integration; simple installation, props placeholder, full i18n). Follow-ups: `label-position` input, `loading` state, group keyboard roving refinement.
- ef91fee: Extend `solaris-table` with `appearance` (`outline`/`surface`/`soft`/`plain`, with `soft`/`plain` using subtle borders), `stripedMode` (`even`/`odd`), `expandMode` (`row`/`cell`/`both`) where per-cell chevrons open a filtered detail row below the row (one item per expanded column, same styling as the responsive detail list, with full-bleed dividers), `column.detailVariant` (`list`/`free`, where `free` renders a chromeless area for custom breakdowns), `column.hideCardLabel` (value-only card fields that keep the desktop header), `layout="card"` (with `mobile` kept as a deprecated alias), `column.expandable`, and `cardTitleOf`/`cardSubtitleOf` card headers. Card layout drops the outer frame border, uses full-bleed field dividers with padding on the line, follows density, and renders plain labels without sort buttons. Responsive detail items are separated by full-bleed dividers. Error state now renders inside the table chrome (keeps headers, `role="alert"` in the row) like the empty state, and empty/error/loading/sort/expand labels ship with en-US/pt-BR defaults while remaining overridable via text/key inputs (showcase error tab uses `errorKey`). Document `sortValueOf` for badge/status ordering and `align`/`headerAlign` guidance, add wide/appearance/cell-expand (points breakdown with semantic colors)/mobile-composed (avatar, badge, actions) showcase sections, and allow nested `appearance="plain"` subtables inside detail templates.
- 35174f7: Add `solaris-table-toolbar` + `solaris-column-manager` (`data-display/table-filter`): global search (debounced), per-column conditions (text/number/date/options operators with chips + clear-all), saved-view tabs with `viewCreate`, pluggable export button (`icon` default, `icon-label` opt-in; hidden without exporters, direct download with one, menu with many), and the `Customize columns` manager (drag-reorder with keyboard alternative, visibility toggles, Reset/Cancel/Save). Pure helpers (`applyTableFilters`, `applyOrderedVisibleColumns`, persistence) cover the client adapter; server tables consume `filterChange`. `solaris-table` gains the `ng-template[solaris-table-toolbar]` header slot inside its frame (mirrors the pagination footer); without the slot the table is unchanged. Follow-ups: nested AND/OR groups, dirty-view state, URL-shared views, XLSX exporter.
- db42ea3: Table footer aggregates: columns with `footer`/`footerKey`/`footerValueOf`/`footerTemplateId` render a semantic `tfoot` over visible rows, ready for gradebook averages.
- faeb9c6: Table header groups and cell editor contract: `headerGroups` renders a two-level grouped header (`colspan`/`colgroup`), and columns with `editorTemplateId` edit in place through `solaris-table-cell-editor` with `editStart`/`editEnd`. Value commits stay consumer-owned.
- 99aea20: Add `solaris-table` lean data table with text/number/date/checkbox/custom columns, client/server `SolarisTableDataSource`, tri-state sort cycle with independently animated `sort-asc`/`sort-desc` arrows plus `aria-sort` and live announcements, two-way `selectedRowIds` with tri-state header checkbox (single mode trims to one row on mode switch), cell/header/empty/error/loading/per-column-detail slots, priority-based expandable detail rows in a trailing Actions column with smooth open/close, card layout on mobile with per-field sort, smooth row hover, `mobile` forced-card mode, `fullWidth` fixed layout, `cellPadding` vertical rhythm, and inherited density. Reuses `solaris-checkbox`, `solaris-skeleton`, and the `sort`/`sort-asc`/`sort-desc` icons. Follow-ups: filters/toolbar/search, badge/avatar/progress/actions/currency column types, column-visibility UI, CSV export, sticky first column, resize/reorder, virtual scroll, inline editing, hierarchical sub-rows, and the separate `gradebook` component.
- 566daba: Table polish: grid appearance, frame radius, header icons, inline add row, smaller header type.
- db42ea3: Table sticky first column: `stickyFirstColumn` pins the leading data column (plus selection when selectable) to the viewport start.
- 35174f7: feature(table-filter): export menu now groups options under a "Format" title (`solaris.dataDisplay.tableFilter.exportFormat`, en-US/pt-BR) and shows a per-format icon. `SolarisExporter` gains an optional `icon` field; the built-in CSV/JSON exporters use `file-text`/`json` (`json` also added to the built-in icon name union).
- b17fac1: Tabs: default `color` is now `'neutral'` instead of `'primary'`. Pass `color="primary"` explicitly to keep the brand accent on the indicator and active tab.
- c11765c: Add `size` (`sm` | `md` | `lg`, default `md`) and `color` (`primary` | `neutral`, default `primary`) to `solaris-tabs`, with the same 3×3 `size` × `density` matrix as Segmented Control (height via `--solaris-control-height-*` tokens, `sm` → `xs`, `md` → `sm`, `lg` → `md` typography). `solaris-editable-tabs` forwards both inputs to its inner tabs and sizes the rename input from the same matrix. Also fixes the inverted `compact`/`normal` density scale, the `wide` shape referencing the nonexistent `--solaris-density-padding-lg` token, the `pills` radius override order, boolean host attributes now following the presence pattern (`data-full-width`, `data-scrollable`, `data-show-indicator`, plus the new `data-fit-content` binding), a ResizeObserver/MutationObserver/requestAnimationFrame indicator (SSR-safe) replacing the `offsetLeft`/`setTimeout` measurement, wrap-around keyboard navigation with RTL mirroring, `aria-disabled` on the tablist when the group is disabled, an `undefined` `aria-label` fallback instead of hardcoded `"Tabs"`, and unified `--solaris-tab-*` tokens (removed divergent `--solaris-tabs-tab-*` duplicates). Follow-ups: `pills` tabs gain extra horizontal padding for a more regular pill shape, the vertical tablist separates tabs from the separator line via the new `--solaris-tabs-separator-gap` token, and the editable-tabs action trigger glyph follows `--solaris-tab-icon-size` (buttons do not inherit `font-size`, so the ellipsis previously ignored tab sizing).
- 7a596c1: Add 23 built-in icons and two new icon groups. New `people` group (`user-group`, `user-check`, `user-gear`, `user-star`, `user-add`, `user-delete`, `user-remove`, `user-circle`, `user-square`, `user-edit`, `user-file`, plus `user` and `users` moved from `data`) and new `documents` group (`file-text`, `receipt`, `notebook-pen`, `notebook-text`, `sticky-note`, plus `book`, `squared-text`, `notepad` and `book-user` moved from `data`). Also adds `backpack`, `blocks`, `sparkles` and `trophy` to `data`, `square-plus` to `actions`, `chart-spline` to `navigation` and `table` to `layout`.
- 78df5a1: Refine `solaris-toast` size/density proportions and countdown stability: `iconSize` now defaults from the card `size` (`sm`→`sm`, `md`→`md`, `lg`→`lg`) so a small toast no longer renders the large `md` glyph — an explicit per-toast or provider `iconSize` still overrides; the glyph scale now matches the title scale exactly (`sm 14px`, `md 16px`, `lg 18px`) and the close glyph scales with `size` (`xs/sm/md`) while keeping the 24–28px hit box; `sm` description steps down to `2xs (12px)` for title/description hierarchy (`sm 14/12`, `md 16/14`, `lg 18/16`) and the countdown footer inherits the description size; the countdown toggle no longer renders a focus outline and the footer stacks a hidden sizer with the starting plural text in the same grid cell as the visible message, so the plural→singular (`N segundos` → `1 segundo`) transition no longer shrinks the card — with no hardcoded widths, following any locale; the loading glyph now spins on its own axis (explicit square icon box with explicit center origin, and the `solaris-icon` host is now grid-centered so the inner inline `svg` no longer sits ~2px off baseline — that offset was orbiting 4px per turn); media container uses visible overflow to avoid clipping the glyph.
- cc6d9d9: Refactor `solaris-toast`: add adapted `size` (`sm` | `md` | `lg`, default `md`) × `density` (`compact` | `normal` | `comfortable`, default from `SolarisThemeService`) matrix for card scale (padding/gap, title/description typography, max-width 420/520/600, min-width 380/460/540, close size, progress height) with `data-size` + `data-density` (effective) on the host; unify the countdown API into a single `countdown` (`'bar'` | `'text'` | `'both'` | `false`, default `'text'`) — **breaking: removes `showCountdown`, `showCountdownText`, `showProgress` and `countdownMode`**; add `toast.promise()` for loading→success/error flows. Also fixes the rounded bottom corners disconnecting the card from the countdown footer (`data-has-bottom` zeroes the root bottom radius), the outline border wraps the whole card including the countdown footer (with a divider), rescales proportions (3px variant bar, 4–6px progress by density, 24px close box, media larger than icon, countdown footer without ellipsis and with min-width (single-line, wraps only under 640px)), hides countdown text from screen readers, removes hardcoded `'Fechar'` close fallback (now `closeLabel` | `closeLabelKey` | `solaris.toast.close` without hardcoded default), keeps `outline` borders always in the default border color, widens container padding (20px desktop / 12px mobile) with a 12px stack gap, generates ids via `nextIdFor('solaris-toast')`, guards container creation for SSR, and removes CSS fallbacks in the `custom` variant. Follow-ups: swipe/drag-to-dismiss with per-position exit animation, dedup/grouping and notification-center queue.
- 868c88c: Tooltip: new `solarisTooltipSkipDelay` input (default 300ms, Radix pattern — reopening within the window after a close skips `showDelay`), proportional arrow sizes (sm 8px, md 10px, lg 12px, shared with `SOLARIS_TOOLTIP_ARROW_SIZE_PX` so the CDK offset stays exact), and arrow rewrite as a rotated square centered on the panel edge (border only on the two outer sides), fixing 1px seam steps on every side with the `outline` appearance. Docs: corrected `offset` default (0), `maxWidth` default (320px), size table in px, plus `showOnDisabled` wrapper guidance. Follow-ups: touch long-press, `followCursor`, `maxLines`.
- 5d348e5: Migrate translation dictionaries from TS consts to nested JSON (`en-US`, `pt-BR`, `es-419`) with load-time flattening. Adds full `es-419` coverage (372 keys) and removes the legacy `es` locale key. Breaking: `SOLARIS_TRANSLATE_EN_US/PT_BR/ES` consts removed, `solaris.file-upload.avatar` renamed to `solaris.file-upload.avatar.label`.
- 1468897: Make `SolarisTranslateService` reactive: `locale` is now a signal with `setLocale()`/`resetLocale()`, locale normalization (`pt*` to `pt-BR`, `en*` to `en-US`, `es*` to `es-419`), `localStorage` persistence (`persistKey`, default `'solaris:locale'`, `false` opts out), runtime `addTranslations()`, `has()` and `availableLocales()`. The `translate` pipe is impure and re-renders on locale change with no reload. Breaking: `service.locale` is now a signal, read it as `service.locale()`.
- aede692: Migrate showcase dictionaries from TS consts to colocated nested JSON (`en-US`, `pt-BR`, `es-419`) with import-only `index.ts` per page and shell. Rename `translations/` folders to `translation/`, deep-merge page modules in the central aggregator, and add full `es-419` coverage plus a Services section with a live translate reference page (`/services/translate`).
- 5ea5da1: Slice translation dictionaries per component: 32 `translation/` packages with nested `en-US`/`pt-BR`/`es-419` JSON plus import-only `index.ts`. The central defaults now import every package and deep-merge per locale before load-time flattening, with identical keys (372) and no duplication.
- 79a6688: Rename the small font-size tokens to make room at the bottom of the scale (`--solaris-font-size-3xs: 8px`, `--solaris-font-size-2xs: 12px`, `--solaris-font-size-xs: 14px`), add `--solaris-font-weight-bolder: 800`, and simplify the sans stack by dropping the legacy `ui-sans-serif` fallback.

### Patch Changes

- 1841ecc: Fix `solaris-alert` icon alignment when a title is projected. `--solaris-alert-icon-offset` was `0` (unitless) under `data-has-title`, which invalidated `inset-block-start: calc(0.5lh + var(--solaris-alert-icon-offset))` and dropped the icon's vertical centering to `0px` — leaving the icon ~12.6px above the title's center. It is now `0px`, restoring the icon/title/close-button centering on the title's first line.
- ee3bee5: Fix `solaris-bar-chart` stacked rounding, hover and tooltip modes: bars now render as paths with selective outer rounding (baseline edges stay square), bar hover shows a single-series tooltip and dims the rest with no background guide while main-axis hover keeps the full category tooltip with total. The whole-column guide is narrowed with side gaps, aligned exactly to the plot edges, and grows/shrinks in height only from the zero baseline with `--solaris-motion-duration-normal` (pre-positioned while hidden so it never slides in from 0,0), and the active category tick promotes to `--solaris-neutral-text-body`. Showcase weekdays and locale are now fully translated (`bar-chart-view.examples.days.*` + dynamic `[locale]`).
- 35174f7: fix(button): pre-stamp data-\* variant attributes in ngOnInit so ghost/outline buttons never flash from the solid base style on first paint. Host bindings remain the source of truth afterwards. Applies to `solaris-button`, `solaris-icon-button` and `solaris-button-group`.
- 05fed17: Fix label jumping up on focus/click in `solaris-button`. The text line box (`line-height-sm`) was taller than the button content box in the tighter size/density combinations, so the overflowing text got clipped upward when focused. Buttons now use `line-height-none`: single-line labels are still centered by flex, and the line box fits every fixed control height.
- df3face: fix(button): eliminate first-paint flash for `solaris-button` and `solaris-icon-button` across appearance, color, size, and density. Transitions now apply only after a browser-only `data-hydrated` marker is stamped in `afterNextRender` (never rendered on the server, so SSR hydration cannot diverge on it); pre-hydration paint uses `transition: none` over the neutral solid md/normal base. Adds `[data-size]:not([data-density)]` fallbacks assuming normal density so late density resolution (theme CSS, group context) lands without a geometry jump.
- 14e7691: Soften the press feedback of `solaris-button` and `solaris-icon-button`. The active scale goes from `0.99` to `0.97` (`--solaris-motion-scale-active`) so the press is perceptible, and the `transform` transition switches from the symmetric `standard` easing to `decelerate` — fast start with a soft landing instead of a mechanical snap. Durations are unchanged (`fast`, 150ms) and reduced-motion behavior is untouched.
- 7d61f13: Soften the `:active`/`data-pressed` treatment of the low-emphasis appearances (`ghost`, `tonal`, `surface`) in `solaris-button` and `solaris-icon-button`. Pressing no longer flashes the solid fill with inverted text (which read as a visual bug on quick clicks); it now holds the hover treatment — same surface tint, same text/icon tone, stable border. Only `solid` and `outline` still commit to the solid `active` background on press. Docs updated (`Hover and active`, toggle `pressed` note, icon-button states).
- d02d973: Fix the native text-selection highlight painting over the drag ghost when creating all-day ranges in the week and month views: the grid disables user selection while a drag session is active and any pending native selection is cleared when the session activates.
- d02d973: Calendar mini-month days are true circles: day buttons fill the grid track with a 1:1 aspect ratio instead of stretching into pills.
- d02d973: Calendar mini-month gains a narrow weekday header row, mutes days outside the visible month with text-secondary, and renders compact fixed-size day circles.
- f450b47: Fix `solaris-calendar-month-view` layout: keep square cells with `border-box` sizing and clipped overflow, full-width chips with truncated text, true-circle day numbers with fixed size and zero padding, and auto-fit visible rows via `ResizeObserver` so the more button only appears when markings exceed what fits in the cell (the last row is replaced by it). The more button now occupies a full chip-sized row. `maxVisiblePerDay` remains as the initial/SSR cap and still governs the compact (<=480px) layout where square cells are disabled.
- d02d973: Calendar schedule deduplicates navigation: add `showToolbar` to the schedule view (default `true` standalone) and hide it inside the shell, with the shell title showing the 7-day window range.
- d02d973: Click-to-create in the calendar shell: slot clicks and drag-create proposals open the event-editor dialog when `editable` (one-hour timed draft / proposed range, `solaris.calendar.newEvent` title fallback in en/pt-BR/es), saving emits `eventSave` for consumer upsert.
- d02d973: Calendar shell polish: capitalize the month in day/schedule titles, show friendly time-zone labels with corrected GMT offsets, rename custom days to displayed days, hide number-input spinners globally, and clean the shell showcase (visually-hidden event log, stretch preview for the year grid).
- d02d973: Calendar shell round 2: the shell host is now block-level full-width (it previously shrink-wrapped in some layouts), the year grid month minimum drops from 192px to 152px, and narrow shells (below 640px of their own width, e.g. docs) stack the side panel on top in year view — so months flow 3 → 2 → 1 through auto-fill in every implementation. Also: circular mini-month previous/next buttons, translated toolbar/side aria-labels, and the custom-days number input becomes a 1–7 select.
- 480594b: Calendar shell keyboard shortcuts: window-level N (create at focusedDate, editable only), T (today), 1-5 (day/week/month/year/schedule), [ / ] (shift ∓1) with input/textarea/select/contenteditable and open-dialog guards; every action announces via the live region (en/pt-BR/es). Delete stays out — the shell keeps no selected-event state.
- d02d973: Calendar shell no longer depends on the translate pipe: chrome strings resolve through the component locale fallback, so the shell renders without the translate service. The translate pipe itself returns the key instead of crashing when the service is absent.
- d02d973: Fix the `solaris-calendar-week-view` all-day row overflowing into a scrollbar instead of collapsing into the `+N` more button: visible chips now auto-fit the measured row budget (same pattern as the month view, `maxVisiblePerDay` stays the SSR/initial cap) and the last row is replaced by the overflow button whose popover keeps listing every item.
- d79ad3f: `line-chart` exit in two layers: the previous frame's data (lines/areas/dots) still slides out to the right, but grid, X/Y ticks and reference lines now only fade in place via a second snapshot layer — axis values no longer "travel". Verified with scripted screenshots (no ghost, no stacked charts mid-transition).
- d79ad3f: `line-chart` sequential axes: on data change the new grid/ticks/reference stay hidden (inline) while the old snapshot layer fades out, and only fade in after it completes — old and new axis labels never overlap ("encavalado"). Snapshot sanitization now also resets axis opacity; cancel/destroy resets axes too. Verified with scripted screenshots at 150ms/400ms post-change.
- dc931a6: Fix inner vertical scroll in chart showcase previews: the `solaris-line-chart` screen-reader data table is now wrapped in the positioned `.solaris-line-chart__data` container (a bare `<table>` ignores the off-screen `0x0` sizing and leaked ~250px of scrollable overflow into `solaris-preview-code` surfaces), and the preview surface uses `overflow: auto clip` so page scroll owns the vertical axis. No visual or SR-tree changes. Also centers the `solaris-chart-shell` error state like the empty state.
- d79ad3f: `line-chart` tooltip readability: the card now grows (`max-content`) instead of wrapping long series labels, row labels always use `--solaris-neutral-text-secondary` followed by ":", and the footer shows an explicit translated "Total:" label before the total.
- 8a93adf: `line-chart` y-axis clipping: the top nice tick could land above the padded domain and render outside the plot, cut by the svg edge. The frame domain now snaps outwards to the outer ticks so every gridline and label stays inside the plot.
- d79ad3f: `line-chart` transition overlay fix: imperatively created nodes (slide-out overlay, pen dot) never receive Angular's emulated-encapsulation attribute, so the component SCSS never matched them — the overlay rendered as an in-flow block duplicating the chart below. Positioning is now applied inline with an explanatory comment (dead SCSS rules removed, pen also ignores pointer events), and the draw/pen animation is slower (1000ms mount, 650ms updates).
- d79ad3f: `line-chart` pen sync: the pen dot used `easeOutCubic` while the stroke dash animates with `cubic-bezier(0.4, 0, 0.2, 1)`, so the pen raced ahead of the visible tip and read as a floating dot. It now evaluates the same cubic-bezier in JS (Newton–Raphson), riding exactly on the dash tip — verified via scripted screenshots. Draw durations raised to 1000ms (mount) / 650ms (updates).
- 2261cbd: Fix `SolarisCodeBlockComponent` collapsed height so `collapsedLines` is honored (the previous `max-height` calc combined a unitless `line-height` token and was ignored by browsers, showing the full content while collapsed). The collapsed viewport now measures lines with `1lh` (with an `em`-based fallback), and expand/collapse animates smoothly by interpolating the viewport between measured pixel heights in JS (with a CSS `max-height` transition as fallback), disabled under reduced motion.
- d02d973: Fix the collapsible `lined` appearance dropping the trigger divider on the last sibling (docs already promise a divider under each trigger) and add a borderless `plain` appearance to collapsible and accordion.
- 4020b0e: Design tokens: add `sizing` control-height scale forming a chained ladder from 28px to 52px in 4px steps (compact 28/32/36, normal 36/40/44, comfortable 44/48/52; the `sm` of a denser scale equals the `lg` of the previous one). The ladder measures the control outer box: segmented controls render container padding at zero so outer height always equals item height. Each density `min-height` points at its own `md` height, so default controls align across components — note `comfortable` `min-height` moves 44px to 48px, growing every comfortable-density control by 4px. Components must reference the token of their own size x density combination, never another combination's token, even when values coincide. Segmented Control items enforce the mapped height via `min-height`, with vertical padding per combination sized so natural content height never exceeds the target. Shared declarations were hoisted to the base selectors: zero container padding on the control, and horizontal padding plus label line-height on the item. Input height moves from density-only to the size x density matrix.
- 83a6f76: Fix `solaris-date-picker` (and `solaris-date-range-picker`) rendering 2px taller than a plain `solaris-form-field` at the same size: the calendar trigger (`solaris-icon-button` in the suffix affix) kept the full control-height token because the icon-button size x density matrix outranks the form-field affix override, overflowing the wrapper content box by twice the border width. The form-field override now outranks the matrix and pins affix icon-buttons to the affix box (control height minus borders), and neutralizes the 44px `::after` hit-area expansion inside affixes (the field surface is already the trigger target, so the expansion is redundant and would spill over the input); the calendar triggers also inherit the field `size`/`density` so the glyph scales with the field.
- 3466ff1: Apply the locale date mask while typing in date-picker and date-range-picker: writing `16102026` in `pt-BR` becomes `16/10/2026` (`dd/MM/yyyy`). Order and separator always follow `locale` (`MM/dd/yyyy` in `en-US`), eight continuous digits parse without separators, and only complete `yyyy` years are committed.
- 3c0c206: Collapse the duplicate separator when dialog actions or footer render directly below a header with separator. The components detect the adjacent `solaris-dialog-header[data-separator]` sibling and set `data-adjacent-header`, which removes their own top border.
- 1bb36dd: Fix dialog initial focus: with `autoFocus: 'first-tabbable'` (default) the container now focuses the first enabled action button when actions are present, instead of the header close button that became first-tabbable after the header close refactor. Explicit `[data-autofocus]`, `autoFocus: 'panel'` and `autoFocus: false` behavior is unchanged.
- d951a5b: Refresh the dropdown-menu showcase to the docs-page-layout standard and fix outdated icons. The showcase page now uses `docs-page-header` + `docs-section` + `preview-code` + `tabs` with breadcrumbs, prev/next, TOC, installation, and props sections. Showcase icons updated (`gear` → `settings`, `file`/`files` → `file-text`). The `solaris-dropdown-menu-item` and `solaris-dropdown-submenu-trigger` leading/trailing icons now use `[decorative]` instead of a no-op `aria-hidden` host attribute; `iconDecorative` defaults to `true` on the item and was added to the submenu trigger. The in-menu checkbox/radio indicators now follow the standalone `solaris-checkbox`/`solaris-radio` neutral treatment (`neutral-border-default` unchecked, `neutral-text-body` checked with `neutral-text-inverse` checkmark) instead of primary, and the radio ring now uses the border-width token instead of a spacing token. The submenu trigger leading/trailing icon boxes are fixed to match the item leading size (`spacing-8`) with a readable trailing chevron (`spacing-6`), and the trigger gap matches the item gap (`spacing-4`). The trigger `solarisDropdownMenuAppearance` default stays `'outline'` with `surface` as opt-in (docs corrected to match); the showcase appearance tabs now pass explicit values so surface/outline render distinctly.
- 3a788e4: Event editor architecture cleanup: split component internals into model files.
  - Fallback text moved out of the component into one file per locale (`event-editor/model/i18n/event-editor-text.{en,pt,es}.ts`, full translation keys so the no-service fallback actually resolves) behind `model/event-editor-text.ts` (`SOLARIS_EVENT_EDITOR_FALLBACKS`, `resolveEventEditorFallback`).
  - Types (`SolarisEventEditorFreq`, `SolarisEventEditorEndsMode`, `SolarisEventEditorReminderRow`, `timeZoneOptions` on `SolarisEventEditorData`) live in `model/event-editor.types.ts`; shared constants (colors, reminder presets/limit, curated zones) in `model/event-editor.constants.ts`; pure draft/hydrate/date helpers in `model/event-editor.utils.ts`, which also drops `buildDraft`/`hydrate` cognitive complexity back under the limit and removes the nested ternary in `onFreq`.
  - The template now consumes the previously unused `isCustomRecurrence` computed.
  - Showcase demo dialog binds `(timeZoneChange)="onTimeZoneChange($event)"` (fixes TS2554).

- e0c0f29: Event editor: allow removing all reminders so an event can have zero notifications. The per-row remove button is no longer disabled on the last row, and an empty reminder list hydrates and saves as `reminders: []`.
- 3a788e4: Timezone dialog layout and missing select search placeholder.
  - The separate-zones checkbox now lives inside the timezone picker dialog (560px, content in `comfortable` density): checkbox plus a row pairing the two back-to-back searchable selects with the swap action in its own right-hand column, vertically centered — `arrow-left-right` rotated 90° in a small circular chip clearly above the fields. The end select stays disabled and mirrors the start zone until the checkbox is checked. Confirming closes with `{ start, end | null }`, mirrored back to `timeZone`/`timeZoneEnd`.
  - Fixed the horizontal overflow (verified live in the browser): the old `nowrap` row plus the select's content-based trigger min-width floor overflowed narrow dialogs, and the icon-button's extended `::after` hit area (`inset: -6px`) bled past the floating button. The selects now stack at full width with `[triggerMinWidth]="0"` and the trailing action sits in-flow, so long zone labels truncate instead of scrolling.
  - The swap action floats at the right edge between the back-to-back selects without taking layout space (`arrow-left-right` rotated 90°, small opaque circular chip clearly above the fields).
  - Fixed the searchable-select placeholder rendering the raw `solaris.select.search.placeholder` key: the key now exists in the en-US/pt-BR maps (es falls back to en, like the other select keys).

- 966cf0a: Refine `solaris-file-list-item` density: larger file-type icon (`--solaris-file-list-item-icon-size` default `2xl`, centered across name+meta lines) and smaller text (`name: xs`, `meta: 2xs`). Document the supported rejection-feedback pattern with `SolarisToastService` via `fileRejected` instead of coupling `forms -> feedback`.
- 680ad9b: Step form-field control type down one notch on the type ramp in every field scenario (compact 16px to 14px, normal 18px to 16px, comfortable 20px to 18px): `solaris-input`/`solaris-textarea` text, select/multi-select trigger and chip text, affix icons, password toggle matrix, phone country/flag/chevron, otp boxes, and the date-range trigger. Select/multi trigger icons step from 24px to 20px. Placeholders keep `text-muted` but render at 70% opacity (`--solaris-opacity-70`) across inputs, textareas, and select search/trigger placeholders. The Form Field label now tracks the control type per density instead of staying fixed. OTP drops both outline rings (outer Form Field ring suppressed, box focus ring removed): the active box signals with a lighter neutral border (`--solaris-border-strong` via the new `--solaris-otp-input-box-active-border-color`). Control heights, line-heights, radius scale, and the loading overlay are untouched.
- 23df862: fix(gradebook): close the grade editor on blur

  The internal grade editor now closes on `blur` (clicking or tabbing outside), matching the existing Escape behavior: close without committing. Explicit commits stay via `change`/`Enter`. Prevents the editor from staying stuck open when the user clicks away without editing.

- 23df862: fix(gradebook): center status columns by default

  Columns with `status: true` now default to `align: 'center'`, matching the documented badge convention (`SITUAÇÃO` badges were rendering start-aligned unless consumers set it manually). Explicit `align` still wins.

- 7ded387: Fix `solaris-heatmap` edge tooltip clipping and segment the intensity scale: the tooltip now docks toward the grid center so first/last row and column cells keep the card inside the canvas instead of growing outward past the scrollport and preview surface (no extra scrollbar, full content always visible). `showScale` now renders five intensity buckets with six ticks (0, 20, 40, 60, 80, 100 at `max=100`) instead of a continuous gradient. Showcase scale matrix now includes values near 0 to exercise the lightest buckets.
- 7d61f13: Align `solaris-icon-button` color scheme with `solaris-button`. The icon-button `:hover`/`:active` rules now apply the icon color (new `--solaris-icon-button-hover-color`/`--solaris-icon-button-active-color` vars), and every `color x appearance` block mirrors the button tokens: `outline` fills with the solid hover/active background and inverts the icon color (e.g. neutral outline now fills `surface-reverse` instead of `surface-muted`), `primary solid` uses `primary-on-solid` as the resting color, `ghost`/`tonal`/`surface` active states use the solid active background, and `custom` gains hover/active color overrides. Also adds the missing `surface` hover border-color rules and the `text-muted` disabled color. `chromeless` keeps its transparent background and preserves the glyph color on hover/active so the new hover colors never render an invisible icon.
- 095622e: `line-chart` ENTER no longer gates markers behind the dots row: each dot reveals itself with a backwards-filled animation synced to the pen progress, eliminating the loose-dots flash between RESCALE and ENTER and the simultaneous pop-in when ENTER completes.
- 095622e: `line-chart` deterministic EXIT → RESCALE → ENTER transitions: staged rendered series/axes prevent old/new overlap, pen erase/draw follows path geometry via stroke-dashoffset, axes rescale only while empty, rapid period changes coalesce to the latest pending dataset with generation-guarded cancellation and resource cleanup.
- 77dcdfc: Align the mega menu trigger with the component standard: it now declares the system font by default (semibold `sm`/`1.5`/sans) instead of inheriting whatever the consumer context provides, the chevron grows from a fixed 6px to `1em` so it stays proportional to the text, and the text-chevron gap becomes `0.5em` (new `--solaris-mega-menu-trigger-gap` variable) — overriding `font-size` on the trigger scales text, chevron, and gap together. Also adds a visible `focus-ring` outline on trigger focus and scopes the host rule to its class. The showcase drops its trigger font override to rely on the library default.
- 60f42b3: Fix `solaris-multi-select` width collapse and auto-display flicker. The trigger now keeps a `min-width` floor estimated from the widest option row (longest display label with a size-aware factor plus option chrome, also covering the summary text), and the same value backs the panel `min-width` when no explicit `panelMinWidth` is given — like a native `<select>`, long options no longer force count-only mode nor wrap inside a narrowed `matchTriggerWidth` panel. Because the trigger width no longer depends on the rendered chips/count state, `auto` mode cannot oscillate between `Brasil +1` and `2 selecionados` while open.
- eb503fc: Move the `SECURITY_EXCEPTION` justifications in `solaris-multi-select` (`setupResizeObserver`) directly above each `nativeElement` read so the security check passes. No behavior change: trigger width measurement stays read-only via `offsetWidth` with an SSR-guarded `ResizeObserver`.
- 37fa5c0: Clean up `solaris-otp-input`: drop the unused `SolarisFormSuffixActionDirective` entry from the component `imports` (the directive is only read through a `contentChild` query) and simplify the focus fallback to `Math.max(index, 0)`. No behavior change.
- 1cf99f6: Fix the pagination page-size selector sizing and the mobile label. `solaris-select` gains a `triggerMinWidth` input that overrides the widest-option `contentMinWidth` floor (`0` removes it); the pagination page-size selector now passes `triggerMinWidth="0"` and `panelMinWidth="0"`, so the trigger and the dropdown panel shrink to the compact value + chevron (the previous ~69px inline floor was the remaining "large" space), the value reserves `3ch` for up to 3 digits with a slightly larger trigger gap, and the projected options use compact padding. The "rows per page" label is now also hidden by CSS inside card/mobile table footers (`solaris-table[data-card-layout]` / `solaris-table[data-mobile]`), covering card layouts forced on wide viewports such as the `layout="card"` showcase tab, where the viewport query never matches.
- 9a1af6e: Phase 0 docs and guardrails: resolve 6 doc contradictions (data-\* variants, spec paths, selected pair, touch targets, i18n links, radius scope), exclude translate dictionary and stories from check-i18n, dedupe start/dev/showcase scripts, mark phase-plan A-D as history.
- c624f0b: Phase 1 tooling and guardrails: canvas token-exception traces in image-editor utils, fast check:push push-gate with branch-aware changeset check, CI on develop, security-allowlist ledger, doctor info split, architecture rules synced to real layout, bundle re-baselined.
- 1d66c65: Phase 3 actions visual: primary/info solid + outline hover/active text now uses `on-solid` (white) instead of `foreground` — dark text on the blue `solid-hover` background measured 1.59:1 and now measures 7.08:1 (primary) and 6.70:1 (info) at rest/hover in light theme. The `[solaris-button]` / `[solaris-icon-button]` SCSS base radius default moves `sm` → `md` (4px), matching the directive `radius` input default (`md`) and the 13-visual-standard default. Icon-only buttons gain a transparent `::after` hit area expanding the effective target to 44px (`inset: calc((min(size, 44px) - 44px) / 2)`; no-op at ≥44px) with zero visual change — verified 32px box + −6px inset = 44px effective at 360px viewport.
- 1d66c65: Phase 3 data-display visual: card glass `::before` warm-orange tint (`#ff6e185c`) replaced with neutral cool highlight (`#ffffff1f`, same family as the other two glass layers) per 07 §1 / G-09 and approved D-06 — no other visual change. Card `::ng-deep` ×22 kept as-is (projected consumer sections via directives; `:host ::slotted` needs Shadow DOM — filed as dedicated refactor follow-up, no `::ng-deep` added).
- 1d66c65: Phase 3 forms visual pass: add token-driven hover border on textual shells (form-field wrapper, standalone input, textarea, OTP boxes); replace hardcoded 1px borders with border-width token in file-upload dropzone/trigger and file-list-item; remove no-fallback violation in switch-group invalid label.
- 1d66c65: Phase 3 overlay visual: dialog panel `radius="full"` is removed (pill dialogs contradict the calm surface language) — `SolarisDialogRadius` is now `'none' | 'sm' | 'md' | 'lg' | 'xl'` (max `xl`, default still `lg`; action-button `full` is unchanged). Dialog panels clamp `min-width` to the viewport (`min()` against `100vw - 20px`) so a 400px default panel no longer overflows a 360px phone, and the default `lg` radius steps down to `md` under 640px. Both close buttons now meet touch targets without changing visuals: the floating container close grows to a 24px box with a 44px `::after` hit area plus a visible focus ring, and the sticky header close keeps its 20px visual with a 24px minimum and a 44px `::after` hit area. `bottom` sheet remains the documented mobile pattern.
- 983b5f9: Phase 5 security audit: harden `solarisSafeHtml` with an SVG allowlist (`isTrustedFlagSvg` rejects non-SVG, event handlers, scripts and `javascript:` URLs before `bypassSecurityTrustHtml`), add `solaris-safe-html.pipe.spec.ts` regression tests, cover export download hardening (`rel=noopener`, `revokeObjectURL`, filename sanitize) with new `export.service.spec.ts` tests, and rewrite generic `SECURITY_EXCEPTION_FILE` blankets into per-API justifications (mega-menu, toast service, dropdown-submenu, popover-trigger encoding fix).
- 0c137c8: Fix `ReferenceError: Cannot access 'SolarisRadioComponent' before initialization` when evaluating the built bundle. `solaris-radio` imported the group tokens through the `radio-group` barrel while `solaris-radio-group` imported the radio component through the `radio` barrel — the only barrel cycle in the library. The radio component now imports `SOLARIS_RADIO_GROUP`/`SOLARIS_RADIO_GROUP_NAME` directly from the token file, matching the `checkbox`/`switch` pattern. No API or behavior change.
- 8873603: fix(record-grid): correct error, selection, sticky and i18n contract
  - `hasError`/`hasEmptyState` resolve through `error`/`errorKey` with the
    translated fallback, matching `solaris-table`; `errorKey` alone now shows
    the error state.
  - Grouped headers keep a functional select-all checkbox reusing
    `toggleSelectAllVisibleRows` and the tri-state labels.
  - `getAriaSort` returns `null` for non-sortable columns so the attribute is
    removed instead of polluting screen readers with `none`.
  - Second grouped header row exposes continuous `aria-colindex` through the
    shared visible-column index.
  - `allVisibleRowsSelected`/`someVisibleRowsSelected` are gated by
    `selectionMode="multiple"`, matching the table in `single`/`none` with a
    prefilled model.
  - `isStickyColumn` keeps the first data column fixed when selection is
    enabled (selection offset parity with the table).
  - Header/footer template resolvers return their concrete directive types
    without unsafe casts.
  - `GradebookAutofocusDirective` is exported from the gradebook barrel and the
    public entrypoint; record-grid imports it from the barrel.
  - Gradebook text moves to `solaris.dataDisplay.gradebook.*` (`editorLabel`,
    `status.missing/late/excused`, en-US + pt-BR) with legacy `gradebook.*`
    fallback before the documented English text.
  - Sort-cleared announcements resolve through
    `solaris.dataDisplay.{table,recordGrid}.sortedCleared` (en-US + pt-BR).
  - Editor keeps the cell alignment (`text-align: inherit`) and shares the
    table `tabular-nums`, so digits no longer shift or change glyphs in edit
    mode; table uses `border-collapse: collapse` (parity with `solaris-table`)
    with single-line body/foot joints and no doubled sticky-edge divider.
  - Draftbar actions use the `solaris-button` directive
    (`appearance="outline" size="sm"`) instead of hand-rolled styles and the
    draftbar aligns its actions to the end.
  - Sticky first column draws its divider as its own `border-inline-end` (single
    collapsed line, still stuck when scrolled) instead of a `box-shadow` that
    browsers drop under `border-collapse: collapse`.
  - Merged span origins (`rowspan`/`colspan` > 1, e.g. identity/section columns)
    no longer open editors: the write target would be ambiguous, so they render
    as text like computed cells.

  Follow-ups (not done here, tracked for P2/P3): F1 synthetic `footerText`
  rows, F2 `commitAll` `::` separator, F3 `parseDraftValue "09"`, F4 dead
  `normalizeRecordGridCellPadding/StripedMode`, F5 undocumented
  `records`/`sectionOf`/`writeOf` API, F6 `data` without `SolarisTableDataSource`.

- 853437a: Segmented Control: restyle internals without visual changes — removed all `::ng-deep` selectors from `solaris-segmented-control` and all `solaris-segmented-control` `:host-context` selectors from `solaris-segmented-item`. Parent-to-item styling now flows through inherited `--solaris-segmented-*` custom properties (no `var()` fallbacks, no comments), with edge-item radius resolved by the item itself via `:first-of-type` / `:last-of-type`. Icon-only items use `calc(var(--solaris-font-size-md) * 1.125)`.
- b922e19: Fix the flush (`sm` + `compact`) `solaris-segmented-control` rendering square outer corners on edge segments: the first and last `solaris-segmented-item` now carry the container radius (`--solaris-segmented-radius`) on their outer corners, and the flush indicator follows the selected edge via the new `data-selected-edge` host attribute (`first` | `last` | `both`, derived from the selected item index, so it supports any number of options). Both orientations are covered with logical properties.
- b922e19: Segmented Control: the invalid visual state now follows the same rule as `aria-invalid` — manual `[invalid]` or `required` + touched + empty value. Invalid styling goes beyond a red outline: danger-tinted selection indicator and border, danger selected-item text, and danger focus ring.
- b922e19: Fix `solaris-segmented-control` height when nested inside another component carrying its own `data-size`/`data-density` (e.g. the `sm` + `compact` command selector inside `solaris-code-block` rendered at 32px instead of 28px). The item's size/density visuals (`--solaris-segmented-item-gap`, `--solaris-segmented-item-padding-y`, `--solaris-segmented-item-font-size`, `--solaris-segmented-item-icon-size`) are now owned by the `solaris-segmented-control` host per size x density combination and inherited by `solaris-segmented-item`, instead of `:host-context([data-size][data-density])` rules that also matched outer ancestors. Remaining `:host-context` rules in the item are qualified with the `solaris-segmented-control` element.
- eac80a2: Fix `solaris-segmented-control` outer-size parity between `surface` and `outline` appearances. The outline container owns a real 1px border (kept for forced-colors safety), so its thickness is now subtracted from the inner spacing: container side padding is reduced by `--solaris-segmented-border-width` (horizontal) or on all sides (vertical), and item `min-height` is reduced by twice the border width in horizontal mode where vertical padding is zero. A 32px control no longer renders as 34px in outline mode, and the vertical indicator inset follows the compensated padding.
- 60f42b3: Fix `solaris-select` trigger/panel width sync when searchable. The search input no longer contributes intrinsic width (`width: 0` with `flex: 1`/`min-width: 0`), and — like the multi-select floor — the trigger keeps a `min-width` estimated from the widest option row, backing the panel `min-width` when no explicit `panelMinWidth` is given. Opening a searchable select no longer widens the trigger while the `matchTriggerWidth` panel keeps its stale width; both render at the widest-option size from the closed state.
- 60f42b3: Fix `solaris-select` and `solaris-multi-select` after form-field outline standardization: increase trigger/actions gaps so placeholder, value, clear (x) and chevron no longer look glued; hide chevron/clear while `loading` and reserve spinner space to prevent overlap; suppress form-field focus-ring when panel is connected (`data-connected-side`) so outline merges with the panel. Align multi-select select-all checkbox and option selection checkbox with the `solaris-checkbox` size x density matrix (9 combos) and make multi-select chip padding-y/x dynamic per size x density. Stabilize auto display ResizeObserver (outer trigger + subpixel guard + actions reserve) to fix clearable-mode flicker.
- 83488d0: Fix `solaris-select` and `solaris-multi-select` popover opening above the label when there is no space below. The CDK origin is now the `.solaris-form-field__control-wrapper` (input box) when `solarisPopoverTopConnected` is set, so the `top` fallback covers the label and stays connected to the field.
- 847c25b: Reduce `solaris-selection-card` and `solaris-form-field` compiled styles below the per-component budget with no visual change. The selection-card 3x3 `size` x `density` matrix is split by axis (`gap`/`padding` vary only by density, `media`/`dot`/`switch` only by size; only `indicator-size` keeps both axes), and `form-field` drops an `appearance` block that duplicated the `:host` defaults plus a redundant `invalid+focused` border rule.
- 966cf0a: Add the `camera` icon (Lucide) to the media group.
- 35174f7: fix(table): animate cell-detail expand/collapse like the responsive row detail
- 35174f7: fix(table-filter): resetting the column manager now restores the draft order and visibility to the column defaults (previously only the applied filter was cleared, so saving after reset restored the modified layout). The reset button is disabled while the drafts already match the defaults, and the save button is disabled while the drafts match the applied state.
- 35174f7: fix(table-filter): conditions with operators that require a value but have none (e.g. an empty number field) no longer filter rows — they are treated as no-ops, consistent with the existing empty `in`/`between` behavior. Also hides the number input spinners inside the filter panel.
- 35174f7: feature(table-filter): animate the active-filter chips row open/closed with the same grid expand pattern used by table detail rows (double-rAF open, timed collapse, reduced-motion support), including a subtle chip fade-in. Clearing filters now keeps a snapshot of the chips rendered during the collapse so they fade together with "Clear all" instead of vanishing first. The Filters button count badge pops in with a scale/fade animation to soften the pressed-state transition.
- 35174f7: fix(table-filter): keep the Filters count badge mounted inside a grid 0fr/1fr wrapper so the button width grows and shrinks smoothly in both directions (with a margin compensation for the parent gap and an inner fade/scale), instead of jumping when the badge mounts/unmounts. Reduced-motion safe.
- 868c88c: Tooltip: fix arrow tip overlapping panel text. The arrow element is now a clipping container placed strictly outside the panel with the diamond in `::before`, so only the outer triangle paints and no tip intrudes into the content on any placement (`top`, `bottom`, `left`, `right` and `-start`/`-end` variants).
- 1250459: Fix `pnpm verify` failures: move the sliced-translation aggregation out of `services/translation` into the `lib/i18n` layer (services must not import components), break the switch/switch-group and accordion/collapsible barrel import cycles that crashed bundle evaluation with a temporal-dead-zone error, and align the form-field radius docs and spec with the `md` default.

## 0.24.0

### Minor Changes

- 8b99d41: Add the `cookie` icon (Lucide) to the built-in registry in the Data group.
- 0f902a7: Refactor `solaris-dialog` to the `solaris-card` / `solaris-selection-card` pattern: panel adapts to content (fixed `size` scale `sm` / `md` / `lg` / `xl` removed in favor of a `fullscreen` flag plus explicit `width` / `height` constraints), 9 placements (`center`, `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, `bottom-right`) with 24px offsets, `headerSeparator` / `footerSeparator` opt-out (default `true`), panel `radius` / `density` with theme fallback, fixed `[data-dialog-close]` icon button owned by the container, zero `padding` / `margin` / `gap` defaults with density opt-in, action buttons forwarding `shape` / `density` / `radius` / `icon` / `loading` to `solaris-button`, and `surface` background on `--solaris-surface-base`, with `outline` as the new default appearance (was `surface`). Title and description element ids are now unique per dialog (`<dialog-id>-title` / `<dialog-id>-description`) and wired to the panel via `aria-labelledby` / `aria-describedby` (with `titleKey` / `descriptionKey` / `ariaLabelKey` / action `labelKey` translation support). `autoFocus` now supports `'panel'` and `false` plus per-action `autoFocus`, and `restoreFocus` actually restores focus to the trigger on close. Migration: dialogs relying on the old default paddings should set `density`; the header close button moved to the container.

## 0.23.0

### Minor Changes

- b0d9d79: Add commerce and utility icons to the built-in registry: `shopping-cart`, `shopping-basket`, `shopping-bag`, `wallet` and `globe-off` in the Data group, plus `square-stack` in the Layout group.

## 0.22.0

### Minor Changes

- e99c846: Card and selection-card ship with zero spacing by default and separators on by default. Migration: remove explicit `[separator]="true"` (now the default, use `[separator]="false"` to opt out) and set spacing through `size`/`density` or the `--solaris-card-*` / `--solaris-selection-card-*` tokens.
  - `solaris-card` and `solaris-selection-card` default to `padding: 0`, `gap: 0` and zero section margins in every `size` and `density`. `size` now only affects indicator, dot and side-media dimensions.
  - `solaris-card-header`, `solaris-card-footer`, `solaris-selection-card-header` and `solaris-selection-card-footer` now default `separator` to `true`.
  - Selection-card separators span the full row width, including the control column, and share the same subtle color through `--solaris-selection-card-header-border-color` and the new `--solaris-selection-card-footer-border-color`. The host exposes `data-header-separator` / `data-footer-separator`.
  - `solaris-selection-card` adds `selection="radio" | "switch"`, `selectionPosition="start" | "end"` and `mediaPosition="top" | "start"`. The radio sits in the header row at header height; the switch renders in the footer row and must not be used inside `solaris-radio-group`.
  - `solaris-card` adds `mediaPosition="top" | "start"` (fixed side thumb, vertically centered).

## 0.21.0

### Minor Changes

- fa8689d: Add institutional domain icons to the built-in registry: `id-card`, `badge`, `city`, `school`, `balance`, `signature`, `neighborhood`, `book-user` and `hash` in the Data group, plus `list-ordered` in the Layout group.

### Patch Changes

- 0179b25: Require patched Angular peers and remove the test-only Vitest peer dependency.
- fa8689d: Fix `solaris-select` and `solaris-multi-select` keeping the flat connected border after the popover closes. `data-connected-side` ownership moved to `SolarisPopoverTriggerDirective`, which now clears it on close, detach and overlay dispose, and keeps the panel data object in sync so the top/bottom flip is not reverted by change detection. The popover panel no longer renders a shadow when connected above a form field.

## 0.20.0

### Minor Changes

- fe0de1b: Add Selection Card for single-choice card options with Radio Group and Angular Forms support.
- 7e9858e: Add locale-aware date picker and date range picker form controls.

## 0.19.0

### Minor Changes

- db8a0b9: Add the `command`, `log-in`, `log-out`, and `share-2` built-in action icons.

### Patch Changes

- d736f5b: Document breadcrumb variants and limit Angular test workers to prevent local memory exhaustion.

## 0.18.0

### Minor Changes

- de89c85: Add headphones, headphones-off, timer, clock-arrow-right, truck, handshake, route, mouse-pointer-click, and rss built-in icons.

## 0.17.2

### Patch Changes

- 26f8d34: Render mega menu chevrons with CSS to preserve hydration and pointer interactions.

## 0.17.1

### Patch Changes

- Preserve server-rendered button variants during hydration and render mega menu chevrons before client startup.

## 0.17.0

### Minor Changes

- 8f815c3: Add reusable animated icons and an accessible menu toggle control.

## 0.16.1

### Patch Changes

- Fix SSR compatibility for DOM adapters without `dataset` support.

## 0.16.0

### Minor Changes

- feat(alert): add textPosition input and restructure alert showcase with tabs and section-card layout

## 0.15.0

### Minor Changes

- 84347e9: Add 12 new built-in icons: `key`, `rocket`, `package`, `plane`, `squared-text`, `send`,
  `notepad`, `star`, `star-plus`, `eject`, `podium` and `save`. Sorted into the existing
  icon groups (actions, communication, data, navigation, media) and exposed in the showcase
  category filters.
- Add `textPosition` input to `SolarisAlertComponent` supporting `'start' | 'center' | 'end' | 'space-between'` alignment. Restructure AlertShowcasePage with tabs for variants/appearances and a new Text Position section. Add hover color transition to alert close button matching the dialog pattern. Rename DialogPageComponent to DialogShowcaseComponent.

## 0.14.0

### Minor Changes

- 6107105: Add the `solaris-otp-input` preset form control and fix phone-field density.
  - **otp-input**: a row of single-character boxes driven by `maxLength` (default 12) with
    `minLength` validation, automatic focus advancement, keyboard navigation, paste support,
    configurable char type, optional masking and visual grouping. Ships a reusable
    `solarisOtpValidator` and a showcase page (`/forms/otp-input`).
  - **phone-field**: prefix sizes (flag, chevron, font, padding) now scale with the field
    density.

## 0.13.0

### Minor Changes

- f8f0c68: Add the `solaris-phone-field` preset form control.
  - Wraps `solaris-form-field` with a `tel` input and as-you-type formatting via `libphonenumber-js`.
  - Exposes a searchable country selector in the prefix (flag + calling code) backed by a popover listbox.
  - Stores a single E.164 value through a `ControlValueAccessor` and ships a reusable `solarisPhoneValidator`.
  - Adds `libphonenumber-js` and `country-flag-icons` as runtime dependencies.
  - Adds a showcase page (`/forms/phone-field`) demonstrating the field.

## 0.12.0

### Minor Changes

- Polish the toast and button components and refresh the light/dark color tokens.
  - **toast**: use `fit-content` width, increase padding and add vertical spacing between stacked toasts, and add a 2px rounded accent bar colored to match the variant icon.
  - **button**: refine appearance/color defaults and borders, and rework the showcase to browse appearances per color through tabs.
  - **tokens**: update the light and dark semantic color tokens.

## 0.11.2

### Patch Changes

- 7e089b4: fix(button): apply variant attributes synchronously to avoid FOUC

  The `[solaris-button]` and `[solaris-icon-button]` directives rely on
  `data-appearance`, `data-color`, `data-radius`, and `data-shape` attributes to
  select the correct visual. These were applied only during Angular's first
  change detection, so on first paint (especially with SSR/hydration or deferred
  hydration) the element briefly showed the base style before switching to the
  configured variant — a visible color flash.

  The directives now set these attributes synchronously in the constructor, so
  the element carries the correct variant from the moment it exists in the DOM.
  Host bindings remain in place to keep them in sync when inputs change at
  runtime.

  Migration: none.

## 0.11.1

### Patch Changes

- d4411af: fix(button): prevent color flash before hydration

  The base `[solaris-button]` and `[solaris-icon-button]` styles used the
  `primary` tokens as the default, while the components' actual default is
  `color="neutral"`. During SSR/hydration (or any delayed attribute application),
  buttons rendered with the primary color for a frame before switching to their
  configured color.

  The base styles now default to the neutral/solid tokens, matching the real
  component default, so buttons with no explicit `color` render correctly on the
  first paint without flashing.

  Migration: none. Buttons without an explicit `color` input already behaved as
  `neutral` at runtime; the initial paint now matches that instead of flashing
  `primary` first.

## 0.11.0

### Minor Changes

- 85710b7: feature(forms): larger field labels, larger password toggle, label actions
  - Field labels now use `--solaris-font-size-md` for every density (one step
    above the previous `sm`), improving readability across compact, normal, and
    comfortable densities.
  - The password-field visibility toggle icon is now sized one typography step
    above the density font size for every density (`compact` → `lg`, `normal` →
    `xl`, `comfortable` → `2xl`), keeping it proportionally larger than the text.
    The password-field host now exposes `data-density`.
  - New `[solaris-form-label-action]` slot renders content (e.g. a "Forgot
    password?" link) on the same row as the label, aligned to the opposite side.
    It is forwarded by `solaris-email-field`, `solaris-password-field`,
    `solaris-select`, and `solaris-multi-select`.
  - Fixed multi-level content projection for projected affixes: `[solaris-form-prefix]`
    and `[solaris-form-suffix]` declared inside the preset fields now render in the
    affix slots (previously they fell into the control wrapper). The preset fields
    re-project these slots with `ngProjectAs`, and the new label action slot uses
    the same mechanism.

  Migration: none required. All changes are additive; existing labels and toggle
  icons simply render slightly larger.

### Patch Changes

- 85710b7: fix(icon): preserve brand colors and add inheritColor input

  Multi-color brand icons (`google`, `microsoft`, `android`) and monochrome brand
  icons (`apple`, `github`) carry their own fills. Previously the SVG root forced
  `stroke="currentColor"` on every element, so these icons gained an inherited
  outline in the surrounding text color, washing out their brand colors.

  `solaris-icon` now detects icons that define their own element fills and omits
  the inherited stroke (`stroke="none"`). A new `inheritColor` input (`true` by
  default) gives explicit control: set `[inheritColor]="false"` to render a
  line-based icon without an inherited stroke.

## 0.10.0

### Minor Changes

- e64e48d: feature(icon): add brand icons and button icon inputs

  Adds built-in provider/brand icons to the icon registry: `google`,
  `microsoft`, `apple`, `android`, and `github`. Multi-color brand icons keep
  their official brand colors; monochrome brand icons (`apple`, `github`) use
  `currentColor` so they adapt to the active theme.

  Extends the SVG icon definition model so each element (path, rect, circle,
  line, polyline, polygon) can carry its own `fill`/`stroke` attributes,
  enabling multi-color icons.

  `[solaris-button]` now accepts an `icon` input (a registered `SolarisIconName`)
  rendered inside the button, plus `iconPosition` (`'start'` | `'end'`) to place
  it before or after the text. The padding on the icon side is reduced so the
  icon sits close to the button edge, matching social login button conventions.

  Migration: none required — the `[solaris-button-icon]` projection directive
  continues to work for custom inline SVGs and content.

## 0.9.0

### Minor Changes

- f30e482: feature(data-display): add label support to divider

  `solaris-divider` now renders text between its lines via `label` or `labelKey`
  (translated with the Solaris i18n system). `textPosition` (`'center'`,
  `'start'`, `'end'`) controls the label alignment on horizontal dividers.
  - When a label is present, the divider becomes semantic: `role="separator"` is
    applied and `aria-hidden` is removed, regardless of the `decorative` input,
    so the label is announced to assistive technology.
  - Labels are ignored on vertical dividers.
  - New CSS tokens: `--solaris-divider-text-gap`, `--solaris-divider-text-color`,
    `--solaris-divider-text-font-size`.

## 0.8.0

### Minor Changes

- 8a033ee: feature(forms): unify prefix/suffix as icon inputs across form fields

  Adds `prefix` and `suffix` inputs (icon names) to `solaris-form-field`,
  `solaris-email-field`, `solaris-password-field`, `solaris-select`, and
  `solaris-multi-select`. When set, an icon is rendered in the field's affix
  slot with the correct token color and density-based size, matching the layout
  of directly projected affixes.
  - `solaris-email-field` and `solaris-password-field`: `prefixIcon` /
    `suffixIcon` renamed to `prefix` / `suffix`.
  - `solaris-select` and `solaris-multi-select`: `icon` renamed to `prefix`.
  - Manual projection via `[solaris-form-prefix]` / `[solaris-form-suffix]`
    remains supported for text, buttons, or any custom content.

  Affix icons now size with `--solaris-density-font-size` instead of a fixed
  `--solaris-font-size-lg`, and inherit the affix color on hover consistently.
  The password-field toggle gains density-based inline padding so it stays clear
  of the field border in compact density.

  Migration: replace `icon` with `prefix` on select/multi-select, and
  `prefixIcon`/`suffixIcon` with `prefix`/`suffix` on email/password fields.

## 0.7.2

### Patch Changes

- b379605: fix(forms): allow custom translation resolver and fix prefix/suffix projection
  - `SolarisTranslateConfig` now accepts an optional `resolver` function. When a
    `*Key` input (e.g. `labelKey`, `placeholderKey`, `errorKey`) resolves a key
    that is not registered in the Solaris translations, the service delegates to
    the resolver so the host app's own i18n system can translate it. Previously
    unknown keys were returned verbatim, so keys like
    `app.login.email.placeholder` showed up as raw text even when the app used
    its own `translate` pipe.
  - `solaris-email-field` and `solaris-password-field` now forward projected
    `[solaris-form-prefix]` and `[solaris-form-suffix]` content to the inner
    `solaris-form-field`, so affixes declared inside these composite fields
    render correctly.
  - The password visibility toggle icon now sizes itself with the density
    typography token (`--solaris-density-font-size`) instead of a fixed
    `--solaris-font-size-xl`, keeping it proportional across density modes.

## 0.7.1

### Patch Changes

- 13e385f: fix(theme): connect SCSS theme config to runtime density and color scheme

  Two fixes for consumers who configure Solaris exclusively through the SCSS
  `@include solaris.theme(...)` setup:
  - **Density now applies.** `SolarisThemeService.density` falls back to the
    `--solaris-density-default` CSS custom property emitted by the `theme()`
    mixin when no `density` is set in `provideSolaris`. Previously the CSS
    variable was written but never read, so components always resolved to
    `normal` even when the SCSS set `density: compact`.
  - **Forced color schemes now apply to all components.** The `theme()` mixin
    now emits the light or dark color tokens directly on
    `:root:not([data-theme])` when `color-scheme: light` or `dark` is set, so
    the explicit choice overrides `@media (prefers-color-scheme: dark)`.
    Previously `color-scheme: light` only set the CSS property while component
    tokens (buttons, form fields, etc.) still followed the OS preference.
    `color-scheme: system` keeps the previous auto behavior.

  The `solaris-light-tokens` and `solaris-dark-tokens` SCSS mixins are now
  exported so the theme mixin can reuse them.

## 0.7.0

### Minor Changes

- dd6a837: feature(dialog): add placement option for bottom-anchored panels

  Adds a `placement` option ('center' | 'bottom') to `SolarisDialogOptions` and
  `SolarisDialogComponentConfig`. When set to 'bottom', the dialog panel anchors
  to the bottom of the viewport, enabling bottom-sheet style previews without
  occupying the full height.

- ba15a08: feature(styles): standardize units to px and colors to hex

  Replaces rem-based design tokens with px so rendering is deterministic
  regardless of the consumer's root font-size. A consumer that sets a custom
  root font-size (e.g. 62.5%) will no longer silently rescale Solaris
  components.

  Token values changed:
  - spacing, radius, typography, and density tokens now use px;
  - translucent rgb()/rgba() values now use 8-digit hex (e.g. `#0000004d`);
  - default public API sizes now use px (`panelMaxHeight` and
    `solarisTooltipMaxWidth` default to `320px`);
  - `rem` is forbidden in component styles; relative units are allowed only
    where required (`vw`/`dvh`, `em` for letter-spacing).

  Page zoom still satisfies WCAG 1.4.4 (Resize Text).

- abd6ada: feature(styles): add normal density mode and make density control typography

  Introduces a third density mode, `normal`, as the intermediate step between
  `compact` and `comfortable`. `normal` is now the default density across the
  theme and all components (`SolarisDensity`, `SolarisThemeConfig`).

  Density now affects typography in addition to spacing:
  - new density typography tokens `--solaris-density-font-size` and
    `--solaris-density-font-size-sm`, defined per density mode;
  - inputs, textareas, buttons, and icon buttons scale their font size with
    density (compact 12px, normal 14px, comfortable 16px);
  - form-field labels, hints, and errors follow the density scale.

  Theme propagation fixed: components now resolve their effective density from
  the configured theme density via `SolarisThemeService`, so setting
  `density: compact` in the consumer setup applies to every component instead
  of being ignored.

  This is additive: existing `compact` and `comfortable` values keep working.
  Components default to `normal` instead of `comfortable`, so consumers relying
  on the previous default should explicitly set `density: comfortable`.

  ### Removed `size` from the form-field family

  The `size` input (`sm`/`md`/`lg`) was removed from `solaris-form-field`,
  `solaris-email-field`, `solaris-password-field`, `solaris-select`, and
  `solaris-multi-select`. Density now controls height, padding, and typography
  for these, making `size` redundant on the wrapper. The `SolarisFormFieldSize`,
  `SolarisEmailFieldSize`, `SolarisPasswordFieldSize`, `SolarisSelectSize`, and
  `SolarisMultiSelectSize` types were removed. Controls such as
  `solaris-input`, `solaris-textarea`, and `solaris-option` keep their own
  `size` input.

  ### Removed `size` from `solaris-tabs` and `solaris-editable-tabs`

  The `size` input (`sm`/`md`/`lg`) was removed from `solaris-tabs` and
  `solaris-editable-tabs`. Density now controls tab padding, gap, icon size, and
  typography (`compact`/`normal`/`comfortable`), which is most visible in the
  `pills` appearance. The `SolarisTabsSize` and `SolarisEditableTabsSize` types
  were removed.

  ### Removed `size` from `solaris-button`

  The `size` input (`sm`/`md`/`lg`) was removed from `solaris-button`. Density
  now controls button height, padding, gap, min-width, icon size, and
  typography (`compact`/`normal`/`comfortable`). The `SolarisButtonSize` type
  was removed. The icon button (`solaris-icon-button`) keeps its own `size`
  input.

  ### Removed `size` from `solaris-icon-button` and added `shape`

  The `size` input (`sm`/`md`/`lg`) was removed from `solaris-icon-button`.
  Density now controls icon button size and typography, matching
  `solaris-button`. The `SolarisIconButtonSize` type was removed.

  Both `solaris-button` and `solaris-icon-button` now expose a `shape` input
  (`'normal' | 'wide'`). `shape="wide"` renders a horizontally elongated
  button (wider than tall) by increasing horizontal padding and minimum width.

  ### Added `shape` to `solaris-tabs`

  `solaris-tabs` now exposes a `shape` input (`'normal' | 'wide'`).
  `shape="wide"` increases tab horizontal padding so tabs are elongated, most
  visible in the `pills` appearance. The elongation scales with density via
  `--solaris-density-padding-lg`, staying proportional in all modes.
  `solaris-editable-tabs` also exposes `shape` and forwards it to the inner
  tabs.

- 3ad0b23: feature(icons): add 37 new built-in icons and replace loader

  Adds new built-in icons grouped into two new categories (communication and
  media) plus additions to the existing groups. Replaces the loader glyph with
  the new loader-circle path.

## 0.6.1

### Patch Changes

- f729075: Fix a circular module dependency between `SolarisAccordionComponent` and `SolarisCollapsibleComponent` that crashed the published `fesm2022` bundle at module-evaluation time in JIT/unit-test environments (`ReferenceError: Cannot access 'SolarisCollapsibleComponent' before initialization`). The collapsible component now imports the `SOLARIS_ACCORDION` token directly from `model/accordion.tokens` instead of the accordion barrel, letting the bundler emit the classes in a deterministic order. Consumers can now import any symbol from the package barrel in Vitest/Karma/JIT without evaluation errors.

## 0.6.0

### Minor Changes

- 504f8ca: feature(feedback): add loading-text component

  Adds `solaris-loading-text`, an animated loading caption that sweeps a shimmer across short text. Supports `sm`/`md`/`lg`/`xl` sizes, semantic and `custom` colors, `slow`/`normal`/`fast` speeds, i18n-enabled text, `role="status"` with `aria-live="polite"`, and reduced-motion support.

- b0c183a: feature(feedback): add progress component

  Adds `solaris-progress`, a progress indicator with determinate (`value` 0-100) and indeterminate modes, `sm`/`md`/`lg` sizes, semantic and `custom` colors, an optional i18n-enabled label and numeric percentage, `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and reduced-motion support.

- fc285b2: feature(feedback): add spinner component

  Adds `solaris-spinner`, an indeterminate loading indicator with `sm`/`md`/`lg`/`xl` sizes (thickness scales with size), semantic and `custom` colors, `speed` and `easing` motion controls, an optional full-screen `backdrop`, an optional i18n-enabled label, `role="status"` + `aria-live="polite"` announcements, and reduced-motion support. The button loading state now renders `solaris-spinner` instead of a CSS pseudo-element spinner.

- 1608f7b: feature(feedback): add spinner stacked variant, progress layout, and rounded caps

  Extends `solaris-spinner` with a `variant` input (`ring` | `stacked` | `progress`). `stacked` renders a classic radial spinner built from 8 independent rounded bars (45 degrees apart) that animate a clockwise fading trail through staggered opacity states; `progress` renders a determinate arc driven by `value` (0-100, clamped) with optional `showPercent` and `description`/`descriptionKey` lines, `role="progressbar"`, and `aria-valuenow`/`valuemin`/`valuemax`/`valuetext`. The progress percentage and label share a baseline with description lines aligned beneath. The indicator now renders as SVG with rounded stroke caps in a fixed `120` viewBox that keeps caps fully inside the canvas, and the static track uses the indicator color at reduced opacity (`--solaris-spinner-track-color` defaults to `--solaris-spinner-color`, `--solaris-spinner-track-opacity` defaults to `--solaris-opacity-20`).

## 0.5.0

### Minor Changes

- 1680e35: remove the unused `setChecked` method from `solaris-radio` (the radio group syncs checked state through `writeValue`, so the method was dead API) and the unused `isCheckSelection` computed from `solaris-option` (single-selection feedback is rendered by the trailing check indicator). Also narrow the `writeValue` parameter type in `solaris-radio-group` from `unknown | null` to `unknown`.
- 7f05f82: rename `change` output to `changeEvent` in `solaris-switch`, `solaris-checkbox`, `solaris-radio` and the `solaris-switch-group`, `solaris-checkbox-group`, `solaris-radio-group` components. The old name collided with the native DOM `change` event and was flagged by `@angular-eslint/no-output-native`. Consumers should bind `(changeEvent)` instead of `(change)`.

## 0.4.0

### Minor Changes

- Added `SolarisCollapsibleComponent`, an accessible disclosure primitive with token-driven styling, keyboard support, reduced-motion-aware animation, and showcase/documentation coverage.
- Added `SolarisAccordionComponent`, a grouped disclosure component built on top of Collapsible. It supports single and multiple expansion modes, boxed and lined appearances, controlled Collapsible items, APG-compatible semantics, and keyboard interaction.
- Added `SolarisBreadcrumbComponent` for hierarchical navigation. It supports link and text items, icon-only and icon-with-text items, slash/chevron/dot separators, start/middle/end overflow strategies, a dropdown overflow menu, optional previous/next pager controls, default translations, showcase coverage, and public exports.
- Added built-in `slash`, `dot`, and `home` icons for navigation and breadcrumb use cases.
- Added `SolarisDividerStackComponent`, a layout primitive for separating stacked content groups with token-driven spacing and inset controls.
- Added the unified `provideSolaris(config)` setup API and `SolarisSetupConfig` type. Individual setup providers remain internal and are no longer part of the public API surface.
- Added an interactive `init` schematic and updated `ng-add` to delegate to it. The schematic creates `src/styles/solaris.scss`, wires the global stylesheet, and adds `provideSolaris(...)` to the application configuration.
- Updated schematics packaging so generated schematics compile as CommonJS inside the ESM package and can be loaded by Angular CLI.
- Centralized generated component IDs through shared `nextIdFor` and `resolveElementId` utilities, removing repeated per-component ID counters.

### Patch Changes

- Excluded Storybook-only packages from the Angular library dependency checks so package validation focuses on dependencies used by the published library.

### Migration Notes

- Replace public imports of individual setup providers with `provideSolaris(config)`.
- Existing component imports remain stable unless they depended on internal setup providers that are no longer exported from the public API.

## 0.3.3

### Patch Changes

- Published component style entry points through the unified public styles API.
- Moved component SCSS entry points under `src/styles` so ng-packagr includes them in the published package assets.
- Updated the public styles index to forward all component styles from a single entry point.
- Added initial `ng-add` schematic infrastructure for automatic consumer setup.
- Added token validation exceptions for intentional hardcoded SCSS values in overlay and navigation controls.

## 0.3.2

### Patch Changes

- Updated exported style assets to make public style imports resolve consistently from the npm package.
- Added wildcard style exports so consumers can import the aggregate styles entry point or individual public style files when needed.

## 0.3.1

### Patch Changes

- Fixed missing published CSS custom properties for `--solaris-*` design tokens.
- Moved token SCSS files into the published `src/styles/token` asset tree.
- Updated the public theme entry point so calling `@include solaris.theme()` emits color, spacing, typography, density, radius, shadow, and related token variables on `:root`.

## 0.3.0

### Minor Changes

- Added `SolarisToastService` and toast UI for non-blocking notifications. Toasts support neutral, info, success, warning, danger, loading, and custom variants; surface and outline appearances; multiple positions; configurable duration; countdown progress; hover/focus pause; expandable content; action buttons; and programmatic dismissal/update APIs.
- Added dialog infrastructure for modal workflows, alerts, confirmations, and custom Angular component content. Dialogs support multiple variants and sizes, simple and component-based opening modes, configurable close behavior, focus management, action buttons, and dialog flow transitions.
- Added `SolarisStepperComponent` for multi-step flows with horizontal and vertical orientations, default/card/dashed appearances, linear and non-linear navigation, status states, content transitions, and built-in action alignment.
- Added `SolarisTabsComponent` with horizontal and vertical orientations, underline/pills/enclosed appearances, automatic or manual activation, lazy panels, animated indicators, scrollable tab bars, badges, icons, and WAI-ARIA tab semantics.
- Added `SolarisSegmentedControlComponent`, a ControlValueAccessor-compatible segmented selection control with orientation, appearance, size, density, radius, disabled, readonly, required, animated indicator, and keyboard support.
- Added `SolarisDividerComponent` for decorative or semantic separators with horizontal and vertical orientation, subtle and strong appearances, spacing controls, and inset controls.
- Added dropdown menu primitives with item, checkbox, and radio item support; none/single/multiple selection modes; color variants; submenu support; placement configuration; type-ahead; arrow/Home/End navigation; Enter/Space activation; Escape dismissal; and WAI-ARIA menu semantics.
- Added editable tabs on top of Tabs and Dropdown Menu, including inline rename, keyboard confirm/cancel, reorder guards, remove guards, default tab actions, custom actions, and configurable action visibility.
- Added Form Field character counters for projected inputs and textareas with `maxlength`, including normal, warning, and danger counter states. Email and password field presets now pass `maxlength` through to their native inputs.

## 0.2.0

### Minor Changes

- Added the forms foundation used by Solaris form controls, including shared label, hint, error, prefix, suffix, appearance, size, density, radius, invalid, and focus-ring patterns.
- Added `SolarisFormFieldComponent` for consistent field composition around native and custom controls.
- Added input and textarea directives with external Form Field integration, ControlValueAccessor support, and accessible description wiring.
- Added password and email field presets with ControlValueAccessor support, visibility toggle, strength/domain validation patterns, normalization, blocked-domain handling, and complete showcase documentation.
- Added checkbox, checkbox group, radio, radio group, switch, and switch group components with Reactive Forms integration, disabled/touched/invalid states, accessible labels, and keyboard support.
- Added option and option group primitives for reusable selection UIs with labels, icons, grouping, and slots.
- Added select and multi-select components with Form Field integration, searchable panels, keyboard navigation, popover-based overlays, i18n, ControlValueAccessor support, select-all handling, display modes, removable chips, and overflow behavior.
- Added popover and tooltip primitives for form and overlay use cases, including placement, alignment, offset, trigger behavior, keyboard dismissal, arrow rendering, delay configuration, closeable content, and i18n support.
- Added shared prefix and suffix directives compatible with Form Field, Select, and Multi Select.
- Added showcase pages and documentation for the forms release.

## 0.1.0

### Minor Changes

- Established the Angular library workspace, npm package foundation, build pipeline, test infrastructure, linting, formatting, validation scripts, and Changesets setup.
- Added the design token foundation, theme foundation, light/dark/system theme support, density primitives, high-contrast preparation, reduced-motion support, and root font-size strategy.
- Added translation, accessibility, icon registry, and testing utility foundations.
- Added the first low-risk component set: Button, Icon Button, Badge, Card, Alert, and Skeleton.
- Added initial showcase coverage and public documentation structure for the library foundation.
