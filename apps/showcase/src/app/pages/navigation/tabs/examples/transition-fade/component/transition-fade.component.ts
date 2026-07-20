import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-transition-fade-tabs-example',
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './transition-fade.component.html',
})
export class TransitionFadeTabsExample {
  readonly activeTab = signal<string | number>('a');
}
