# Solaris Code Block

## Purpose

Code Block renders code snippets and installation commands with token-driven styling,
built-in fallback syntax highlighting, copy-to-clipboard, optional expand/collapse
for long content, and optional inline editing. It supports `block` and `inline` layouts
and a `command` variant with a package-manager selector.

Use it for documentation examples, terminal commands, and compact technical snippets.
It is SSR-safe, never uses `innerHTML`, and degrades gracefully when the Clipboard API
or an async highlighter is unavailable.

## API

### SolarisCodeBlockComponent

**Selector:** `solaris-code-block`

| Input                                                      | Type                                             | Default          | Description                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------- |
| `code`                                                     | `string \| null \| undefined`                    | `undefined`      | Visible code when `commands` is not used.                                               |
| `commands`                                                 | `readonly SolarisCodeBlockCommand[]`             | `[]`             | Command options rendered through the selector.                                          |
| `selectedCommand`                                          | `string \| null`                                 | `null`           | Externally controlled active command id.                                                |
| `language`                                                 | `SolarisCodeBlockLanguage \| null`               | `null`           | Language or tool identity (`shell` for commands).                                       |
| `variant`                                                  | `'code' \| 'command'`                            | `'code'`         | Rendering intent.                                                                       |
| `layout`                                                   | `'inline' \| 'block'`                            | `'block'`        | Layout mode.                                                                            |
| `appearance`                                               | `'surface' \| 'outline'`                         | `'surface'`      | Visual appearance.                                                                      |
| `size`                                                     | `'sm' \| 'md' \| 'lg'`                           | `'md'`           | Size variant.                                                                           |
| `radius`                                                   | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| null` | `null`           | Border radius override.                                                                 |
| `density`                                                  | `'compact' \| 'normal' \| 'comfortable'`         | inherited        | Density variant.                                                                        |
| `copyable`                                                 | `boolean`                                        | `true`           | Shows the icon-only copy action.                                                        |
| `copiedDuration`                                           | `number`                                         | `2000`           | Milliseconds the copied state stays visible.                                            |
| `expandable`                                               | `boolean`                                        | `false`          | Enables expand/collapse for long block content.                                         |
| `collapsedLines`                                           | `number`                                         | `8`              | Visible line count while collapsed.                                                     |
| `expanded`                                                 | `boolean`                                        | `false`          | Externally controlled expanded state.                                                   |
| `editable`                                                 | `boolean`                                        | `false`          | Shows the edit action for block layout. The edit button morphs into save while editing. |
| `ariaLabel` / `ariaLabelKey`                               | `string \| null`                                 | Solaris fallback | Accessible label for the code region.                                                   |
| `commandSelectorAriaLabel` / `commandSelectorAriaLabelKey` | `string \| null`                                 | Solaris fallback | Accessible label for the command selector.                                              |
| `copyLabel` / `copyLabelKey`                               | `string \| null`                                 | Solaris fallback | Accessible copy label.                                                                  |
| `copiedLabel` / `copiedLabelKey`                           | `string \| null`                                 | Solaris fallback | Accessible copied label.                                                                |
| `expandLabel` / `expandLabelKey`                           | `string \| null`                                 | Solaris fallback | Accessible expand label.                                                                |
| `collapseLabel` / `collapseLabelKey`                       | `string \| null`                                 | Solaris fallback | Accessible collapse label.                                                              |
| `editLabel` / `editLabelKey`                               | `string \| null`                                 | Solaris fallback | Accessible edit label.                                                                  |
| `saveLabel` / `saveLabelKey`                               | `string \| null`                                 | Solaris fallback | Accessible save label.                                                                  |
| `cancelLabel` / `cancelLabelKey`                           | `string \| null`                                 | Solaris fallback | Accessible cancel-editing label.                                                        |
| `identityLabel` / `identityLabelKey`                       | `string \| null`                                 | language label   | Overrides the header identity label.                                                    |

| Output                  | Type                     | Description                                   |
| ----------------------- | ------------------------ | --------------------------------------------- |
| `copied`                | `Output<string>`         | Emits the copied visible code after a copy.   |
| `codeChange`            | `Output<string>`         | Emits the edited code when the user saves.    |
| `editingChange`         | `Output<boolean>`        | Emits when the user enters or leaves editing. |
| `expandedChange`        | `Output<boolean>`        | Emits when the user toggles expansion.        |
| `selectedCommandChange` | `Output<string \| null>` | Emits when the user picks another command.    |

Editing is block-layout only and presents the saved code in a textarea. The edit
button morphs into save (emitting `codeChange`); cancel discards the draft.
`Escape` cancels, `Ctrl`/`Cmd`+`Enter` saves. Switching commands while editing
discards the draft. Bind `(codeChange)` (or `[(code)]`) to persist edits, since the
component never mutates the `code` input itself.

### SolarisCodeBlockCommand

| Name       | Type                                    | Description                          |
| ---------- | --------------------------------------- | ------------------------------------ |
| `id`       | `string`                                | Stable command identifier.           |
| `label`    | `string`                                | Visible command label.               |
| `labelKey` | `string \| undefined`                   | Optional translation key for label.  |
| `code`     | `string`                                | Command text.                        |
| `language` | `SolarisCodeBlockLanguage \| undefined` | Optional language override.          |
| `icon`     | `string \| undefined`                   | Optional icon-registry key override. |

### Highlighting API

| Export                           | Kind           | Description                                         |
| -------------------------------- | -------------- | --------------------------------------------------- |
| `SOLARIS_CODE_HIGHLIGHTER`       | InjectionToken | Adapter boundary for custom highlighters.           |
| `provideSolarisCodeHighlighter`  | Provider       | Registers a custom `SolarisCodeHighlighter`.        |
| `provideSolarisShikiHighlighter` | Provider       | Registers the optional lazy Shiki highlighter.      |
| `SolarisCodeHighlighter`         | Interface      | `highlight(code, language, context)` sync or async. |

`shiki` is an optional peer dependency. It is imported lazily only when highlighting
runs in the browser; on the server, on load failure, or for unsupported languages the
component falls back to the built-in regex highlighter or plain text.

## Appearances

| Appearance | Visual                                                      |
| ---------- | ----------------------------------------------------------- |
| `surface`  | Filled background with raised header (default).             |
| `outline`  | Transparent background, visible border, transparent header. |

Default: `surface`

Only `surface` and `outline` are supported. This keeps the component aligned with the
minimal docs surface and avoids the legacy `soft`/`glass` treatments.

## Sizes

| Size | Usage                          |
| ---- | ------------------------------ |
| `sm` | Dense docs, inline references. |
| `md` | Default body code (default).   |
| `lg` | Featured examples.             |

Default: `md`

## Density

| Density       | Effect                              |
| ------------- | ----------------------------------- |
| `compact`     | Reduced vertical padding and gap.   |
| `normal`      | Default spacing.                    |
| `comfortable` | Increased vertical padding and gap. |

When not provided, Code Block inherits density from `SolarisThemeService`.

## CSS Variables

| Token                                       | Purpose                        |
| ------------------------------------------- | ------------------------------ |
| `--solaris-code-block-background`           | Code area background.          |
| `--solaris-code-block-header-background`    | Header background.             |
| `--solaris-code-block-border-color`         | Frame and header border.       |
| `--solaris-code-block-text`                 | Code and label color.          |
| `--solaris-code-block-muted-text`           | Identity and operator color.   |
| `--solaris-code-block-font-size`            | Code font size.                |
| `--solaris-code-block-line-height`          | Code line height.              |
| `--solaris-code-block-padding-block`        | Vertical viewport padding.     |
| `--solaris-code-block-padding-inline`       | Horizontal viewport padding.   |
| `--solaris-code-block-radius`               | Frame border radius.           |
| `--solaris-code-block-gap`                  | Header and shell gap.          |
| `--solaris-code-block-action-size`          | Copy button size.              |
| `--solaris-code-block-action-icon-size`     | Copy/check icon size.          |
| `--solaris-code-block-button-background`    | Action button background.      |
| `--solaris-code-block-button-border-color`  | Action button border.          |
| `--solaris-code-block-collapsed-max-height` | Collapsed viewport max height. |

Token-kind colors map to semantic text tokens (`--solaris-primary-text`,
`--solaris-success-text`, `--solaris-warning-text`, `--solaris-info-text`,
`--solaris-text-muted`). Shiki-provided colors arrive inline per token and take
precedence when present.

## Accessibility

- Block layout uses semantic `pre` and `code` inside a `region` labelled by
  `ariaLabel`/`ariaLabelKey` (defaults to the `solaris.codeBlock.ariaLabel` key).
- Inline layout uses semantic `code`.
- The copy button is icon-only visually but always exposes an accessible name that
  switches to the copied label after a successful copy.
- Copy success is announced through a polite live region.
- The expand/collapse toggle exposes `aria-expanded` and `aria-controls`.
- The edit action exposes `aria-pressed` and morphs into save while editing; the
  editor is a labelled textarea (`Escape` cancels, `Ctrl`/`Cmd`+`Enter` saves) and
  focus returns to the toggle when editing ends.
- The command selector reuses Solaris Segmented Control keyboard and ARIA behavior.
- The scrollable block viewport is keyboard-focusable (`tabindex="0"`) when content
  exists, and honors `prefers-reduced-motion` for icon transitions.
- Language identity icons are decorative (`aria-hidden`); unknown languages render a
  textual badge instead of raw SVG.

## Examples

```html
<!-- Basic block -->
<solaris-code-block code="const answer = 42;" language="typescript" />

<!-- Inline command -->
<solaris-code-block layout="inline" variant="command" code="pnpm nx build angular" language="shell" />

<!-- Package-manager selector -->
<solaris-code-block
  variant="command"
  [commands]="[
    { id: 'pnpm', label: 'pnpm', code: 'pnpm add @educarehq/solaris-ui', language: 'shell' },
    { id: 'npm', label: 'npm', code: 'npm install @educarehq/solaris-ui', language: 'shell' },
  ]"
/>

<!-- Expandable long content -->
<solaris-code-block [code]="longExample" language="typescript" [expandable]="true" [collapsedLines]="6" />

<!-- Editable with two-way binding -->
<solaris-code-block [(code)]="snippet" language="typescript" [editable]="true" />

<!-- Translated labels -->
<solaris-code-block code="const answer = 42;" language="typescript" copyLabelKey="docs.codeBlock.copy" />

<!-- Custom highlighter -->
<!-- providers: [provideSolarisCodeHighlighter(myHighlighter)] -->

<!-- Optional Shiki highlighting (shiki is an optional peer dependency) -->
<!-- providers: [provideSolarisShikiHighlighter()] -->
```
