import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-announcement-media]',
  standalone: true,
  host: {
    class: 'solaris-announcement-media',
  },
})
export class SolarisAnnouncementMediaDirective {}
