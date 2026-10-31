import { Route } from '@angular/router';

export const gettingStartedRoutes: Route[] = [
  {
    path: 'introduction',
    loadComponent: () =>
      import('../pages/introduction/component/introduction').then(
        (m) => m.IntroductionShowcasePage,
      ),
  },
  {
    path: 'installation',
    loadComponent: () =>
      import('../pages/installation/component/installation').then(
        (m) => m.InstallationShowcasePage,
      ),
  },
];
