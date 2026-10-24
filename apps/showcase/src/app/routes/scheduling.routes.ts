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
      {
        path: 'shell',
        loadComponent: () =>
          import('../pages/scheduling/shell/component/shell-showcase').then(
            (m) => m.ShellShowcasePage,
          ),
      },
      {
        path: 'holidays',
        loadComponent: () =>
          import(
            '../pages/scheduling/holidays/component/holidays-showcase'
          ).then((m) => m.HolidaysShowcasePage),
      },
      {
        path: 'print',
        loadComponent: () =>
          import('../pages/scheduling/print/component/print-showcase').then(
            (m) => m.PrintShowcasePage,
          ),
      },
      {
        path: 'event-editor',
        loadComponent: () =>
          import(
            '../pages/scheduling/event-editor/component/event-editor-showcase'
          ).then((m) => m.EventEditorShowcasePage),
      },
    ],
  },
];
