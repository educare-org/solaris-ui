# Solaris UI — Architecture

## Official architecture

Solaris uses the **Solaris Modular Architecture**.

This architecture combines:

- modular boundaries;
- strict public API;
- domain-based UI organization;
- controlled internal dependencies;
- token-driven styling;
- explicit accessibility rules;
- native i18n;
- security baseline;
- mandatory tests;
- governed releases.

## Why not full hexagonal architecture?

Solaris does not use full hexagonal architecture for every component.

A UI component does not always have a business domain, entity, repository, or use case. Applying full hexagonal architecture to simple components like buttons or badges would create artificial complexity.

## Where ports/adapters are allowed

Ports and adapters are allowed only where there is a real replaceable implementation:

- i18n;
- theme;
- date adapter;
- number/currency adapter;
- overlay;
- icon registry;
- optional logger.

## Where ports/adapters are not allowed

Ports/adapters must not be created for simple visual components without real external dependencies.

Examples:

- button;
- badge;
- card;
- alert;
- skeleton.

## Main library structure

```txt
packages/angular/src/lib/
  core/
  theme/
  i18n/
  a11y/
  primitives/

  actions/
    button/
    icon-button/
    segmented-control/

  forms/
    form-field/
    input/
    select/
    checkbox/
    radio/
    switch/
    textarea/
    phone-input/

  feedback/
    alert/
    toast/
    tooltip/
    skeleton/

  overlay/
    dialog/
    dropdown-menu/

  navigation/
    tabs/
    stepper/

  data-display/
    badge/
    card/
    table/
```

## Internal component structure

A component may use this structure when needed:

```txt
component-name/
  component/
  directives/
  model/
  service/
  token/
  testing/
  docs/
  index.ts
```

Not every component needs every folder.

A structure is required only when it serves the component.

## Forbidden folder

The `shared` folder is forbidden.

If something is reusable, it must have a clear architectural name:

- `core`;
- `theme`;
- `i18n`;
- `a11y`;
- `primitives`;
- `testing`;
- domain folder.

## Dependency rules

Allowed:

```txt
actions -> primitives/core/a11y/theme/i18n
forms -> primitives/core/a11y/theme/i18n
feedback -> primitives/core/a11y/theme/i18n
overlay -> primitives/core/a11y/theme/i18n
navigation -> primitives/core/a11y/theme/i18n
data-display -> primitives/core/a11y/theme/i18n
```

Forbidden:

```txt
core -> visual components
theme -> components
i18n -> components
a11y -> final components
primitives -> final components
components -> showcase
consumer app -> internal library files
```

## Architecture enforcement

Architecture must be enforced through:

- Nx boundaries;
- ESLint rules;
- package exports;
- CI validation;
- public API checks.

Architecture must not depend on developer memory.
