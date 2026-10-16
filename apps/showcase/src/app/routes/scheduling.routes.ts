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
      {
        path: 'week-view',
        loadComponent: () =>
          import(
            '../pages/scheduling/week-view/component/week-view-showcase'
          ).then((m) => m.WeekViewShowcasePage),
      },
      {
        path: 'year-view',
        loadComponent: () =>
          import(
            '../pages/scheduling/year-view/component/year-view-showcase'
          ).then((m) => m.YearViewShowcasePage),
      },
      {
        path: 'schedule-view',
        loadComponent: () =>
          import(
            '../pages/scheduling/schedule-view/component/schedule-view-showcase'
          ).then((m) => m.ScheduleViewShowcasePage),
      },
    ],
  },
];
