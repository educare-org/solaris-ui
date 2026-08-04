# Solaris UI — AI Development Rules

## Purpose

AI can accelerate development, but it must not define architecture during implementation.

## AI is allowed to

- implement approved tasks;
- generate tests following standards;
- draft documentation;
- refactor within approved boundaries;
- suggest improvements for review.

## AI is not allowed to

- change architecture without approval;
- create components without tests;
- add dependencies without justification;
- expose public APIs without documentation;
- invent folder structures;
- bypass accessibility rules;
- bypass security rules;
- ignore Definition of Done;
- generate Unix-only commands unless explicitly requested and documented;
- generate Windows-only commands unless explicitly requested and documented;
- assume Bash, zsh, PowerShell, or CMD as the default shell;
- use OS-specific path syntax without justification.

## Required prompt context

Every AI implementation prompt must include:

- task scope;
- target files;
- architectural rules;
- public API expectations;
- accessibility requirements;
- tests required;
- cross-platform command requirements;
- forbidden changes;
- acceptance checklist.

## Cross-platform command generation

AI-generated commands must follow `CROSS_PLATFORM_COMMANDS.md`.

When creating or editing scripts, AI must assume the project is developed on Windows, Linux, and macOS.

AI must prefer:

```txt
pnpm
Nx commands
Node scripts
cross-platform utilities
portable paths
```

AI must avoid:

```txt
rm -rf
cp -r
mkdir -p
NODE_ENV=value command
Bash-only syntax
PowerShell-only syntax
CMD-only syntax
hardcoded path separators
```

If an OS-specific command is unavoidable, AI must:

1. explain why;
2. isolate it behind a documented wrapper;
3. provide a cross-platform alternative when possible;
4. never place it directly in a general-purpose package script.

## Generated code rule

If generated code is poorly formatted, weakly typed, untested, or inconsistent with standards, it must be rejected.

If generated commands are not portable, they must be rejected.

## Core principle

AI executes inside the standard.

AI does not create the standard during execution.
