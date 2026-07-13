import { Directive } from '@angular/core';

@Directive({
  selector: '[solaris-option-leading]',
  standalone: true,
})
export class SolarisOptionLeadingDirective {}

@Directive({
  selector: '[solaris-option-label]',
  standalone: true,
})
export class SolarisOptionLabelDirective {}

@Directive({
  selector: '[solaris-option-description]',
  standalone: true,
})
export class SolarisOptionDescriptionDirective {}

@Directive({
  selector: '[solaris-option-meta]',
  standalone: true,
})
export class SolarisOptionMetaDirective {}

@Directive({
  selector: '[solaris-option-trailing]',
  standalone: true,
})
export class SolarisOptionTrailingDirective {}
