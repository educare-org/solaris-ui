import { Component } from '@angular/core';

import {
  SolarisBreadcrumbComponent,
  type SolarisBreadcrumbItem,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-breadcrumb-example',
  imports: [SolarisBreadcrumbComponent],
  templateUrl: './basic.component.html',
})
export class BasicBreadcrumbExample {
  protected readonly items: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    { labelKey: 'breadcrumb.products', href: '/products' },
    { labelKey: 'breadcrumb.analytics', current: true },
  ];
}
