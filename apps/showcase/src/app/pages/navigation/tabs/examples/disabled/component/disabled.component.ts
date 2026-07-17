import { Component, signal } from '@angular/core';

import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-disabled-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent, SolarisTranslatePipe],
  templateUrl: './disabled.component.html',
})
export class DisabledTabsExample {
  readonly activeTab = signal<string | number>('enabled-1');
}
