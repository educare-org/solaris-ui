---
'@educarehq/solaris-ui': patch
---

Move the `SECURITY_EXCEPTION` justifications in `solaris-multi-select` (`setupResizeObserver`) directly above each `nativeElement` read so the security check passes. No behavior change: trigger width measurement stays read-only via `offsetWidth` with an SSR-guarded `ResizeObserver`.
