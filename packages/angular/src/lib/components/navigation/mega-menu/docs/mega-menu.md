# Solaris Mega Menu

## Purpose

Mega Menu provides a connected overlay for navigation content. It is anchored to a navigation container, opened by a semantic button, and can coordinate sibling menus through an optional group.

## API

### SolarisMegaMenuComponent

| Input               | Type                                  | Default       | Description                                          |
| ------------------- | ------------------------------------- | ------------- | ---------------------------------------------------- |
| `open`              | `boolean`                             | `false`       | Open state; supports two-way binding.                |
| `panelWidth`        | `'trigger' \| 'anchor' \| 'viewport'` | `'viewport'`  | Width used for the overlay panel.                    |
| `appearance`        | `'underline' \| 'text'`               | `'underline'` | Trigger appearance.                                  |
| `backdrop`          | `boolean`                             | `false`       | Adds a backdrop around the anchored navigation area. |
| `persistentOnClick` | `boolean`                             | `false`       | Keeps the menu open after its trigger is clicked.    |
| `hoverOpenDelay`    | `number`                              | `120`         | Delay in milliseconds before hover opens the panel.  |
| `hoverCloseDelay`   | `number`                              | `160`         | Delay in milliseconds before hover closes the panel. |

| Output   | Description                                      |
| -------- | ------------------------------------------------ |
| `opened` | Emits after the panel attaches to the overlay.   |
| `closed` | Emits after the panel detaches from the overlay. |

### Directives

| Directive                   | Description                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `solaris-mega-menu-anchor`  | Required on an ancestor that supplies the overlay origin and active navigation area. |
| `solaris-mega-menu-trigger` | Required on the button that opens and closes a menu.                                 |
| `solaris-mega-menu-panel`   | Required on the `ng-template` rendered in the overlay.                               |
| `solaris-mega-menu-group`   | Optional ancestor that closes the previously active sibling menu.                    |

## Accessibility

- The trigger receives `aria-controls`, `aria-expanded`, and `aria-haspopup` automatically.
- Escape closes the menu and restores focus to its trigger.
- Moving focus outside both the trigger and panel closes the menu.
- The panel supports pointer hover with configurable open and close delays.
- Motion is disabled when the user requests reduced motion.

## Examples

```html
<nav solaris-mega-menu-anchor solaris-mega-menu-group>
  <solaris-mega-menu panelWidth="anchor" [backdrop]="true">
    <button solaris-mega-menu-trigger>Products</button>

    <ng-template solaris-mega-menu-panel>
      <section class="product-links">
        <a href="/forms">Forms</a>
        <a href="/navigation">Navigation</a>
      </section>
    </ng-template>
  </solaris-mega-menu>
</nav>
```

Use `[(open)]` when application state needs to control the panel:

```html
<solaris-mega-menu solaris-mega-menu-anchor [(open)]="productsOpen">
  <button solaris-mega-menu-trigger>Products</button>
  <ng-template solaris-mega-menu-panel>...</ng-template>
</solaris-mega-menu>
```

## Appearances

| Appearance  | Description                                         |
| ----------- | --------------------------------------------------- |
| `underline` | Draws an active underline aligned with the trigger. |
| `text`      | Uses a text-only active state.                      |

## CSS Variables

| Variable                         | Default                    | Description             |
| -------------------------------- | -------------------------- | ----------------------- |
| `--solaris-mega-menu-background` | `--solaris-surface-raised` | Panel background.       |
| `--solaris-mega-menu-color`      | `--solaris-text-default`   | Panel foreground color. |
| `--solaris-mega-menu-shadow`     | `--solaris-shadow-lg`      | Panel elevation shadow. |
