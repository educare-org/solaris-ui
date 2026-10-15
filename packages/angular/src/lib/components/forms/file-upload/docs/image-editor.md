# Solaris Image Editor

## Purpose

Solaris Image Editor prepares images before upload: it shows the image under a fixed crop window with a translucent mask, and exports the selection as a new `File` with zoom, drag-to-pan positioning, 90° rotation, and rectangular or circular masks. It is designed to open in a dialog via `SolarisDialogService.openComponent` (inline use works too).

## Component

```txt
selector: <solaris-image-editor>
```

## When to use

- Avatar/profile photo preparation before upload (circular mask).
- Normalizing user-provided images to a fixed aspect (1:1, 4:3, 16:9).
- Quick rotate/zoom/position fixes without leaving the app.

## When not to use

- Full photo editing (filters, freehand crop handles, annotations) — out of scope.
- Non-image files — the editor only loads raster images the browser can decode.

## API

### Inputs

| Input                            | Type                                                    | Default       | Description                                                  |
| -------------------------------- | ------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| `image`                          | `string \| File`                                        | —             | Image source (URL or picked file). Falls back to dialog data |
| `aspect`                         | `'free' \| '1:1' \| '4:3' \| '3:4' \| '16:9' \| '9:16'` | `'free'`      | Fixed aspect crop (rect mask only); no user picker           |
| `aspects`                        | `readonly SolarisImageEditorAspect[]`                   | all six       | Deprecated: kept for API compatibility, no longer rendered   |
| `shape`                          | `'rect' \| 'circle'`                                    | `'rect'`      | Fixed mask shape; circle forces a square crop                |
| `format`                         | `'image/png' \| 'image/jpeg'`                           | `'image/png'` | Export format                                                |
| `quality`                        | `number`                                                | `0.92`        | JPEG quality (0–1)                                           |
| `maxDimension`                   | `number`                                                | `2048`        | Longest exported edge in px                                  |
| `maxSourceDimension`             | `number`                                                | `8000`        | Refuse sources larger than this per side (bomb guard)        |
| `maxSourcePixels`                | `number`                                                | `30000000`    | Refuse sources above this pixel count (bomb guard)           |
| `title` / `titleKey`             | `string`                                                | —             | Toolbar/heading text                                         |
| `saveLabel` / `saveLabelKey`     | `string`                                                | —             | Save button text                                             |
| `cancelLabel` / `cancelLabelKey` | `string`                                                | —             | Cancel button text                                           |

Aspect and shape are fixed by the consumer via inputs (or dialog data). The editor no longer offers shape/aspect pickers in the UI.

### Outputs

| Output      | Type   | Description                       |
| ----------- | ------ | --------------------------------- |
| `saved`     | `File` | Edited image exported from canvas |
| `cancelled` | `void` | User dismissed the editor         |

## Interactions

- **Stage**: the view box fits the photo aspect (within a 560×380 box, 320×240 floor) so the stage hugs the image with no side gutters; rotating refits the box. For a dialog that hugs the photo, open it with `width: 'fit-content'`.
- **Mask**: the crop window stays centered and fixed; a translucent dim covers everything outside it with no separator border. With `free` aspect at 100% zoom the whole photo is the crop, so no dim is painted — zoom in or pick a fixed aspect/circle and the dim appears. While the user drags the image, rule-of-thirds framing guides appear inside the crop window.
- **Zoom**: slider (with visible percent), `+`/`-` buttons, `+`/`-` keys, and the scroll wheel over the photo; range 100–300%.
- **Pan**: drag the image with the pointer, or focus the viewport and use arrow keys (`Shift` moves faster). Panning clamps so the crop window never leaves the image. A `solaris-badge` (solid, sm, non-truncated) floats over the photo as a "drag to reposition" hint and hides while dragging.
- **Rotate**: 90° steps; the view resets to center afterwards.
- **Reset**: restores zoom 100%, rotation 0°, and centered position.
- **Controls**: `solaris-icon-button` (ghost, custom, sm, round) for rotate/zoom and `solaris-button` (ghost, custom, sm) for reset, in a discreet bar overlaid at the bottom of the photo (over a bottom gradient), not in a separate toolbar container. The `custom` color reads local overrides so the glyphs stay white over any photo; the scrim itself uses the `neutral-backdrop` token.
- **Zoom slider**: natively styled thin track (4px translucent wash) with a small 12px thumb, capped at 128px wide.
- **Shape**: `rect` follows the fixed `aspect` input; `circle` crops a centered disc.

## Aspect variants

| Value           | Crop box                                       |
| --------------- | ---------------------------------------------- |
| `free`          | Whole rotated image (zoom and pan still apply) |
| `1:1`           | Square, e.g. avatars                           |
| `4:3` / `3:4`   | Classic photo / portrait                       |
| `16:9` / `9:16` | Widescreen / story                             |

## Shape variants

| Value    | Description                                                                    |
| -------- | ------------------------------------------------------------------------------ |
| `rect`   | Rectangular window following the fixed aspect.                                 |
| `circle` | Circular window with a square export (transparent PNG; white corners on JPEG). |

## Formats

- `image/png` (default): lossless, preserves transparency (matters for circles).
- `image/jpeg`: smaller files; `quality` applies; transparency is flattened to white.

Exported file name derives from the source name with the matching extension (`photo.png`, fallback `edited-image.png`).

## CSS Variables

Image Editor declares its own `--solaris-image-editor-*` custom properties (stage, overlay, slider, actions, plus `--solaris-image-editor-on-scrim` for glyphs over the photo). All values reference Solaris tokens except the scrim glyphs: dark and high-contrast themes adapt automatically. The photo mask, the bottom scrim (`neutral-backdrop` token), and the floating controls use fixed black/white overlays so they contrast any photo.

## Dialog integration

Prefer the dialog: the editor reads `{ image, aspect, shape }` from `SOLARIS_DIALOG_DATA` and closes the dialog with the edited `File`:

```typescript
const ref = dialogService.openComponent(SolarisImageEditorComponent, {
  title: 'Edit photo',
  width: 'fit-content',
  data: { image: file, aspect: '1:1', shape: 'circle' },
});
ref.afterClosed().subscribe((edited) => {
  if (edited) this.upload(edited as File);
});
```

Inline usage relies on `[image]` + `(saved)` / `(cancelled)` instead; both paths emit the outputs.

## Accessibility

- Viewport is focusable (`role="group"`) with translated drag/keyboard instructions; arrows pan, `+`/`-` or the scroll wheel zoom.
- Zoom slider is a native `range` input with a translated label and percent value text.
- Overlay controls are native buttons with translated `aria-label`s; zoom bounds disable the buttons instead of hiding them. The drag hint is `aria-hidden` (instructions live on the viewport label).
- Canvas is purely visual; loading uses `role="status"`, failures use `role="alert"`.
- Focus ring via `--solaris-focus-ring-*`; respects `prefers-reduced-motion`.

## Limitations (v1)

- Fixed centered window — position by panning the image, not by moving the window.
- Rotation in 90° steps only.
- No filters, flips, or annotations.
- Export capped by `maxDimension` (default 2048px).
- Sources above `maxSourceDimension`/`maxSourcePixels` are refused (decompression-bomb guard).
- String sources must be `https:`/`http:`, `blob:`, or `data:image:`; anything else (e.g. `javascript:`) is refused.
- Remote images load with anonymous CORS and no referrer; hosts without `Access-Control-Allow-Origin` fail closed.
- Requires Canvas 2D; environments without it report a load error.

## Examples

### Dialog with circular mask

```typescript
this.dialogs.openComponent(SolarisImageEditorComponent, {
  title: 'Edit photo',
  width: 'fit-content',
  data: { image: photoFile, shape: 'circle' },
});
```

### Inline

```html
<solaris-image-editor [image]="photo" aspect="1:1" (saved)="onPhotoSaved($event)" (cancelled)="onEditorCancelled()"></solaris-image-editor>
```

### JPEG export capped at 1024px

```html
<solaris-image-editor [image]="photo" format="image/jpeg" [quality]="0.85" [maxDimension]="1024"></solaris-image-editor>
```
