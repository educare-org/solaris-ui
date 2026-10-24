---
'@educarehq/solaris-ui': minor
---

Remove legacy `groups/*.ts` icon sources and generate `SOLARIS_BUILT_IN_ICONS` from `tools/icons` SVG source via `pnpm icons:build` (`solaris-icons-generated.ts`). Remove `SOLARIS_OUTLINE_SVG` public export to keep showcase budget; outline markup is served from the registry via `iconElementsToInner`. Add 48 dedicated solid and 57 dedicated duotone artworks (60 solid / 65 duotone validated with fillable derivation), with `rss` duotone and mail/message/user/server families covered.
