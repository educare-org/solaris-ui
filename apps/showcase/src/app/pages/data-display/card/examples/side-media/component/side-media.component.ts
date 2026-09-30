import { Component } from '@angular/core';

import {
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardMediaDirective,
  SolarisCardTitleDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-side-media-card-example',
  imports: [
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardDescriptionDirective,
    SolarisCardMediaDirective,
    SolarisCardTitleDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './side-media.component.html',
  styleUrls: ['./side-media.component.scss'],
})
export class SideMediaCardExample {}
