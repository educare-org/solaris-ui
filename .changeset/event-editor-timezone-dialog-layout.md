---
'@educarehq/solaris-ui': patch
---

Timezone dialog layout and missing select search placeholder.

- The separate-zones checkbox now lives inside the timezone picker dialog (560px, content in `comfortable` density): checkbox plus a row pairing the two back-to-back searchable selects with the swap action in its own right-hand column, vertically centered — `arrow-left-right` rotated 90° in a small circular chip clearly above the fields. The end select stays disabled and mirrors the start zone until the checkbox is checked. Confirming closes with `{ start, end | null }`, mirrored back to `timeZone`/`timeZoneEnd`.
- Fixed the horizontal overflow (verified live in the browser): the old `nowrap` row plus the select's content-based trigger min-width floor overflowed narrow dialogs, and the icon-button's extended `::after` hit area (`inset: -6px`) bled past the floating button. The selects now stack at full width with `[triggerMinWidth]="0"` and the trailing action sits in-flow, so long zone labels truncate instead of scrolling.
- The swap action floats at the right edge between the back-to-back selects without taking layout space (`arrow-left-right` rotated 90°, small opaque circular chip clearly above the fields).
- Fixed the searchable-select placeholder rendering the raw `solaris.select.search.placeholder` key: the key now exists in the en-US/pt-BR maps (es falls back to en, like the other select keys).
