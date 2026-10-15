# Solaris UI — Engineering Principles

## Core principles

1. Clarity over cleverness.
2. Predictability over excessive flexibility.
3. Tokens over loose CSS.
4. Accessibility over visual shortcuts.
5. Tests over speed.
6. Public API over convenience.
7. Security over ease.
8. Simple architecture over impressive diagrams.
9. Explicit contracts over implicit behavior.
10. Governed evolution over uncontrolled growth.
11. Cross-platform execution over local convenience.

## Code quality rules

The following are not allowed without technical justification:

- `any`;
- unsafe non-null assertions;
- raw values in component styles;
- hardcoded internal user-facing text;
- direct DOM access;
- direct browser globals;
- undocumented public APIs;
- component states without tests;
- visual-only disabled states;
- inaccessible interactive behavior;
- hidden side effects;
- OS-specific commands in general-purpose scripts;
- shell-specific assumptions in documentation or tooling.

## Cross-platform engineering

Solaris must support Windows, Linux, and macOS development environments.

All commands, scripts, generators, schematics, and validation flows must follow `CROSS_PLATFORM_COMMANDS.md`.

Maintainers must not introduce shell-specific assumptions into:

- `package.json`;
- Nx targets;
- generators;
- schematics;
- Git hooks;
- CI commands;
- documentation examples;
- AI-generated task instructions.

Forbidden by default:

```txt
rm -rf
cp -r
mkdir -p
NODE_ENV=value command
Bash-only scripts
PowerShell-only scripts
CMD-only scripts
shell-specific path separators
```

Preferred:

```txt
Node scripts
Nx executors
cross-platform utilities
portable package scripts
documented wrappers
```

Developer convenience must not reduce portability.

## API design rules

Component APIs must be:

- explicit;
- small;
- predictable;
- typed;
- documented;
- testable;
- stable enough for consumers.

Avoid ambiguous names like:

```txt
type
mode
data
config
changed
selected (bare — always use the `selected` + `selectedChange` pair)
```

Prefer precise names:

```txt
appearance
variant
density
selectionMode
valueChange
selectedChange
```

## Flexibility policy

Solaris is rigid internally and controlled externally.

Consumers customize by contract:

- providers;
- documented tokens;
- supported options;
- public APIs.

Consumers must not customize through:

- internal classes;
- internal DOM structure;
- private CSS variables;
- deep selectors;
- package internals.

## AI-generated code rule

If the simplest model cannot identify and follow the pattern, the pattern is still weak.

Generated code must never define architecture.

Generated commands must never assume a specific operating system unless the task is explicitly OS-specific.
