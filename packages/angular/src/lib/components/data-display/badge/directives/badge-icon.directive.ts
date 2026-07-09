import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-badge-icon]',
  standalone: true,
  host: {
    class: 'solaris-badge-icon',
  },
})
export class SolarisBadgeIconDirective {}
