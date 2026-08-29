import { Route } from '@angular/router';

export const overlayRoutes: Route[] = [
  {
    path: 'overlay',
    children: [
      {
        path: 'dialog',
        loadComponent: () =>
          import(
            '../pages/overlay/dialog/component/dialog-showcase.component'
          ).then((m) => m.DialogShowcaseComponent),
      },
    ],
  },
];
