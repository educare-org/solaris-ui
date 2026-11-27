# Solaris Rich Text Editor

## Purpose

Rich text editing with two presentations sharing one native `contenteditable` engine: `document` (field-like with fixed toolbar, form-field pills, char count) and `composer` (compact chat bar with floating toolbar, `submitted` via `Enter` or the public `submit()` method, plus a visible Send button in the showcase).

Use `document` for descriptions, templates and payment-form text blocks. Use `composer` for chat inputs.

## API

Inputs: `value` (model object, `writeValue` also accepts HTML string), `variant`, `appearance`, `size`, `density`, `radius`, `placeholder/placeholderKey`, `ariaLabel/ariaLabelKey`, `disabled/readonly/required/invalid`, `maxLength`, `showCharCount`, `toolbarDisplay`, `toolbarPreset`, `contentFormat` (model `rich|plain`, toggled by the `Aa` toolbar action), `submitTrigger`, `fields`, `fieldTrigger`, `imageUpload { accept, maxSizeBytes }`, `autofocus`.

Toolbar: block style select + inline split button (bold primary + chevron menu), color popover button (Jira-style: `A` in a color-bordered 24px square with thinner glyph, tooltip "Text and highlight color" suppressed while its panel is open, pressed tint while a color or highlight is active; 10-column text grid with light/mid/dark tones per hue + 8 highlight swatches; selected swatches show a contrast-safe check instead of an outline; outline full-width "Remove highlight" action; compact "Accessibility • level" tag with a native-title `?` help), lists split button (bullets primary + chevron menu: bullets/ordered/tasks) + undo/redo pair, align split button (current-alignment primary + chevron menu with radio-checked left/center/right/justify), link popover (URL + optional display text, `Ctrl/Cmd+K`), `Aa` plain toggle, image popover with `solaris-tabs` (`Arquivo`/`Link` with underline indicator + fade transition; file tab: full-width `Carregar` + hidden file input with `PNG, JPG, GIF ou WebP` hint; link tab: URL field + dashed preview with `Carregar pré-visualização`, `Cancelar`/`Inserir`), table. Task lists render static checkboxes (no state sync in v1). Groups separated by `solaris-divider` components; the bar wraps on narrow screens and active items get a marked background (state also exposed via `aria-pressed`, `aria-checked` on the align menu, translated tooltips). Toolbar buttons render at 36px with a 44px pointer hit area; all labels/tooltips resolve through the reactive `translate` pipe so they follow locale changes.

Colors apply user-chosen text color (`data-color`) and highlight (`data-highlight`, soft-tinted backgrounds); the palette is user content (like Google Docs), not component chrome. Images are selectable figures: hover shows a discreet outline + thin side pills, click selects; drag either side handle or focus the east handle and use `ArrowLeft/ArrowRight` (`Shift` for larger steps) to resize with soft snap every 10% of the editor width (hold `Alt` to disable snap, `Esc` deselects). While dragging, snap guides appear at every 10% of the editor width plus a `596 px` badge that highlights when snapped. Wrap aligns (`data-align="start-wrap"`/`"end-wrap"`) float the figure left/right with text flowing beside it; applying wrap shrinks an oversized image to half the editor width once so text fits beside it, then it resizes freely; figures are always inserted between paragraphs so there is a caret line to type in. Lists that flow beside a left-floated image keep their own formatting context so bullets, numbers and task checkboxes render beside the float instead of hidden underneath it. Formatting works with a collapsed caret too: toggling bold/italic/underline/strike/color inserts a zero-width marker and subsequently typed text inherits the format (toggle again to exit). Selections survive toolbar clicks: the last in-editor range (including collapsed carets) is remembered on blur and restored when a toolbar action runs; focus returns to the editor after a select, menu or popover pick closes its panel. Committed values never contain the marker, empty inline tags, resize handles or figure selection state.

Outputs: `htmlChange`, `editorFocused`, `editorBlurred`, `selectionChange`, `submitted` (`valueChange` and `contentFormatChange` are auto-emitted by the `value`/`contentFormat` models — never declare them explicitly), `mentionInserted`, `imageAdded/imageRejected/imageRemoved`, `tableInserted`.

Public method `submit()` emits `submitted` with the current value (even when empty, like `Enter`); it is a noop when disabled or readonly.

The host is a single shared shell (border + radius + bottom-divided toolbar, footer/count inside). Inside `solaris-form-field` the host carries `data-in-field` and drops its own border, background and radius so the field provides the shell (mirrors the textarea contract); the field wrapper resting border is raised to `neutral-border-default` so the in-field shell matches the standalone shell strength (focus/invalid/appearance states still win).

Value shape: `{ html, text, blocks, version: 1 }`. `maxLength` counts visible `text` (pills count as label length). Programmatic `value` updates paint the editor automatically while it is not focused, so `[(value)]` with a preset works without `ControlValueAccessor`.

## Read-only view

`solaris-rich-text-view` renders a committed value without any editing chrome: inputs are `value` (same `SolarisRichTextValue | string | null` shape) and optional `ariaLabel` (adds `role="region"` only when set). The content reuses the editor content shell, so view and edit render identically (same typography, alignment, floats, colors, tables, code lines).

Sanitization: committed HTML is allowlist-sanitized in an inert template (only the component allowlist of tags/attributes; links restricted to `http(s)`/`mailto:`/`tel`/relative, image sources to `http(s)`/`blob:`/`data:image`, inline styles to `width`/`max-width` in `px`, classes to the code-line class) before bypassing Angular sanitization, which would otherwise strip the `data-*` attributes the shell relies on. Task checkboxes render inert (`pointer-events: none`). SSR renders an empty shell and hydrates content on the client.

## Persisting values

The component is transport-agnostic: persist on `htmlChange`/`submitted` (or read `value()`). Recommended columns: `content_html TEXT` (source of truth, rendered back through the view), `content_text TEXT` (generated for search/listing without parsing HTML), `content_version SMALLINT` + `updated_at` (the `version: 1` field already supports future schema migrations). Re-sanitize on render (defense in depth — the stored HTML was already sanitized on commit). Local file uploads produce `blob:` URLs that do not survive reload: upload the file to permanent storage on `imageAdded` (or an async `imageUpload` hook) and rewrite the figure `src` to the permanent URL before saving.

## Accessibility

`role="textbox" aria-multiline`, labelled by `ariaLabel` or placeholder fallback; `aria-invalid` + `aria-describedby` via form-field; toolbar `role="toolbar"` with `role="separator"` dividers; every toolbar control has a translated tooltip + `aria-label`; link button opens a `dialog` popover with labelled URL/display-text fields (autofocus on the URL field, `Esc` closes); toggles expose `aria-pressed`; mention listbox uses `aria-activedescendant` + `aria-selected`; `Esc` closes the mention menu; count is `role="status" aria-live="polite"`; focus-visible rings; readonly distinct from disabled; reduced-motion doubled guard.

Keyboard: `Ctrl/Cmd+B/I/U` (bold/italic/underline), `Ctrl+Shift+5` (strikethrough, legacy `Ctrl+Shift+S` still works but conflicts with Windows screenshot/save), `Ctrl+Shift+9` (inline code, legacy `Ctrl+Shift+M` still works but conflicts with devtools), `Ctrl/Cmd+,` (subscript), `Ctrl/Cmd+.` (superscript), `Ctrl/Cmd+\` (clear formatting), `Alt+ArrowUp/Down` (move current block up/down), `Ctrl+Shift+L/C/R/J` (align left/center/right/justify), `Ctrl+Shift+8/7/6` (bulleted/ordered/task list), `Ctrl/Cmd+Z` (undo), `Ctrl+Shift+Z` / `Ctrl/Cmd+Y` (redo), `Ctrl/Cmd+K` opens the link popover, `Alt+F10` focuses the toolbar, `ArrowUp/Down + Enter/Esc` in the mention menu, `Tab/Shift+Tab` moves through table cells (native), `Enter/Shift+Enter/Ctrl+Enter` per `submitTrigger`. Clearing removes strong/em/u/s/code/sub/sup/color spans plus block `data-align` from the selection and keeps links, highlights, mentions and pills; on a collapsed caret it clears the current block alignment. History is capped at 50 entries; fast typing coalesces into one undo step per session (pauses at or above 1000ms or any toolbar action start a new step, so one word typed at once undoes in a single step); format toggles do not push history. Blocks can be reordered by dragging the ⋮⋮ grip that appears on hover — including individual list items within their own list — with a blue drop line marking the landing position inside the editor; drops outside the dragged list are ignored. `Alt+ArrowUp/Down` moves the current block or list item the same way for keyboard users; moving pushes history so it undoes in a single step.

Motion signature: content-format (`Aa`) switch crossfades the editing area while the toolbar groups to the right of the block-style select play a short horizontal slide (`translateX ±12px` + fade, 300ms `normal`, standard easing, WAAPI fire-and-forget after render, 20ms stagger per group). The block select always stays first and exists in both modes, so it never moves; the toolbar container and its border are never animated and keep their natural height throughout — no `height`/`overflow` animation, so the editor below never shifts mid-play (compositor-only properties per the motion guidance). Reduced motion (media query or `data-reduced-motion`) skips the whole play; SSR/jsdom without `animate` or `requestAnimationFrame` renders the end state synchronously. No other enter/exit animation (instant state, same information without motion); only focus-ring color transitions on `fast` tokens; floating toolbar repositions instantly on selection change; every transition ships the doubled reduced-motion guard (media query + `data-reduced-motion`), which also disables the `Aa` animation, as does any environment without WAAPI (SSR/jsdom).

## Examples

```html
<solaris-rich-text-editor placeholder="Description" [maxLength]="300" />

<solaris-form-field label="Receipt" hint="Write an objective message.">
  <solaris-rich-text-editor [fields]="fields" [maxLength]="300" />
</solaris-form-field>

<solaris-rich-text-editor variant="composer" (submitted)="send($event)" />

@if (editing) {
  <solaris-rich-text-editor [(value)]="draft" [maxLength]="300" />
  <button solaris-button (click)="saved.set(draft()); editing.set(false)">Save</button>
  <button solaris-button (click)="draft.set(saved()); editing.set(false)">Cancel</button>
} @else {
  <solaris-rich-text-view [value]="saved()" />
  <button solaris-button (click)="draft.set(saved()); editing.set(true)">Edit</button>
}
```

Tables insert as semantic `table/tbody/tr/th(scope=col)/td` (no merge/sort/nested in v1; aligning applies per `td/th` cell and multi-cell selections align every intersected cell). Images insert as `figure[data-image] > img[alt required]` (no caption in v1; alt stays mandatory and a missing alt rejects the upload) via file or direct `http(s)` URL. Hovering a figure shows a discreet outline + thin side pills, clicking selects it with a tight outline and two discreet side handles (thin centered west/east pills, drag to resize with 10% snap guides + `px` badge, `Alt` for free resize, arrows with `Shift` for larger steps, `Esc` releases) and a single-row Jira-style pill panel below it: align left/center/right/justify plus wrap start/end (float with text wrap, custom inline SVGs), border toggle (custom dashed-square icon) and a `…` menu (Adicionar link, Adicionar texto alter, Redimensionar, Copiar, Excluir). `Largura`/`Altura` only appear in the panel while resizing. Typing or deleting with a figure selected never traps content inside it: text is inserted after the figure (so wraps flow beside it) and deletion removes the figure. To get below a tall floated image, press Enter on an empty line beside it — that line itself becomes a cleared paragraph below the figure, without moving the side text — or use the `…` menu item `Pular para baixo da imagem` (caret goes to a cleared paragraph after the following text). Native blue image selection is suppressed. Code blocks insert as `pre[data-language][data-line-numbers]` with one `.solaris-rich-text-code-line` div per line (Enter splits the line in place, pasted content is re-wrapped); selecting the block opens a single-row Jira-style panel below it with a searchable language select (default `Detect language`, aliases resolved through the shared code-block runtime), a line-numbers toggle, a format action (trims trailing whitespace), copy and remove — no nested popover. `auto` means plain text until detection lands. Links validate `http(s)` and render with `target=_blank rel=noopener`; `javascript:` URLs are rejected. Colors apply `data-color` text spans and `data-highlight` soft-tint spans through the Jira-style popover (square swatches with large radii; 30 text colors in 3 rows (system tones, 9 fixed Jira-style base hues and their dark shades × light/base/dark tones, theme-independent): `default` resets to automatic — plus 10 highlight tints (neutral plus one dark tone per family) in a fixed-width panel with breathing room; the toolbar preview mirrors the active text color and highlight). Applying a color or highlight covers exactly the selection (expanding only to wrappers the selection already covers in full) and preserves nested inline tags; existing spans with the same attribute normalize to the new value and uncovered runs are wrapped, so bold/subscript survive; clearing one attribute unwraps only that attribute. Merged spans carry a single `<span data-color data-highlight>` (no nesting). The panel footer is a compact tag (`contrast` icon + "Accessibility • level", level in success/danger foreground) with a `circle-question-mark` help icon whose native `title` explains the live WCAG AA verdict (ok ≥ 4.5, partial ≥ 3.0 for large text only, fail below) — no floating tooltip inside the popover. Picks do not close the panel, so text color and highlight chain in one opening (it closes on outside interaction or Escape).

## Composer floating toolbar

With `toolbarDisplay="floating"` (default in `composer`), the toolbar positions above the current text selection (`Selection`/`Range` geometry, SSR-guarded) and hides when the selection collapses, in `plain` format, or when disabled/readonly.

## CSS Variables

| Token                              | Purpose                    |
| ---------------------------------- | -------------------------- |
| `--solaris-rich-text-bg`           | Field + toolbar background |
| `--solaris-rich-text-border-color` | Borders                    |
| `--solaris-rich-text-radius`       | Container + toolbar radius |
| `--solaris-rich-text-color`        | Text                       |
| `--solaris-rich-text-min-height`   | Editing area minimum       |
| `--solaris-rich-text-padding-x/y`  | Editing area padding       |

Content rules (tables, pills, colors, alignment, quotes, code) live in the official `styles/_rich-text-editor.scss` shell — same pattern as `_textarea.scss` — because `innerHTML` content cannot match Angular emulated-encapsulation attributes. Toolbar chrome stays encapsulated in the component stylesheet.

`data-align` centers/rights blocks; `span[data-color]` tints text with `*-solid` tokens (user-chosen content color, like Google Docs). Bulleted and numbered lists share the same marker gutter: bullets use native outside markers while ordered items render hierarchical counters (`1.1`, `1.2.1` for nested levels) through `li::marker`. Floating toolbar uses `z-index: raised` + `shadow-md`.

## Visual variants

`data-variant=document|composer`, `data-size=sm|md|lg`, `data-density`, `data-appearance=outline|surface|filled`, `data-radius=none|sm|md|lg` (no `xl|full` on textual), `data-format=rich|plain`.

Toolbar icons are official Solaris icons (`letter-b`, `italic`, `underline`, `strikethrough`, `list`, `list-ordered`, `arrow-left-to-line`, `arrow-right-to-line`, `text-align-justify`, `case-sensitive`, plus existing `link`, `unlink`, `image`, `table`). Center alignment reuses the symmetric `text-align-justify` glyph; the registry also ships `text-align-start`/`text-align-end` for consumers.
