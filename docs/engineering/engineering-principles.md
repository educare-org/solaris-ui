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
- explanatory code comments (only `// Exception:` comments are allowed);
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

Solaris supports Windows, Linux, and macOS. All commands, scripts, and
examples must run on all three. The full policy lives in
`docs/quality-and-validation/cross-platform-commands.md` — follow it.
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
