import { NgTemplateOutlet } from '@angular/common';
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

const SOLARIS_AVATAR_GROUP_BADGE_DEFAULT_MAX = 3;

@Component({
  selector: 'solaris-avatar-group-badge',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisAvatarComponent],
  templateUrl: './avatar-group-badge.component.html',
  styleUrls: ['./avatar-group-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-avatar-group-badge',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'hostRole()',
    '[attr.aria-label]': 'hostAriaLabel()',
  },
})
export class SolarisAvatarGroupBadgeComponent {
  readonly users = input<readonly SolarisAvatarGroupUser[]>([]);
  readonly max = input<number>(SOLARIS_AVATAR_GROUP_BADGE_DEFAULT_MAX);
  readonly size = input<SolarisAvatarSize>('sm');
  readonly radius = input<SolarisAvatarRadius>('full');

  readonly label = input<string | undefined>(undefined);
  readonly labelKey = input<string | undefined>(undefined);

  readonly href = input<string | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);
  readonly rel = input<string | undefined>(undefined);
  readonly actionAriaLabel = input<string | undefined>(undefined);
  readonly actionAriaLabelKey = input<string | undefined>(undefined);

  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly badgeClick = output<void>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly visibleUsers = computed(() => {
    const max =
      this.max() <= 0 ? SOLARIS_AVATAR_GROUP_BADGE_DEFAULT_MAX : this.max();
    return this.users().slice(0, max);
  });

  protected readonly overflowCount = computed(() => {
    const max =
      this.max() <= 0 ? SOLARIS_AVATAR_GROUP_BADGE_DEFAULT_MAX : this.max();
    return Math.max(0, this.users().length - max);
  });

  protected readonly resolvedLabel = computed(
    () =>
      this.label() ??
      (this.labelKey() && this.translateService
        ? this.translateService.translate(this.labelKey() as string)
        : undefined),
  );

  protected readonly resolvedOverflowLabel = computed(() => {
    if (this.overflowCount() <= 0) return undefined;
    if (this.translateService) {
      return this.translateService.translate('solaris.avatar.overflowMore', {
        count: `${this.overflowCount()}`,
      });
    }
    return `+${this.overflowCount()}`;
  });

  protected readonly resolvedAriaLabel = computed(
    () =>
      this.ariaLabel() ??
      (this.ariaLabelKey() && this.translateService
        ? this.translateService.translate(this.ariaLabelKey() as string)
        : undefined) ??
      this.resolvedLabel() ??
      this.resolvedOverflowLabel(),
  );

  protected readonly isLink = computed(() => this.href() !== undefined);

  protected readonly isButton = computed(
    () =>
      !this.isLink() &&
      (this.actionAriaLabel() !== undefined ||
        this.actionAriaLabelKey() !== undefined),
  );

  protected readonly isInteractive = computed(
    () => this.isLink() || this.isButton(),
  );

  protected readonly resolvedActionLabel = computed(
    () =>
      this.actionAriaLabel() ??
      (this.actionAriaLabelKey() && this.translateService
        ? this.translateService.translate(this.actionAriaLabelKey() as string)
        : undefined) ??
      this.resolvedAriaLabel(),
  );

  protected readonly hostRole = computed(() =>
    this.isInteractive() ? undefined : 'group',
  );

  protected readonly hostAriaLabel = computed(() =>
    this.isInteractive() ? undefined : this.resolvedAriaLabel(),
  );

  protected readonly linkRel = computed(() => {
    if (this.rel() !== undefined) return this.rel();
    if (this.target() === '_blank') return 'noopener noreferrer';
    return undefined;
  });

  protected onBadgeClick(): void {
    this.badgeClick.emit();
  }
}
