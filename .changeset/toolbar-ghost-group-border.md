---
'@educarehq/solaris-ui': patch
---

fix(rich-text-editor): scope legacy toolbar button styles to native buttons

The `.solaris-rich-text-toolbar button` block (36px min-size, `::before` hit area, hover/active/focus/disabled) predates the toolbar migration to `solaris-button-group` + `solaris-icon-button` and was overriding the size x density matrix via higher specificity. Legacy rules now apply only to `button:not([solaris-button], [solaris-icon-button])`, so DS buttons follow their tokens while native toolbar buttons keep the 36px floor.

fix(rich-text-editor): standardize remaining toolbar buttons to ghost sm icon-buttons

The `link`, `unlink`, `format`, `image` and `table` actions were still native buttons on the fixed 36px legacy style; they are now `solaris-icon-button` with `appearance="ghost"` and `size="sm"`, matching the rest of the toolbar matrix.

fix(button-group): attached all-ghost groups render borderless

An attached group whose every button child is `ghost` no longer draws the container frame or inner separators (transparent overrides via `:has()`); mixed groups are unchanged.
