import { Component } from '@angular/core';

import {
  SolarisBreadcrumbComponent,
  type SolarisBreadcrumbItem,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-icons-breadcrumb-example',
  imports: [SolarisBreadcrumbComponent],
  templateUrl: './icons.component.html',
})
export class IconsBreadcrumbExample {
  protected readonly items: SolarisBreadcrumbItem[] = [
    { icon: 'home', href: '/', ariaLabelKey: 'breadcrumb.home' },
    { labelKey: 'breadcrumb.settings', icon: 'gear', href: '/settings' },
    { labelKey: 'breadcrumb.security', icon: 'lock', current: true },
  ];
}
