import { Component, signal } from '@angular/core';
import { SolarisTabsComponent, SolarisTabComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-scrollable-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent],
  templateUrl: './scrollable.component.html',
})
export class ScrollableTabsExample {
  readonly activeTab = signal<string | number>('tab-1');
}
