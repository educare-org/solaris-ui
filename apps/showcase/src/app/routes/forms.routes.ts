import { Route } from '@angular/router';

export const formsRoutes: Route[] = [
  {
    path: 'form-field',
    loadComponent: () =>
      import('../pages/forms/form-field/component/form-field-showcase').then(
        (m) => m.FormFieldShowcasePage,
      ),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('../pages/forms/textarea/component/textarea-showcase').then(
        (m) => m.TextareaShowcasePage,
      ),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('../pages/forms/input/component/input-showcase').then(
        (m) => m.InputShowcasePage,
      ),
  },
  {
    path: 'password-field',
    loadComponent: () =>
      import(
        '../pages/forms/password-field/component/password-field-showcase'
      ).then((m) => m.PasswordFieldShowcasePage),
  },
  {
    path: 'email-field',
    loadComponent: () =>
      import('../pages/forms/email-field/component/email-field-showcase').then(
        (m) => m.EmailFieldShowcasePage,
      ),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('../pages/forms/checkbox/component/checkbox-showcase').then(
        (m) => m.CheckboxShowcasePage,
      ),
  },
  {
    path: 'checkbox-group',
    loadComponent: () =>
      import(
        '../pages/forms/checkbox-group/component/checkbox-group-showcase'
      ).then((m) => m.CheckboxGroupShowcasePage),
  },
  {
    path: 'radio',
    loadComponent: () =>
      import('../pages/forms/radio/component/radio-showcase').then(
        (m) => m.RadioShowcasePage,
      ),
  },
  {
    path: 'radio-group',
    loadComponent: () =>
      import('../pages/forms/radio-group/component/radio-group-showcase').then(
        (m) => m.RadioGroupShowcasePage,
      ),
  },
  {
    path: 'switch',
    loadComponent: () =>
      import('../pages/forms/switch/component/switch-showcase').then(
        (m) => m.SwitchShowcasePage,
      ),
  },
  {
    path: 'switch-group',
    loadComponent: () =>
      import(
        '../pages/forms/switch-group/component/switch-group-showcase'
      ).then((m) => m.SwitchGroupShowcasePage),
  },
  {
    path: 'option',
    loadComponent: () =>
      import('../pages/forms/option/component/option-showcase').then(
        (m) => m.OptionShowcasePage,
      ),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('../pages/forms/select/component/select-showcase').then(
        (m) => m.SelectShowcasePage,
      ),
  },
  {
    path: 'multi-select',
    loadComponent: () =>
      import(
        '../pages/forms/multi-select/component/multi-select-showcase'
      ).then((m) => m.MultiSelectShowcasePage),
  },
];
