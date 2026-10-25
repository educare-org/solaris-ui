import {
  Component,
  inject,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  SolarisIconRegistryService,
  SOLARIS_ICONS_CONFIG,
  SOLARIS_SOLID_SVG,
  SOLARIS_DUOTONE_SVG,
  iconElementsToNodes,
  sanitizedInnerToNodes,
  type SolarisIconSvgNode,
  SolarisIconVariant,
  SvgElement,
} from '../../../services/icon';

interface IconViewModel {
  viewBox: string;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number | null;
  linecap: string;
  linejoin: string;
  variant: SolarisIconVariant;
  nodes: SolarisIconSvgNode[];
}

function parseViewBoxSize(viewBox: string): { w: number; h: number } {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
    return { w: parts[2], h: parts[3] };
  }
  return { w: 24, h: 24 };
}

const NO_VARIANT_ICONS = new Set([
  'loader',
  'dot',
  'slash',
  'ellipsis',
  'ellipsis-vertical',
  'grip-vertical',
]);

const VECTOR_EFFECT_ATTRS: Record<string, string> = {
  'vector-effect': 'non-scaling-stroke',
};

@Component({
  selector: 'solaris-icon',
  standalone: true,
  imports: [NgTemplateOutlet],
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
    const elements = icon.elements ?? [];
    if (elements.length === 0) return false;
    return elements.every(
      (el: SvgElement) =>
        'fill' in el &&
        !!(el as { fill?: string }).fill &&
        (el as { fill?: string }).fill !== 'none',
    );
  });

  readonly isFallback = computed(() => {
    const icon = this.definition();
    if (!icon || this.hasOwnColors()) return false;
    if (NO_VARIANT_ICONS.has(icon.name)) return false;
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
    const requested = this.resolvedVariant();
    const variant = NO_VARIANT_ICONS.has(icon.name) ? 'outline' : requested;
    const strokeWidth = this.resolvedStrokeWidth();
    const linecap = icon.strokeLinecap ?? 'round';
    const linejoin = icon.strokeLinejoin ?? 'round';
    const elementNodes = iconElementsToNodes(icon.elements);
    const withVectorEffect =
      this.absoluteStrokeWidth() &&
      variant === 'outline' &&
      !this.hasOwnColors();

    if (this.hasOwnColors()) {
      return {
        viewBox: icon.viewBox,
        fill: icon.fill ?? null,
        stroke: 'none',
        strokeWidth: 0,
        linecap,
        linejoin,
        variant,
        nodes: elementNodes,
      };
    }

    if (variant === 'solid') {
      const solidInner = SOLARIS_SOLID_SVG[icon.name];
      if (solidInner !== undefined) {
        return {
          viewBox: icon.viewBox,
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeWidth,
          linecap,
          linejoin,
          variant,
          nodes: sanitizedInnerToNodes(solidInner),
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
        nodes: this.knockoutNodes(
          icon.name,
          icon.viewBox,
          elementNodes,
          strokeWidth,
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
          nodes: sanitizedInnerToNodes(duotoneInner),
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
        nodes: this.duotoneFallbackNodes(
          icon.viewBox,
          elementNodes,
          strokeWidth,
        ),
      };
    }

    const nodes =
      withVectorEffect && elementNodes.length > 0
        ? [
            {
              tag: 'g' as const,
              attrs: { ...VECTOR_EFFECT_ATTRS },
              children: elementNodes,
            },
          ]
        : elementNodes;
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
      nodes,
    };
  });

  private knockoutNodes(
    name: string,
    viewBox: string,
    lineNodes: SolarisIconSvgNode[],
    strokeWidth: number,
  ): SolarisIconSvgNode[] {
    const { w, h } = parseViewBoxSize(viewBox);
    const rx = Math.round((Math.min(w, h) / 6) * 100) / 100;
    const id = `solaris-${name.replace(/[^a-z0-9-]/gi, '')}-${String(strokeWidth).replace('.', '-')}-mask`;
    const size = { w: String(w), h: String(h), rx: String(rx) };
    // SOLARIS_TOKEN_EXCEPTION: mask constants (#fff visible, #000 hidden) are luminance values required by SVG mask semantics, not theme colors.
    return [
      {
        tag: 'mask',
        attrs: { id },
        children: [
          {
            tag: 'rect',
            attrs: {
              x: '0',
              y: '0',
              width: size.w,
              height: size.h,
              rx: size.rx,
              fill: '#fff',
            },
            children: [],
          },
          {
            tag: 'g',
            attrs: {
              fill: 'none',
              stroke: '#000',
              'stroke-width': String(strokeWidth),
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
            },
            children: lineNodes,
          },
        ],
      },
      {
        tag: 'rect',
        attrs: {
          x: '0',
          y: '0',
          width: size.w,
          height: size.h,
          rx: size.rx,
          fill: 'currentColor',
          mask: `url(#${id})`,
        },
        children: [],
      },
    ];
  }

  private duotoneFallbackNodes(
    viewBox: string,
    lineNodes: SolarisIconSvgNode[],
    strokeWidth: number,
  ): SolarisIconSvgNode[] {
    const { w, h } = parseViewBoxSize(viewBox);
    const rx = Math.round((Math.min(w, h) / 6) * 100) / 100;
    const lineAttrs: Record<string, string> = {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': String(strokeWidth),
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    };
    if (this.absoluteStrokeWidth()) {
      Object.assign(lineAttrs, VECTOR_EFFECT_ATTRS);
    }
    return [
      {
        tag: 'rect',
        attrs: {
          x: '0',
          y: '0',
          width: String(w),
          height: String(h),
          rx: String(rx),
          fill: 'currentColor',
          opacity: '0.2',
        },
        children: [],
      },
      { tag: 'g', attrs: lineAttrs, children: lineNodes },
    ];
  }
}
