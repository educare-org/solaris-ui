import {
  Component,
  inject,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { SolarisIconRegistryService } from '../../../services/icon';
import { SOLARIS_ICONS_CONFIG } from '../../../services/icon';
import type { SolarisIconVariant, SvgElement } from '../../../services/icon';
import { SOLARIS_SOLID_SVG } from '../../../services/icon/icons/generated/solaris-icons-solid-svg';
import { SOLARIS_DUOTONE_SVG } from '../../../services/icon/icons/generated/solaris-icons-duotone-svg';
import { iconElementsToInner } from '../../../services/icon/service/solaris-icon-serializer';
import { sanitizeIconSvgInner } from '../../../services/icon/service/solaris-icon-sanitizer';

interface IconViewModel {
  viewBox: string;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number | null;
  linecap: string;
  linejoin: string;
  variant: SolarisIconVariant;
  safeInner: SafeHtml;
}

function parseViewBoxSize(viewBox: string): { w: number; h: number } {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
    return { w: parts[2], h: parts[3] };
  }
  return { w: 24, h: 24 };
}

@Component({
  selector: 'solaris-icon',
  standalone: true,
  templateUrl: './solaris-icon.component.html',
  styleUrls: ['./solaris-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': 'sizeCss()',
    '[style.height]': 'sizeCss()',
    '[attr.data-variant]': 'resolvedVariant()',
  },
})
export class SolarisIconComponent {
  private readonly registry = inject(SolarisIconRegistryService);
  private readonly config = inject(SOLARIS_ICONS_CONFIG, { optional: true });
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly variant = input<SolarisIconVariant>();
  readonly size = input<number | string>();
  readonly strokeWidth = input<number>();
  readonly absoluteStrokeWidth = input(false);
  readonly ariaLabel = input<string>();
  readonly decorative = input(true);
  readonly inheritColor = input<boolean>(true);

  protected readonly definition = computed(() =>
    this.registry.getIcon(this.name()),
  );

  readonly resolvedVariant = computed<SolarisIconVariant>(
    () => this.variant() ?? this.config?.defaultVariant ?? 'outline',
  );

  protected readonly sizeCss = computed<string | null>(() => {
    const size = this.size() ?? this.config?.defaultSize ?? null;
    if (size === null || size === undefined) return null;
    return typeof size === 'number' ? `${size}px` : size;
  });

  protected readonly resolvedStrokeWidth = computed(
    () =>
      this.strokeWidth() ??
      this.config?.defaultStrokeWidth ??
      this.definition()?.strokeWidth ??
      2,
  );

  protected readonly hasOwnColors = computed(() => {
    const icon = this.definition();
    if (!icon) return false;
    if (icon.fill && icon.fill !== 'none') {
      return true;
    }
    return icon.elements.some((el: SvgElement) => 'fill' in el && !!el.fill);
  });

  readonly isFallback = computed(() => {
    const icon = this.definition();
    if (!icon || this.hasOwnColors()) return false;
    const requested = this.resolvedVariant();
    if (requested === 'outline') return false;
    if (requested === 'solid') return !(icon.name in SOLARIS_SOLID_SVG);
    return !(icon.name in SOLARIS_DUOTONE_SVG);
  });

  protected readonly isHidden = computed(() => this.decorative());
  protected readonly accessibleLabel = computed(() => this.ariaLabel() ?? '');
  protected readonly hasSemanticLabel = computed(
    () => !this.decorative() && !!this.ariaLabel(),
  );

  protected readonly viewModel = computed<IconViewModel | undefined>(() => {
    const icon = this.definition();
    if (!icon) return undefined;
    const variant = this.resolvedVariant();
    const strokeWidth = this.resolvedStrokeWidth();
    const linecap = icon.strokeLinecap ?? 'round';
    const linejoin = icon.strokeLinejoin ?? 'round';
    const inner = iconElementsToInner(icon.elements);
    const vectorEffect = this.absoluteStrokeWidth()
      ? ' vector-effect="non-scaling-stroke"'
      : '';

    if (this.hasOwnColors()) {
      return {
        viewBox: icon.viewBox,
        fill: icon.fill ?? null,
        stroke: 'none',
        strokeWidth: 0,
        linecap,
        linejoin,
        variant,
        // SECURITY_EXCEPTION: inner markup is allowlist-sanitized before trust; built-ins at build, extraIcons at registration.
        safeInner: this.sanitizer.bypassSecurityTrustHtml(
          sanitizeIconSvgInner(inner),
        ),
      };
    }

    if (variant === 'solid') {
      const solidInner = SOLARIS_SOLID_SVG[icon.name];
      if (solidInner !== undefined) {
        return {
          viewBox: icon.viewBox,
          fill: 'currentColor',
          stroke: 'none',
          strokeWidth: 0,
          linecap,
          linejoin,
          variant,
          // SECURITY_EXCEPTION: inner markup is allowlist-sanitized before trust; built-ins at build, extraIcons at registration.
          safeInner: this.sanitizer.bypassSecurityTrustHtml(
            sanitizeIconSvgInner(solidInner),
          ),
        };
      }
      return {
        viewBox: icon.viewBox,
        fill: null,
        stroke: null,
        strokeWidth: null,
        linecap,
        linejoin,
        variant,
        // SECURITY_EXCEPTION: inner markup is allowlist-sanitized before trust; built-ins at build, extraIcons at registration.
        safeInner: this.sanitizer.bypassSecurityTrustHtml(
          sanitizeIconSvgInner(
            this.knockoutInner(icon.name, icon.viewBox, inner, strokeWidth),
          ),
        ),
      };
    }

    if (variant === 'duotone') {
      const duotoneInner = SOLARIS_DUOTONE_SVG[icon.name];
      if (duotoneInner !== undefined) {
        return {
          viewBox: icon.viewBox,
          fill: null,
          stroke: null,
          strokeWidth: null,
          linecap,
          linejoin,
          variant,
          // SECURITY_EXCEPTION: inner markup is allowlist-sanitized before trust; built-ins at build, extraIcons at registration.
          safeInner: this.sanitizer.bypassSecurityTrustHtml(
            sanitizeIconSvgInner(
              `<g fill="currentColor" opacity="0.25">${duotoneInner}</g>` +
                `<g fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="${linecap}" stroke-linejoin="${linejoin}"${vectorEffect}>${duotoneInner}</g>`,
            ),
          ),
        };
      }
      return {
        viewBox: icon.viewBox,
        fill: null,
        stroke: null,
        strokeWidth: null,
        linecap,
        linejoin,
        variant,
        // SECURITY_EXCEPTION: inner markup is allowlist-sanitized before trust; built-ins at build, extraIcons at registration.
        safeInner: this.sanitizer.bypassSecurityTrustHtml(
          sanitizeIconSvgInner(
            this.duotoneInner(icon.viewBox, inner, strokeWidth, vectorEffect),
          ),
        ),
      };
    }

    const wrapped =
      vectorEffect !== '' ? `<g${vectorEffect}>${inner}</g>` : inner;
    const stroke = this.inheritColor()
      ? (icon.stroke ?? 'currentColor')
      : 'none';
    return {
      viewBox: icon.viewBox,
      fill: icon.fill ?? 'none',
      stroke,
      strokeWidth: stroke === 'none' ? 0 : strokeWidth,
      linecap,
      linejoin,
      variant,
      // SECURITY_EXCEPTION: inner markup is allowlist-sanitized before trust; built-ins at build, extraIcons at registration.
      safeInner: this.sanitizer.bypassSecurityTrustHtml(
        sanitizeIconSvgInner(wrapped),
      ),
    };
  });

  private knockoutInner(
    name: string,
    viewBox: string,
    inner: string,
    strokeWidth: number,
  ): string {
    const { w, h } = parseViewBoxSize(viewBox);
    const rx = Math.round(Math.min(w, h) * 0.25 * 100) / 100;
    const id = `solaris-${name.replace(/[^a-z0-9-]/gi, '')}-${String(strokeWidth).replace('.', '-')}-mask`;
    // SOLARIS_TOKEN_EXCEPTION: mask constants (#fff visible, #000 hidden) are luminance values required by SVG mask semantics, not theme colors.
    return (
      `<mask id="${id}"><rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="#fff"/>` +
      `<g fill="none" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</g></mask>` +
      `<rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="currentColor" mask="url(#${id})"/>`
    );
  }

  private duotoneInner(
    viewBox: string,
    inner: string,
    strokeWidth: number,
    vectorEffect: string,
  ): string {
    const { w, h } = parseViewBoxSize(viewBox);
    const rx = Math.round(Math.min(w, h) * 0.25 * 100) / 100;
    return (
      `<rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="currentColor" opacity="0.2"/>` +
      `<g fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${vectorEffect}>${inner}</g>`
    );
  }
}
