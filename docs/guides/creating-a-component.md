# Solaris UI — Creating a Component

## Before you start

Read the following docs in order:

1. `COMPONENT_STANDARD.md` — component categories, mandatory states, API rules
2. `ACCESSIBILITY_STANDARD.md` — ARIA, keyboard, focus requirements
3. `TESTING_STRATEGY.md` — what and how to test
4. `STYLING_AND_TOKENS.md` — token-driven styling
5. `DEFINITION_OF_DONE.md` — acceptance criteria

## Directory structure

```
packages/angular/src/lib/components/<category>/<component-name>/
├── component/
│   ├── <component-name>.component.ts
│   ├── <component-name>.component.html
│   └── <component-name>.component.scss
├── directives/          (optional — if the component has sub-directives)
├── model/
│   ├── <component-name>.types.ts
│   └── <component-name>.tokens.ts  (optional)
├── testing/
│   └── <component-name>.component.spec.ts
├── docs/
│   └── <component-name>.md
└── index.ts
```

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
  --solaris-component-color: var(--solaris-text-default);
  --solaris-component-bg: var(--solaris-surface-base);
  --solaris-component-radius: var(--solaris-radius-md);
  --solaris-component-padding: var(--solaris-spacing-3);

  color: var(--solaris-component-color);
  background: var(--solaris-component-bg);
  border-radius: var(--solaris-component-radius);
  padding: var(--solaris-component-padding);
}

[solaris-component][data-size='sm'] { --solaris-component-padding: var(--solaris-spacing-2); }
[solaris-component][data-size='lg'] { --solaris-component-padding: var(--solaris-spacing-4); }
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

See `TESTING_STRATEGY.md` for detailed test requirements.

### 5. Write documentation

Create `docs/<component-name>.md` following the existing pattern. Required sections:

- Purpose
- API (inputs, outputs, types)
- Visual variants
- Accessibility
- CSS Variables
- Examples

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

- [ ] Types defined in `model/` (input/output types, config interface)
- [ ] Component standalone with OnPush
- [ ] Inputs use `input()` signal, outputs use `output()`
- [ ] Host class set (`solaris-<name>`)
- [ ] CSS uses `--solaris-*` tokens only
- [ ] Variants use `data-*` attributes
- [ ] Spec file created with minimum 3 tests
- [ ] Documentation created with all required sections
- [ ] Exported in barrel (`index.ts`)
- [ ] Changeset created
- [ ] `pnpm check` passes
