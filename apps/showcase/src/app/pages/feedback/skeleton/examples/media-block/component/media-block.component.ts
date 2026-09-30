import { Component } from '@angular/core';

import {
  SolarisSkeletonComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-skeleton-media-block-example',
  imports: [SolarisSkeletonComponent, SolarisTranslatePipe],
  templateUrl: './media-block.component.html',
  styleUrls: ['./media-block.component.scss'],
})
export class SkeletonMediaBlockExample {}
