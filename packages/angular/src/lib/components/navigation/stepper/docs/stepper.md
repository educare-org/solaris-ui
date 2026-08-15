# Solaris Stepper

## Purpose

The Stepper provides a visual and interactive structure for multi-step flows. It serves as a progress indicator and, optionally, a wizard controller.

## When to use

- Onboarding flows
- Checkout processes
- Registration forms
- Setup wizards
- Approval workflows
- Review processes
- Any multi-step linear or non-linear flow

## When not to use

- Single-page forms (use tabs or sections instead)
- Content that does not benefit from step-by-step progression
- Navigation between unrelated pages (use router or tabs)
- When the consumer needs built-in business logic, validation, or data persistence

## Difference between Stepper and Onboarding

The Stepper provides the structural UI for step progression. Onboarding is a business flow that may use a Stepper internally. The Stepper does not implement:

- Tour logic
- User segmentation logic
- Completion criteria
- Analytics tracking
- Feature gating

Onboarding shells should compose the Stepper, not extend it.

## Difference between Stepper and Tabs

| Aspect      | Stepper                                     | Tabs                         |
| ----------- | ------------------------------------------- | ---------------------------- |
| Progression | Sequential, ordered                         | Any order, parallel sections |
| Status      | Pending, active, completed, error, disabled | Selected, unselected         |
| Finality    | Steps lead to completion                    | Steps are content sections   |
| Connectors  | Visual connector between steps              | No connectors                |
| Actions     | Actions slot for navigation                 | No actions slot              |

## API

### SolarisStepperComponent

Selector: `solaris-stepper`

#### Inputs

| Input               | Type                                     | Default        | Description                         |
| ------------------- | ---------------------------------------- | -------------- | ----------------------------------- |
| `activeIndex`       | `number`                                 | `0`            | Index of the active step            |
| `orientation`       | `'horizontal' \| 'vertical'`             | `'horizontal'` | Layout direction                    |
| `appearance`        | `'default' \| 'card' \| 'dashed'`        | `'default'`    | Visual style                        |
| `linear`            | `boolean`                                | `false`        | Blocks future steps when true       |
| `size`              | `'sm' \| 'md' \| 'lg'`                   | `'md'`         | Size variant                        |
| `density`           | `'compact' \| 'normal' \| 'comfortable'` | `'normal'`     | Spacing density                     |
| `showConnectors`    | `boolean`                                | `true`         | Shows connector lines between steps |
| `showStepStatus`    | `boolean`                                | `true`         | Shows status badges                 |
| `showStepNumbers`   | `boolean`                                | `true`         | Shows step numbers                  |
| `contentTransition` | `'none' \| 'fade' \| 'slide'`            | `'fade'`       | Content transition animation        |
| `ariaLabel`         | `string \| undefined`                    | `undefined`    | Direct ARIA label                   |
| `ariaLabelKey`      | `string \| undefined`                    | `undefined`    | Translation key for ARIA label      |

#### Outputs

| Output              | Type                        | Description                           |
| ------------------- | --------------------------- | ------------------------------------- |
| `activeIndexChange` | `number`                    | Emits when active index changes       |
| `stepChange`        | `SolarisStepperChangeEvent` | Emits step change with previous index |
| `stepClick`         | `SolarisStepClickEvent`     | Emits when a step is clicked          |

### SolarisStepComponent

Selector: `solaris-step`

#### Inputs

| Input            | Type                   | Default     | Description                       |
| ---------------- | ---------------------- | ----------- | --------------------------------- |
| `label`          | `string \| undefined`  | `undefined` | Step label                        |
| `labelKey`       | `string \| undefined`  | `undefined` | Translation key for label         |
| `description`    | `string \| undefined`  | `undefined` | Step description                  |
| `descriptionKey` | `string \| undefined`  | `undefined` | Translation key for description   |
| `status`         | `SolarisStepperStatus` | `'pending'` | Visual status                     |
| `optional`       | `boolean`              | `false`     | Marks step as optional            |
| `editable`       | `boolean`              | `false`     | Allows re-entering completed step |
| `disabled`       | `boolean`              | `false`     | Disables the step                 |
| `completed`      | `boolean`              | `false`     | Marks step as completed           |
| `error`          | `boolean`              | `false`     | Marks step with error             |
| `icon`           | `string \| undefined`  | `undefined` | Custom icon name                  |

### SolarisStepperContentComponent

Selector: `solaris-stepper-content`

Simple content wrapper for step body content.

### SolarisStepperActionsComponent

Selector: `solaris-stepper-actions`

#### Inputs

| Input   | Type                                              | Default | Description       |
| ------- | ------------------------------------------------- | ------- | ----------------- |
| `align` | `'start' \| 'center' \| 'end' \| 'space-between'` | `'end'` | Actions alignment |

Actions is an open slot. Consumers provide their own buttons using `[solaris-button]`.

## Orientation

### Horizontal

Steps are displayed in a row with connectors between them. Suitable for wide layouts and desktop workflows.

### Vertical

Steps are displayed in a column with vertical connectors. Suitable for side panels or mobile-friendly layouts.

## Appearance

### Default

Standard stepper with filled circular indicators and solid connector lines.

### Card

Steps are displayed on card-like surfaces with borders and shadows. Active step is highlighted with primary color.

### Dashed

Compact minimalist appearance with dashed connector lines and smaller indicators. Suitable for headers and compact spaces.

## Linear vs Non-linear

### Linear (`linear=true`)

- Future steps are not clickable
- Completed steps can be clicked to go back
- Consumer controls which steps are marked completed

### Non-linear (`linear=false`)

- All enabled steps are clickable
- Users can navigate freely
- Disabled steps remain blocked

## Status

| Status      | Visual            | Description          |
| ----------- | ----------------- | -------------------- |
| `pending`   | Neutral indicator | Step not yet reached |
| `active`    | Primary highlight | Current step         |
| `completed` | Success/check     | Step completed       |
| `error`     | Danger icon       | Step has error       |
| `disabled`  | Reduced opacity   | Step unavailable     |

Status precedence: disabled > error > active > completed > pending.

## CSS Variables

The following CSS variables can be customized:

| Token                                      | Purpose                           |
| ------------------------------------------ | --------------------------------- |
| `--solaris-stepper-gap`                    | Gap between steps and connectors  |
| `--solaris-stepper-card-shadow`            | Card appearance shadow            |
| `--solaris-stepper-indicator-size`         | Indicator circle size             |
| `--solaris-stepper-label-color`            | Step label color                  |
| `--solaris-stepper-indicator-color`        | Indicator text/icon color         |
| `--solaris-stepper-description-color`      | Step description color            |
| `--solaris-stepper-card-background`        | Card appearance background        |
| `--solaris-stepper-connector-color`        | Connector line color              |
| `--solaris-stepper-connector-size`         | Connector line thickness          |
| `--solaris-stepper-card-border-color`      | Card appearance border color      |
| `--solaris-stepper-indicator-background`   | Indicator background              |
| `--solaris-stepper-connector-active-color` | Active connector line color       |
| `--solaris-stepper-dashed-connector-color` | Dashed appearance connector color |

## Content / Wizard

The Stepper supports two modes:

1. **Indicator only**: Steps are rendered as visual indicators without content projection.
2. **Wizard**: Each step can contain `<solaris-stepper-content>` with body content. Only the active step's content is visible.

## Actions

Actions are projected at the Stepper level using `<solaris-stepper-actions>`. This slot accepts any content but is designed for `<button solaris-button>` elements.

## Accessibility

- The stepper container has `role="navigation"` with an `aria-label`
- Each clickable step renders a `<button>` element
- Active step has `aria-current="step"`
- Disabled steps have `aria-disabled="true"`
- Custom icons are marked as `decorative`
- Keyboard: Enter/Space activates clickable steps
- Reduced motion is respected for content transitions

## i18n

Labels and descriptions support translation keys via `labelKey`/`descriptionKey`. ARIA labels also support `ariaLabelKey`.

## Examples

### Basic stepper

```html
<solaris-stepper [(activeIndex)]="activeStep">
  <solaris-step label="Account" description="Create your account" />
  <solaris-step label="Profile" description="Complete your profile" />
  <solaris-step label="Confirm" description="Review and confirm" />
</solaris-stepper>
```

### Wizard with content and actions

```html
<solaris-stepper [(activeIndex)]="activeStep" linear>
  <solaris-step label="Details" icon="user">
    <solaris-stepper-content>
      <p>Step 1 content</p>
    </solaris-stepper-content>
  </solaris-step>
  <solaris-step label="Payment" icon="credit-card">
    <solaris-stepper-content>
      <p>Step 2 content</p>
    </solaris-stepper-content>
  </solaris-step>

  <solaris-stepper-actions>
    <button solaris-button (click)="previous()">Back</button>
    <button solaris-button color="primary" (click)="next()">Next</button>
  </solaris-stepper-actions>
</solaris-stepper>
```

### Statuses

```html
<solaris-stepper [(activeIndex)]="activeStep">
  <solaris-step label="Cart" status="completed" />
  <solaris-step label="Shipping" status="active" />
  <solaris-step label="Payment" status="pending" />
  <solaris-step label="Review" status="error" />
</solaris-stepper>
```

### Appearances

```html
<solaris-stepper appearance="card" [(activeIndex)]="activeStep">
  <solaris-step label="Setup" />
  <solaris-step label="Integrate" />
  <solaris-step label="Launch" />
</solaris-stepper>

<solaris-stepper appearance="dashed" [(activeIndex)]="activeStep">
  <solaris-step label="One" />
  <solaris-step label="Two" />
  <solaris-step label="Three" />
</solaris-stepper>
```

### Vertical orientation

```html
<solaris-stepper orientation="vertical" [(activeIndex)]="activeStep">
  <solaris-step label="Plan" />
  <solaris-step label="Design" />
  <solaris-step label="Ship" />
</solaris-stepper>
```

## Limitations (v1)

- No nested steppers
- No complex sub-steps
- No built-in form validation
- No data persistence
- No router integration
- No business logic
- No analytics
- No onboarding shell
- No warning status (use error if needed)
