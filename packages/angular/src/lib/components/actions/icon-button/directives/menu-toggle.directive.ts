// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement reads the host button's disabled and loading state before toggling.
import {
  Directive,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

@Directive({
  selector: 'button[solaris-icon-button][solaris-menu-toggle]',
  standalone: true,
  host: {
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.aria-expanded]': 'open() ? "true" : "false"',
    '[attr.aria-controls]': 'controls() ?? null',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class SolarisMenuToggleDirective {
  private readonly elementRef =
    inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly open = model(false, { alias: 'solarisMenuToggleOpen' });
  readonly controls = input<string | undefined>(undefined, {
    alias: 'solarisMenuToggleControls',
  });
  readonly openLabel = input<string | undefined>(undefined, {
    alias: 'solarisMenuToggleOpenLabel',
  });
  readonly closeLabel = input<string | undefined>(undefined, {
    alias: 'solarisMenuToggleCloseLabel',
  });

  protected readonly resolvedAriaLabel = computed(() => {
    const label = this.open() ? this.closeLabel() : this.openLabel();
    if (label) {
      return label;
    }

    const key = this.open()
      ? 'solaris.menuToggle.close'
      : 'solaris.menuToggle.open';
    const fallback = this.open() ? 'Close menu' : 'Open menu';
    const translated = this.translateService?.translate(key);

    return translated && translated !== key ? translated : fallback;
  });

  @HostListener('click')
  protected toggle(): void {
    const button = this.elementRef.nativeElement;
    if (
      button.disabled ||
      button.getAttribute('aria-disabled') === 'true' ||
      button.hasAttribute('data-loading')
    ) {
      return;
    }

    this.open.update((open) => !open);
  }
}
