# Solaris UI — Cross-Platform Commands

## Purpose

Solaris must be developed safely on Windows, Linux, and macOS.

All scripts, commands, generators, schematics, validation tools, and documentation examples must be cross-platform by default.

## Core rule

```txt
If a command does not run on Windows, Linux, and macOS, it is not a valid Solaris command.
```

Exceptions are allowed only when they are:

- technically justified;
- isolated behind a documented wrapper;
- not placed directly in general-purpose package scripts;
- accompanied by a cross-platform alternative when possible.

## Scope

This policy applies to:

- `package.json` scripts;
- Nx targets;
- local validation scripts;
- CI commands;
- Git hooks;
- generators;
- schematics;
- documentation examples;
- AI-generated commands;
- setup instructions;
- maintenance scripts.

## Forbidden by default

Do not use Unix-only command syntax in general-purpose scripts:

```txt
rm -rf dist
cp -r src dist
mkdir -p tools/tmp
NODE_ENV=production nx build
VAR=value pnpm start
cat file.txt
grep "pattern" file.txt
find ./src -name "*.ts"
```

Do not use Windows-only command syntax in general-purpose scripts:

```txt
rmdir /s /q dist
copy src dist
set NODE_ENV=production && nx build
type file.txt
dir /s
```

Do not hardcode path assumptions:

```txt
tools/scripts/clean.sh
src\styles\solaris.scss
packages/angular/src/lib\core
```

## Preferred approaches

Prefer:

```txt
Node scripts
Nx executors
pnpm scripts with portable commands
cross-platform utilities
documented wrappers
portable path handling
```

Examples:

```txt
node ./tools/scripts/clean.mjs
node ./tools/scripts/doctor.mjs
node ./tools/scripts/verify.mjs
cross-env NODE_ENV=production nx build showcase
```

## Node script rule

For non-trivial automation, prefer Node scripts over shell scripts.

Recommended location:

```txt
tools/scripts/
```

Recommended extension:

```txt
.mjs
```

Node scripts must use portable APIs:

```txt
node:path
node:fs/promises
node:process
```

They must avoid shell-specific assumptions.

## Environment variables

Inline Unix-style environment variables are forbidden in portable scripts.

Forbidden:

```txt
NODE_ENV=production nx build
```

Allowed:

```txt
cross-env NODE_ENV=production nx build
```

Preferred when logic grows:

```txt
node ./tools/scripts/build-production.mjs
```

## File system operations

Use Node scripts or cross-platform utilities for:

- removing directories;
- copying files;
- creating directories;
- scanning files;
- reading files;
- replacing text;
- validating paths.

Preferred:

```txt
node ./tools/scripts/clean.mjs
```

Acceptable when justified:

```txt
rimraf dist
shx cp -r src dist
```

## Path handling

Scripts must use portable path handling.

Preferred in Node:

```txt
import path from 'node:path';

const filePath = path.join(workspaceRoot, 'src', 'styles', 'solaris.scss');
```

Forbidden:

```txt
const filePath = workspaceRoot + '/src/styles/solaris.scss';
const filePath = workspaceRoot + '\\src\\styles\\solaris.scss';
```

## Git hooks

Git hooks must be cross-platform.

Hooks must call portable package scripts or Node scripts.

Preferred:

```txt
pnpm check:staged
pnpm commitlint
node ./tools/scripts/pre-push.mjs
```

Forbidden:

```txt
bash ./tools/hooks/pre-commit.sh
powershell ./tools/hooks/pre-commit.ps1
```

Shell-specific hooks are allowed only as internal wrappers with documented alternatives.

## CI

CI commands must follow the same rules as local commands.

A command that only works in Linux CI but fails on Windows development environments is not acceptable for general Solaris documentation or package scripts.

## Documentation examples

Documentation must prefer portable commands.

Examples should use:

```txt
pnpm
nx
node
cross-platform scripts
```

Avoid examples that assume Bash, zsh, PowerShell, or CMD unless the section is explicitly OS-specific.

## AI command generation

AI-generated commands must follow this document.

AI must not assume Unix-like shells by default.

If an OS-specific command is unavoidable, AI must explain why and provide a portable alternative when possible.

## `pnpm doctor` responsibility

`pnpm doctor` must help detect portability issues when feasible.

It should validate:

- operating system;
- Node version;
- pnpm version;
- package manager correctness;
- path handling assumptions;
- required tools;
- shell-specific commands in package scripts when detectable;
- missing cross-platform wrappers.

## Error message rule

Cross-platform validation failures must explain:

1. what command or file is not portable;
2. why it is not portable;
3. what portable alternative should be used.

## Final rule

```txt
Works on my machine is not a Solaris standard.
Works on Windows, Linux, and macOS is the standard.
```
