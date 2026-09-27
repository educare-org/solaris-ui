import { Route } from '@angular/router';

export const interactionRoutes: Route[] = [
  {
    path: 'interaction',
    children: [
      {
        path: 'popover',
        loadComponent: () =>
          import(
            '../pages/interaction/popover/component/popover-page.component'
          ).then((m) => m.PopoverPageComponent),
      },
      {
        path: 'tooltip',
        loadComponent: () =>
          import(
            '../pages/interaction/tooltip/component/tooltip-page.component'
          ).then((m) => m.TooltipPageComponent),
      },
      {
        path: 'dropdown-menu',
        loadComponent: () =>
          import(
            '../pages/interaction/dropdown-menu/component/dropdown-menu-showcase'
          ).then((m) => m.DropdownMenuShowcasePage),
      },
      {
        path: 'collapsible',
        loadComponent: () =>
          import(
            '../pages/interaction/collapsible/component/collapsible-showcase'
          ).then((m) => m.CollapsibleShowcasePage),
      },
      {
        path: 'accordion',
        loadComponent: () =>
          import(
            '../pages/interaction/accordion/component/accordion-showcase'
          ).then((m) => m.AccordionShowcasePage),
      },
    ],
  },
];
