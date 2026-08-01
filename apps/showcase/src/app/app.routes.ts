import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'configuration',
    loadComponent: () =>
      import('./pages/configuration/component/configuration').then(
        (m) => m.ConfigurationPage,
      ),
  },
  {
    path: 'badge',
    loadComponent: () =>
      import('./pages/data-display/badge/component/badge-showcase').then(
        (m) => m.BadgeShowcasePage,
      ),
  },
  {
    path: 'skeleton',
    loadComponent: () =>
      import('./pages/feedback/skeleton/component/skeleton-showcase').then(
        (m) => m.SkeletonShowcasePage,
      ),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./pages/data-display/card/component/card-showcase').then(
        (m) => m.CardShowcasePage,
      ),
  },
  {
    path: 'alert',
    loadComponent: () =>
      import('./pages/feedback/alert/component/alert-showcase').then(
        (m) => m.AlertShowcasePage,
      ),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/actions/button/component/button-showcase').then(
        (m) => m.ButtonShowcasePage,
      ),
  },
  {
    path: 'icon-button',
    loadComponent: () =>
      import('./pages/actions/icon-button/component/icon-button-showcase').then(
        (m) => m.IconButtonShowcasePage,
      ),
  },
  {
    path: 'button-group',
    loadComponent: () =>
      import(
        './pages/actions/button-group/component/button-group-showcase'
      ).then((m) => m.ButtonGroupShowcasePage),
  },
  {
    path: 'form-field',
    loadComponent: () =>
      import('./pages/forms/form-field/component/form-field-showcase').then(
        (m) => m.FormFieldShowcasePage,
      ),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./pages/forms/textarea/component/textarea-showcase').then(
        (m) => m.TextareaShowcasePage,
      ),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./pages/forms/input/component/input-showcase').then(
        (m) => m.InputShowcasePage,
      ),
  },
  {
    path: 'password-field',
    loadComponent: () =>
      import(
        './pages/forms/password-field/component/password-field-showcase'
      ).then((m) => m.PasswordFieldShowcasePage),
  },
  {
    path: 'email-field',
    loadComponent: () =>
      import('./pages/forms/email-field/component/email-field-showcase').then(
        (m) => m.EmailFieldShowcasePage,
      ),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/forms/checkbox/component/checkbox-showcase').then(
        (m) => m.CheckboxShowcasePage,
      ),
  },
  {
    path: 'checkbox-group',
    loadComponent: () =>
      import(
        './pages/forms/checkbox-group/component/checkbox-group-showcase'
      ).then((m) => m.CheckboxGroupShowcasePage),
  },
  {
    path: 'radio',
    loadComponent: () =>
      import('./pages/forms/radio/component/radio-showcase').then(
        (m) => m.RadioShowcasePage,
      ),
  },
  {
    path: 'radio-group',
    loadComponent: () =>
      import('./pages/forms/radio-group/component/radio-group-showcase').then(
        (m) => m.RadioGroupShowcasePage,
      ),
  },
  {
    path: 'switch',
    loadComponent: () =>
      import('./pages/forms/switch/component/switch-showcase').then(
        (m) => m.SwitchShowcasePage,
      ),
  },
  {
    path: 'switch-group',
    loadComponent: () =>
      import('./pages/forms/switch-group/component/switch-group-showcase').then(
        (m) => m.SwitchGroupShowcasePage,
      ),
  },
  {
    path: 'option',
    loadComponent: () =>
      import('./pages/forms/option/component/option-showcase').then(
        (m) => m.OptionShowcasePage,
      ),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./pages/forms/select/component/select-showcase').then(
        (m) => m.SelectShowcasePage,
      ),
  },
  {
    path: 'multi-select',
    loadComponent: () =>
      import('./pages/forms/multi-select/component/multi-select-showcase').then(
        (m) => m.MultiSelectShowcasePage,
      ),
  },
  {
    path: 'popover',
    loadComponent: () =>
      import('./pages/interaction/popover/component/popover-showcase').then(
        (m) => m.PopoverShowcasePage,
      ),
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('./pages/interaction/tooltip/component/tooltip-showcase').then(
        (m) => m.TooltipShowcasePage,
      ),
  },
  {
    path: 'toast',
    loadComponent: () =>
      import('./pages/feedback/toast/component/toast-showcase').then(
        (m) => m.ToastShowcasePage,
      ),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('./pages/overlay/dialog/component/dialog-page.component').then(
        (m) => m.DialogPageComponent,
      ),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/navigation/tabs/component/tabs-page.component').then(
        (m) => m.TabsPageComponent,
      ),
  },
  {
    path: 'stepper',
    loadComponent: () =>
      import(
        './pages/navigation/stepper/component/stepper-page.component'
      ).then((m) => m.StepperPageComponent),
  },
  {
    path: 'segmented-control',
    loadComponent: () =>
      import(
        './pages/navigation/segmented-control/component/segmented-control-page.component'
      ).then((m) => m.SegmentedControlPageComponent),
  },
  {
    path: 'divider',
    loadComponent: () =>
      import('./pages/content/divider/component/divider-showcase').then(
        (m) => m.DividerShowcasePage,
      ),
  },
  {
    path: 'dropdown-menu',
    loadComponent: () =>
      import(
        './pages/interaction/dropdown-menu/component/dropdown-menu-showcase'
      ).then((m) => m.DropdownMenuShowcasePage),
  },
  {
    path: 'collapsible',
    loadComponent: () =>
      import(
        './pages/interaction/collapsible/component/collapsible-showcase'
      ).then((m) => m.CollapsibleShowcasePage),
  },
  {
    path: 'editable-tabs',
    loadComponent: () =>
      import(
        './pages/navigation/editable-tabs/component/editable-tabs-page.component'
      ).then((m) => m.EditableTabsPageComponent),
  },
];
