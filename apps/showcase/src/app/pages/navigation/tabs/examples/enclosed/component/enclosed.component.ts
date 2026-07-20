import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-enclosed-tabs-example',
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './enclosed.component.html',
})
export class EnclosedTabsExample {
  readonly activeTab = signal<string | number>('details');
}
