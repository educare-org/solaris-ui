import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-vertical-tabs-example',
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
})
export class VerticalTabsExample {
  readonly activeTab = signal<string | number>('general');
}
