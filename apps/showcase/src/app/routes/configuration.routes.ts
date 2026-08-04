import { Route } from '@angular/router';

export const configurationRoutes: Route[] = [
  {
    path: 'configuration',
    loadComponent: () =>
      import('../pages/configuration/component/configuration').then(
        (m) => m.ConfigurationPage,
      ),
  },
];
