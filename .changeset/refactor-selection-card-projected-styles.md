---
'@educarehq/solaris-ui': patch
---

refactor(selection-card): style projected sections without ng-deep

Projected section styles (`media`, `header`, `content`, `footer`, `title`, `description`) move from `::ng-deep` to the global `selection-card` stylesheet, following the form-field precedent. No visual change.
