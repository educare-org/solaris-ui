import { Route } from '@angular/router';

export const feedbackRoutes: Route[] = [
  {
    path: 'feedback',
    children: [
      {
        path: 'loading',
        children: [
          {
            path: 'skeleton',
            loadComponent: () =>
              import(
                '../pages/feedback/skeleton/component/skeleton-showcase'
              ).then((m) => m.SkeletonShowcasePage),
          },
          {
            path: 'spinner',
            loadComponent: () =>
              import(
                '../pages/feedback/spinner/component/spinner-showcase'
              ).then((m) => m.SpinnerShowcasePage),
          },
          {
            path: 'progress',
            loadComponent: () =>
              import(
                '../pages/feedback/progress/component/progress-showcase'
              ).then((m) => m.ProgressShowcasePage),
          },
          {
            path: 'loading-text',
            loadComponent: () =>
              import(
                '../pages/feedback/loading-text/component/loading-text-showcase'
              ).then((m) => m.LoadingTextShowcasePage),
          },
        ],
      },
      {
        path: 'alert',
        loadComponent: () =>
          import('../pages/feedback/alert/component/alert-showcase').then(
            (m) => m.AlertShowcasePage,
          ),
      },
      {
        path: 'toast',
        loadComponent: () =>
          import('../pages/feedback/toast/component/toast-showcase').then(
            (m) => m.ToastShowcasePage,
          ),
      },
    ],
  },
];
