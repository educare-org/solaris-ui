# ADR-0001: Standalone Components

## Status

Accepted

## Context

Angular 14+ introduced standalone components as an alternative to NgModules. The project started with NgModules but migrated early. Every new component needs to choose between standalone or NgModule-based.

## Decision

All Solaris components, directives, and pipes MUST be standalone (`standalone: true`).

- No NgModule wrappers around components
- No shared modules
- Barrel imports via `index.ts` files for convenience
- Components import their dependencies directly

## Consequences

Positive:
- Tree-shakeable by default — consumers import only what they use
- Simpler file structure — no NgModule boilerplate
- Easier lazy loading and testing

Negative:
- Each component must declare its imports, leading to repetition
- Angular versions < 15 require polyfills or migration

## Compliance

Enforced by code review. The component standard documents this requirement.
