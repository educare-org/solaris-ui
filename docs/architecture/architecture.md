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
  components/
    actions/            button, button-group, icon-button
    forms/              input, textarea, select, multi-select, checkbox,
                        radio, switch (+groups), date/time pickers,
                        email/password/phone fields, form-field, option
    feedback/           alert, skeleton, toast, spinner, progress,
                        loading-text, announcement
    overlay/            dialog
    navigation/         tabs, editable-tabs, segmented-control, stepper,
                        breadcrumb, pagination, mega-menu
    data-display/       badge, card, divider, table (+filter), charts,
                        gradebook, record-grid, code-block, preview-code
    interaction/        dropdown-menu, popover, tooltip, accordion,
                        collapsible, carousel
    icon/
    scheduling/         calendar (month/week/year/schedule views,
                        event-editor, shell)
  services/
    accessibility/ icon/ theme/ translation/ export/
  testing/
```

New categories and components follow the same contract; this list tracks
the folder layout and may lag new additions. The folder is the source of
truth, not this list.

## Internal component structure

A component uses this structure:

```txt
component-name/
  component/      .ts, .html, .scss (wiring only)
  model/          types, defaults, consts (no Angular imports)
  functions/      pure logic, utils (no Angular imports)
  translation/    pt-BR.json, en-US.json, es-419.json + index.ts
  testing/        specs, harnesses
  docs/           component docs
  token/          optional — only when the component owns tokens
  service/        optional — only when the component owns a service
  directives/     optional — only when the component owns directives
  index.ts        barrel export
```

`component/` never exports types or utils. `model/` never imports Angular
values (`import type` and DI token files `*.tokens.ts` / `*.contract.ts`
are exempt). `functions/` never imports Angular or browser globals.
`validate-component.mjs` enforces `functions/` purity as errors and reports
contract drift in existing code as warnings until migration completes.

## Showcase page structure

Showcase pages mirror the same separation:

```txt
pages/<category>/<name>/
  component/      showcase .ts/.html/.scss (wiring only)
  model/          breadcrumbs, TOC, snippets, page data
  functions/      page actions, markdown serialization, formatting
  translation/    pt-BR.json, en-US.json, es-419.json + index.ts
```

Showcase `component/` files must not define data tables, translation maps,
or markdown builders inline — those live in `model/` and `functions/`.

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

Allowed (every component category depends only on shared foundations):

```txt
actions, forms, feedback, overlay, navigation, data-display,
interaction, icon, scheduling -> primitives/core/a11y/theme/i18n
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
