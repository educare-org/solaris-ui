# Solaris Content Carousel

## Purpose

Content carousel rotates arbitrary projected components one slide at a time
with previous/next arrows, dot navigation, and full keyboard support. Slides
are projected through `<ng-template solaris-carousel-slide>` children queried
via `contentChildren` in DOM order. The carousel never measures its own
height: it fills `height: 100%` of the parent, so the consumer layout owns the
box (login split panel, promo slot, mega-menu featured panel). There is no
auto-height animation in v1 — all slides share the fixed parent height.

## API

### SolarisContentCarouselComponent

**Selector:** `solaris-content-carousel`

Children: `<ng-template solaris-carousel-slide>` (directive,
`contentChildren`, DOM order). Projected content — including its own i18n —
belongs to the consumer.

| Input                        | Type                                                          | Default     | Description                                                                     |
| ---------------------------- | ------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `activeIndex`                | `model<number>`                                               | `0`         | Two-way active slide (+ `activeIndexChange`)                                    |
| `navigation`                 | `'dots' \| 'progress' \| 'none'`                              | `'dots'`    | `progress` renders dots with the duration fill; no `preview` in v1              |
| `showArrows`                 | `boolean`                                                     | `true`      | Prev/next arrows (translucent disc, always legible)                             |
| `loop`                       | `boolean`                                                     | `true`      | Wrap around or clamp at the ends                                                |
| `autoplay`                   | `boolean`                                                     | `false`     | Advance every `duration`; off under reduced-motion until play                   |
| `duration`                   | `number`                                                      | `5000`      | ms per slide; drives the active-dot fill                                        |
| `showPlayPause`              | `boolean \| undefined`                                        | `autoplay`  | Play/pause toggle next to the dots                                              |
| `pauseOnHover`               | `boolean`                                                     | `true`      | Pause the timer on hover and on keyboard focus (mouse focus alone never pauses) |
| `align`                      | `'start' \| 'end' \| 'center' \| 'top' \| 'bottom' \| 'none'` | `'none'`    | Divider side logic                                                              |
| `showDivider`                | `boolean`                                                     | `false`     | Opt-in divider (Image 7 mega-panel ships `false`)                               |
| `ariaLabel` / `ariaLabelKey` | `string \| undefined`                                         | `undefined` | Carousel region name (one required)                                             |

| Output              | Payload   | Description                     |
| ------------------- | --------- | ------------------------------- |
| `activeIndexChange` | `number`  | Two-way pair with `activeIndex` |
| `autoplayChange`    | `boolean` | Play/pause toggle state         |

`align` → divider side (only when `showDivider=true`): `end`→left,
`start`→right, `center`→both, `top`→bottom, `bottom`→top, `none`→no divider.
Height: `100%` of the parent, never self-measured (fixed by consumer layout).

With `loop="false"`, arrows at the ends stay in the DOM with
`aria-disabled="true"` instead of being removed. With a single slide, arrows
and dots are hidden. With `autoplay`, the active dot stretches into a pill and
fills over `duration` (linear); the fill pauses in sync with every pause source
(hover/focus when `pauseOnHover`, hidden tab, offscreen viewport, reduced
motion, manual pause). The play/pause toggle shows its label as visible text
(`carousel.play` / `carousel.pause`, crossfading between the two), reports
`aria-pressed`, and emits `autoplayChange`. `navigation="progress"` renders
the same dots with the duration fill; `navigation="none"` hides the indicator.

## File layout (no-mix rule)

This component follows a strict file-layout rule: the component file holds
**wiring only** (inputs, outputs, computed state, template event handlers).
Every public type lives in its own file under `model/` (one type per file),
and every pure function or constant lives in `model/content-carousel-defaults.ts`.
Index math is reused from the internal `interaction/carousel/engine` — never
reimplemented in the component. New code must keep this split: no type
declarations and no pure helper functions inside
`component/content-carousel.component.ts` or
`directives/carousel-slide.directive.ts`.

## Accessibility

- Container: `role="region"`, `aria-roledescription="carousel"`, accessible
  name via `ariaLabel`/`ariaLabelKey` (one required).
- Slides: `role="group"`, `aria-roledescription="slide"`,
  `aria-label="N of M"` (translated via `carousel.slideNofM`). Inactive slides
  use `aria-hidden="true"` + `inert`, so Tab reaches only active slide content.
- Arrows: translated `aria-label`s (`carousel.prev`/`carousel.next`),
  decorative icons, `aria-disabled="true"` at clamped ends.
- Dots: buttons named `carousel.goToSlide` (`{index, total}` params),
  `aria-current="true"` on the active dot. The track uses `aria-live="off"`.
- Play/pause toggle: single button, label swaps Play/Pause, state in
  `aria-pressed`, `autoplayChange` output. Never motion-only.
- Divider: decorative (`aria-hidden="true"`), never focusable, color from
  `--solaris-neutral-border-*` (3:1 non-text contrast).
- Keyboard: `ArrowRight`/`ArrowLeft` move, `Home`/`End` jump to first/last.
  Tab reaches only active slide content plus the controls.
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens. Track
  motion respects `prefers-reduced-motion` and the `data-reduced-motion` flag;
  under reduced motion the fill is static and autoplay stays off until the user
  presses play.

## Visual variants

- `align` (`start | end | center | top | bottom | none`) is exposed through
  the `data-align` attribute; the resolved divider side is exposed through
  `data-divider` (`left | right | both | top | bottom | none`).
- `navigation` (`dots | progress | none`) is exposed through
  `data-navigation`; `progress` renders the same dots with the duration fill.
- At `360px` and below, vertical dividers (`left`/`right`/`both`) flip to a
  bottom horizontal divider so a stacked panel keeps the separation legible.
- The active dot stretches to a 48px pill. Dot tracks are translucent
  (60% mix) while the duration fill is solid, so the progress sweep stays
  legible. The play/pause toggle sits at the
  strip edge with the same inset as the arrows, out of the centered dots row.

## CSS Variables

| Token                                  | Purpose                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `--solaris-carousel-gap`               | Arrow inset + dots offset (`--solaris-spacing-4`)                         |
| `--solaris-carousel-dots-gap`          | Dot spacing (`--solaris-spacing-3`)                                       |
| `--solaris-carousel-dot-size`          | Dot diameter (`--solaris-spacing-5`, 8px optical + symmetric hit padding) |
| `--solaris-carousel-dot-active-width`  | Active dot pill width (`--solaris-spacing-13`, 48px)                      |
| `--solaris-carousel-control-size`      | Arrow/dot hit area (`--solaris-density-min-height`)                       |
| `--solaris-carousel-arrow-size`        | Chevron icon size (`--solaris-spacing-8`)                                 |
| `--solaris-carousel-dot-color`         | Dot color (light text)                                                    |
| `--solaris-carousel-arrow-color`       | Arrow/play-pause icon color (light text, both themes)                     |
| `--solaris-carousel-arrow-background`  | Arrow/play-pause disc (`--solaris-neutral-backdrop`, both themes)         |
| `--solaris-carousel-progress-duration` | Active-dot fill duration (dynamic ms, inline only)                        |
| `--solaris-carousel-divider-width`     | Divider thickness (`--solaris-border-width-sm`)                           |
| `--solaris-carousel-divider-color`     | Divider color (`--solaris-neutral-border-default`)                        |

Inline styles allowed (dynamic values tokens cannot express): `transform` on
the track (`translateX(-index * 100%)`) and
`--solaris-carousel-progress-duration` on the dots (`duration` value).

## Gestures

Horizontal swipes on the track move to the next/previous slide once the
pointer travels past `CONTENT_CAROUSEL_SWIPE_THRESHOLD_PX` with a mostly
horizontal direction; shorter or vertical drags are ignored so the page keeps
scrolling normally. The track declares `touch-action: pan-y` for the same
reason.

## Print

`@media print` renders a static first slide: arrows, dots, and the play/pause
toggle hide; the track transform resets and only the first slide displays.
Autoplay, hover, and motion do not run on paper. Print from any slide — the
paper always shows slide one.

## Examples

```html
<solaris-content-carousel align="end" [showDivider]="true" ariaLabel="Login highlights" style="height: 320px">
  <ng-template solaris-carousel-slide>
    <app-login-qr />
  </ng-template>
  <ng-template solaris-carousel-slide>
    <app-early-access-promo />
  </ng-template>
</solaris-content-carousel>

<solaris-content-carousel align="none" ariaLabel="Featured content" style="height: 240px">
  <ng-template solaris-carousel-slide>
    <app-wellness-card />
  </ng-template>
  <ng-template solaris-carousel-slide>
    <app-founder-stories />
  </ng-template>
</solaris-content-carousel>

<solaris-content-carousel navigation="none" ariaLabel="Rotator" style="height: 240px">
  <ng-template solaris-carousel-slide>
    <app-first-panel />
  </ng-template>
  <ng-template solaris-carousel-slide>
    <app-second-panel />
  </ng-template>
</solaris-content-carousel>
```

Projected content keeps its own i18n: the carousel only translates its chrome
(arrows, dots, play/pause, empty state) via `carousel.*` keys.
