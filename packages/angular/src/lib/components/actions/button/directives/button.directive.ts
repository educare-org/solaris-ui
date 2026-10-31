import {
  Directive,
  input,
  computed,
  effect,
  HostListener,
  createComponent,
  isDevMode,
  AfterViewInit,
  type ComponentRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type {
  SolarisButtonSize,
  SolarisButtonAppearance,
  SolarisButtonColor,
  SolarisButtonRadius,
  SolarisButtonDensity,
  SolarisButtonShape,
  SolarisButtonIconPosition,
} from '../model/button.types';

import { SolarisButtonHostBase } from './button-host-base';
import { SolarisIconComponent } from '../../../icon';

@Directive({
  selector: '[solaris-button]',
  standalone: true,
  host: {
    '[attr.data-size]': 'effectiveSize()',
    '[attr.data-shape]': 'resolvedShape()',
    '[attr.data-color]': 'resolvedColor()',
    '[attr.data-radius]': 'resolvedRadius()',
    '[attr.data-appearance]': 'resolvedAppearance()',
    '[attr.data-density]': 'effectiveDensity()',
    '[attr.data-group]': 'groupPlacement()',
    '[attr.aria-pressed]': 'computedAriaPressed()',
    '[attr.data-loading]': 'effectiveLoading() || undefined',
    '[attr.aria-busy]': 'effectiveLoading() ? "true" : null',
    '[attr.data-pressed]': 'pressed() || undefined',
    '[attr.data-full-width]': 'fullWidth() || undefined',
    '[attr.data-icon-position]': 'computedIconPosition()',
    '[attr.aria-disabled]': 'isEffectivelyDisabled() ? "true" : null',
    '[tabindex]': 'isAnchor && isEffectivelyDisabled() ? "-1" : null',
    '[attr.disabled]': 'isButton && isEffectivelyDisabled() ? "" : null',
  },
})
export class SolarisButtonDirective
  extends SolarisButtonHostBase
  implements AfterViewInit
{
  readonly density = input<SolarisButtonDensity | undefined>(undefined);
  readonly iconPosition = input<SolarisButtonIconPosition>('start');
  readonly appearance = input<SolarisButtonAppearance>('solid');
  readonly pressed = input<boolean | undefined>(undefined);
  readonly color = input<SolarisButtonColor>('neutral');
  readonly shape = input<SolarisButtonShape>('normal');
  readonly radius = input<SolarisButtonRadius>('md');
  readonly size = input<SolarisButtonSize>('md');
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly loadingLabelKey = input<string>();
  readonly loadingLabel = input<string>();
  readonly ariaLabelKey = input<string>();
  readonly ariaLabel = input<string>();
  readonly icon = input<string>();

  protected readonly computedIconPosition = computed<string | null>(() => {
    return this.icon() ? this.iconPosition() : null;
  });

  protected readonly computedAriaPressed = computed<string | null>(() => {
    const pressed = this.pressed();
    if (pressed == null) {
      return null;
    }
    return pressed ? 'true' : 'false';
  });

  private iconRef: ComponentRef<SolarisIconComponent> | null = null;

  constructor() {
    super();
    this.setupButtonHost();

    effect(() => {
      this.syncIcon();
    });

    this.destroyRef.onDestroy(() => {
      this.detachIcon();
    });
  }

  private syncIcon(): void {
    const name = this.icon();
    if (!name || !isPlatformBrowser(this.platformId)) {
      this.detachIcon();
      return;
    }

    if (this.iconRef) {
      this.iconRef.setInput('name', name);
      this.iconRef.changeDetectorRef.detectChanges();
      const el = this.iconRef.location.nativeElement as HTMLElement;
      this.placeIcon(el);
      return;
    }

    const iconRef = createComponent(SolarisIconComponent, {
      environmentInjector: this.environmentInjector,
    });
    iconRef.setInput('name', name);
    iconRef.setInput('decorative', true);
    iconRef.changeDetectorRef.detectChanges();

    const iconEl = iconRef.location.nativeElement as HTMLElement;
    iconEl.classList.add('solaris-button-icon');
    this.iconRef = iconRef;
    this.placeIcon(iconEl);
  }

  private placeIcon(iconEl: HTMLElement): void {
    const host = this.elementRef.nativeElement;
    if (this.iconPosition() === 'end') {
      host.appendChild(iconEl);
    } else {
      host.insertBefore(iconEl, host.firstChild);
    }
  }

  private detachIcon(): void {
    if (!this.iconRef) {
      return;
    }
    this.iconRef.destroy();
    this.iconRef = null;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.handleActionClick(event);
  }

  ngAfterViewInit(): void {
    if (isDevMode() && isPlatformBrowser(this.platformId)) {
      this.warnIfIconOnlyWithoutLabel();
    }
  }

  private warnIfIconOnlyWithoutLabel(): void {
    const el = this.elementRef.nativeElement;
    const hasText = (el.textContent ?? '').trim().length > 0;
    if (hasText) {
      return;
    }
    if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) {
      return;
    }
    console.warn(
      '[Solaris] <button solaris-button> without text content needs an ' +
        'aria-label, or use [solaris-icon-button] for icon-only buttons.',
    );
  }
}
