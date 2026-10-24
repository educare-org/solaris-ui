import { Component } from '@angular/core';

import {
  SolarisAnnouncementComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-announcement-image-bg-example',
  imports: [SolarisAnnouncementComponent, SolarisTranslatePipe],
  templateUrl: './announcement-image-bg.component.html',
  styleUrls: ['./announcement-image-bg.component.scss'],
})
export class AnnouncementImageBgExample {}
