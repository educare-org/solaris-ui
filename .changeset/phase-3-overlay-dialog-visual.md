---
'@educarehq/solaris-ui': patch
---

Phase 3 overlay visual: dialog panel `radius="full"` is removed (pill dialogs contradict the calm surface language) — `SolarisDialogRadius` is now `'none' | 'sm' | 'md' | 'lg' | 'xl'` (max `xl`, default still `lg`; action-button `full` is unchanged). Dialog panels clamp `min-width` to the viewport (`min()` against `100vw - 20px`) so a 400px default panel no longer overflows a 360px phone, and the default `lg` radius steps down to `md` under 640px. Both close buttons now meet touch targets without changing visuals: the floating container close grows to a 24px box with a 44px `::after` hit area plus a visible focus ring, and the sticky header close keeps its 20px visual with a 24px minimum and a 44px `::after` hit area. `bottom` sheet remains the documented mobile pattern.
