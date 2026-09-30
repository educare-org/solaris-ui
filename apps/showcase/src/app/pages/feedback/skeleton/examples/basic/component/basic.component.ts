import { Component } from '@angular/core';

import { SolarisSkeletonComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-skeleton-basic-example',
  imports: [SolarisSkeletonComponent],
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
})
export class SkeletonBasicExample {}
