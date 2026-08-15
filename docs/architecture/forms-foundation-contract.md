# Solaris UI - Forms Foundation Contract

## Purpose

This document defines the architectural contract for the forms system in Solaris UI **before** any component is implemented.

It is the source of truth for Form Field, Input, Textarea, Checkbox, Radio, Switch, and Select in version `0.2.0`.

Implementation prompts must follow this contract without deviation.

---

## 1. Core Principles

**Principle 1 - Separation of concerns:**

- Form Field organizes context.
- Input collects value.
- Error communicates validation.
- Control does not become layout manager.

**Principle 2 - Infrastructure first:**
Forms are critical product infrastructure. Architecture prioritizes accessibility, predictability, Angular Forms integration, visual consistency, and low coupling.

**Principle 3 - Native when possible, component when necessary:**
Controls that preserve native semantics and browser behavior must be directives. Controls with their own visual anatomy and complex internal states must be components.

---

## 2. Component Type Decisions

### 2.1. Form Field

- **Type:** Component (`solaris-form-field`).
- **Requirement:** Recommended, not mandatory.
- The inner control must work standalone without Form Field.
- Form Field orchestrates label, hint, error, prefix, suffix, and `aria-describedby`.

### 2.2. Input

- **Type:** Directive (`[solaris-input]`).
- Applied on native `<input>`.
- Preserves autofill, keyboard, semantics, browser behavior, and Angular Forms integration.
- **Do not** create a `solaris-input` component.

### 2.3. Textarea

- **Type:** Directive (`[solaris-textarea]`).
- Applied on native `<textarea>`.
- Same justification as Input.
- **Do not** create a `solaris-textarea` component.

### 2.4. Checkbox

- **Type:** Component (`solaris-checkbox`).
- Own visual anatomy (indicator, label, states).
- Own `ControlValueAccessor`.

### 2.5. Radio and Radio Group

- **Type:** Component (`solaris-radio`, `solaris-radio-group`).
- Radio Group orchestrates Radio selection.
- `ControlValueAccessor` on Radio Group.

### 2.6. Switch

- **Type:** Component (`solaris-switch`).
- Own visual anatomy.
- Own `ControlValueAccessor`.

### 2.7. Select

- **Type:** Component (`solaris-select`).
- Custom dropdown with overlay.
- Searchable in v1.
- Single select in v1; multiple select planned as natural evolution.
- **Do not** treat as a directive over native `<select>`.
- Select is the most complex component in the Forms Release and requires its own rigorous prompt.

---

## 3. Angular Forms Integration

### 3.1. Reactive Forms

Reactive Forms is mandatory. All custom controls must work predictably with `formControlName` and `[formControl]`.

### 3.2. Template-driven Forms

Template-driven Forms must be compatible when natural, but it is not the top priority.

### 3.3. ControlValueAccessor

Custom controls must implement or correctly integrate with `ControlValueAccessor`:

- `solaris-checkbox`
- `solaris-radio`
- `solaris-radio-group`
- `solaris-switch`
- `solaris-select`

Input and Textarea (native directives) **must not** create their own CVA unless a very well-justified technical need arises.

### 3.4. Required support

All custom controls must support:

- `writeValue`
- `registerOnChange`
- `registerOnTouched`
- `setDisabledState`
- touched
- dirty
- invalid
- disabled
- integration with `formControlName`
- integration with `[formControl]`

---

## 4. Form Field Integration

Form Field detects and orchestrates the inner control automatically whenever possible.

### 4.1. Form Field responsibilities

- label
- hint
- error
- description (when applicable)
- required/optional marker
- prefix
- suffix
- `aria-describedby`
- label association (`for`/`id`)
- visual state (invalid, focused, disabled, readonly) when detectable
- automatic IDs when consumer does not provide `id`

### 4.2. Control responsibilities

- value
- interaction
- focus
- disabled
- readonly (when applicable)
- Angular Forms integration
- minimal state exposure to Form Field

---

## 5. Internal Control Contract (Conceptual)

This contract does not need to be implemented as a public class/interface in this task, but must guide future implementations.

### 5.1. Expected control capabilities

- `id: string`
- `focused: boolean`
- `disabled: boolean`
- `readonly: boolean` (when applicable)
- `invalid: boolean`
- `required: boolean` (when detectable)
- `describedByIds: string[]`
- `setDescribedByIds(ids: string[]): void`
- `focus(): void`
- reference to `NgControl` when applicable

### 5.2. Constraint

Do not turn this into a heavy public API. It may remain an internal documented contract to guide implementation.

---

## 6. Error Display Rules

### 6.1. Default rule (v1)

Error is visible only when:

```txt
control.invalid &&
(control.touched || control.dirty) &&
!control.focused
```

### 6.2. Expected behavior

Required empty field:

- user has not touched yet â†’ no error
- user focused and is still typing â†’ no aggressive visual error
- user left the field (blur) empty â†’ red border + error message
- user corrects the value â†’ error disappears

### 6.3. Future evolution

```txt
control.invalid &&
(control.touched || control.dirty || form.submitted) &&
!control.focused
```

### 6.4. Visual error state

- red border when required field is empty after blur
- error message below the field
- `aria-describedby` pointing to the error
- invalid state **must not** depend only on color (use icon, border, text)

---

## 7. Visual States

Form Field and controls must support:

- default
- hover
- focus
- invalid
- disabled
- readonly
- required
- optional

---

## 8. Hint, Error and Description

### 8.1. Concept definitions

| Concept     | Description                                    |
| ----------- | ---------------------------------------------- |
| hint        | Light, contextual help below the field         |
| error       | Validation message or problem                  |
| description | Auxiliary descriptive text linked to the field |

### 8.2. Usage forms

**Via input string:**

```html
<solaris-form-field label="E-mail" hint="Use your institutional e-mail" error="Enter a valid e-mail">
  <input solaris-input />
</solaris-form-field>
```

**Via projection:**

```html
<solaris-form-field label="Password">
  <input solaris-input />

  <solaris-form-hint> Use at least 12 characters. </solaris-form-hint>

  <solaris-form-error> Password is required. </solaris-form-error>
</solaris-form-field>
```

### 8.3. Future components (planned)

- `solaris-form-label`
- `solaris-form-hint`
- `solaris-form-error`

---

## 9. Label

### 9.1. Usage forms

**Via input string:**

```html
<solaris-form-field label="Name">
  <input solaris-input />
</solaris-form-field>
```

**Via projection:**

```html
<solaris-form-field>
  <solaris-form-label>Name</solaris-form-label>
  <input solaris-input />
</solaris-form-field>
```

The projected label must preserve semantics and allow composition.

---

## 10. Required and Optional

### 10.1. Planned inputs

- `required: boolean`
- `optional: boolean`
- `requiredLabel: string`
- `optionalLabel: string`
- `requiredLabelKey: string`
- `optionalLabelKey: string`

### 10.2. Visual decisions

- Mark **optional** by default when `optional=true`
- **Do not** mark required with asterisk on every field automatically
- **Do not** use a bare asterisk as the only visual indicator

```html
<solaris-form-field label="Complement" optional>
  <input solaris-input />
</solaris-form-field>
```

Expected visual: `Complement (optional)`

A required field must influence semantics, state, and visual validation when applicable, but must not visually pollute all required fields.

---

## 11. Prefix and Suffix

### 11.1. Directives

- `[solaris-form-prefix]`
- `[solaris-form-suffix]`

### 11.2. Usage with icon

```html
<solaris-form-field label="Search">
  <solaris-icon solaris-form-prefix name="search" decorative="true" />
  <input solaris-input />
</solaris-form-field>
```

### 11.3. Usage with text

```html
<solaris-form-field label="Amount">
  <span solaris-form-prefix>R$</span>
  <input solaris-input />
  <span solaris-form-suffix>BRL</span>
</solaris-form-field>
```

### 11.4. Usage with action

```html
<solaris-form-field label="Password">
  <input solaris-input type="password" />
  <button solaris-icon-button solaris-form-suffix aria-label="Show password">
    <solaris-icon name="info" decorative="true" />
  </button>
</solaris-form-field>
```

### 11.5. v1 constraints

- **Do not** create separate leading/trailing API.
- Prefix and suffix accept text, icon, or action.

---

## 12. Size, Density and Radius

### 12.1. Size (control-level)

Size applies to the control directives (`solaris-input`, `solaris-textarea`,
`option`, etc.), not to the `solaris-form-field` wrapper. The wrapper's
vertical rhythm and typography are governed by density.

| Value | Description      |
| ----- | ---------------- |
| `sm`  | Small            |
| `md`  | Medium (default) |
| `lg`  | Large            |

Size affects: height, padding, font-size, icon size, prefix/suffix spacing.

### 12.2. Density

| Value         | Description      |
| ------------- | ---------------- |
| `compact`     | Compact          |
| `normal`      | Normal (default) |
| `comfortable` | Comfortable      |

Density affects: vertical spacing, padding, internal rhythm, and typography (control font size), without compromising accessibility.

### 12.3. Radius (textual fields)

| Value  | Description      |
| ------ | ---------------- |
| `none` | Sharp            |
| `sm`   | Small            |
| `md`   | Medium (default) |
| `lg`   | Large            |

- **Do not** use `full` radius for textual fields.
- **Do not** use `xl` for textual fields in v1.

---

## 13. Appearance

| Value     | Description                      |
| --------- | -------------------------------- |
| `outline` | Classic bordered (default)       |
| `surface` | Neutral surface for cards/panels |
| `filled`  | Subtle background, modern style  |

**Glass is excluded in v1.**

---

## 14. Readonly

- `disabled` = non-interactive, generally does not submit value
- `readonly` = value visible, not editable; behavior depends on the control

Input: supports `readonly`.
Textarea: supports `readonly`.
Select: plan `readonly` in the contract, discuss in the Select prompt.
Checkbox / Radio / Switch: **do not** invent `readonly` without clear need.

---

## 15. Automatic IDs and SSR Safety

Form Field and controls must orchestrate IDs for:

- label
- hint
- error
- description
- `aria-describedby`
- `aria-labelledby` (when applicable)

### 15.1. Rules

- If consumer does not provide `id`, Solaris generates an ID automatically
- Auto-generated IDs must be SSR-safe
- **Do not** use `Math.random()`
- **Do not** depend on `window` / `document`

### 15.2. Conceptual example

```
solaris-form-field-1
solaris-form-control-1
solaris-form-hint-1
solaris-form-error-1
```

---

## 16. Accessibility

Reference: `docs/standards/accessibility-standard.md`. This section applies that standard to forms.

- label correctly associated with the control (`for`/`id`)
- `aria-describedby` with hint/error/description
- visible error associated with the control
- `invalid` state communicated accessibly
- `disabled` state respected
- `readonly` state respected (when applicable)
- visible focus
- preserved keyboard navigation
- **do not** rely only on color
- adequate contrast in light/dark
- predictable screen reader behavior
- **no** div/span pretending to be a native control when a better alternative exists

---

## 17. I18n

Reference: `docs/standards/i18n_standard.md`. This section applies that standard to forms.

### 17.1. Translation-oriented inputs

- `labelKey`
- `hintKey`
- `errorKey`
- `optionalLabelKey`
- `requiredLabelKey`

### 17.2. Translatable texts

- optional label
- required label
- error messages (when provided by key)
- loading/empty states (future)
- select placeholder/search placeholder/no results (future)

### 17.3. Constraint

Do not over-engineer the API before components exist. This contract guides consistent patterns - actual inputs will be decided in each prompt.

---

## 18. Security

Reference: `docs/engineering/security-baseline.md`. This section applies that baseline to forms.

### 18.1. Prohibitions

- `innerHTML`
- `bypassSecurityTrustHtml`
- `bypassSecurityTrustUrl`
- arbitrary HTML in string inputs

### 18.2. Rich content

Use safe projection (`<ng-content>`) instead of HTML in strings.

**Correct:**

```html
<solaris-form-error>Text with <strong>emphasis</strong></solaris-form-error>
```

**Incorrect:**

```html
<solaris-form-field error="<b>Error</b>">...</solaris-form-field>
```

---

## 19. Testing Strategy

Reference: `docs/quality-and-validation/testing-strategy.md`. This section applies that strategy to forms.

### 19.1. Mandatory tests per control

- public API
- Angular Forms integration
- `ControlValueAccessor` (when applicable)
- disabled
- readonly (when applicable)
- touched / dirty
- invalid
- focus / blur
- `aria-describedby`
- label association
- hint / error visibility
- keyboard interaction
- dark/light tokens (when feasible)
- density / size / radius / appearance
- SSR-safety (when applicable)

### 19.2. Specific tests for Form Field

- label via input
- label via projection
- hint via input
- hint via projection
- error via input
- error via projection
- prefix
- suffix
- optional marker
- required state
- invalid after blur
- no error while focused
- `aria-describedby` update
- generated IDs

---

## 20. Foundation Compatibility

Forms must reuse existing patterns, **not create a parallel system**:

- tokens
- theme
- density
- radius
- motion / reduced-motion
- accessibility service / foundation
- translate service / foundation
- Button / Icon Button for suffix actions
- Icon for prefix / suffix
- Badge only where it makes sense (future)

---

## 21. Release Order

The Forms Release `0.2.0` must follow this order:

1. **Forms Foundation Contract** â† this document
2. Form Field
3. Input
4. Textarea
5. Checkbox
6. Radio
7. Switch
8. Select

Select is intentionally last because it requires overlay, keyboard navigation, searchable, CVA, and strong a11y.

---

## 22. Next Prompts (Mini Prompts)

Future Forms Release prompts will follow this naming convention:

- `foundation-form-field.txt`
- `foundation-input.txt`
- `foundation-textarea.txt`
- `foundation-checkbox.txt`
- `foundation-radio.txt`
- `foundation-switch.txt`
- `foundation-select.txt`

Each prompt must reference this contract as the source of truth and **must not** deviate from the decisions defined here without updating this document first.

---

## 23. Decision Records

| #   | Decision                   | Value                                       |
| --- | -------------------------- | ------------------------------------------- |
| 1   | Form Field                 | Component, recommended not mandatory        |
| 2   | Input                      | Native directive `[solaris-input]`          |
| 3   | Textarea                   | Native directive `[solaris-textarea]`       |
| 4   | Checkbox                   | Component                                   |
| 5   | Radio / Radio Group        | Component                                   |
| 6   | Switch                     | Component                                   |
| 7   | Select                     | Custom searchable component v1              |
| 8   | Angular Forms              | Reactive mandatory                          |
| 9   | CVA                        | Checkbox, Radio, RadioGroup, Switch, Select |
| 10  | Error rule                 | `invalid && (touched\|\|dirty) && !focused` |
| 11  | Label                      | Input string + projection                   |
| 12  | Hint / Error / Description | Input string + projection                   |
| 13  | Required                   | No mandatory asterisk by default            |
| 14  | Optional                   | Marked by default when `optional=true`      |
| 15  | Prefix / Suffix            | Directives in v1                            |
| 16  | Density                    | compact / normal (default) / comfortable    |
| 17  | Radius (textual)           | none / sm / md (default) / lg               |
| 18  | Appearance                 | outline (default) / surface / filled        |
| 19  | Glass                      | Excluded in v1                              |
| 20  | Readonly                   | Input, Textarea, Select (plan ahead)        |
| 21  | IDs                        | Automatic SSR-safe                          |
| 22  | i18n                       | Solaris standard                            |
| 23  | Security                   | No innerHTML or bypass                      |
| 24  | shared folder              | Forbidden                                   |

---

## 24. Non-negotiable Rules

1. Forms must not use `innerHTML`.
2. Forms must not use `bypassSecurityTrustHtml`.
3. Forms must not depend on `window` / `document` directly.
4. Forms must not use `Math.random()` for IDs.
5. Error must not appear while control is focused.
6. Error must not appear before touched/dirty.
7. `invalid` state is never communicated only through color.
8. Every custom control has a CVA.
9. The `shared` folder does not exist for forms.
10. Tailwind is not used.

---

## 25. References

- `docs/standards/component-standard.md`
- `docs/standards/directive-standard.md`
- `docs/standards/accessibility-standard.md`
- `docs/standards/i18n_standard.md`
- `docs/standards/styling-and-tokens.md`
- `docs/quality-and-validation/testing-strategy.md`
- `docs/quality-and-validation/definition-of-done.md`
- `docs/roadmap/project-roadmap.md`
