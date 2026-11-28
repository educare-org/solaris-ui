---
'@educarehq/solaris-ui': patch
---

Fix `rich-text-editor` quote edge cases: committed values no longer leak managed closing marks or `data-hide-open` variants, Enter with a ranged selection exits the quote to a paragraph, `maxLength` reverts keep the closing mark, empty structural blocks count as empty, pasted/merged nesting is repaired, exiting an empty quote collapses it, and `> ` + Space converts a text block into a quote. Also stabilizes the color e2e (contrast probes preserve the selection, specs wait for the popover) and aligns the style spec with the `normal` motion token.
