---
'@solaris-ui/angular': minor
---

feat(forms): 0.2.0 Forms Release

- **Form Field**: new component with label, hint, error, prefix/suffix, appearance, size, density, radius, invalid state, and focus ring
- **Input**: directive with external Form Field support, CVA, icon prefix
- **Textarea**: directive with external Form Field support, CVA, auto-resize
- **Password Field**: preset with visibility toggle, strength meter, CVA
- **Email Field**: preset with domain validation, blocked domains, CVA
- **Checkbox**: standalone component, CVA, label
- **Checkbox Group**: group with indeterminate state, select all, CVA
- **Radio**: standalone component, CVA
- **Radio Group**: group with orientation support, CVA
- **Switch**: standalone component, CVA, label
- **Switch Group**: group with select all, CVA
- **Option + Option Group**: reusable option primitives with selection, icon, slots, group label
- **Select**: uses Form Field internally, searchable, keyboard navigation, popover panel, i18n, CVA
- **Multi Select**: uses Form Field internally, display modes (auto/summary/chips/comma), searchable, select all, removable chips, overflow, i18n, CVA
- **Popover**: trigger directive + panel component, placement, align, offset, scroll strategy, keyboard dismissal
- **Tooltip**: directive with hover/click trigger, placement, arrow, delay, closeable, i18n
- **Accessibility**: ARIA attributes on all form controls (aria-expanded, aria-controls, aria-haspopup, aria-activedescendant, aria-multiselectable, aria-label, aria-describedby)
- **Prefix/Suffix**: directives compatible with Form Field, Select, and Multi Select
- **Showcase**: documentation pages for all form components with live examples
