import { Component, signal } from '@angular/core';
import {
  SolarisTabsComponent,
  SolarisTabComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-density-tabs-example',
  imports: [SolarisTabsComponent, SolarisTabComponent, SolarisTranslatePipe],
  templateUrl: './density.component.html',
})
export class DensityTabsExample {
  readonly compactTab = signal<string | number>('drafts');
  readonly normalTab = signal<string | number>('drafts');
  readonly comfortableTab = signal<string | number>('drafts');
}
