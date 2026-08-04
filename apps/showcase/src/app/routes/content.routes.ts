import { Route } from '@angular/router';

export const contentRoutes: Route[] = [
  {
    path: 'content',
    children: [
      {
        path: 'divider',
        loadComponent: () =>
          import('../pages/content/divider/component/divider-showcase').then(
            (m) => m.DividerShowcasePage,
          ),
      },
    ],
  },
];
