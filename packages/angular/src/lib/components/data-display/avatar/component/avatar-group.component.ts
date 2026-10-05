import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

import { SolarisAvatarComponent } from './avatar.component';
import type {
  SolarisAvatarGroupUser,
  SolarisAvatarRadius,
  SolarisAvatarSize,
} from '../model/avatar.types';

@Component({
  selector: 'solaris-avatar-group',
  standalone: true,
  imports: [SolarisAvatarComponent],
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-avatar-group',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.role]': '"group"',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[style.--solaris-avatar-group-overlap]': 'overlapStyle()',
  },
})
export class SolarisAvatarGroupComponent {
  readonly users = input<readonly SolarisAvatarGroupUser[]>([]);
  readonly max = input<number>(4);
  readonly size = input<SolarisAvatarSize>('md');
  readonly radius = input<SolarisAvatarRadius>('full');
  readonly overlap = input<number | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly overflowClick = output<void>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly visibleUsers = computed(() => {
    const max = this.max() <= 0 ? 4 : this.max();
    return this.users().slice(0, max);
  });

  protected readonly overflowCount = computed(() => {
    const max = this.max() <= 0 ? 4 : this.max();
    return Math.max(0, this.users().length - max);
  });

  protected readonly overflowLabel = computed(() => {
    const count = this.overflowCount();
    const direct =
      this.ariaLabel() ??
      (this.ariaLabelKey() && this.translateService
        ? this.translateService.translate(this.ariaLabelKey() as string)
        : undefined);
    if (direct) return direct;
    if (this.translateService) {
      return this.translateService.translate('solaris.avatar.overflowMore', {
        count: `${count}`,
      });
    }
    return `+${count}`;
  });

  protected readonly resolvedAriaLabel = computed(
    () =>
      this.ariaLabel() ??
      (this.ariaLabelKey() && this.translateService
        ? this.translateService.translate(this.ariaLabelKey() as string)
        : undefined),
  );

  protected readonly overlapStyle = computed(() => {
    const overlap = this.overlap();
    return overlap === undefined ? undefined : `${overlap}px`;
  });

  protected onOverflowClick(): void {
    this.overflowClick.emit();
  }
}
