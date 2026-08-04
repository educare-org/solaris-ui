# Solaris UI — Directive Standard

## Purpose

Directives must be used when behavior can be attached to native or projected elements without forcing unnecessary component structure.

## Naming

Directives must use clear, kebab-case selectors when public.

Example:

```txt
[solaris-button]
[solaris-card-title]
[solaris-card-description]
```

## When to use a directive

Use a directive when:

- native semantics should be preserved;
- the host element matters;
- the behavior is lightweight;
- content projection needs semantic slots;
- a component would create unnecessary DOM.

## When not to use a directive

Do not use a directive when:

- the feature needs complex internal structure;
- the feature owns layout;
- the feature controls overlay/focus lifecycle;
- the feature needs multiple coordinated parts;
- a component would be clearer.

## Accessibility

Directives must not remove or corrupt native semantics.

If a directive changes interaction behavior, it must document:

- role;
- keyboard behavior;
- focus behavior;
- disabled behavior;
- ARIA behavior.

## Testing

Public directives require:

- host component test;
- behavior test;
- accessibility test when interactive;
- documentation example.
