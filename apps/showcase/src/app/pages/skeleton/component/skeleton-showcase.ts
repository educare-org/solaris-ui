import { Component } from '@angular/core';

import {
  SolarisSkeletonComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisSkeletonComponent, SolarisTranslatePipe],
  templateUrl: './skeleton-showcase.html',
  styleUrls: ['./skeleton-showcase.scss'],
})
export class SkeletonShowcasePage {}
