import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-cell]',
})
export class SolarisTableCellDirective {
  readonly templateId = input.required<string>({
    alias: 'solaris-table-cell',
  });

  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-header]',
})
export class SolarisTableHeaderDirective {
  readonly templateId = input.required<string>({
    alias: 'solaris-table-header',
  });

  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-detail]',
})
export class SolarisTableDetailDirective {
  readonly templateId = input.required<string>({
    alias: 'solaris-table-detail',
  });

  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-empty]',
})
export class SolarisTableEmptyDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-error]',
})
export class SolarisTableErrorDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-loading]',
})
export class SolarisTableLoadingDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-footer]',
})
export class SolarisTableFooterDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}

@Directive({
  standalone: true,
  selector: 'ng-template[solaris-table-toolbar]',
})
export class SolarisTableToolbarDirective {
  readonly templateRef = inject(TemplateRef<Record<string, unknown>>);
}
