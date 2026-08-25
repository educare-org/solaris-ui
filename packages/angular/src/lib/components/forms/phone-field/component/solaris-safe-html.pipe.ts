// SECURITY_EXCEPTION_FILE: this pipe trusts a string only when rendered via [innerHTML] in the
// phone-field country list. The value is a flag SVG returned by the pinned `country-flag-icons`
// dependency (static data). It is never derived from user input, so bypassing Angular's sanitizer
// here is safe and justified. A test documents this behavior.
import { Pipe, type PipeTransform, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'solarisSafeHtml',
  standalone: true,
})
export class SolarisSafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
