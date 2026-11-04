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
- use OS-specific path syntax without justification;
- add explanatory code comments (only `// Exception:` comments are allowed);
- commit, push, or publish without explicit human validation for each action.

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

AI-generated commands must follow
`docs/quality-and-validation/cross-platform-commands.md`. Assume Windows,
Linux, and macOS. Prefer `pnpm`, Nx commands, Node scripts, and portable
paths. If an OS-specific command is unavoidable, explain why, isolate it
behind a documented wrapper, and never place it directly in a
general-purpose package script.

## Generated code rule

If generated code is poorly formatted, weakly typed, untested, or inconsistent with standards, it must be rejected.

If generated commands are not portable, they must be rejected.

## Core principle

AI executes inside the standard.

AI does not create the standard during execution.
