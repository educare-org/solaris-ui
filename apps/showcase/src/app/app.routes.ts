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
];
