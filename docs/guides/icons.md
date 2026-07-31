# Solaris UI — Icon System

## Usage

```html
<solaris-icon name="check" />
<solaris-icon name="x" decorative />
<solaris-icon name="info" ariaLabel="Information" />
```

## Inputs

| Input        | Type      | Default  | Description                          |
| ------------ | --------- | -------- | ------------------------------------ |
| `name`       | `string`  | required | Icon name from the registry          |
| `decorative` | `boolean` | `false`  | Hides icon from screen readers       |
| `ariaLabel`  | `string`  | —        | Accessible label when not decorative |

## Accessibility

- **Decorative icons** (`[decorative]="true"`): set `aria-hidden="true"` and `role="presentation"`. Use when the icon is purely visual and the surrounding text already conveys the meaning.
- **Semantic icons** (default): set `role="img"`. Provide `ariaLabel` when the icon conveys meaning not present in text.
- Icons inside buttons should use `[decorative]="true"` if the button already has a text label.

## Registering custom icons

### 1. Define the icon

```typescript
import type { SolarisIconDefinition } from '@educarehq/solaris-ui';

const myIcon: SolarisIconDefinition = {
  name: 'custom-star',
  viewBox: '0 0 24 24',
  elements: [{ type: 'path', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }],
};
```

Supported element types: `path`, `circle`, `rect`, `line`, `polyline`, `polygon`.

### 2. Register via provider

```typescript
import { provideSolaris } from '@educarehq/solaris-ui';

export const appConfig = {
  providers: [provideSolaris({ icons: { extraIcons: [myIcon] } })],
};
```

### 3. Use in templates

```html
<solaris-icon name="custom-star" />
```

## Built-in icons

Solaris ships with the following icon groups:

| Group      | Icons                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Actions    | `check`, `x`, `chevron-down`, `chevron-right`, `chevron-left`, `chevron-up`, `search`, `plus`, `minus`, `edit`, `copy`, `share`, `external-link`, `more-horizontal`, `more-vertical` |
| Navigation | `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`, `home`, `menu`, `sidebar`                                                                                                     |
| Status     | `info`, `warning`, `danger`, `success`, `alert-circle`, `help-circle`, `question`                                                                                                    |
| Layout     | `maximize`, `minimize`, `expand`, `collapse`, `move`                                                                                                                                 |
| Data       | `download`, `upload`, `trash`, `file`, `folder`, `filter`, `refresh-cw`                                                                                                              |
| Theme      | `sun`, `moon`, `eye`, `eye-off`, `settings`, `bell`                                                                                                                                  |

To check if an icon exists at runtime:

```typescript
import { SolarisIconRegistryService } from '@educarehq/solaris-ui';

class MyComponent {
  private registry = inject(SolarisIconRegistryService);

  hasIcon = this.registry.hasIcon('custom-star');
}
```

## Icon colors

The icon inherits the current text color via `currentColor`:

```css
.my-icon-container {
  color: var(--solaris-primary-base);
}
```

To set a specific icon color, wrap it in an element with the desired color.

## Best practices

- Use existing built-in icons whenever possible
- Keep custom icons in a single file grouped by feature
- Use `decorative` for purely visual icons
- Always provide `ariaLabel` for icons that convey information
- Test icons at multiple sizes — use `font-size` on the parent to scale
- Prefer SVG paths over bitmap images for better scaling and theming
