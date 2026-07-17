import { Component, signal } from '@angular/core';

import { SolarisTabsComponent, SolarisTabComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent],
  templateUrl: './basic.component.html',
})
export class BasicTabsExample {
  readonly activeTab = signal<string | number>('code');
}
