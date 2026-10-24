import { Component } from '@angular/core';

import {
  SolarisAnnouncementComponent,
  SolarisTranslatePipe,
  clearSolarisAnnouncementDismissed,
} from '@solaris-ui/angular';

const DISMISS_KEY = 'showcase-announcement-promo';

@Component({
  standalone: true,
  selector: 'app-announcement-persistent-example',
  imports: [SolarisAnnouncementComponent, SolarisTranslatePipe],
  templateUrl: './announcement-persistent.component.html',
})
export class AnnouncementPersistentExample {
  protected showAgain(): void {
    clearSolarisAnnouncementDismissed(DISMISS_KEY);
  }
}
