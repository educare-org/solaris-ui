# Solaris UI — Forms Security

## Principle

Forms components must be secure by construction.

They do not replace backend validation, but they must not offer APIs or patterns that induce XSS, unsafe rendering, data leakage in the DOM, or unintended value changes.

## Public string inputs are plain text

All public string inputs are treated as plain text. They are rendered through Angular text interpolation (`{{ value }}`), never as HTML.

### Considered plain text

- `label` / `labelKey`
- `placeholder` / `placeholderKey`
- `hint` / `hintKey`
- `error` / `errorKey`
- `emptyText` / `emptyTextKey`
- `loadingText` / `loadingTextKey`
- `searchPlaceholder` / `searchPlaceholderKey`
- `option label` / `description`
- `option group label`
- `tooltip title` / `tooltip content`
- `displayWith` return value
- `closeLabel` / `ariaLabel`

## Raw HTML is not supported

Solaris forms do not support raw HTML string rendering.

The following are **forbidden** in forms components:

- `innerHTML`, `outerHTML`
- `insertAdjacentHTML`
- `bypassSecurityTrustHtml`, `bypassSecurityTrustUrl`, `bypassSecurityTrustResourceUrl`
- `DomSanitizer` for rendering user content
- `labelHtml`, `descriptionHtml`, `tooltipHtml`, `errorHtml`, `hintHtml`
- `rawSvg`, `svgString`, `iconUrl`
- `dangerouslySetInnerHTML` or equivalent

## Projected Angular content is the supported path for rich UI

Rich content must use Angular content projection, controlled by the consumer.

**Correct:**

```html
<solaris-option value="br">
  <span solaris-option-leading>
    <solaris-icon name="flag-br" decorative="true" />
  </span>
  <span solaris-option-label>Brasil</span>
</solaris-option>
```

**Forbidden:**

```html
<solaris-option [labelHtml]="htmlFromApi"></solaris-option>
```

Projected content is rendered as an Angular template provided by the consumer. Solaris does not sanitize arbitrary projected component behavior. Solaris does not support raw HTML string rendering.

## `displayWith` returns plain text

`displayWith` functions used in Select components must return plain text strings, not `TemplateRef`, `SafeHtml`, `HTMLElement`, or interpreted HTML.

Even if `displayWith` returns `<b>Admin</b>`, the text must appear escaped as text, not rendered as HTML.

## Icons use `SolarisIconRegistry` or projection

**Safe:**

- `SolarisIconRegistry` with `<solaris-icon name="...">`
- Projected Angular content

**Forbidden:**

- `iconUrl`, `rawSvg`, `svgString`
- SVG string via `innerHTML`
- Remote image URLs as the component's official icon API

If the consumer projects an image or SVG on their own, that is the consumer's responsibility. The Solaris public API must not encourage this.

## No remote fetching inside form primitives

Forms primitives must not call APIs directly.

**Forbidden in forms components:**

- `remoteUrl`, `fetchUrl`, `dataSourceUrl`, `loadOptionsFromUrl`
- `HttpClient` inside Select, Multi Select, or Option
- `fetch`, `XMLHttpRequest`

If async data loading is needed in the future, it must be provided by the consuming application through controlled data/controllers, not via a URL string inside the component.

## Search security

- Search must not create `RegExp` directly from the user's search term
- Prefer string normalization + `toLowerCase()` + `includes()`
- If regex is unavoidable, escape special characters first
- Search terms must not break filtering with characters like `*`, `+`, `?`, `[`, `]`, `(`, `)`, `\`, `$`, `^`, `.`
- Search must handle long text without freezing

## DOM leakage protection

- Complex values (objects, arrays) must not be serialized in the DOM
- `JSON.stringify(value)` in DOM attributes is forbidden
- No `data-value` attributes with serialized values
- Sensitive objects must remain in memory, compared via `compareWith`
- Internal IDs must be SSR-safe
- Do not build `querySelector` strings with user input without escaping

## `compareWith` security

- Default `compareWith` should use `Object.is` when applicable
- `compareWith` must be called defensively
- Errors in `compareWith` must not break the entire UI without diagnostic

## Disabled state

Disabled must block all value-changing interactions:

| Interaction                              | Must block |
| ---------------------------------------- | ---------- |
| Click on option                          | Yes        |
| Enter / Space                            | Yes        |
| Arrow selection that changes value       | Yes        |
| Clear button                             | Yes        |
| Remove chip                              | Yes        |
| Toggle (checkbox/switch/radio)           | Yes        |
| Select all                               | Yes        |
| Programmatic interaction via user action | Yes        |

A disabled option must not be selectable through any interaction path:

- Click, Enter, Space
- Keyboard navigation
- Search followed by Enter
- Select all
- Internal component programming triggered by user interaction

## Readonly state

Readonly is not disabled.

Readonly must block all value-changing interactions (same as disabled), but must preserve:

- Visual contrast (better than disabled)
- Text selection and reading
- Focusability when appropriate

Readonly must not emit `valueChange` / `changeEvent` from user interaction.

## Overlay cleanup

When a component that uses an overlay (Select, Popover, Tooltip) is destroyed:

- The overlay must be removed from the DOM
- Subscriptions and listeners must be cleaned up
- No orphan overlays in the DOM
- No stale references after destroy

Overlay behavior in forms:

- Escape closes the overlay
- Click outside closes the overlay
- Scroll/resize should reposition when infrastructure offers it
- Overlay must not trap focus like a modal (unless it is a modal component)
- Focus restore must be predictable
- Events must not leak and alter value after close

## Required tests for security

### Unsafe rendering tests

Every form component that accepts text inputs must verify that HTML-like strings render as escaped text:

- Form Field: label, hint, error with `<img src=x onerror=alert(1)>` render as text
- Option: label and description with HTML-like strings render as text
- Option Group: label with HTML-like strings renders as text
- Select: placeholder, emptyText, loadingText, displayWith with HTML-like strings render as text
- Tooltip: title and body with HTML-like strings render as text

### Search security tests

- Search term with `[` does not break filter
- Search term with `*` does not break filter
- Search term with `(a+)+` does not create dangerous dynamic regex
- Search is case-insensitive if that is the contract
- Search ignores accents if that is the contract; document otherwise

### Disabled/readonly interaction tests

- Disabled option does not select by click, Enter, or Space
- Readonly Select does not change by click on option or keyboard
- Readonly Select does not clear via clear button
- Disabled Select does not open or does not allow alteration per contract
- Readonly Multi Select does not remove chip or execute select all
- Disabled Multi Select does not execute select all

### Overlay cleanup tests

- Destroying Select with panel open removes the overlay
- Closing by Escape does not alter value unduly
- Clicking outside closes overlay
- Subscriptions/listeners are cleaned up when technically testable

### DOM leakage tests

- Object values do not appear serialized in the DOM
- Arrays of values in Multi Select do not appear in `data-value` attributes
- Selected objects do not appear as `[object Object]` in attributes
