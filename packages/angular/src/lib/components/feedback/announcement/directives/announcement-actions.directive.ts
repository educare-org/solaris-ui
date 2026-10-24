import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-announcement-actions]',
  standalone: true,
  host: {
    class: 'solaris-announcement-actions',
  },
})
export class SolarisAnnouncementActionsDirective {}
