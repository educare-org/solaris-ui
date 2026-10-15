import { Route } from '@angular/router';

export const schedulingRoutes: Route[] = [
  {
    path: 'scheduling',
    children: [
      {
        path: 'month-view',
        loadComponent: () =>
          import(
            '../pages/scheduling/month-view/component/month-view-showcase'
          ).then((m) => m.MonthViewShowcasePage),
      },
    ],
  },
];
