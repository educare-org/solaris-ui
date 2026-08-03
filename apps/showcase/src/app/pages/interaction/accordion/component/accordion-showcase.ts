import { Component } from '@angular/core';

import {
  SolarisAccordionComponent,
  SolarisCollapsibleComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisAccordionComponent,
    SolarisCollapsibleComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './accordion-showcase.html',
  styleUrls: ['./accordion-showcase.scss'],
})
export class AccordionShowcasePage {
  protected singleValue: string | undefined;
  protected multipleValues: string[] = [];
}
