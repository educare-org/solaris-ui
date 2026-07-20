import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-icons-and-badges-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent, SolarisTranslatePipe],
  templateUrl: './icons-and-badges.component.html',
})
export class IconsAndBadgesTabsExample {
  readonly activeTab = signal<string | number>('code');
}
