# Solaris UI — Branching and Commits

## Branching model

Solaris uses simplified GitHub Flow.

## Main branch

```txt
main
```

The `main` branch must always be releasable.

## Branch naming

Examples:

```txt
feature/actions-button
feature/forms-input
fix/dialog-focus-trap
docs/testing-strategy
chore/repo-setup
```

## Commit standard

Solaris uses Conventional Commits with `feature` as the type for new functionality
(enforced by `commitlint`).

## Commit examples

```txt
feature(actions-button): add loading state
fix(forms-input): correct aria-describedby
docs(architecture): document boundary rules
test(navigation-tabs): add keyboard coverage
chore(repo): configure workspace validation
```

## Pull requests

PRs are required.

Working alone does not lower the quality bar.

## Local hooks

Hooks help, but CI decides.

## CI

CI is the final authority for merge readiness.
