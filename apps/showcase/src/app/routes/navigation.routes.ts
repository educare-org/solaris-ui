import { Route } from '@angular/router';

export const navigationRoutes: Route[] = [
  {
    path: 'navigation',
    children: [
      {
        path: 'tabs',
        loadComponent: () =>
          import('../pages/navigation/tabs/component/tabs-showcase').then(
            (m) => m.TabsShowcasePage,
          ),
      },
      {
        path: 'breadcrumb',
        loadComponent: () =>
          import(
            '../pages/navigation/breadcrumb/component/breadcrumb-showcase'
          ).then((m) => m.BreadcrumbShowcasePage),
      },
      {
        path: 'mega-menu',
        loadComponent: () =>
          import(
            '../pages/navigation/mega-menu/component/mega-menu-showcase.component'
          ).then((m) => m.MegaMenuShowcasePage),
      },
      {
        path: 'stepper',
        loadComponent: () =>
          import(
            '../pages/navigation/stepper/component/stepper-page.component'
          ).then((m) => m.StepperPageComponent),
      },
      {
        path: 'segmented-control',
        loadComponent: () =>
          import(
            '../pages/navigation/segmented-control/component/segmented-control-showcase'
          ).then((m) => m.SegmentedControlShowcasePage),
      },
      {
        path: 'editable-tabs',
        loadComponent: () =>
          import(
            '../pages/navigation/editable-tabs/component/editable-tabs-showcase'
          ).then((m) => m.EditableTabsShowcasePage),
      },
      {
        path: 'pagination',
        loadComponent: () =>
          import(
            '../pages/navigation/pagination/component/pagination-showcase'
          ).then((m) => m.PaginationShowcasePage),
      },
    ],
  },
];
