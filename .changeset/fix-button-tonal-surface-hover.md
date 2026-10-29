## '@educarehq/solaris-ui': patch

fix(button): give tonal and surface appearances a visible hover and active background step

`tonal` and `surface` mapped `--*-hover-background` and `--*-active-background` back to the rest background (`*-soft` / `neutral-sunken`) in every color, so hover only moved the border and looked dead. They now use new per-theme `*-soft-hover` / `*-soft-active` (and `neutral-sunken-hover` / `neutral-sunken-active`) tokens — one light step above rest for hover, a second step for active, keeping `rest < hover < active` with the existing `*-solid` hover border untouched. Applied identically to `button` and `icon-button` (full parity). Text colors are unchanged by this change; note (owner-accepted debt): the concurrent out-of-scope `danger-foreground` retunes sit below AA on the new hover/active steps — tracked as follow-up, not caused by this ladder.
