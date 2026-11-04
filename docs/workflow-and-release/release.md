# Solaris UI — Release

Solaris uses SemVer and Changesets. Policy first, runbook below.

## Versioning

```txt
0.1.0 = foundation release
0.x = API maturation
1.0.0 = stable initial public API
```

Version `1.0.0` is allowed only when the public API is mature enough to
support consumers without frequent breaking changes.

## Breaking changes

Breaking changes require a version bump according to SemVer, a changelog
entry, a migration note, a clear reason, and a deprecated path when
possible. Do not unpublish a version consumers may have installed — ship a
patch and deprecate the bad version instead:

```bash
npm deprecate @educarehq/solaris-ui@<bad-version> "Use @educarehq/solaris-ui@<fixed-version> instead."
```

## Release requirements

A release requires a clean build, passing tests (including the SSR +
hydration matrix), passing lint and typecheck, package and public API
validation, a changelog, a dependency audit, and no undocumented breaking
changes.

## Publishing

npm provenance requires a public source repository. While `solaris-ui` is
private, the release workflow publishes without `--provenance`. Before
public npm publishing, Solaris must use a granular `NPM_TOKEN` with publish
access (2FA bypass for CI), protected branches, and hardened CI
permissions. Canary/beta channels may be introduced after real external
consumption begins.

The release workflow (`.github/workflows/release.yml`) runs when CI passes
on `main`: it reads the local version from
`packages/angular/package.json`, skips if already published, then runs
`pnpm verify`, `pnpm build:lib`, `pnpm package:check`, and publishes
`dist/packages/angular` (the ng-packagr artifact, never the source
directory) with `npm publish --access public`, creating the git tag
`<package-name>@<version>`.

## Runbook

Release from `main` or a release branch merged into `main`, with a clean
working directory. `develop` must be reconciled with `main` first.

```bash
pnpm changeset status --since=main
pnpm changeset version
```

Review the diff (`packages/angular/package.json`,
`packages/angular/CHANGELOG.md`, consumed `.changeset/` files), then:

```bash
git add .
git commit -m "chore(release): bump @educarehq/solaris-ui to <version>"
pnpm verify
pnpm build:lib
pnpm package:check
```

Manual fallback (CI unavailable):

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm build:lib
pnpm package:check
npm publish dist/packages/angular --access public
```

Verify afterwards:

```bash
npm view @educarehq/solaris-ui version
git tag --list "@educarehq/solaris-ui@*"
```

After a hydration fix, the consuming app validates by removing the
temporary `ngSkipHydration` workaround, rebuilding with SSR +
`provideClientHydration(withEventRelay())`, typing into the field
(including immediately on load), and confirming no NG0500/NG0502, value
propagation, and a green consumer E2E suite.
