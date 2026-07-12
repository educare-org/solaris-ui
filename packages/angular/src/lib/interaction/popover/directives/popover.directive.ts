import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[solaris-popover]',
  standalone: true,
  exportAs: 'solarisPopover',
})
export class SolarisPopoverDirective {
  readonly templateRef = inject(TemplateRef);
}
