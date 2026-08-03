# Solaris UI — Release Policy

## Versioning

Solaris uses SemVer.

## Initial version strategy

```txt
0.1.0 = foundation release
0.x = API maturation
1.0.0 = stable initial public API
```

## 1.0.0 rule

Version `1.0.0` is allowed only when the public API is mature enough to support consumers without frequent breaking changes.

## Release tooling

Solaris uses Changesets.

## Release requirements

A release requires:

- clean build;
- passing tests;
- passing lint;
- passing typecheck;
- package validation;
- public API validation;
- changelog;
- dependency audit;
- no undocumented breaking changes.

## Public publishing

Before public npm publishing, Solaris must use:

- a granular `NPM_TOKEN` with publish access and 2FA bypass for CI;
- protected branches;
- CI permissions hardening.

Provenance is currently disabled because npm provenance requires a public source repository and `solaris-ui` is private. If the repository becomes public, re-enable `--provenance` in the release workflow.

## Canary/beta

Canary or beta channels may be introduced after real external consumption begins.
