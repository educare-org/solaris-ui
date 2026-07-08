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

Every new dependency requires review:

1. Does it solve a real problem?
2. Is there a native Angular/CDK alternative?
3. Is it maintained?
4. Is the license acceptable?
5. Is it tree-shakable?
6. Does it work with SSR?
7. Does it work with strict mode?
8. Does it increase bundle size significantly?
9. Is it replaceable later?
10. Does it have known vulnerabilities?

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
pnpm add @solaris-ui/angular
pnpm exec nx g @solaris-ui/angular:init
```

or:

```txt
ng add @solaris-ui/angular
```

Wrong:

```txt
postinstall script mutates consumer files silently
```
