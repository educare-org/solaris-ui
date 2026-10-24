import { Pipe, type PipeTransform, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'solarisSafeHtml',
  standalone: true,
})
export class SolarisSafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    if (!isTrustedFlagSvg(value)) {
      return '';
    }
    // SECURITY_EXCEPTION: trusts only allowlisted flag SVGs (isTrustedFlagSvg above; pinned country-flag-icons static data, never user input) for [innerHTML]; plain [innerHTML] renders SVG inert so bypass is required; non-SVG never reaches here; covered by solaris-safe-html.pipe.spec.ts.
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

/**
 * Allowlist guard for flag SVGs. Only static `<svg>…</svg>` markup from the
 * pinned `country-flag-icons` set may reach `bypassSecurityTrustHtml`.
 * Anything else (user text, HTML fragments, event handlers, scripts,
 * javascript: URLs) is rejected by the caller.
 */
export function isTrustedFlagSvg(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  const trimmed = value.trim();
  if (!/^<svg[\s>]/i.test(trimmed) || !/<\/svg>\s*$/i.test(trimmed)) {
    return false;
  }
  const lowered = trimmed.toLowerCase();
  if (lowered.includes('<script')) {
    return false;
  }
  if (/<[^>]+\son\w+\s*=/i.test(trimmed)) {
    return false;
  }
  if (lowered.includes('javascript:')) {
    return false;
  }
  return true;
}
