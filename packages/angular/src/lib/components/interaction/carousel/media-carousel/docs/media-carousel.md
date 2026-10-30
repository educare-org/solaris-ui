# Solaris Media Carousel

## Purpose

Media carousel rotates banners, images, and video posters one slide at a time
with previous/next arrows, dot navigation, and full keyboard support. It owns
no video player: a video slide renders its poster image, and opening playback
stays with the consumer (F3 adds the Play badge and the `slideActivate`
output).

## API

### SolarisMediaCarouselComponent

**Selector:** `solaris-media-carousel`

| Input                          | Type                                          | Default               | Description                                                                                |
| ------------------------------ | --------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| `slides`                       | `readonly SolarisMediaSlide[]`                | `[]`                  | Immutable slide list (lib never mutates)                                                   |
| `activeIndex`                  | `model<number>`                               | `0`                   | Two-way active slide (+ `activeIndexChange`)                                               |
| `visibleCount`                 | `'single' \| 'peek'`                          | `'single'`            | `single` fills the viewport; `peek` centers the active slide at 80% with neighbors peeking |
| `navigation`                   | `'dots' \| 'progress' \| 'preview' \| 'none'` | `'dots'`              | F1 renders `dots`/`none`; `progress` lands in F2, `preview` in F3                          |
| `previewCount`                 | `number`                                      | `3`                   | Locked v1: current + next two (clamped 1–3)                                                |
| `previewPosition`              | `'overlay'`                                   | `'overlay'`           | v1 overlay only                                                                            |
| `dotsPosition`                 | `'overlay' \| 'outside'`                      | `'overlay'`           | Dots over the image or below it                                                            |
| `showArrows`                   | `boolean`                                     | `true`                | Prev/next arrows (translucent disc, always legible)                                        |
| `loop`                         | `boolean`                                     | `true`                | Wrap around or clamp at the ends                                                           |
| `autoplay`                     | `boolean`                                     | `false`               | Advance every `duration`; off under reduced-motion until play                              |
| `duration`                     | `number`                                      | `5000`                | ms per slide; drives the active-dot fill                                                   |
| `showPlayPause`                | `boolean \| undefined`                        | `autoplay`            | Play/pause toggle next to the dots                                                         |
| `pauseOnHover`                 | `boolean`                                     | `true`                | Pause the timer on hover and on keyboard focus (mouse focus alone never pauses)            |
| `aspectRatio`                  | `string`                                      | `'16 / 9'`            | Any valid `aspect-ratio` value                                                             |
| `objectFit`                    | `'cover' \| 'contain'`                        | `'cover'`             | Image fit inside the viewport                                                              |
| `radius`                       | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'`      | `'lg'`                | Viewport radius (`full` forbidden)                                                         |
| `ariaLabel` / `ariaLabelKey`   | `string \| undefined`                         | `undefined`           | Carousel region name (one required)                                                        |
| `playLabel` / `playLabelKey`   | `string \| undefined`                         | i18n `carousel.play`  | Play toggle label                                                                          |
| `pauseLabel` / `pauseLabelKey` | `string \| undefined`                         | i18n `carousel.pause` | Pause toggle label                                                                         |
| `emptyText` / `emptyTextKey`   | `string \| undefined`                         | i18n `carousel.empty` | `slides=[]` state                                                                          |

| Output              | Payload             | Description                                    |
| ------------------- | ------------------- | ---------------------------------------------- |
| `activeIndexChange` | `number`            | Two-way pair with `activeIndex`                |
| `autoplayChange`    | `boolean`           | Play/pause toggle state                        |
| `slideActivate`     | `SolarisMediaSlide` | Slide or preview click (consumer opens player) |

```typescript
import type { SolarisMediaSlide, SolarisMediaImageSlide, SolarisMediaVideoSlide } from '@solaris-ui/angular';

const slides: readonly SolarisMediaSlide[] = [
  { type: 'image', src: 'banner-1.jpg', alt: 'Spring collection' },
  { type: 'video', src: 'tour.mp4', poster: 'tour.jpg', alt: 'Product tour' },
];
```

With `loop="false"`, arrows at the ends stay in the DOM with
`aria-disabled="true"` instead of being removed. With a single slide, arrows,
dots, and the preview strip are hidden. With `autoplay`, the active dot stretches into a pill and
fills over `duration` (linear); the fill pauses in sync with every pause source
(hover/focus when `pauseOnHover`, hidden tab, offscreen viewport, reduced
motion, manual pause). The play/pause toggle shows its label as visible text
(`carousel.play` / `carousel.pause`, crossfading between the two), reports
`aria-pressed`, and emits `autoplayChange`.
With `navigation="preview"`, an overlay strip shows the current slide plus the
next two thumbnails (wrapping when `loop`, truncated when clamped); each thumb
is a button named `carousel.goToSlide` with `aria-current` on the active one,
and clicking a thumb navigates to it. Video thumbs carry a centered,
semi-transparent Play badge (`carousel.play`, never opaque). Clicking a slide
or a thumb emits `slideActivate` with the slide; the consumer owns the player —
the lib never plays video itself.
`navigation="progress"` renders the same dots with the duration fill;
`visibleCount="peek"` centers the active slide at 80% of the viewport with a
`--solaris-carousel-gap` gutter, so both neighbors peek at the edges (first
and last positions show a gutter without clones — the v1 limit, no cloned
slides). Side slides render at `scale(0.92)` + `70%` opacity and glide with the
same `normal` + `standard` track transition; reduced-motion keeps the layout
but removes the glide. The track offset is `10% - index * (80% + gap)`,
centered per slide; `preview` thumbs and dots keep working unchanged.
`previewCount` values outside 1–3 clamp to that range and
`previewPosition` only supports `overlay` in v1.

## File layout (no-mix rule)

This component follows a strict file-layout rule: the component file holds
**wiring only** (inputs, outputs, computed state, template event handlers).
Every public type lives in its own file under `model/` (one type per file),
and every pure function or constant lives in `model/media-carousel-defaults.ts`.
Index math is reused from the internal `interaction/carousel/engine` — never
reimplemented in the component. New code must keep this split: no type
declarations and no pure helper functions inside
`component/media-carousel.component.ts`.

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
- Preview: thumb buttons named `carousel.goToSlide` (`{index, total}` params),
  `aria-current="true"` on the active thumb. Image thumbs are 56px and video
  thumbs wider (`--solaris-spacing-14` + `--solaris-spacing-10`), both natively
  above the 44px target; the video badge is decorative (`aria-hidden`, the
  button carries the name, `data-video` marks video thumbs). The strip hides
  for a single slide.
- Play/pause toggle: single button, label swaps Play/Pause (`+Key`), state in
  `aria-pressed`, `autoplayChange` output. Never motion-only.
- Slide trigger: the active slide image is wrapped in a button that emits
  `slideActivate`; its accessible name is the slide `alt` (or `N of M`).
  Keyboard users can also activate via the preview thumbs (same payload).
- Keyboard: `ArrowRight`/`ArrowLeft` move, `Home`/`End` jump to first/last.
  Keyboard acts when focus is inside the carousel (arrows, dots, or toggle) —
  Tab reaches only active slide content plus the controls.
- Focus uses `:focus-visible` with `--solaris-focus-ring-*` tokens. Dots keep an
  8px optical size with a symmetric hit padding (24px wide at rest, growing
  with the pill, 40px tall). The play/pause toggle sits at the strip edge with
  the same inset as the arrows, out of the centered dots row.
  The active dot stretches to a 48px pill. Dot tracks are translucent
  (60% mix) while the duration fill is solid, so the progress sweep stays
  legible. Track motion respects
  `prefers-reduced-motion` and the `data-reduced-motion` flag; under reduced
  motion the fill is static and autoplay stays off until the user presses play.

## Visual variants

- `radius` (`none | sm | md | lg | xl`) maps to `--solaris-radius-*` through
  the `data-radius` attribute (`full` is forbidden and falls back to `lg`).
- `objectFit` (`cover | contain`) switches image fit through
  `data-object-fit`.
- `dotsPosition` (`overlay | outside`) renders the dots over the image or below
  the viewport through `data-dots-position`. Overlay dots live inside the
  viewport; outside dots render after it so the viewport clipping never hides
  them.
- The active dot stretches into a 48px pill after the slide track finishes
  moving: the pill grows and displaces the neighboring dots while the
  play/pause toggle stays put. Only layout-affecting growth runs — the dots
  row itself never shifts, so the resting layout is identical after every
  navigation.
- `visibleCount` and `navigation` are exposed through `data-visible` and
  `data-navigation`; `previewPosition` is exposed through
  `data-preview-position` (v1 `overlay` only).
- `visibleCount="peek"` renders slides at `80%` of the viewport with a gap
  gutter: the active slide is full-size (`scale(1)`, full opacity) and side
  slides sit at `scale(0.92)` + `70%` opacity, gliding on the shared
  `normal` + `standard` track transition (doubled reduced-motion guard, no
  separate easing).
- Preview thumbs (`--solaris-carousel-preview-size`, `--solaris-spacing-14`)
  sit in an overlay strip (`--solaris-carousel-preview-gap`) framed by a subtle
  translucent-white outer border; the frame radius
  (`--solaris-carousel-preview-frame-radius`) is the thumb radius plus padding
  plus border width, so the frame hugs the thumbs. Each thumb carries the same
  subtle border, and the active thumb uses the solid light border
  (`--solaris-carousel-preview-active-border-color`). Video thumbs are wider
  (`--solaris-carousel-preview-video-width`, image + `--solaris-spacing-10`)
  so the Play badge (`carousel.play`) fits in any locale, and their image is
  softly blurred (`--solaris-carousel-preview-video-blur`) for badge legibility.
  The badge reuses the translucent `--solaris-neutral-backdrop` disc with light
  text — semi-transparent by construction, never opaque. The strip enters with a
  fade only (no rise), matching the dots' stillness. On navigation the active
  highlight crossfades (`opacity` + `border-color`, `normal` + `standard`) and
  the thumbs glide to their new positions (FLIP via WAAPI,
  `MEDIA_CAROUSEL_PREVIEW_REORDER_MS`/`EASING` mirroring `normal` + `standard`,
  one glide per order change); origins are anchored in document coordinates, so
  scrolling to the section never flings the thumbs on the next navigation. The
  glide is skipped under reduced motion and without WAAPI. Thumbs carry no CSS
  entrance animation by design: reordering re-inserts DOM nodes, which restarts
  CSS animations and would flash the strip on every navigation — new thumbs
  appear instantly instead.

## CSS Variables

| Token                                            | Purpose                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------- | --- | --------------------------------------------- | ----------------------------------------------------------- |
| `--solaris-carousel-viewport-radius`             | Viewport rounding (`--solaris-radius-*` via `data-radius`)                |
| `--solaris-carousel-gap`                         | Arrow inset + overlay dots offset (`--solaris-spacing-4`)                 |
| `--solaris-carousel-dots-gap`                    | Dot spacing (`--solaris-spacing-3`)                                       |
| `--solaris-carousel-dot-size`                    | Dot diameter (`--solaris-spacing-5`, 8px optical + symmetric hit padding) |
| `--solaris-carousel-dot-active-width`            | Active dot pill width (`--solaris-spacing-13`, 48px)                      |
| `--solaris-carousel-control-size`                | Arrow/dot hit area (`--solaris-density-min-height`)                       |
| `--solaris-carousel-arrow-size`                  | Chevron icon size (`--solaris-spacing-8`)                                 |
| `--solaris-carousel-dot-color`                   | Dot color (light text; body text when `dotsPosition="outside"`)           |
| `--solaris-carousel-arrow-color`                 | Arrow/play-pause icon color (light text, both themes)                     |
| `--solaris-carousel-arrow-background`            | Arrow/play-pause disc (`--solaris-neutral-backdrop`, both themes)         |
| `--solaris-carousel-progress-duration`           | Active-dot fill duration (dynamic ms, inline only)                        |
| `--solaris-carousel-preview-size`                | Preview thumb size (`--solaris-spacing-14`, 56px, 44px hit native)        |
| `--solaris-carousel-preview-gap`                 | Preview thumb spacing (`--solaris-spacing-3`)                             |
| `--solaris-carousel-preview-radius`              | Preview thumb rounding (`--solaris-radius-md`)                            |     | `--solaris-carousel-preview-badge-background` | Video badge disc (translucent `--solaris-neutral-backdrop`) |
| `--solaris-carousel-preview-badge-color`         | Video badge text (`--solaris-neutral-text-light`)                         |
| `--solaris-carousel-preview-border-width`        | Preview frame/thumb border width (`--solaris-border-width-sm`)            |
| `--solaris-carousel-preview-border-color`        | Subtle translucent-white frame/thumb border (40% light text mix)          |
| `--solaris-carousel-preview-active-border-color` | Active thumb border (solid `--solaris-neutral-text-light`)                |
| `--solaris-carousel-preview-frame-radius`        | Frame radius (thumb radius + padding + border width)                      |
| `--solaris-carousel-preview-video-width`         | Video thumb width (preview size + `--solaris-spacing-10`, badge fit)      |
| `--solaris-carousel-preview-video-blur`          | Video thumb image softening (dialog-filter precedent)                     |

Inline styles allowed (dynamic values tokens cannot express): `transform` on
the track (`translateX(-index * 100%)`), `aspect-ratio` on the viewport
(consumer `aspectRatio` value), `--solaris-carousel-progress-duration` on the
dots (`duration` value), and `animation-play-state` on the fill
(paused/running).

## Gestures

Horizontal swipes on the track move to the next/previous slide once the
pointer travels past `MEDIA_CAROUSEL_SWIPE_THRESHOLD_PX` with a mostly
horizontal direction; shorter or vertical drags are ignored so the page keeps
scrolling normally. The track declares `touch-action: pan-y` for the same
reason. Slide images are `draggable="false"` so the browser never starts a
native drag instead of the swipe. A swipe never opens the player: the tap that follows a navigating
swipe is consumed instead of emitting `slideActivate`.

## Print

`@media print` renders a static first slide: arrows, dots, preview strip, and
the play/pause toggle hide; the track transform resets and only the first
slide displays. Autoplay, hover, and motion do not run on paper. Print from
any slide — the paper always shows slide one.

## Examples

```html
<solaris-media-carousel [slides]="slides" [(activeIndex)]="current" ariaLabel="Featured stories" />

<solaris-media-carousel [slides]="slides" dotsPosition="outside" [loop]="false" radius="md" ariaLabel="Featured stories" />

<solaris-media-carousel [slides]="slides" [autoplay]="true" [duration]="5000" ariaLabel="Featured stories" />

<solaris-media-carousel [slides]="slides" navigation="preview" (slideActivate)="openPlayer($event)" ariaLabel="Featured stories" />

<solaris-media-carousel [slides]="slides" visibleCount="peek" ariaLabel="Featured stories" />

<solaris-media-carousel [slides]="[]" ariaLabel="Featured stories" emptyText="Nothing to show yet" />
```
