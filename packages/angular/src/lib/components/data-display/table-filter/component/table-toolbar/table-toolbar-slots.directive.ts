import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-toolbar-leading]',
})
export class SolarisTableToolbarLeadingDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-toolbar-trailing]',
})
export class SolarisTableToolbarTrailingDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}
