import { Component, signal } from '@angular/core';

import {
  SolarisBreadcrumbComponent,
  type SolarisBreadcrumbItem,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-navigation-breadcrumb-example',
  imports: [SolarisBreadcrumbComponent],
  templateUrl: './navigation.component.html',
})
export class NavigationBreadcrumbExample {
  protected readonly items: SolarisBreadcrumbItem[] = [
    { labelKey: 'breadcrumb.home', icon: 'home', href: '/' },
    { labelKey: 'breadcrumb.products', href: '/products' },
    { labelKey: 'breadcrumb.analytics', current: true },
  ];

  protected readonly lastAction = signal<string>('');

  protected goBack(): void {
    this.lastAction.set('previous');
  }

  protected goForward(): void {
    this.lastAction.set('next');
  }
}
