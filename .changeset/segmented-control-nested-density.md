---
'@educarehq/solaris-ui': patch
---

Fix `solaris-segmented-control` height when nested inside another component carrying its own `data-size`/`data-density` (e.g. the `sm` + `compact` command selector inside `solaris-code-block` rendered at 32px instead of 28px). The item's size/density visuals (`--solaris-segmented-item-gap`, `--solaris-segmented-item-padding-y`, `--solaris-segmented-item-font-size`, `--solaris-segmented-item-icon-size`) are now owned by the `solaris-segmented-control` host per size x density combination and inherited by `solaris-segmented-item`, instead of `:host-context([data-size][data-density])` rules that also matched outer ancestors. Remaining `:host-context` rules in the item are qualified with the `solaris-segmented-control` element.
