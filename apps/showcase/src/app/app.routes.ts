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
    path: 'input',
    loadComponent: () =>
      import('./pages/input/component/input-showcase').then(
        (m) => m.InputShowcasePage,
      ),
  },
];
