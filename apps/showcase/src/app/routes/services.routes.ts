import { Route } from '@angular/router';

export const servicesRoutes: Route[] = [
  {
    path: 'services',
    children: [
      {
        path: 'translate',
        loadComponent: () =>
          import(
            '../pages/services/translate/component/translate-showcase'
          ).then((m) => m.TranslateShowcasePage),
      },
    ],
  },
];
