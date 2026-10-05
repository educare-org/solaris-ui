import { Component } from '@angular/core';

import {
  SolarisBreadcrumbComponent,
  type SolarisBreadcrumbItem,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-truncation-breadcrumb-example',
  imports: [SolarisBreadcrumbComponent],
  templateUrl: './truncation.component.html',
})
export class TruncationBreadcrumbExample {
  protected readonly items: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    {
      labelKey: 'breadcrumb.example.truncation.long-one',
      href: '/reports',
    },
    {
      labelKey: 'breadcrumb.example.truncation.long-two',
      href: '/reports/quarterly',
    },
    { labelKey: 'breadcrumb.example.truncation.current', current: true },
  ];
}
