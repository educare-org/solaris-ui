import { Component } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';

import {
  SolarisButtonDirective,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-popover-reactive-example',
  imports: [
    CdkScrollable,
    SolarisButtonDirective,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss'],
})
export class PopoverReactiveExample {}
