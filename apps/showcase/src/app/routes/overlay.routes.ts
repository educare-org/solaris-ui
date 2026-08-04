import { Route } from '@angular/router';

export const overlayRoutes: Route[] = [
  {
    path: 'overlay',
    children: [
      {
        path: 'dialog',
        loadComponent: () =>
          import(
            '../pages/overlay/dialog/component/dialog-page.component'
          ).then((m) => m.DialogPageComponent),
      },
    ],
  },
];
