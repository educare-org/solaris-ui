# Solaris Avatar

## Purpose

Avatar identifies a person, team, or organization through a photo, generative
initials, or an empty placeholder. It also carries presence (status dot with
an off-hours `z` emblem that never changes the status color), notification
counts (same `count`/`max` semantics as `solaris-badge`), a verified seal, an
organization emblem, and border states (`active` ring, `loading` arc).

The family has four components:

- `solaris-avatar` — the base identity block.
- `solaris-avatar-group` — a data-driven overlapped row with a focusable `+N`
  overflow button. The overflow opens a consumer-provided menu; the group never
  implements its own overlay.
- `solaris-avatar-group-badge` — a pill combining a mini member cluster with a
  text label (e.g. a team name). The `+N` marker is static text, never a
  button, so the pill itself can be a link or a button without nesting
  interactives. It is intentionally standalone: `solaris-badge` carries
  count/status semantics that don't fit an identity cluster, but every
  group-badge token still comes from `--solaris-*`.
- `solaris-avatar-profile` — an account-selector row (avatar + title +
  subtitle + optional badge) with a compact avatar-only mode.

Overlays (tooltip, dropdown menu) are always reused from Solaris; the avatar
family exposes labels and slots for them instead of implementing its own.

## When to use

- Showing who did something (comments, assignees, activity feeds).
- Signaling presence next to identity.
- Rendering member stacks with `solaris-avatar-group`.
- Rendering account switchers with `solaris-avatar-profile`.

## When not to use

- Do not use Avatar as a button by default; only the explicit action overlay
  (`actionAriaLabel` + `actionClick`) is interactive.
- Do not implement tooltips, popovers, or menus inside avatar templates —
  reuse `solaris-tooltip` and the menu components.
- Do not persist the generative art in the design system; the seed is pure and
  deterministic, persistence belongs to the consumer app.

## API

### SolarisAvatarComponent

**Selector:** `solaris-avatar`

| Input                | Type                                                                | Default        | Description                                                    |
| -------------------- | ------------------------------------------------------------------- | -------------- | -------------------------------------------------------------- |
| `src`                | `string \| undefined`                                               | `undefined`    | Photo URL; on error falls back to the generative art           |
| `srcset`             | `string \| undefined`                                               | `undefined`    | Responsive photo candidates (omitted when undefined)           |
| `alt`                | `string \| undefined`                                               | `undefined`    | Decorative fallback identity when `name` is missing            |
| `imageLoading`       | `'lazy' \| 'eager'`                                                 | `'lazy'`       | Native `loading` forwarded to the photo (`eager` for LCP)      |
| `imageDecoding`      | `'async' \| 'sync' \| 'auto'`                                       | `'async'`      | Native `decoding` forwarded to the photo                       |
| `name`               | `string \| undefined`                                               | `undefined`    | Person name; drives initials, hash seed, and accessible name   |
| `userId`             | `string \| undefined`                                               | `undefined`    | Stable hash seed (preferred over `name`)                       |
| `size`               | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                              | `'md'`         | Size variant                                                   |
| `radius`             | `'full' \| 'md' \| 'sm' \| 'square'`                                | `'full'`       | Border radius                                                  |
| `fallback`           | `'initials' \| 'generative' \| 'icon' \| 'empty'`                   | `'generative'` | Rendered when there is no photo                                |
| `status`             | `'online' \| 'away' \| 'busy' \| 'dnd' \| 'offline'` \| `undefined` | `undefined`    | Presence status                                                |
| `showStatus`         | `boolean`                                                           | `false`        | Render the status dot                                          |
| `workingHours`       | `SolarisAvatarWorkingHours \| undefined`                            | `09:00–18:00`  | Working range in `'HH:mm'`                                     |
| `timezone`           | `string \| undefined`                                               | local          | IANA timezone for the off-hours check                          |
| `showOffHours`       | `boolean`                                                           | `true`         | Render the `z` emblem when outside working hours               |
| `offHoursOverride`   | `boolean \| undefined`                                              | `undefined`    | Force the off-hours state when defined                         |
| `count`              | `number \| undefined`                                               | `undefined`    | Notification counter (badge semantics)                         |
| `max`                | `number`                                                            | `99`           | Cap before the `"+"` suffix (`103` → `"99+"`)                  |
| `showZero`           | `boolean`                                                           | `false`        | Render `0` instead of hiding the counter                       |
| `verified`           | `boolean`                                                           | `false`        | Info rosette seal, pushed outward (shifts the status dot left) |
| `loading`            | `boolean`                                                           | `false`        | Animated border arc (reduced-motion safe)                      |
| `active`             | `boolean`                                                           | `false`        | Continuous active ring                                         |
| `empty`              | `boolean`                                                           | `false`        | Neutral `+` placeholder surface                                |
| `ariaLabel`          | `string \| undefined`                                               | `undefined`    | Accessible name override                                       |
| `ariaLabelKey`       | `string \| undefined`                                               | `undefined`    | i18n key for the accessible name                               |
| `emptyAriaLabel`     | `string \| undefined`                                               | `undefined`    | Accessible name for the empty state                            |
| `emptyAriaLabelKey`  | `string \| undefined`                                               | `undefined`    | i18n key for the empty accessible name                         |
| `actionAriaLabel`    | `string \| undefined`                                               | `undefined`    | Makes the avatar interactive with an action overlay button     |
| `actionAriaLabelKey` | `string \| undefined`                                               | `undefined`    | i18n key for the action label                                  |

| Output        | Description                           |
| ------------- | ------------------------------------- |
| `actionClick` | Emitted when the action overlay fires |

Slots: `[solaris-avatar-organization]` (top-left emblem, projected content).

### SolarisAvatarGroupComponent

**Selector:** `solaris-avatar-group`

| Input          | Type                                   | Default     | Description                                             |
| -------------- | -------------------------------------- | ----------- | ------------------------------------------------------- |
| `users`        | `readonly SolarisAvatarGroupUser[]`    | `[]`        | Data-driven members (avatar inputs subset)              |
| `max`          | `number`                               | `4`         | Visible members before the `+N` overflow (`<= 0` → `4`) |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Forwarded to member avatars and the overflow pill       |
| `radius`       | `'full' \| 'md' \| 'sm' \| 'square'`   | `'full'`    | Forwarded to member avatars                             |
| `overlap`      | `number \| undefined`                  | token       | Overlap in px (`--solaris-avatar-group-overlap`)        |
| `ariaLabel`    | `string \| undefined`                  | `undefined` | Group label; also overrides the overflow button label   |
| `ariaLabelKey` | `string \| undefined`                  | `undefined` | i18n key for the group/overflow label                   |

| Output          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `overflowClick` | Emitted when the `+N` overflow button fires                          |
| `memberClick`   | Emitted with `{ user, index }` when a member avatar fires its action |

Members are clickable per-avatar: set `actionAriaLabel` (or
`actionAriaLabelKey`) on a `SolarisAvatarGroupUser` to render that member as
a real `<button>` inside `solaris-avatar`. Members without an action label
stay non-interactive. Set `tooltip` (or `tooltipKey`) per member to reuse the
Solaris tooltip on that avatar. Hovering (or keyboard-focusing) a member lifts it
(`translateY(-4px)`) and dims the siblings; the separator ring is
`var(--solaris-spacing-3)` (4px). Reduced motion disables the lift.
Keyboard: one tab stop per group (roving `tabindex`); `ArrowLeft`/`ArrowRight`
(RTL-aware), `Home`/`End` move focus between member actions and the `+N`
overflow button.

### SolarisAvatarGroupBadgeComponent

**Selector:** `solaris-avatar-group-badge`

| Input                | Type                                   | Default     | Description                                              |
| -------------------- | -------------------------------------- | ----------- | -------------------------------------------------------- |
| `users`              | `readonly SolarisAvatarGroupUser[]`    | `[]`        | Data-driven members (avatar inputs subset)               |
| `max`                | `number`                               | `3`         | Visible members before the static `+N` (`<= 0` → `3`)    |
| `size`               | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'`      | Avatar size inside the pill                              |
| `radius`             | `'full' \| 'md' \| 'sm' \| 'square'`   | `'full'`    | Forwarded to member avatars                              |
| `label`              | `string \| undefined`                  | `undefined` | Pill text (e.g. a team name)                             |
| `labelKey`           | `string \| undefined`                  | `undefined` | i18n key for the pill text                               |
| `href`               | `string \| undefined`                  | `undefined` | Turns the pill into a link                               |
| `target`             | `string \| undefined`                  | `undefined` | Link target (`_blank` auto-adds `rel`)                   |
| `rel`                | `string \| undefined`                  | `undefined` | Link rel override                                        |
| `actionAriaLabel`    | `string \| undefined`                  | `undefined` | Turns the pill into a `button` + label                   |
| `actionAriaLabelKey` | `string \| undefined`                  | `undefined` | i18n key for the button label                            |
| `ariaLabel`          | `string \| undefined`                  | `undefined` | Accessible name (defaults to label, then `overflowMore`) |
| `ariaLabelKey`       | `string \| undefined`                  | `undefined` | i18n key for the accessible name                         |

| Output        | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `badgeClick`  | Emitted when the pill link/button is activated                       |
| `memberClick` | Emitted with `{ user, index }` when a member avatar fires its action |

Members support the same per-avatar action as `solaris-avatar-group`
(`actionAriaLabel` / `actionAriaLabelKey` on `SolarisAvatarGroupUser`) with
the same hover lift + sibling dim, plus per-member `tooltip` / `tooltipKey`
reusing the Solaris tooltip. Member actions only render when the pill
itself is non-interactive (`span`); when the pill is a link or button the
members stay static so interactives are never nested. Interactive members
share the group roving `tabindex` (arrows/`Home`/`End`). The pill label
truncates with `ellipsis` and exposes the full text in `title` only when
actually overflowing (measured like `solaris-avatar-profile`).

### SolarisAvatarProfileComponent

**Selector:** `solaris-avatar-profile`

| Input                | Type                                   | Default     | Description                                         |
| -------------------- | -------------------------------------- | ----------- | --------------------------------------------------- |
| `src`                | `string \| undefined`                  | `undefined` | Photo forwarded to the inner avatar                 |
| `srcset`             | `string \| undefined`                  | `undefined` | Photo candidates forwarded to the inner avatar      |
| `name`               | `string \| undefined`                  | `undefined` | Identity for initials, hash, and fallback label     |
| `userId`             | `string \| undefined`                  | `undefined` | Stable hash seed                                    |
| `size`               | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Avatar size                                         |
| `title`              | `string \| undefined`                  | `undefined` | Primary text (name)                                 |
| `titleKey`           | `string \| undefined`                  | `undefined` | i18n key for the title                              |
| `subtitle`           | `string \| undefined`                  | `undefined` | Secondary text (email)                              |
| `subtitleKey`        | `string \| undefined`                  | `undefined` | i18n key for the subtitle                           |
| `badgeText`          | `string \| undefined`                  | `undefined` | Small pill text via `solaris-badge` (`sm`, primary) |
| `badgeTextKey`       | `string \| undefined`                  | `undefined` | i18n key for the pill text                          |
| `href`               | `string \| undefined`                  | `undefined` | Turns the identity (avatar + texts) into a link     |
| `target`             | `string \| undefined`                  | `undefined` | Link target (`_blank` auto-adds `rel`)              |
| `rel`                | `string \| undefined`                  | `undefined` | Link rel override                                   |
| `actionAriaLabel`    | `string \| undefined`                  | `undefined` | Turns the identity into a `button` + label          |
| `actionAriaLabelKey` | `string \| undefined`                  | `undefined` | i18n key for the button label                       |
| `count`              | `number \| undefined`                  | `undefined` | Counter forwarded to the inner avatar               |
| `max`                | `number`                               | `99`        | Counter cap                                         |
| `showZero`           | `boolean`                              | `false`     | Render `0` instead of hiding the counter            |
| `status`             | `SolarisAvatarStatus \| undefined`     | `undefined` | Presence status                                     |
| `showStatus`         | `boolean`                              | `false`     | Render the status dot                               |
| `verified`           | `boolean`                              | `false`     | Verified seal                                       |
| `compact`            | `boolean`                              | `false`     | Avatar-only mode (`data-compact`)                   |
| `ariaLabel`          | `string \| undefined`                  | `undefined` | Accessible name (defaults to the title)             |
| `ariaLabelKey`       | `string \| undefined`                  | `undefined` | i18n key for the accessible name                    |

Slot: `[solaris-avatar-profile-actions]` (trailing actions, e.g. `...` menu trigger — always stays outside the link/button identity, so it never nests interactives).

| Output         | Description                                        |
| -------------- | -------------------------------------------------- |
| `profileClick` | Emitted when the identity link/button is activated |

### SolarisAvatarPresenceService

Pure, `providedIn: 'root'` helpers with an injectable `now` parameter for tests:

- `isOffHours(now, workingHours = 09:00–18:00, timezone?): boolean` — timezone-aware via `Intl`; handles overnight ranges; invalid ranges return `false`.
- `resolveInitials(name): string` — two uppercase letters (first + last word; single word uses its first two letters; accents stripped).
- `resolveGenerativeSeed(userId, name?): number` — deterministic FNV-1a hash; same user always renders the same art.
- `generatedPaletteIndex(seed, paletteCount): number` — maps a seed onto the fixed token palette range.

## Sizes

| Size | Pixels | Initials |
| ---- | ------ | -------- |
| `xs` | 24px   | `xs`     |
| `sm` | 32px   | `xs`     |
| `md` | 40px   | `sm`     |
| `lg` | 48px   | `md`     |
| `xl` | 64px   | `lg`     |

Density is intentionally inherited only: avatar sizes are fixed, so no
`density` input exists (unlike `solaris-badge`, which keeps the size × density
matrix). Status dot, count badge, verified seal, and organization emblem scale
proportionally with the host instead of using fixed values.

## Radius

| Radius   | Value                        |
| -------- | ---------------------------- |
| `full`   | `var(--solaris-radius-full)` |
| `md`     | `var(--solaris-radius-md)`   |
| `sm`     | `var(--solaris-radius-sm)`   |
| `square` | `var(--solaris-radius-none)` |

Status, count, verified, and organization markers follow the host radius.
The generative art fills the whole shape: the SVG clip is a full-bleed rect
and the outer host radius rounds it, so `square` avatars get corner-to-corner
art instead of a round orb on a flat tile.

## Count

Follows the `solaris-badge` semantics exactly:

```html
<solaris-avatar name="Amelia Davis" [count]="3" />
<solaris-avatar name="Amelia Davis" [count]="103" />
<!-- renders "99+" with title="103" -->
```

- `count > max` renders `"${max}+"` and exposes the full value in `title`.
- `count === 0` hides the counter unless `showZero` is `true`.
- `max <= 0` falls back to `99`, mirroring the badge guard.
- Single-digit counts render circular (`data-count-single` drops the side
  padding); longer counts grow into a pill. The counter follows the avatar
  radius and carries a knockout separator like every other marker.

## Status and off-hours

```html
<solaris-avatar name="Amelia Davis" status="online" [showStatus]="true" />
```

- The dot renders only when `showStatus` is `true`; colors come from status
  tokens (`online` → success, `away` → warning, `busy` → solid danger,
  `dnd` → danger with a white horizontal bar, `offline` → border).
- The `z` emblem is a two-stroke SVG glyph nested on the status dot edge
  (bottom-right): a status-colored `z` over a thicker surface-base halo
  stroke that cuts it out of the dot. It renders only when
  `showOffHours && isOffHours` and never changes the dot color itself.
- `offHoursOverride` forces the state for stories and tests.
- With `verified`, the info rosette seal keeps the bottom-right corner and
  the status dot shifts to the bottom-left. Every marker (status, count,
  verified) sits pushed outward from the edge and cuts a knockout separator
  into the avatar instead of sitting glued on the photo. The seal check uses
  `text-default` for contrast on the info fill in both themes.
- `loading` renders a gray track ring with a primary arc that travels over it;
  under reduced motion the arc stops as a full static ring. `active` renders a
  thicker continuous ring in a widened primary→info gradient (active, info,
  hover, base) so it reads as a gradient instead of a flat ring. Both rings
  float with a transparent gap around the avatar instead of touching it.

## CSS Variables

| Token                                | Purpose                           |
| ------------------------------------ | --------------------------------- |
| `--solaris-avatar-size`              | Outer size (per `size`)           |
| `--solaris-avatar-radius`            | Border radius (per `radius`)      |
| `--solaris-avatar-background`        | Fallback surface (per palette)    |
| `--solaris-avatar-color`             | Initials/icon color (per palette) |
| `--solaris-avatar-font-size`         | Initials size (per `size`)        |
| `--solaris-avatar-ring-color`        | Separator ring around markers     |
| `--solaris-avatar-knockout`          | Knockout width around markers     |
| `--solaris-avatar-ring-offset`       | Gap between avatar and rings      |
| `--solaris-avatar-status-size`       | Status dot diameter               |
| `--solaris-avatar-status-color`      | Status dot fill (per `status`)    |
| `--solaris-avatar-count-height`      | Counter height                    |
| `--solaris-avatar-count-background`  | Counter fill                      |
| `--solaris-avatar-count-color`       | Counter text                      |
| `--solaris-avatar-verified-size`     | Verified seal diameter            |
| `--solaris-avatar-ring-width`        | Active/loading ring thickness     |
| `--solaris-avatar-organization-size` | Organization emblem box           |
| `--solaris-avatar-mesh-a/b/c`        | Generative mesh spot fills        |
| `--solaris-avatar-group-overlap`     | Group overlap (px)                |
| `--solaris-avatar-group-size`        | Overflow pill size (per `size`)   |
| `--solaris-avatar-group-hover-lift`  | Group hover lift distance         |
| `--solaris-avatar-group-dim-opacity` | Group sibling dim opacity         |
| `--solaris-avatar-profile-max-width` | Title/subtitle truncation width   |

Generative palettes pair `--solaris-*-surface` backgrounds with the matching
`--solaris-*-text` initials color, so text contrast holds by token design. The
art is a mesh gradient: seeded color spots blurred (`feGaussianBlur`)
and clipped to the avatar shape, so the same user always renders the same orb
while different users get different compositions. Ten palettes (`0–9`)
cover warning, info, success, primary, orange, danger, two blue alternates
and two graphite grays; palettes `0–4` are unchanged so existing seeds keep
their colors. The spot geometry also varies by seed across three layouts
(orbit triangle, diagonal ribbon with four spots, tight cluster + satellite),
so defaults differ in shape as well as color. The initials carry a
surface-base soft-glow halo built from blurred `text-shadow`s that just
separates them from bright warm mixes (green/red/yellow) in both themes —
`stroke`/`paint-order` are SVG-only and
do not render on HTML text — so contrast holds without muting the art.

## Accessibility

- Non-interactive avatar: `role="img"` with a composite `aria-label`
  (`name`, translated status, off-hours note, verified note, count).
- Interactive avatar (`actionAriaLabel`): the host drops `role="img"` and an
  inner real `<button>` carries the action label with `:focus-visible`.
- Empty state without action: `role="img"` with `emptyAriaLabel`.
- Status is never color-only: the accessible name always includes the
  translated status and the off-hours note.
- Group overflow `+N` is a real `<button>` labeled by `ariaLabel` or the
  translated `solaris.avatar.overflowMore` (`{{count}} more people`).
- Profile title/subtitle truncate with ellipsis and expose the full text in
  `title` only when actually overflowing (measured like `solaris-badge`).
- `loading` uses a CSS arc that stops under `prefers-reduced-motion` (and
  `[data-reduced-motion='true']`); state never depends on animation alone.
- Keyboard: `Enter`/`Space` activate the action and overflow buttons natively.
  Member groups keep a single tab stop (roving `tabindex`) with
  `ArrowLeft`/`ArrowRight` (RTL-aware) and `Home`/`End` moving focus.

## Examples

```html
<!-- Photo with fallback -->
<solaris-avatar src="https://example.com/photo.jpg" name="Amelia Davis" userId="user-1" />

<!-- Status with off-hours -->
<solaris-avatar name="Amelia Davis" status="online" [showStatus]="true" />

<!-- Count, verified, organization -->
<solaris-avatar name="Amelia Davis" [count]="3" [verified]="true">
  <span solaris-avatar-organization>G</span>
</solaris-avatar>

<!-- Action overlay -->
<solaris-avatar name="Amelia Davis" actionAriaLabel="Change photo" (actionClick)="onChangePhoto()" />

<!-- Empty -->
<solaris-avatar [empty]="true" emptyAriaLabel="Add member" />

<!-- Group -->
<solaris-avatar-group [users]="users" [max]="4" (overflowClick)="openList()" (memberClick)="openMember($event)" />

<!-- Group badge (static +N, pill itself is the link) -->
<solaris-avatar-group-badge [users]="users" [max]="3" label="Design team" href="/teams/design" (badgeClick)="openTeam()" (memberClick)="openMember($event)" />

<!-- Tooltip and menu are always reused, never built-in: the dropdown content is 100% consumer-provided -->
<solaris-avatar name="Amelia Davis" status="online" [showStatus]="true" [solarisTooltip]="'avatar.example.tooltip-hint' | translate" />
<solaris-avatar-group solaris-dropdown-menu-trigger [solarisDropdownMenuTriggerFor]="membersMenu" [users]="users" [max]="2" (overflowClick)="openList()" />
<solaris-dropdown-menu #membersMenu>
  <!-- qualquer conteúdo: items simples, com avatar, com descrição, ações... -->
  <solaris-dropdown-menu-item label="Amelia Davis" />
</solaris-dropdown-menu>

<!-- Profile (link + button identities work in full and compact modes) -->
<solaris-avatar-profile name="Amelia Davis" title="Amelia Davis" subtitle="davis@example.com" badgeText="PRO" [verified]="true" href="/users/amelia" (profileClick)="onOpenProfile()">
  <button type="button" solaris-avatar-profile-actions>...</button>
</solaris-avatar-profile>
<solaris-avatar-profile name="Amelia Davis" title="Amelia Davis" [compact]="true" actionAriaLabel="Open profile" (profileClick)="onOpenProfile()" />
```

## Limitations (v1)

- No photo editing, upload, or crop.
- No overlay implementation (tooltip/menu come from the consumer via Solaris).
- No generative-art persistence; the seed is pure and deterministic.
- No lazy-load beyond native `<img loading>` attributes set by consumers.
- Group is data-driven (`users`); projecting arbitrary `<solaris-avatar>`
  children is not supported in v1.
