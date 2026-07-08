import { Component, inject, input, computed } from '@angular/core';

import { SolarisIconRegistryService } from '../service/solaris-icon-registry.service';

@Component({
  standalone: true,
  selector: 'solaris-icon',
  templateUrl: './solaris-icon.component.html',
})
export class SolarisIconComponent {
  private readonly registry = inject(SolarisIconRegistryService);

  readonly name = input.required<string>();
  readonly decorative = input(false);
  readonly ariaLabel = input<string>();

  protected readonly definition = computed(() =>
    this.registry.getIcon(this.name()),
  );

  protected readonly isHidden = computed(() => this.decorative());
  protected readonly accessibleLabel = computed(() => this.ariaLabel() ?? '');
  protected readonly hasSemanticLabel = computed(
    () => !this.decorative() && !!this.ariaLabel(),
  );
}
