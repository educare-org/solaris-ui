import { Route } from '@angular/router';

export const contentRoutes: Route[] = [
  {
    path: 'divider',
    loadComponent: () =>
      import('../pages/content/divider/component/divider-showcase').then(
        (m) => m.DividerShowcasePage,
      ),
  },
];
