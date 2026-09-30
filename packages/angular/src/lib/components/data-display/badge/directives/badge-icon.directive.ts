import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-badge-icon]',
  standalone: true,
  host: {
    class: 'solaris-badge-icon',
    '[style.width]': '"var(--solaris-badge-icon-size)"',
    '[style.height]': '"var(--solaris-badge-icon-size)"',
    '[style.flex-shrink]': '"0"',
    '[style.display]': '"inline-flex"',
    '[style.align-items]': '"center"',
    '[style.justify-content]': '"center"',
  },
})
export class SolarisBadgeIconDirective {}
