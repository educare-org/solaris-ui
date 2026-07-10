import { Component, inject, input, computed } from '@angular/core';

import { SolarisIconRegistryService } from '../../../services/icon';

@Component({
  selector: 'solaris-icon',
  standalone: true,
  templateUrl: './solaris-icon.component.html',
})
export class SolarisIconComponent {
  private readonly registry = inject(SolarisIconRegistryService);

  readonly name = input.required<string>();
  readonly ariaLabel = input<string>();
  readonly decorative = input(false);

  protected readonly definition = computed(() =>
    this.registry.getIcon(this.name()),
  );

  protected readonly isHidden = computed(() => this.decorative());
  protected readonly accessibleLabel = computed(() => this.ariaLabel() ?? '');
  protected readonly hasSemanticLabel = computed(
    () => !this.decorative() && !!this.ariaLabel(),
  );
}
