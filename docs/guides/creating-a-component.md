# Solaris UI — Creating a Component

## Before you start

Read the following docs in order:

1. `docs/standards/component-standard.md` — component categories, mandatory states, API rules
2. `docs/standards/accessibility-standard.md` — ARIA, keyboard, focus requirements
3. `docs/quality-and-validation/testing-strategy.md` — what and how to test
4. `docs/standards/styling-and-tokens.md` — token-driven styling
5. `docs/quality-and-validation/definition-of-done.md` — acceptance criteria

## Directory structure

```
packages/angular/src/lib/components/<category>/<component-name>/
├── component/
│   ├── <component-name>.component.ts    (wiring only — no exported types, no utils)
│   ├── <component-name>.component.html
│   └── <component-name>.component.scss
├── model/
│   ├── <component-name>.types.ts        (types, interfaces — no Angular imports)
│   └── <component-name>.defaults.ts     (defaults, consts)
├── functions/
│   └── <component-name>.utils.ts        (pure logic — no Angular imports)
├── translation/
│   ├── en-US.json
│   ├── pt-BR.json
│   ├── es-419.json
│   └── index.ts
├── directives/          (optional — if the component has sub-directives)
├── token/               (optional — if the component owns tokens)
├── testing/
│   └── <component-name>.component.spec.ts
├── docs/
│   └── <component-name>.md
└── index.ts
```

`component/` never exports types or utils. `model/` never imports Angular
values. `functions/` never imports Angular or browser globals.
`validate-component.mjs` reports drift as warnings during migration
(errors for `functions/` purity) — violations in new code block CI after
the migration completes.

For **directives** (no template), use `directives/<name>.directive.ts` instead of `component/`.

## Step-by-step

### 1. Define the types

Create `model/<component-name>.types.ts`:

```typescript
export type SolarisComponentSize = 'sm' | 'md' | 'lg';

export interface SolarisComponentConfig {
  size?: SolarisComponentSize;
  label?: string;
}
```

Use `Solaris` prefix for all public types. Name exports consistently.

### 2. Create the component

```typescript
import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'solaris-component',
  standalone: true,
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-component',
    '[attr.data-size]': 'size()',
  },
})
export class SolarisComponentComponent {
  readonly value = model<string>();
  readonly size = input<SolarisComponentSize>('md');
  readonly disabled = input<boolean>(false);
  readonly valueChange = output<string>();
}
```

**Rules:**

- Use `input` signal, not `@Input()`
- Use `model` for two-way binding, `output` for events
- Use `OnPush` change detection
- Set `standalone: true`
- Use `data-*` attributes for visual variants, not CSS classes
- Host class is mandatory (`solaris-<name>`)

### 3. Style with tokens

```scss
[solaris-component] {
  --solaris-component-color: var(--solaris-neutral-text-body);
  --solaris-component-bg: var(--solaris-neutral-default);
  --solaris-component-radius: var(--solaris-radius-md);
  --solaris-component-padding: var(--solaris-spacing-3);

  color: var(--solaris-component-color);
  background: var(--solaris-component-bg);
  border-radius: var(--solaris-component-radius);
  padding: var(--solaris-component-padding);
}

[solaris-component][data-size='sm'] {
  --solaris-component-padding: var(--solaris-spacing-2);
}
[solaris-component][data-size='lg'] {
  --solaris-component-padding: var(--solaris-spacing-4);
}
```

**Rules:**

- Always use CSS custom properties with `--solaris-*` prefix
- Never use raw color/length values — always reference design tokens
- Use `data-*` attribute selectors for variants
- Never use `!important`

### 4. Write tests

```typescript
import { TestBed } from '@angular/core/testing';
import { SolarisComponentComponent } from './component-name.component';

describe('SolarisComponentComponent', () => {
  it('should create', () => {
    TestBed.configureTestingModule({ imports: [SolarisComponentComponent] });
    const fixture = TestBed.createComponent(SolarisComponentComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

See `docs/quality-and-validation/testing-strategy.md` for detailed test requirements.

### 5. Write documentation

Create `docs/<component-name>.md` in English. Sections follow a required baseline plus conditional sections:

**Always required:**

- `## Purpose` — what the component is for
- `## API` — inputs, outputs, types, defaults
- `## Accessibility` — ARIA, keyboard, focus, contrast
- `## Examples` — usage snippets

**Conditional (add when they apply):**

- `## CSS Variables` — only when the component defines `--solaris-*` tokens
- Visual variants section (e.g. `## Visual variants`, `## Appearances`, `## Sizes`) — only when the component exposes variant inputs (`appearance`, `size`, `density`, `radius`, `color`, `orientation`, …)

The template used by `generate-component.mjs` already includes all six sections; remove the conditional ones if they do not apply.

`tools/scripts/validate-component.mjs` enforces the required baseline and warns when tokens or variant inputs exist without the corresponding section. Run `pnpm validate:component` before committing.

See `packages/angular/src/lib/components/actions/button/docs/button.md` as reference.

### 6. Export in barrel

Add to `index.ts`:

```typescript
export { SolarisComponentComponent } from './component/component-name.component';
export type { SolarisComponentSize, SolarisComponentConfig } from './model/component-name.types';
```

### 7. Create changeset

```bash
pnpm changeset add
```

Describe what was added. The changeset is required for any change in `packages/angular/`.

## Checklist

- [ ] Types in `model/`, logic in `functions/`, wiring in `component/`
- [ ] `translation/` ships `en-US` + `pt-BR` + `es-419`
- [ ] Component standalone with OnPush
- [ ] Inputs use `input()` signal, outputs use `output()`
- [ ] Host class set (`solaris-<name>`)
- [ ] CSS uses `--solaris-*` tokens only
- [ ] Variants use `data-*` attributes
- [ ] Motion: reduced-motion guard on every transition/animation
- [ ] Spec file created with minimum 3 tests
- [ ] Documentation created with all required sections, in English
- [ ] Exported in barrel (`index.ts`)
- [ ] Changeset created
- [ ] `pnpm check` passes
- [ ] No commit without human review (AI never commits autonomously)
