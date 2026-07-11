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
      import('./pages/badge/component/badge-showcase').then(
        (m) => m.BadgeShowcasePage,
      ),
  },
  {
    path: 'skeleton',
    loadComponent: () =>
      import('./pages/skeleton/component/skeleton-showcase').then(
        (m) => m.SkeletonShowcasePage,
      ),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./pages/card/component/card-showcase').then(
        (m) => m.CardShowcasePage,
      ),
  },
  {
    path: 'alert',
    loadComponent: () =>
      import('./pages/alert/component/alert-showcase').then(
        (m) => m.AlertShowcasePage,
      ),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/button/component/button-showcase').then(
        (m) => m.ButtonShowcasePage,
      ),
  },
  {
    path: 'icon-button',
    loadComponent: () =>
      import('./pages/icon-button/component/icon-button-showcase').then(
        (m) => m.IconButtonShowcasePage,
      ),
  },
  {
    path: 'button-group',
    loadComponent: () =>
      import('./pages/button-group/component/button-group-showcase').then(
        (m) => m.ButtonGroupShowcasePage,
      ),
  },
  {
    path: 'form-field',
    loadComponent: () =>
      import('./pages/form-field/component/form-field-showcase').then(
        (m) => m.FormFieldShowcasePage,
      ),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./pages/textarea/component/textarea-showcase').then(
        (m) => m.TextareaShowcasePage,
      ),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./pages/input/component/input-showcase').then(
        (m) => m.InputShowcasePage,
      ),
  },
  {
    path: 'password-field',
    loadComponent: () =>
      import('./pages/password-field/component/password-field-showcase').then(
        (m) => m.PasswordFieldShowcasePage,
      ),
  },
  {
    path: 'email-field',
    loadComponent: () =>
      import('./pages/email-field/component/email-field-showcase').then(
        (m) => m.EmailFieldShowcasePage,
      ),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/checkbox/component/checkbox-showcase').then(
        (m) => m.CheckboxShowcasePage,
      ),
  },
  {
    path: 'checkbox-group',
    loadComponent: () =>
      import('./pages/checkbox-group/component/checkbox-group-showcase').then(
        (m) => m.CheckboxGroupShowcasePage,
      ),
  },
];
