import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'configuration',
    loadComponent: () =>
      import('./pages/configuration/component/configuration').then(
        (m) => m.ConfigurationPage,
      ),
  },
];
