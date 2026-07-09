# Solaris UI — Scripts and Validation

## Philosophy

Scripts are part of the architecture.

They must be explicit, predictable, portable, and clear when they fail.

## Cross-platform requirement

All Solaris scripts must follow `CROSS_PLATFORM_COMMANDS.md`.

Scripts must work on Windows, Linux, and macOS by default.

Shell-specific syntax is forbidden unless isolated behind a documented Node script, Nx executor, or explicit cross-platform wrapper.

Examples of forbidden script patterns:

```txt
rm -rf dist
NODE_ENV=production nx build
cp -r src dist
mkdir -p tools/tmp
```

Preferred alternatives:

```txt
node ./tools/scripts/clean.mjs
cross-env NODE_ENV=production nx build
node ./tools/scripts/doctor.mjs
```

A script that only works on Unix-like shells is not considered valid for Solaris.

## Main rule

```txt
start validates minimum health
verify validates everything
commit validates changed files
CI validates the whole project
```

## Development scripts

Expected group:

```txt
start
dev
showcase
```

## Fast validation scripts

Expected group:

```txt
check
check:workspace
check:format
check:lint
check:types
```

## Full validation scripts

Expected group:

```txt
verify
verify:ci
test
test:unit
test:component
test:a11y
test:e2e
test:visual
```

## Build scripts

Expected group:

```txt
build
build:lib
build:showcase
```

## Security scripts

Expected group:

```txt
security:audit
security:dependencies
security:secrets
security:licenses
```

## Release scripts

Expected group:

```txt
changeset
version
release
release:dry-run
package:check
```

## Maintenance scripts

Expected group:

```txt
format
format:check
lint
lint:fix
clean
doctor
```

## `pnpm start`

`pnpm start` must not simply run the application.

It should validate minimum project health first:

- package manager;
- dependency installation;
- workspace shape;
- light format check;
- affected lint;
- affected typecheck.

Then it may run the showcase.

## `pnpm verify`

`pnpm verify` must run the full quality gate:

- format check;
- lint;
- typecheck;
- tests;
- build;
- accessibility checks;
- package validation;
- public API validation;
- dependency audit.

## `pnpm doctor`

`pnpm doctor` must diagnose the workspace:

- operating system;
- Node version;
- pnpm version;
- lockfile integrity;
- dependency installation;
- Nx health;
- Angular buildability;
- import boundaries;
- package manager correctness;
- required config files.

## Cross-platform diagnostics

`pnpm doctor` must validate whether the current environment can run Solaris scripts safely.

It should check:

- operating system;
- path handling;
- shell assumptions;
- required tools;
- invalid Unix-only commands in package scripts when detectable;
- invalid Windows-only commands in package scripts when detectable;
- missing Node wrappers for non-trivial automation.

## Error message rule

A failing script must explain what failed and what the developer should do next.

A script that fails without useful guidance is considered incomplete.

## Final rule

Scripts must be strict enough for CI and clear enough for local development.
