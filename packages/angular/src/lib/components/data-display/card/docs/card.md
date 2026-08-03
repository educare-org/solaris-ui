# Solaris Card

## Purpose

Card is a non-interactive surface component that groups related content into a visually cohesive container. It provides a flexible anatomy with optional structural wrappers, semantic directives, and controlled appearances.

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

## When not to use

- Do not use Card for navigation or clickable surfaces (v1 is non-interactive).
- Do not use Card as a dialog, modal, or overlay.
- Do not use Card for form sections where a fieldset is more appropriate.
- Do not use Card when a simpler container or plain section is sufficient.

## API

### SolarisCardComponent

**Selector:** `solaris-card`

| Input          | Type                                           | Default     | Description                      |
| -------------- | ---------------------------------------------- | ----------- | -------------------------------- |
| `appearance`   | `'surface' \| 'outline' \| 'tonal' \| 'glass'` | `'surface'` | Visual appearance                |
| `radius`       | `'none' \| 'sm' \| 'lg' \| 'xl'`               | `'lg'`      | Border radius                    |
| `size`         | `'sm' \| 'md' \| 'lg'`                         | `'md'`      | Internal section gap and padding |
| `density`      | `'compact' \| 'comfortable'`                   | inherited   | Density variant                  |
| `glassTexture` | `'none' \| 'grooves'`                          | `'none'`    | Decorative texture (glass only)  |

## Wrappers

All wrappers are optional and project free content.

| Component          | Selector               | Purpose                       |
| ------------------ | ---------------------- | ----------------------------- |
| SolarisCardHeader  | `solaris-card-header`  | Title, description, metadata  |
| SolarisCardContent | `solaris-card-content` | Main content area             |
| SolarisCardMedia   | `solaris-card-media`   | Image, video, or visual media |
| SolarisCardFooter  | `solaris-card-footer`  | Metadata, dates, metrics      |
| SolarisCardActions | `solaris-card-actions` | Future action area            |

### SolarisCardFooter

| Input       | Type    | Default | Description                    |
| ----------- | ------- | ------- | ------------------------------ |
| `separator` | boolean | `false` | Shows a border-top when `true` |

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

## Size

| Size | Effect                                                                          |
| ---- | ------------------------------------------------------------------------------- |
| `sm` | Reduced section gap and padding (`--solaris-spacing-4`)                         |
| `md` | Default section gap and padding                                                 |
| `lg` | Increased section gap and padding (`--solaris-spacing-6`/`--solaris-spacing-8`) |

Default: `md`

`size` controls the internal section gap and padding, not the card's width. The card still expands to fit its content unless constrained by its parent.

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

## Footer Separator

When `separator="true"` is set on `<solaris-card-footer>`, a border-top is rendered. This is a purely visual separator and must not be the only way to convey semantic grouping.

## Media

`<solaris-card-media>` projects content (typically an image) and handles overflow control. It does not:

- set aspect ratio;
- perform lazy loading;
- manipulate images via TypeScript;
- remove alt attributes from projected images.

## Accessibility

- Card v1 is non-interactive: no tabindex, no role button, no click events.
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

| Token                                | Purpose                       |
| ------------------------------------ | ----------------------------- |
| `--solaris-card-background`          | Background color              |
| `--solaris-card-color`               | Text color                    |
| `--solaris-card-border-color`        | Border color                  |
| `--solaris-card-border-width`        | Border width                  |
| `--solaris-card-radius`              | Border radius                 |
| `--solaris-card-padding`             | Inner padding                 |
| `--solaris-card-gap`                 | Gap between sections          |
| `--solaris-card-shadow`              | Box shadow                    |
| `--solaris-card-glass-background`    | Glass background (glass only) |
| `--solaris-card-glass-border-color`  | Glass border color            |
| `--solaris-card-glass-blur`          | Glass backdrop blur amount    |
| `--solaris-card-footer-border-color` | Footer separator border color |
| `--solaris-card-header-gap`          | Gap inside header             |

## Limitations (v1)

- Non-interactive: no click, routerLink, keyboard, or focus behavior.
- No `selected`, `pressed`, or `active` states.
- No clickable, action, selection, or task card presets.
- No `radius="full"`.
- No aspect ratio control on media.
- No harness in v1 (may be added later for components with richer interaction).
- Presets (metric-card, profile-card, media-card, dashboard-card, card-list) are future patterns.
