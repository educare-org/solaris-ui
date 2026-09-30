# Announcement

## Purpose

Announcement is a **full-bleed site banner** for page-top messages:
product launches, promotions, maintenance notices, seasonal campaigns.

## Definition

Announcement is a **thin container over Alert**. It owns placement
(`sticky`, `align`), dismissal (with optional `localStorage` persistence)
and the polite live region — while the projected content is **fully free**:
text, links, images, animated blocks, image backgrounds.

Use Alert for inline contextual messages. Use Announcement for the top
of the page. Place it as the first element of the app shell, before
the header.

## When to use

- Site-wide banners (launches, promotions, seasonal campaigns)
- Maintenance or incident notices visible on every route
- Contextual top-of-page messages with an optional link/CTA

## When not to use

- As an inline form or section message (use Alert)
- As an overlay notification (use Toast)
- For modal or blocking flows (use Dialog)

---

## API

### SolarisAnnouncementComponent

**Selector:** `solaris-announcement`

**Inputs:**

| Input         | Type                                                                    | Default     | Description                                             |
| ------------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| align         | `'left' \| 'center' \| 'right'`                                         | `'center'`  | Content alignment (mapped to Alert text position)       |
| size          | `'sm' \| 'md' \| 'lg'`                                                  | `'md'`      | Size, passed through to the inner Alert                 |
| density       | `'compact' \| 'normal' \| 'comfortable' \| undefined`                   | `undefined` | Spacing density (falls back to theme density)           |
| variant       | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'custom'` | `'neutral'` | Semantic variant, passed through to the inner Alert     |
| appearance    | `'tonal' \| 'outline' \| 'surface' \| 'solid'`                          | `'solid'`   | Visual appearance, passed through                       |
| radius        | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                | `'none'`    | Border radius (square full-bleed by default)            |
| sticky        | `boolean`                                                               | `true`      | Sticks to the viewport top (`--solaris-z-index-sticky`) |
| closable      | `boolean`                                                               | `true`      | Shows close button (in-flow, respects padding)          |
| showIcon      | `boolean`                                                               | `false`     | Shows variant icon                                      |
| icon          | `string \| undefined`                                                   | `undefined` | Custom icon name                                        |
| live          | `'off' \| 'polite' \| 'assertive'`                                      | `'polite'`  | Live region setting (inner Alert stays silent)          |
| dismissKey    | `string \| undefined`                                                   | `undefined` | `localStorage` key for persistent dismissal             |
| closeLabel    | `string \| undefined`                                                   | `undefined` | Close button accessible label                           |
| closeLabelKey | `string \| undefined`                                                   | `undefined` | Close button i18n key                                   |

**Outputs:**

| Output    | Type   | Description                                                   |
| --------- | ------ | ------------------------------------------------------------- |
| dismissed | `void` | Emitted when close is clicked (after persisting `dismissKey`) |

### SolarisAnnouncementMediaDirective

**Selector:** `[solaris-announcement-media]`

Optional leading slot for a logo or image. Preserves the host element.

### SolarisAnnouncementActionsDirective

**Selector:** `[solaris-announcement-actions]`

Optional trailing slot for CTAs. Preserves the host element.

### Storage helpers

```typescript
import { isSolarisAnnouncementDismissed, clearSolarisAnnouncementDismissed } from '@educarehq/solaris-ui';
```

- `isSolarisAnnouncementDismissed(key)` — SSR-safe check for `*ngIf` guards.
- `persistSolarisAnnouncementDismissed(key)` — persist without a component.
- `clearSolarisAnnouncementDismissed(key)` — show the banner again (e.g. new campaign).

---

## Variants

| Variant             | Usage                                            |
| ------------------- | ------------------------------------------------ |
| `neutral` (default) | Site banners, promotions, institutional messages |
| `info`              | Product news, guidance                           |
| `success`           | Positive confirmations                           |
| `warning`           | Maintenance notices, moderate risk               |
| `danger`            | Incidents, critical errors                       |
| `custom`            | Image backgrounds and brand styling via CSS vars |

---

## Appearances

| Appearance        | Visual                                              |
| ----------------- | --------------------------------------------------- |
| `solid` (default) | Filled banner, on-solid text, maximum prominence    |
| `tonal`           | Soft variant background, no border                  |
| `outline`         | Transparent background with variant border          |
| `surface`         | Soft variant background with visible variant border |

---

## Sizes

| Size           | Content font | Effect                    |
| -------------- | ------------ | ------------------------- |
| `sm`           | `xs`         | Slim single-line banners  |
| `md` (default) | `sm`         | Balanced default          |
| `lg`           | `md`         | High-prominence campaigns |

Size selects the padding/gap step; the effective density resolves the
value — the same 9-combination matrix as Alert.

---

## Placement

Render it first in the shell. The component never teleports itself —
layout ownership stays with the app:

```html
@if (!isAnnouncementDismissed()) {
<solaris-announcement align="center" dismissKey="site-announcement-sep-2026" (dismissed)="dismissAnnouncement()">
  New features just dropped in September Early Access.
  <a href="/changelog">See what's new →</a>
</solaris-announcement>
}
<app-header />
<router-outlet />
```

With `dismissKey`, a returning visitor never sees the banner again
(the component suppresses itself on init). Without it, the consumer
controls visibility via `dismissed` — exactly like Alert.

---

## Free content

Anything can be projected: links, images, animated blocks.

```html
<solaris-announcement showIcon icon="sparkles">
  <img solaris-announcement-media src="/logo.svg" alt="" />
  Black Friday — up to 50% off.
  <span solaris-announcement-actions>
    <a href="/sale">Shop now</a>
  </span>
</solaris-announcement>
```

For one-line arrangements (logo left, CTA right), wrap content in your
own flex container — the banner never constrains inner layout.

---

## Image background

Use `variant="custom"` with the documented Alert custom tokens.
Contrast over photography is the consumer's responsibility (use a scrim):

```css
.hero-announcement {
  --solaris-alert-custom-color: #ffffff;
  --solaris-alert-custom-border-color: transparent;
  --solaris-alert-custom-icon-color: #ffffff;
  --solaris-alert-custom-background: center / cover url('/banner.jpg') #111827;
}
```

```html
<solaris-announcement variant="custom" class="hero-announcement"> Limited offer — ends Sunday. <a href="/sale">Shop now</a> </solaris-announcement>
```

Custom tokens inherit from the host into the inner Alert, so a plain
class on `solaris-announcement` is enough — no `::ng-deep` needed.

---

## Close button and padding

The close button is **in-flow** (last flex item of the inner Alert),
never absolutely overlaid. Container padding from the `size × density`
matrix always applies around it — custom backgrounds and projected
images are never covered by the button.

---

## Accessibility

- Host defaults to `role="status"` + `aria-live="polite"`; the inner
  Alert is forced silent (`live="off"`) to avoid double announcements.
- Close button is a native `<button type="button">` with an accessible
  name (`closeLabel | closeLabelKey | 'solaris.announcement.close'`).
- Enter animation respects `prefers-reduced-motion` and
  `data-reduced-motion`.
- Decorative projected images must use `alt=""`.

---

## Examples

```html
<!-- Brex-style: centered text + inline link -->
<solaris-announcement> New features just dropped. <a href="/changelog">See what's new →</a> </solaris-announcement>

<!-- Persistent dismiss -->
<solaris-announcement dismissKey="promo-2026" (dismissed)="onDismiss()"> Sign up before July 31 and get a gift card. </solaris-announcement>

<!-- Static (scrolls away) -->
<solaris-announcement [sticky]="false" align="left"> Maintenance window on Sunday 02:00–04:00. </solaris-announcement>
```

---

## Limitations (v1)

- Single banner only — no stack manager (stack with `@for` in the shell).
- No auto-dismiss timer (use Toast for timed messages).
- No built-in marquee/rotation — project your own animated content.
- Custom backgrounds require the `custom` variant + CSS variables.

---

## CSS Variables

Announcement inherits all `--solaris-alert-*` tokens through the inner
Alert (set them on the `solaris-announcement` host). Custom variant:

| Token                                 | Purpose                         |
| ------------------------------------- | ------------------------------- |
| `--solaris-alert-custom-color`        | Text color for custom variant   |
| `--solaris-alert-custom-background`   | Background for custom variant   |
| `--solaris-alert-custom-border-color` | Border color for custom variant |
| `--solaris-alert-custom-icon-color`   | Icon color for custom variant   |
