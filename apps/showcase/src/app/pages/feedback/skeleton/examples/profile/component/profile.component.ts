import { Component } from '@angular/core';

import {
  SolarisSkeletonComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-skeleton-profile-example',
  imports: [SolarisSkeletonComponent, SolarisTranslatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class SkeletonProfileExample {}
