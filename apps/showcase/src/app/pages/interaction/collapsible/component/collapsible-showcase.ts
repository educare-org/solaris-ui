import { Component } from '@angular/core';

import {
  SolarisCollapsibleComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisCollapsibleComponent, SolarisTranslatePipe],
  templateUrl: './collapsible-showcase.html',
  styleUrls: ['./collapsible-showcase.scss'],
})
export class CollapsibleShowcasePage {
  protected controlledOpen = false;
  protected sizes = ['sm', 'md', 'lg'] as const;
}
