# Solaris UI — Cross-Platform Commands

## Purpose

Solaris is developed on Windows, Linux, and macOS. Every script, command,
generator, schematic, validation flow, and documentation example must run
on all three.

## Core rule

```txt
If a command does not run on Windows, Linux, and macOS, it is not a valid Solaris command.
```

Exceptions are allowed only when technically justified, isolated behind a
documented wrapper, never placed directly in a general-purpose package
script, and accompanied by a cross-platform alternative when possible.

## Scope

This policy covers `package.json` scripts, Nx targets, validation scripts,
CI commands, Git hooks, generators, schematics, documentation examples,
AI-generated commands, setup instructions, and maintenance scripts.

## Forbidden by default

Unix-only syntax in general-purpose scripts:

```txt
rm -rf dist
cp -r src dist
mkdir -p tools/tmp
NODE_ENV=production nx build
cat file.txt
grep "pattern" file.txt
```

Windows-only syntax in general-purpose scripts:

```txt
rmdir /s /q dist
copy src dist
set NODE_ENV=production && nx build
type file.txt
```

Hardcoded path assumptions:

```txt
tools/scripts/clean.sh
src\styles\solaris.scss
```

## Preferred

```txt
node ./tools/scripts/clean.mjs
node ./tools/scripts/doctor.mjs
node ./tools/scripts/verify.mjs
cross-env NODE_ENV=production nx build showcase
```

Prefer Node scripts (`.mjs` under `tools/scripts/`), Nx executors, and
portable path handling (`node:path`, never string-concatenated
separators). Inline Unix-style env vars are forbidden; use `cross-env` or
a Node wrapper. Shell-specific hooks are allowed only as internal wrappers
with a documented portable alternative.

## Roles

```txt
start validates minimum health, then serves the showcase
verify runs the full quality gate (format, lint, typecheck, tests, build, a11y, package, API, audit)
commit validates changed files
CI validates the whole project
```

`pnpm doctor` diagnoses portability and workspace health (OS, Node, pnpm,
lockfile, Nx, boundaries, required configs). A failing script must explain
what failed and what to do next.

## AI command generation

AI must assume Windows, Linux, and macOS. Prefer `pnpm`, Nx commands,
Node scripts, and portable paths. Never assume Bash, zsh, PowerShell, or
CMD. If an OS-specific command is unavoidable, explain why, isolate it
behind a documented wrapper, and provide a portable alternative when
possible.

## Final rule

```txt
Works on my machine is not a Solaris standard.
Works on Windows, Linux, and macOS is the standard.
```
