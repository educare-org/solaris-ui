---
'@solaris-ui/angular': patch
---

Phase 5 security audit: harden `solarisSafeHtml` with an SVG allowlist (`isTrustedFlagSvg` rejects non-SVG, event handlers, scripts and `javascript:` URLs before `bypassSecurityTrustHtml`), add `solaris-safe-html.pipe.spec.ts` regression tests, cover export download hardening (`rel=noopener`, `revokeObjectURL`, filename sanitize) with new `export.service.spec.ts` tests, and rewrite generic `SECURITY_EXCEPTION_FILE` blankets into per-API justifications (mega-menu, toast service, dropdown-submenu, popover-trigger encoding fix).
