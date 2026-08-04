import { Route } from '@angular/router';

export const actionsRoutes: Route[] = [
  {
    path: 'actions',
    children: [
      {
        path: 'button',
        loadComponent: () =>
          import('../pages/actions/button/component/button-showcase').then(
            (m) => m.ButtonShowcasePage,
          ),
      },
      {
        path: 'icon-button',
        loadComponent: () =>
          import(
            '../pages/actions/icon-button/component/icon-button-showcase'
          ).then((m) => m.IconButtonShowcasePage),
      },
      {
        path: 'button-group',
        loadComponent: () =>
          import(
            '../pages/actions/button-group/component/button-group-showcase'
          ).then((m) => m.ButtonGroupShowcasePage),
      },
    ],
  },
];
