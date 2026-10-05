import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { SolarisTranslateService } from '../../../../services/translation';
import { nextIdFor } from '../../../../core';

import {
  SOLARIS_AVATAR_DEFAULT_WORKING_HOURS,
  SolarisAvatarPresenceService,
} from '../service/avatar-presence.service';
import type {
  SolarisAvatarFallback,
  SolarisAvatarRadius,
  SolarisAvatarSize,
  SolarisAvatarStatus,
  SolarisAvatarWorkingHours,
} from '../model/avatar.types';

export const SOLARIS_AVATAR_GENERATIVE_PALETTE_COUNT = 5;

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = Math.trunc(state);
    state = Math.trunc(state + 0x6d2b79f5);
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SolarisAvatarMeshSpot {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  tone: 'a' | 'b' | 'c';
}

function buildMeshSpots(seed: number): SolarisAvatarMeshSpot[] {
  const random = mulberry32(seed);
  const tones: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c'];
  const spots: SolarisAvatarMeshSpot[] = [];
  const baseAngle = random() * Math.PI * 2;
  for (let i = 0; i < tones.length; i++) {
    const angle = baseAngle + (i / tones.length) * Math.PI * 2;
    const distance = 16 + random() * 18;
    spots.push({
      cx: 50 + Math.cos(angle) * distance,
      cy: 50 + Math.sin(angle) * distance,
      rx: 24 + random() * 14,
      ry: 20 + random() * 14,
      rotate: Math.floor(random() * 180),
      tone: tones[i],
    });
  }
  return spots;
}

function buildSealPath(lobes = 7, radius = 36, depth = 0.07): string {
  const steps = 168;
  let path = '';
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = radius * (1 + depth * Math.cos(lobes * angle));
    const x = 50 + Math.cos(angle) * r;
    const y = 50 + Math.sin(angle) * r;
    path += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${path}Z`;
}

@Component({
  selector: 'solaris-avatar',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-avatar',
    '[attr.data-size]': 'size()',
    '[attr.data-radius]': 'radius()',
    '[attr.data-fallback]': 'fallback()',
    '[attr.data-status]': 'visibleStatus()',
    '[attr.data-status-placement]': 'statusPlacement()',
    '[attr.data-loading]': 'loading() || undefined',
    '[attr.data-active]': 'active() || undefined',
    '[attr.data-empty]': 'empty() || undefined',
    '[attr.data-verified]': 'verified() || undefined',
    '[attr.data-off-hours]': 'showOffHoursBadge() || undefined',
    '[attr.data-count-single]': 'isSingleDigit() || undefined',
    '[attr.data-palette]': 'paletteIndex()',
    '[attr.role]': 'hostRole()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class SolarisAvatarComponent {
  readonly src = input<string | undefined>(undefined);
  readonly srcset = input<string | undefined>(undefined);
  readonly alt = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly userId = input<string | undefined>(undefined);

  readonly size = input<SolarisAvatarSize>('md');
  readonly radius = input<SolarisAvatarRadius>('full');
  readonly fallback = input<SolarisAvatarFallback>('generative');

  readonly status = input<SolarisAvatarStatus | undefined>(undefined);
  readonly showStatus = input<boolean>(false);
  readonly workingHours = input<SolarisAvatarWorkingHours | undefined>(
    undefined,
  );
  readonly timezone = input<string | undefined>(undefined);
  readonly showOffHours = input<boolean>(true);
  readonly offHoursOverride = input<boolean | undefined>(undefined);

  readonly count = input<number | undefined>(undefined);
  readonly max = input<number>(99);
  readonly showZero = input<boolean>(false);

  readonly verified = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly active = input<boolean>(false);
  readonly empty = input<boolean>(false);

  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);
  readonly emptyAriaLabel = input<string | undefined>(undefined);
  readonly emptyAriaLabelKey = input<string | undefined>(undefined);
  readonly actionAriaLabel = input<string | undefined>(undefined);
  readonly actionAriaLabelKey = input<string | undefined>(undefined);

  readonly actionClick = output<void>();

  private readonly presenceService = inject(SolarisAvatarPresenceService);
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });

  protected readonly meshId = nextIdFor('solaris-avatar-mesh');
  protected readonly clipId = `${this.meshId}-clip`;
  protected readonly blurId = `${this.meshId}-blur`;
  private readonly imageFailed = signal(false);

  protected readonly initials = computed(() =>
    this.presenceService.resolveInitials(this.name()),
  );

  protected readonly seed = computed(() =>
    this.presenceService.resolveGenerativeSeed(this.userId(), this.name()),
  );

  protected readonly paletteIndex = computed(() =>
    this.presenceService.generatedPaletteIndex(
      this.seed(),
      SOLARIS_AVATAR_GENERATIVE_PALETTE_COUNT,
    ),
  );

  protected readonly meshSpots = computed(() => buildMeshSpots(this.seed()));

  protected readonly sealPath = computed(() => buildSealPath());

  protected readonly showImage = computed(
    () => !this.empty() && !this.imageFailed() && !!this.src(),
  );

  protected readonly showInitials = computed(
    () =>
      !this.empty() &&
      (this.fallback() === 'initials' || this.fallback() === 'generative'),
  );

  protected readonly showGenerativeArt = computed(
    () => !this.empty() && this.fallback() === 'generative',
  );

  protected readonly showIconFallback = computed(
    () => !this.empty() && this.fallback() === 'icon',
  );

  protected readonly isOffHours = computed(() => {
    const override = this.offHoursOverride();
    if (override !== undefined) return override;
    return this.presenceService.isOffHours(
      new Date(),
      this.workingHours() ?? SOLARIS_AVATAR_DEFAULT_WORKING_HOURS,
      this.timezone(),
    );
  });

  protected readonly visibleStatus = computed(() => {
    if (!this.showStatus()) return undefined;
    return this.status() ?? undefined;
  });

  protected readonly showOffHoursBadge = computed(
    () =>
      this.showStatus() &&
      this.status() !== undefined &&
      this.showOffHours() &&
      this.isOffHours(),
  );

  protected readonly statusPlacement = computed(() =>
    this.showStatus() && this.status() !== undefined && this.verified()
      ? 'bottom-left'
      : 'bottom-right',
  );

  protected readonly displayCount = computed(() => {
    const count = this.count();
    if (count === undefined || count === null) return null;
    const max = this.max() <= 0 ? 99 : this.max();
    return count > max ? `${max}+` : `${count}`;
  });

  protected readonly isCountCapped = computed(() => {
    const count = this.count();
    if (count === undefined || count === null) return false;
    const max = this.max() <= 0 ? 99 : this.max();
    return count > max;
  });

  protected readonly showCount = computed(() => {
    if (this.displayCount() === null) return false;
    return this.count() !== 0 || this.showZero();
  });

  protected readonly isSingleDigit = computed(
    () => (this.displayCount()?.length ?? 0) === 1,
  );

  protected readonly countTitle = computed(() =>
    this.isCountCapped() ? `${this.count()}` : undefined,
  );

  protected readonly isInteractive = computed(
    () =>
      this.actionAriaLabel() !== undefined ||
      this.actionAriaLabelKey() !== undefined,
  );

  protected readonly hostRole = computed(() =>
    this.isInteractive() ? undefined : 'img',
  );

  private translateKey(key: string | undefined): string | undefined {
    if (!key) return undefined;
    if (this.translateService) return this.translateService.translate(key);
    return key;
  }

  protected readonly resolvedActionLabel = computed(
    () =>
      this.actionAriaLabel() ??
      this.translateKey(this.actionAriaLabelKey()) ??
      this.name() ??
      undefined,
  );

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.isInteractive()) return undefined;
    const direct = this.ariaLabel() ?? this.translateKey(this.ariaLabelKey());
    if (direct) return direct;
    if (this.empty()) {
      return (
        this.emptyAriaLabel() ??
        this.translateKey(this.emptyAriaLabelKey()) ??
        undefined
      );
    }
    const parts: string[] = [];
    const identity = this.name() ?? this.alt();
    if (identity) parts.push(identity);
    const status = this.visibleStatus();
    if (status && this.translateService) {
      parts.push(
        this.translateService.translate(`solaris.avatar.status.${status}`),
      );
    } else if (status) {
      parts.push(status);
    }
    if (this.showOffHoursBadge() && this.translateService) {
      parts.push(this.translateService.translate('solaris.avatar.offHours'));
    }
    if (this.verified() && this.translateService) {
      parts.push(this.translateService.translate('solaris.avatar.verified'));
    }
    if (this.showCount() && this.translateService) {
      parts.push(
        this.translateService.translate('solaris.avatar.notifications', {
          count: this.isCountCapped() ? `${this.count()}` : `${this.count()}`,
        }),
      );
    }
    return parts.length > 0 ? parts.join(', ') : undefined;
  });

  protected onImageError(): void {
    this.imageFailed.set(true);
  }

  protected onActionClick(): void {
    this.actionClick.emit();
  }
}
