import { Route } from '@angular/router';

export const dataDisplayRoutes: Route[] = [
  {
    path: 'data-display',
    children: [
      {
        path: 'avatar',
        loadComponent: () =>
          import('../pages/data-display/avatar/component/avatar-showcase').then(
            (m) => m.AvatarShowcasePage,
          ),
      },
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
      {
        path: 'code-block',
        loadComponent: () =>
          import(
            '../pages/data-display/code-block/component/code-block-showcase'
          ).then((m) => m.CodeBlockShowcasePage),
      },
      {
        path: 'preview-code',
        loadComponent: () =>
          import(
            '../pages/data-display/preview-code/component/preview-code-showcase'
          ).then((m) => m.PreviewCodeShowcasePage),
      },
      {
        path: 'table',
        redirectTo: 'tables/table',
        pathMatch: 'full',
      },
      {
        path: 'tables',
        children: [
          {
            path: 'table',
            loadComponent: () =>
              import(
                '../pages/data-display/table/component/table-showcase'
              ).then((m) => m.TableShowcasePage),
          },
          {
            path: 'gradebook',
            loadComponent: () =>
              import(
                '../pages/data-display/tables/gradebook/component/gradebook-showcase'
              ).then((m) => m.GradebookShowcasePage),
          },
          {
            path: 'record-grid',
            loadComponent: () =>
              import(
                '../pages/data-display/tables/record-grid/component/record-grid-showcase'
              ).then((m) => m.RecordGridShowcasePage),
          },
        ],
      },
    ],
  },
];
