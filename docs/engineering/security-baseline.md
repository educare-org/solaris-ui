# Solaris UI — Security Baseline

## Security principle

Security is a day-zero architectural requirement.

It is not a release checklist item.

## Forbidden by default

The following are forbidden by default:

- `innerHTML`;
- `bypassSecurityTrustHtml`;
- `bypassSecurityTrustUrl`;
- `eval`;
- direct `document`;
- direct `window`;
- direct `localStorage`;
- direct `sessionStorage`;
- arbitrary external SVG;
- arbitrary consumer-provided HTML;
- arbitrary dynamic CSS;
- unvalidated external URLs.

## Exception policy

Dangerous APIs are allowed only with:

- documented justification;
- internal wrapper;
- tests;
- review;
- clear technical comment;
- no safer alternative.

## Browser API policy

Browser APIs must be accessed through SSR-safe abstractions.

Components must not access browser globals directly.

## Dependency security

Every new dependency requires review per `docs/engineering/dependency-policy.md`.
No dependency ships without justification, license check, and audit.

## Supply chain

Before public release, Solaris must use:

- frozen lockfile in CI;
- dependency audit;
- Dependabot or equivalent;
- secrets scanning;
- minimal CI permissions;
- npm trusted publishing;
- npm provenance;
- protected branches.

## Consumer setup security

Package installation must not silently mutate consumer files.

Project mutation is only allowed through explicit generators or schematics.

Correct:

```txt
pnpm add @educarehq/solaris-ui
pnpm exec nx g @educarehq/solaris-ui:init
```

or:

```txt
ng add @educarehq/solaris-ui
```

Wrong:

```txt
postinstall script mutates consumer files silently
```
