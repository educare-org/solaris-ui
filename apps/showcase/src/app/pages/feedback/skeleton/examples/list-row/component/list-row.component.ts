import { Component } from '@angular/core';

import {
  SolarisSkeletonComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-skeleton-list-row-example',
  imports: [SolarisSkeletonComponent, SolarisTranslatePipe],
  templateUrl: './list-row.component.html',
  styleUrls: ['./list-row.component.scss'],
})
export class SkeletonListRowExample {}
