# Solaris Preview Code

## Purpose

Preview Code renders a live Angular preview together with its corresponding
source code. It composes Solaris Segmented Control for preview/code switching
and Solaris Code Block for rendering, copy behavior, highlighting, and
expandable code. It can switch between multiple code files inside the code
panel.

Use it for documentation examples. The preview is projected content
(`ng-content`); the component never executes code, parses HTML, or touches the
network. It is SSR-safe.

## API

### SolarisPreviewCodeComponent

**Selector:** `solaris-preview-code`

| Input                                                | Type                                             | Default               | Description                                                                    |
| ---------------------------------------------------- | ------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------ |
| `code`                                               | `string \| null \| undefined`                    | `undefined`           | Code rendered by the internal code block.                                      |
| `codeFiles`                                          | `readonly SolarisPreviewCodeFile[]`              | `[]`                  | Multiple files for the code panel; the selected file drives code and language. |
| `language`                                           | `string \| null`                                 | `null`                | Language passed to the internal code block.                                    |
| `defaultCodeFile`                                    | `string \| null`                                 | `null`                | Initial file id; falls back to the first file.                                 |
| `activeTab`                                          | `'preview' \| 'code' \| null`                    | `null`                | Controlled active tab (pair with `activeTabChange` for `[(activeTab)]`).       |
| `defaultTab`                                         | `'preview' \| 'code'`                            | `'preview'`           | Initial tab for uncontrolled usage.                                            |
| `appearance`                                         | `'surface' \| 'outline'`                         | `'outline'`           | Visual treatment, inherited by the code block.                                 |
| `size`                                               | `'sm' \| 'md' \| 'lg'`                           | `'md'`                | Size scale, inherited by the code block.                                       |
| `radius`                                             | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| null` | `null`                | Radius override.                                                               |
| `density`                                            | `'compact' \| 'normal' \| 'comfortable'`         | inherited             | Density variant.                                                               |
| `previewLabel` / `previewLabelKey`                   | `string \| null`                                 | Solaris fallback      | Visible label for the preview tab.                                             |
| `codeLabel` / `codeLabelKey`                         | `string \| null`                                 | Solaris fallback      | Visible label for the code tab.                                                |
| `ariaLabel` / `ariaLabelKey`                         | `string \| null`                                 | Solaris fallback      | Accessible name for the tab switcher.                                          |
| `fileSelectorAriaLabel` / `fileSelectorAriaLabelKey` | `string \| null`                                 | Solaris fallback      | Accessible name for the file selector.                                         |
| `codeBlockAppearance`                                | `'surface' \| 'outline' \| null`                 | inherits `appearance` | Appearance override for the code block.                                        |
| `codeBlockSize`                                      | `'sm' \| 'md' \| 'lg' \| null`                   | inherits `size`       | Size override for the code block.                                              |
| `codeExpandable`                                     | `boolean`                                        | `false`               | Enables expand/collapse in the code block.                                     |
| `codeCollapsedLines`                                 | `number`                                         | `8`                   | Visible lines while collapsed.                                                 |
| `previewAlign`                                       | `'start' \| 'center' \| 'stretch'`               | `'center'`            | Alignment of projected preview content.                                        |
| `previewMinHeight`                                   | `'sm' \| 'md' \| 'lg' \| 'xl'`                   | `'md'`                | Minimum height of the preview surface.                                         |
| `previewPadding`                                     | `'sm' \| 'md' \| 'lg'`                           | `'md'`                | Padding of the preview surface.                                                |

| Output            | Type                          | Description                       |
| ----------------- | ----------------------------- | --------------------------------- |
| `activeTabChange` | `Output<'preview' \| 'code'>` | Emits when the user changes tabs. |

### SolarisPreviewCodeFile

| Name       | Type                  | Description                             |
| ---------- | --------------------- | --------------------------------------- |
| `id`       | `string`              | Stable file identifier.                 |
| `label`    | `string`              | Visible file label fallback.            |
| `labelKey` | `string \| undefined` | Optional translation key for the label. |
| `language` | `string \| undefined` | Optional language for this file.        |
| `code`     | `string`              | Source code for this file.              |

## Appearances

| Appearance | Visual                                               |
| ---------- | ---------------------------------------------------- |
| `surface`  | Filled background with raised preview surface.       |
| `outline`  | Transparent frame, raised preview surface (default). |

Default: `outline`

Only `surface` and `outline` are supported, matching Solaris Code Block.

## Sizes

| Size | Usage              |
| ---- | ------------------ |
| `sm` | Dense docs.        |
| `md` | Default (default). |
| `lg` | Featured examples. |

Default: `md`

## Density

| Density       | Effect                             |
| ------------- | ---------------------------------- |
| `compact`     | Reduced gap and preview padding.   |
| `normal`      | Default spacing.                   |
| `comfortable` | Increased gap and preview padding. |

When not provided, Preview Code inherits density from `SolarisThemeService`.

## CSS Variables

| Token                                       | Purpose                     |
| ------------------------------------------- | --------------------------- |
| `--solaris-preview-code-background`         | Frame background.           |
| `--solaris-preview-code-border-color`       | Preview surface border.     |
| `--solaris-preview-code-text`               | Preview text color.         |
| `--solaris-preview-code-muted-text`         | Muted preview text.         |
| `--solaris-preview-code-preview-background` | Preview surface background. |
| `--solaris-preview-code-radius`             | Frame and surface radius.   |
| `--solaris-preview-code-gap`                | Frame gap.                  |
| `--solaris-preview-code-padding-block`      | Preview vertical padding.   |
| `--solaris-preview-code-padding-inline`     | Preview horizontal padding. |
| `--solaris-preview-code-min-height`         | Preview minimum height.     |

## Accessibility

- The tab switcher reuses Solaris Segmented Control keyboard and ARIA
  behavior (arrow keys, Home/End, Enter/Space).
- Each item exposes `aria-controls` pointing at its panel.
- Each panel uses `role="tabpanel"`, is focusable (`tabindex="0"`), and is
  named by its tab label.
- The inactive panel is removed from the DOM, keeping it out of the
  accessibility tree and focus order.
- Selection is not communicated by color alone; the segmented control exposes
  semantic selection state.
- The file selector inside the code panel reuses Code Block accessibility.

## Examples

```html
<!-- Basic -->
<solaris-preview-code [code]="buttonCode" language="html">
  <button solaris-button>Save</button>
</solaris-preview-code>

<!-- Start on code -->
<solaris-preview-code [code]="buttonCode" language="html" defaultTab="code">
  <button solaris-button>Save</button>
</solaris-preview-code>

<!-- Controlled -->
<solaris-preview-code [code]="buttonCode" language="html" [(activeTab)]="activeTab">
  <button solaris-button>Save</button>
</solaris-preview-code>

<!-- Multiple files -->
<solaris-preview-code [codeFiles]="buttonFiles" defaultCodeFile="ts">
  <button solaris-button>Save</button>
</solaris-preview-code>

<!-- Expandable code -->
<solaris-preview-code [code]="longCode" language="typescript" [codeExpandable]="true" [codeCollapsedLines]="4">
  <button solaris-button>Save</button>
</solaris-preview-code>

<!-- Translated labels -->
<solaris-preview-code [code]="buttonCode" language="html" previewLabelKey="docs.previewCode.preview" />
```

## Non-goals

- live editing
- iframe sandboxing
- external playground actions
- resizable preview areas
- raw HTML rendering
