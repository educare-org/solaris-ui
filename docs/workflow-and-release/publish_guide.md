# Solaris UI — Publish Guide

## Purpose

This document describes the step-by-step process to publish `@educarehq/solaris-ui` to npm.

It covers the Changesets workflow, pre-publication validation, npm registry setup, and post-publish verification.

---

## Prerequisites

Before publishing, ensure:

1. You have npm publishing rights for the `@solaris-ui` organization.
2. You are logged in to npm (`npm whoami` returns your publishing account).
3. Your npm account has 2FA enabled.
4. The package `@educarehq/solaris-ui` is not already published at the target version.
5. You are on the `main` branch and it is up to date.
6. The working directory is clean (`git status` shows no uncommitted changes).

---

## Step 1 — Run the full validation

```bash
pnpm verify
```

This runs format check, lint, typecheck, tests, build, accessibility checks, package validation, public API validation, and dependency audit.

A publish must not proceed if `pnpm verify` fails.

---

## Step 2 — Create a Changeset

```bash
pnpm changeset
```

Answer the prompts:

- Select `@educarehq/solaris-ui`.
- Choose the bump type (`patch`, `minor`, or `major`) according to SemVer.
- Write a clear changelog entry describing what changed.

Changeset files are created in `.changeset/` as markdown files.

---

## Step 3 — Review the Changeset

Read the generated file:

```bash
cat .changeset/*.md
```

Ensure the bump type is correct and the changelog entry is accurate.

Commit the changeset:

```bash
git add .
git commit -m "chore(release): add changeset for <description>"
```

---

## Step 4 — Version the package

```bash
pnpm changeset version
```

This:

- Updates the package version in `package.json`.
- Updates the changelog.
- Removes the changeset files.

Review the diff:

```bash
git diff
```

Make sure the version is correct and the changelog is well formatted.

---

## Step 5 — Commit the version bump

```bash
git add .
git commit -m "chore(release): bump @educarehq/solaris-ui to <version>"
```

---

## Step 6 — Build the package

```bash
pnpm build
```

This produces the distributable at `dist/packages/angular/`.

---

## Step 7 — Validate the package contents

```bash
pnpm package:check
```

This validates:

- Correct files are included.
- No internal files are accidentally exposed.
- Package metadata is correct.
- Entry points resolve correctly.

---

## Step 8 — Publish to npm

```bash
pnpm publish dist/packages/angular --access public
```

Or, if using the Changesets publish command:

```bash
pnpm changeset publish
```

The publish command:

- Publishes the package to npm.
- Creates a Git tag for the version.
- Pushes the tag to the remote.

When publishing directly, ensure you use `--access public` since scoped packages default to private.

---

## Step 9 — Verify the published package

```bash
npm view @educarehq/solaris-ui versions --json
```

Or check the latest:

```bash
npm view @educarehq/solaris-ui version
```

Install the published version in a temporary project and verify it works:

```bash
mkdir temp-verify
cd temp-verify
npm init -y
npm install @educarehq/solaris-ui
```

---

## Step 10 — Push the release commit and tag

If `pnpm changeset publish` did not push automatically:

```bash
git push origin main --follow-tags
```

---

## CI/CD Publishing

For automated publishing through CI:

1. Configure npm trusted publishing (OpenID Connect) in the npm registry.
2. Set up provenance (attestations) in the npm registry.
3. Configure a GitHub Actions workflow that triggers on push to `main`.
4. The workflow must run `pnpm verify` before publishing.
5. The workflow must use `pnpm changeset publish` with the npm token configured as a secret.

Example CI workflow outline:

```yaml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm verify
      - run: pnpm changeset publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Security Requirements

- npm account must have 2FA enabled.
- CI must use trusted publishing when available.
- CI must use minimal permissions.
- Never commit `.npmrc` files with authentication tokens.
- Never expose `NPM_TOKEN` in logs.
- Use the `--otp` flag when 2FA code is required for manual publishing.
- Before public release, ensure supply chain security measures are in place (see `SECURITY_BASELINE.md`).

---

## Rollback

npm does not allow unpublishing packages that other packages depend on.

If a bad release happens:

1. Do not unpublish a version that consumers may depend on.
2. Publish a patch fixing the issue.
3. Deprecate the bad version with a clear message:
   ```bash
   npm deprecate @educarehq/solaris-ui@<bad-version> "Description of the issue and which version to use instead"
   ```

---

## Related documents

- `docs/workflow-and-release/release_policy.md`
- `docs/workflow-and-release/branching_and_commits.md`
- `docs/engineering/dependency_policy.md`
- `docs/engineering/security_baseline.md`
- `docs/quality-and-validation/scripts_and_validation.md`
