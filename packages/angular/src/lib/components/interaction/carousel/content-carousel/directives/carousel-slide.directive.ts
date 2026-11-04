import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-carousel-slide]',
})
export class SolarisCarouselSlideDirective {
  readonly templateRef = inject(TemplateRef<unknown>);
}
