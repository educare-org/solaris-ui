import { Route } from '@angular/router';

export const dataDisplayRoutes: Route[] = [
  {
    path: 'data-display',
    children: [
      {
        path: 'badge',
        loadComponent: () =>
          import('../pages/data-display/badge/component/badge-showcase').then(
            (m) => m.BadgeShowcasePage,
          ),
      },
      {
        path: 'card',
        loadComponent: () =>
          import('../pages/data-display/card/component/card-showcase').then(
            (m) => m.CardShowcasePage,
          ),
      },
    ],
  },
];
