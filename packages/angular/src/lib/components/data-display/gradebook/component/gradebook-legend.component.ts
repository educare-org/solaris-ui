import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisBadgeComponent } from '../../badge';

import type { SolarisGradebookLegendItem } from '../model/gradebook.types';

@Component({
  selector: 'solaris-gradebook-legend',
  standalone: true,
  imports: [SolarisBadgeComponent],
  templateUrl: './gradebook-legend.component.html',
  styleUrls: ['./gradebook-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-gradebook-legend',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class SolarisGradebookLegendComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  readonly items = input<readonly SolarisGradebookLegendItem[]>([]);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  protected resolvedAriaLabel(): string | undefined {
    if (this.ariaLabel()) {
      return this.ariaLabel();
    }
    const key = this.ariaLabelKey();
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return key;
  }

  protected resolveItemLabel(item: SolarisGradebookLegendItem): string {
    if (item.label !== undefined) {
      return item.label;
    }
    const key = item.labelKey;
    if (key && this.translateService) {
      const translated = this.translateService.translate(key);
      if (translated !== key) {
        return translated;
      }
    }
    return key ?? '';
  }
}
