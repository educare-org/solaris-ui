---
'@educarehq/solaris-ui': patch
---

fix(forms): allow custom translation resolver and fix prefix/suffix projection

- `SolarisTranslateConfig` now accepts an optional `resolver` function. When a
  `*Key` input (e.g. `labelKey`, `placeholderKey`, `errorKey`) resolves a key
  that is not registered in the Solaris translations, the service delegates to
  the resolver so the host app's own i18n system can translate it. Previously
  unknown keys were returned verbatim, so keys like
  `app.login.email.placeholder` showed up as raw text even when the app used
  its own `translate` pipe.

- `solaris-email-field` and `solaris-password-field` now forward projected
  `[solaris-form-prefix]` and `[solaris-form-suffix]` content to the inner
  `solaris-form-field`, so affixes declared inside these composite fields
  render correctly.

- The password visibility toggle icon now sizes itself with the density
  typography token (`--solaris-density-font-size`) instead of a fixed
  `--solaris-font-size-xl`, keeping it proportional across density modes.
