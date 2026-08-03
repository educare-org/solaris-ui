import { Component } from '@angular/core';

import {
  SolarisBreadcrumbComponent,
  SolarisTranslatePipe,
  type SolarisBreadcrumbItem,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisBreadcrumbComponent, SolarisTranslatePipe],
  templateUrl: './breadcrumb-showcase.html',
  styleUrls: ['./breadcrumb-showcase.scss'],
})
export class BreadcrumbShowcasePage {
  protected readonly basicItems: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    { labelKey: 'breadcrumb.products', href: '/products' },
    { labelKey: 'breadcrumb.analytics', current: true },
  ];

  protected readonly iconItems: SolarisBreadcrumbItem[] = [
    {
      icon: 'home',
      href: '/',
      ariaLabelKey: 'breadcrumb.home',
    },
    { labelKey: 'breadcrumb.settings', icon: 'gear', href: '/settings' },
    { labelKey: 'breadcrumb.security', icon: 'lock', current: true },
  ];

  protected readonly longItems: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    { labelKey: 'breadcrumb.organization', href: '/organization' },
    { labelKey: 'breadcrumb.campuses', href: '/organization/campuses' },
    {
      labelKey: 'breadcrumb.students',
      href: '/organization/campuses/students',
    },
    {
      labelKey: 'breadcrumb.enrollment',
      href: '/organization/campuses/students/enrollment',
    },
    { labelKey: 'breadcrumb.current', current: true },
  ];
}
