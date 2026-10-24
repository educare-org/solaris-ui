# Solaris UI - Publish Guide

## Purpose

This document describes how to release `@educarehq/solaris-ui` to npm.

Solaris uses Changesets for versioning and changelog generation. The Angular package is built with ng-packagr, so npm publication must use the generated artifact at `dist/packages/angular`.

## Prerequisites

Before publishing, ensure:

- You are releasing from `main` or from a release branch that will be merged into `main`.
- `develop` has been reconciled with `main` before the release branch is created.
- The working directory is clean.
- `pnpm verify` passes locally before the release branch is merged.
- `packages/angular/package.json` contains the version that should be published.
- The npm package version is not already published.
- GitHub Actions has an `NPM_TOKEN` secret with publish access to `@educarehq/solaris-ui`.
- The `NPM_TOKEN` granular access token has "Bypass two-factor authentication" enabled so CI can publish without an interactive OTP.

> **Note on provenance:** npm provenance (`--provenance`) is only supported for public source repositories. While `solaris-ui` is private, the release workflow publishes without provenance.

## Release Versioning

Run Changesets versioning on the release branch:

```bash
pnpm changeset status --since=main
pnpm changeset version
```

Review the generated diff carefully. It should update:

- `packages/angular/package.json`
- `packages/angular/CHANGELOG.md`
- consumed files under `.changeset/`

For the `0.4.0` release, the expected package bump is:

```txt
@educarehq/solaris-ui: 0.3.3 -> 0.4.0
```

Commit the release version bump:

```bash
git add .
git commit -m "chore(release): bump @educarehq/solaris-ui to 0.4.0"
```

## Local Validation

Run the full local validation before merging the release branch:

```bash
pnpm verify
pnpm build:lib
pnpm package:check
```

`pnpm verify` runs the project validation pipeline. `pnpm build:lib` builds the publishable Angular package and schematics into `dist/packages/angular`. `pnpm package:check` validates that generated artifact.

## CI Publication

The release workflow is defined in `.github/workflows/release.yml` and runs when the `CI` workflow completes successfully on `main`, so the exact verified commit is published without running verification twice.

The workflow:

- Reads the local package name and version from `packages/angular/package.json`.
- Reads the currently published npm version.
- Skips publication if the local version is already published.
- Installs dependencies.
- Runs `pnpm verify`.
- Runs `pnpm build:lib` to rebuild the release artifact, including schematics.
- Runs `pnpm package:check`.
- Publishes `dist/packages/angular` with `npm publish --access public`.
- Creates and pushes the git tag `<package-name>@<version>`.

The workflow publishes the ng-packagr output, not the source package directory. Do not replace it with `pnpm changeset publish` unless the package layout changes.

## Manual Publication Fallback

If CI publication is unavailable, use the same artifact manually:

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm build:lib
pnpm package:check
npm publish dist/packages/angular --access public
```

If npm requires two-factor authentication for manual publication, pass the OTP explicitly:

```bash
npm publish dist/packages/angular --access public --provenance --otp <code>
```

## Post-Publish Verification

After publication, verify npm and git state:

```bash
npm view @educarehq/solaris-ui version
npm view @educarehq/solaris-ui versions --json
git tag --list "@educarehq/solaris-ui@*"
```

The npm version should match `packages/angular/package.json`.

## Rollback Policy

Do not unpublish a version that may have been installed by consumers.

If a bad release is published:

- Publish a patch release with the fix.
- Deprecate the bad version with a clear migration message.

```bash
npm deprecate @educarehq/solaris-ui@<bad-version> "Use @educarehq/solaris-ui@<fixed-version> instead."
```

## Related Documents

- `docs/workflow-and-release/release-policy.md`
- `docs/workflow-and-release/branching-and-commits.md`
- `docs/engineering/dependency-policy.md`
- `docs/engineering/security-baseline.md`
- `docs/quality-and-validation/cross-platform-commands.md`
