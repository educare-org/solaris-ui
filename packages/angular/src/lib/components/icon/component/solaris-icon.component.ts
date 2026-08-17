import {
  Component,
  inject,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SolarisIconRegistryService } from '../../../services/icon';
import type { SvgElement } from '../../../services/icon';

@Component({
  selector: 'solaris-icon',
  standalone: true,
  templateUrl: './solaris-icon.component.html',
  styleUrls: ['./solaris-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolarisIconComponent {
  private readonly registry = inject(SolarisIconRegistryService);

  readonly name = input.required<string>();
  readonly ariaLabel = input<string>();
  readonly decorative = input(false);
  readonly inheritColor = input<boolean>(true);

  protected readonly definition = computed(() =>
    this.registry.getIcon(this.name()),
  );

  protected readonly isHidden = computed(() => this.decorative());
  protected readonly accessibleLabel = computed(() => this.ariaLabel() ?? '');
  protected readonly hasSemanticLabel = computed(
    () => !this.decorative() && !!this.ariaLabel(),
  );

  protected readonly hasOwnColors = computed(() => {
    const icon = this.definition();
    if (!icon) return false;
    if (icon.fill && icon.fill !== 'none') {
      return true;
    }
    return icon.elements.some((el: SvgElement) => 'fill' in el && !!el.fill);
  });

  protected readonly resolvedStroke = computed(() => {
    if (!this.inheritColor()) return 'none';
    const icon = this.definition();
    if (icon?.stroke) return icon.stroke;
    if (this.hasOwnColors()) return 'none';
    return 'currentColor';
  });

  protected readonly resolvedStrokeWidth = computed(() => {
    if (this.resolvedStroke() === 'none') return 0;
    return this.definition()?.strokeWidth ?? 2;
  });
}
