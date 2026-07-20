import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-full-width-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent, SolarisTranslatePipe],
  templateUrl: './full-width.component.html',
})
export class FullWidthTabsExample {
  readonly activeTab = signal<string | number>('overview');
}
