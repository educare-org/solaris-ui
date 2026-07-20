import { Component, signal } from '@angular/core';

import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-manual-activation-tabs-example',
  imports: [
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './manual-activation.component.html',
  styleUrls: ['./manual-activation.component.scss'],
})
export class ManualActivationTabsExample {
  readonly activeTab = signal<string | number>('step-1');
}
