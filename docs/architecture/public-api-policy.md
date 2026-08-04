# Solaris UI — Public API Policy

## Public API rule

If it is not exported by the official public API, it does not exist for consumers.

## Consumers must not import

Consumers must not import:

- internal component files;
- internal models;
- private tokens;
- private utilities;
- source files outside package exports.

## Public API must include

For public components:

- component/directive;
- public types;
- public config interfaces;
- public testing harness when applicable;
- public providers when needed.

## Public API must not include

- private implementation details;
- internal utility functions;
- internal constants;
- private injection tokens;
- internal state helpers.

## Breaking changes

Breaking changes require:

- version bump according to SemVer;
- changelog;
- migration note;
- clear reason;
- deprecated path when possible.

## Release validation

Every release must validate:

- exports;
- type declarations;
- package contents;
- import paths;
- public API diff;
- accidental exports.

## Rule

Convenient internal imports are architectural debt.
