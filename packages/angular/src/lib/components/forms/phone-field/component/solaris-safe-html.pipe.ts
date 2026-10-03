import { Pipe, type PipeTransform, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'solarisSafeHtml',
  standalone: true,
})
export class SolarisSafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    // SECURITY_EXCEPTION: trusts only flag SVGs from the pinned country-flag-icons dependency (static data, never user input) for [innerHTML] rendering.
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
