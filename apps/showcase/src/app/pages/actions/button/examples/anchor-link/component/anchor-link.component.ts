import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-anchor-link-button-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './anchor-link.component.html',
})
export class AnchorLinkButtonExample {}
