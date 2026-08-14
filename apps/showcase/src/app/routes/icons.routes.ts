import { Route } from '@angular/router';

export const iconsRoutes: Route[] = [
  {
    path: 'icons',
    loadComponent: () =>
      import('../pages/icons/component/icons-showcase').then(
        (m) => m.IconsShowcasePage,
      ),
  },
];
