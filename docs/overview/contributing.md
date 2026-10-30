# Contributing to Solaris UI

## Development philosophy

Solaris is strict by design.

Do not optimize for fast local hacks. Optimize for consistent long-term maintenance.

## Before contributing

Read:

1. `START_HERE.md`
2. `ARCHITECTURE.md`
3. `COMPONENT_STANDARD.md`
4. `TESTING_STRATEGY.md`
5. `DEFINITION_OF_DONE.md`

## Pull requests

Pull requests are required even when working alone.

A PR must include:

- clear scope;
- linked task or decision;
- tests;
- documentation when public behavior changes;
- no unrelated changes.

## Commit style

Solaris uses Conventional Commits.

Examples:

```txt
feature(actions-button): add loading state
fix(forms-input): correct aria-describedby
docs(architecture): document boundary rules
test(navigation-tabs): add keyboard coverage
chore(repo): configure workspace validation
```

## New dependencies

New dependencies require justification.

Do not add dependencies because implementation is inconvenient.

## AI usage

AI can help execute approved plans.

AI must not invent architecture, add dependencies, or create public APIs without approval.
