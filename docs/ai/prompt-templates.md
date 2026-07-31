# Solaris UI — Prompt Templates for AI

These templates ensure every AI task includes the required context from Solaris standards.

## Template: Create a new component

```
Create a Solaris [component-name] component.

## Standards to follow
- AGENTS.md — non-negotiable rules
- docs/standards/component_standard.md — API, states, file structure
- docs/standards/accessibility_standard.md — WCAG 2.2 AA
- docs/standards/styling_and_tokens.md — token-driven styling
- docs/quality-and-validation/testing_strategy.md — what to test
- docs/quality-and-validation/definition_of_done.md — acceptance criteria
- docs/guides/creating-a-component.md — step-by-step guide

## Requirements
- Category: [actions|forms|feedback|overlay|navigation|data-display]
- Type: [component|directive]
- Inputs: [list expected inputs with types and defaults]
- Outputs: [list expected outputs]
- Visual variants: [appearance, size, color, etc.]
- States: [default, hover, active, disabled, loading, error, etc.]
- Accessibility: [expected ARIA roles, keyboard interactions]
- i18n: [translate keys needed]

## Deliverables
1. Component/directive files (.ts, .html, .scss)
2. Model types (.ts)
3. Spec file with minimum 3 tests
4. Documentation (.md)
5. Barrel export (index.ts)
6. Changeset
```

## Template: Add functionality

```
Add [feature description] to [component-name].

## Context
- Target files: [file paths]
- Current behavior: [what it does now]
- Desired behavior: [what it should do after]

## Constraints
- Do not change the public API unless necessary
- Do not break existing tests
- Follow the existing code patterns in the file
- Update tests to cover the new functionality

## Acceptance criteria
- [list specific behaviors or states]
```

## Template: Fix a bug

```
Fix a bug in [component-name].

## Bug description
[description of the bug]

## Steps to reproduce
1. [step 1]
2. [step 2]
3. [step 3]

## Expected behavior
[what should happen]

## Actual behavior
[what currently happens]

## Requirements
- Add a regression test that fails before the fix and passes after
- Do not change unrelated behavior
- Check for the same pattern in similar components
```

## Template: Refactor

```
Refactor [component-name] to meet Solaris standards.

## Current issues
- [list issues: not standalone, uses @Input, no OnPush, etc.]

## Requirements
- Convert to standalone component if not already
- Replace @Input/@Output with input()/output() signals
- Add OnPush change detection
- Extract inline styles to .scss file
- Replace raw CSS values with --solaris-* tokens
- Add data-* attributes for visual variants
- Ensure ARIA attributes are present
- Update tests to match new patterns
- Do not change the public API

## Files to modify
[file paths]
```
