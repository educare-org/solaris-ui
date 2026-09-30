# Solaris Card

## Purpose

Card is a surface component that groups related content into a visually cohesive container. It provides a flexible anatomy with optional structural wrappers, semantic directives, and controlled appearances. By default it is non-interactive; setting `href` turns the whole surface into a single link (clickable card).

## Philosophy: Free with Official Anatomy

Card v1 is free.

This means:

- `<solaris-card>` accepts any projected content;
- wrappers (header, content, media, footer, actions) are optional facilitators;
- directives (`[solaris-card-title]`, `[solaris-card-description]`) preserve native semantics;
- consumers choose the semantically appropriate heading level.

## When to use

- Grouping related content into a distinguishable container.
- Building dashboard widgets, profile summaries, or detail views.
- Providing visual separation between content blocks.
- Linking a whole summary surface to a single destination (`href`).

## When not to use

- Do not use Card as a dialog, modal, or overlay.
- Do not use Card for form sections where a fieldset is more appropriate.
- Do not use Card when a simpler container or plain section is sufficient.
- Do not use clickable Card with multiple destinations; one card is one link.
- Do not project buttons, links, or other interactive controls into a clickable Card.
- Do not use Card for selectable options; use `solaris-selection-card` instead.

## API

### SolarisCardComponent

**Selector:** `solaris-card`

| Input           | Type                                           | Default     | Description                                             |
| --------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------- |
| `appearance`    | `'surface' \| 'outline' \| 'tonal' \| 'glass'` | `'surface'` | Visual appearance                                       |
| `radius`        | `'none' \| 'sm' \| 'lg' \| 'xl'`               | `'lg'`      | Border radius                                           |
| `padding`       | `'none' \| 'sm' \| 'md' \| 'lg'`               | `'none'`    | Inner spacing tier (composes with density)              |
| `density`       | `'compact' \| 'normal' \| 'comfortable'`       | inherited   | Density variant                                         |
| `glassTexture`  | `'none' \| 'grooves'`                          | `'none'`    | Decorative texture (glass only)                         |
| `mediaPosition` | `'top' \| 'start'`                             | `'top'`     | Media layout: full-width or side                        |
| `href`          | `string`                                       | `undefined` | Turns the whole surface into a single link when set     |
| `target`        | `string`                                       | `undefined` | Link target, as in `HTMLAnchorElement`                  |
| `rel`           | `string`                                       | `undefined` | Link rel; defaults to `noopener` when `target="_blank"` |
| `disabled`      | `boolean`                                      | `false`     | Disables the link overlay (clickable cards only)        |
| `ariaLabel`     | `string`                                       | `undefined` | Accessible name of the link overlay (clickable cards)   |
| `ariaLabelKey`  | `string`                                       | `undefined` | Translation key for `ariaLabel`                         |

> Card ships with zero spacing by default (`padding`, `gap` and section
> margins are `0`). `padding` and `density` are the opt-in sources of spacing:
> choose `padding="sm"`/`"md"`/`"lg"` when the design needs breathing room,
> or override the `--solaris-card-*` tokens directly.
>
> `size` was removed. Migrate `size="sm"` → `padding="sm"`,
> `size="md"` → `padding="md"`, `size="lg"` → `padding="lg"`.
> Cards without `size` already render `padding="none"` and need no change.

## Wrappers

All wrappers are optional and project free content.

| Component          | Selector               | Purpose                       |
| ------------------ | ---------------------- | ----------------------------- |
| SolarisCardHeader  | `solaris-card-header`  | Title, description, metadata  |
| SolarisCardContent | `solaris-card-content` | Main content area             |
| SolarisCardMedia   | `solaris-card-media`   | Image, video, or visual media |
| SolarisCardFooter  | `solaris-card-footer`  | Metadata, dates, metrics      |
| SolarisCardActions | `solaris-card-actions` | Action row (buttons, links)   |

### SolarisCardHeader

| Input       | Type    | Default | Description                       |
| ----------- | ------- | ------- | --------------------------------- |
| `separator` | boolean | `true`  | Shows a border-bottom when `true` |

### SolarisCardFooter

| Input       | Type    | Default | Description                    |
| ----------- | ------- | ------- | ------------------------------ |
| `separator` | boolean | `true`  | Shows a border-top when `true` |

## Directives

| Directive                       | Selector                     | Purpose                             |
| ------------------------------- | ---------------------------- | ----------------------------------- |
| SolarisCardTitleDirective       | `[solaris-card-title]`       | Applies card title typography       |
| SolarisCardDescriptionDirective | `[solaris-card-description]` | Applies card description typography |

Directives preserve the host element, allowing consumers to choose the correct semantic level (h2, h3, h4, p, span).

## Appearances

| Appearance | Visual                                               |
| ---------- | ---------------------------------------------------- |
| `surface`  | Solid background, subtle border, default card        |
| `outline`  | Transparent background, more visible border          |
| `tonal`    | Subtle tinted background, controlled border          |
| `glass`    | Translucent with backdrop blur, for special contexts |

Default: `surface`

## Radius

| Radius | Value                    |
| ------ | ------------------------ |
| `none` | 0                        |
| `sm`   | var(--solaris-radius-sm) |
| `lg`   | var(--solaris-radius-lg) |
| `xl`   | var(--solaris-radius-xl) |

Default: `lg`

Radius `full` is not supported in Card v1.

## Padding

`padding` selects a spacing tier; `density` resolves its value through the
`--solaris-density-*` tokens, so the same tier breathes with the theme
(`compact` tighter, `comfortable` looser).

| Padding | Tier (normal density)                                                 |
| ------- | --------------------------------------------------------------------- |
| `none`  | Zero spacing (default)                                                |
| `sm`    | `--solaris-density-padding-sm` (section gap + header gap scale along) |
| `md`    | `--solaris-density-padding-md`                                        |
| `lg`    | `--solaris-density-padding-lg` (larger side-media thumb)              |

Default: `none`

`padding` controls the internal section padding and gap, not the card's width. The card still expands to fit its content unless constrained by its parent.

## Clickable Card

Setting `href` renders a native link overlay covering the whole surface, so the
card behaves like a single link: native keyboard focus, `Enter` activation,
context-menu and modifier-click support come from the browser.

```html
<solaris-card href="/integrations/slack" ariaLabel="Open the Slack integration">
  <solaris-card-header>
    <h3 solaris-card-title>Slack Integration</h3>
    <p solaris-card-description>Connect your Slack account.</p>
  </solaris-card-header>
</solaris-card>
```

Rules:

- One card is one destination. For cards with several actions, keep the card
  non-interactive and use `solaris-card-actions` with explicit buttons/links.
- Never project buttons, links, or other interactive controls into a clickable Card.
- `ariaLabel` (or `ariaLabelKey`) names the link overlay; provide it whenever
  the card content alone does not name the destination.
- `disabled` removes the link target, takes the overlay out of the tab order
  (`tabindex="-1"`) and exposes `aria-disabled="true"`. It only applies to
  clickable cards.

## Glass Texture

`glassTexture` adds a decorative texture overlay to the `glass` appearance. It only takes effect when `appearance="glass"`.

| Texture   | Effect                                                    |
| --------- | --------------------------------------------------------- |
| `none`    | No extra texture (default)                                |
| `grooves` | Repeating radial-gradient groove pattern over the surface |

```html
<solaris-card appearance="glass" glassTexture="grooves">
  <solaris-card-content>Content</solaris-card-content>
</solaris-card>
```

## Density

| Density       | Effect                    |
| ------------- | ------------------------- |
| `compact`     | Reduced padding and gap   |
| `comfortable` | Increased padding and gap |

When not provided, Card inherits density from the theme system.

## Header and Footer Separators

Header (`separator="true"`, default) renders a border-bottom; footer
(`separator="true"`, default) renders a border-top. Both are purely visual
separators and must not be the only way to convey semantic grouping. Set
`[separator]="false"` to remove either line. When the card has a single
section (only a header or only a footer), the separator border is suppressed
automatically — there is nothing to separate from.

## Media

`<solaris-card-media>` projects content (typically an image) and handles overflow control.

| `mediaPosition` | Layout                                                            |
| --------------- | ----------------------------------------------------------------- |
| `top`           | Full-width media before the body (default).                       |
| `start`         | Fixed-size thumb at the side of the content, vertically centered. |

```html
<solaris-card mediaPosition="start">
  <figure solaris-card-media>
    <img src="icon.png" alt="Module icon" />
  </figure>
  <div solaris-card-content>
    <h3 solaris-card-title>Analytics</h3>
  </div>
</solaris-card>
```

It does not:

- set aspect ratio;
- perform lazy loading;
- manipulate images via TypeScript;
- remove alt attributes from projected images.

## Accessibility

- Card is non-interactive by default: no tabindex, no role button, no click events.
- Clickable Card renders a native link overlay: focus and `Enter` activation
  are native; the overlay carries `aria-label` from `ariaLabel`/`ariaLabelKey`
  and `aria-disabled` when `disabled`.
- Title directive preserves the heading level chosen by the consumer.
- Description directive preserves the element chosen by the consumer.
- CardMedia preserves alt attributes of projected images.
- Footer separator is visual only; semantic grouping must be conveyed through content structure.

## Examples

```html
<!-- Basic card -->
<solaris-card>
  <h3 solaris-card-title>Card Title</h3>
  <p solaris-card-description>Card description.</p>
  <div>Card content</div>
</solaris-card>

<!-- Full anatomy -->
<solaris-card>
  <solaris-card-header>
    <h3 solaris-card-title>Integration</h3>
    <p solaris-card-description>Description of the integration.</p>
  </solaris-card-header>
  <solaris-card-content>
    <solaris-badge color="primary">Development</solaris-badge>
  </solaris-card-content>
  <solaris-card-footer [separator]="true">
    <span>8 comments</span>
    <span>Tomorrow</span>
  </solaris-card-footer>
</solaris-card>

<!-- With media -->
<solaris-card>
  <solaris-card-media>
    <img src="preview.jpg" alt="Preview of the feature" />
  </solaris-card-media>
  <solaris-card-content>
    <h3 solaris-card-title>Feature Name</h3>
    <p solaris-card-description>Feature description.</p>
  </solaris-card-content>
  <solaris-card-footer>
    <span>Updated 2 days ago</span>
  </solaris-card-footer>
</solaris-card>

<!-- Clickable card -->
<solaris-card href="/features/analytics" ariaLabel="Open the analytics feature">
  <solaris-card-content>
    <h3 solaris-card-title>Analytics</h3>
    <p solaris-card-description>Feature description.</p>
  </solaris-card-content>
</solaris-card>
```

## Composition with Badge and Skeleton

Card works well with other Solaris components:

```html
<solaris-card>
  <solaris-card-header>
    <h3 solaris-card-title>Task Name</h3>
    <p solaris-card-description>Task description.</p>
  </solaris-card-header>
  <solaris-card-content>
    <solaris-badge color="primary">In Progress</solaris-badge>
  </solaris-card-content>
</solaris-card>

<solaris-card>
  <solaris-card-content>
    <solaris-skeleton variant="rectangular" height="10rem"></solaris-skeleton>
    <solaris-skeleton [lines]="3"></solaris-skeleton>
  </solaris-card-content>
</solaris-card>
```

## CSS Custom Properties

| Token                                | Purpose                              |
| ------------------------------------ | ------------------------------------ |
| `--solaris-card-background`          | Background color                     |
| `--solaris-card-color`               | Text color                           |
| `--solaris-card-border-color`        | Border color                         |
| `--solaris-card-border-width`        | Border width                         |
| `--solaris-card-radius`              | Border radius                        |
| `--solaris-card-padding`             | Inner padding                        |
| `--solaris-card-gap`                 | Gap between sections                 |
| `--solaris-card-shadow`              | Box shadow                           |
| `--solaris-card-glass-background`    | Glass background (glass only)        |
| `--solaris-card-glass-border-color`  | Glass border color                   |
| `--solaris-card-glass-blur`          | Glass backdrop blur amount           |
| `--solaris-card-footer-border-color` | Footer separator border color        |
| `--solaris-card-header-border-color` | Header separator border color        |
| `--solaris-card-header-gap`          | Gap inside header                    |
| `--solaris-card-media-size`          | Side-media thumb size (`start` mode) |

The link overlay reuses the global `--solaris-focus-ring-*`,
`--solaris-shadow-sm` and `--solaris-z-index-content` tokens.

## Limitations (v1)

- No `selected`, `pressed`, or `active` states (use `solaris-selection-card` for selectable options).
- No `radius="full"`.
- No aspect ratio control on media.
- No harness in v1 (may be added later for components with richer interaction).
- Presets (metric-card, profile-card, media-card, dashboard-card, card-list) are future patterns.
