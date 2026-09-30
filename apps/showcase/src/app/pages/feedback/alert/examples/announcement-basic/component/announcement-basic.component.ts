import { Component, signal } from '@angular/core';

import {
  SolarisAnnouncementComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-announcement-basic-example',
  imports: [SolarisAnnouncementComponent, SolarisTranslatePipe],
  templateUrl: './announcement-basic.component.html',
})
export class AnnouncementBasicExample {
  protected readonly visible = signal(true);

  protected handleDismiss(): void {
    this.visible.set(false);
  }
}
