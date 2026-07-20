import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-tabs-with-panels-example',
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './with-panels.component.html',
})
export class TabsWithPanelsExample {
  readonly activeTab = signal<string | number>('code');
}
