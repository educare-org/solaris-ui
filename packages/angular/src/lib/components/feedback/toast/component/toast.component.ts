import {
  Component,
  input,
  output,
  inject,
  computed,
  effect,
  signal,
  ChangeDetectionStrategy,
  DestroyRef,
  HostListener,
} from '@angular/core';

import type {
  SolarisToastAction,
  SolarisToastEntry,
} from '../model/toast.types';
import { SolarisTranslateService } from '../../../../services/translation';
import { SolarisButtonDirective } from '../../../actions/button';
import { SolarisToastService } from '../service/toast.service';
import { SolarisIconComponent } from '../../../icon';

@Component({
  selector: 'solaris-toast',
  standalone: true,
  imports: [SolarisIconComponent, SolarisButtonDirective],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'hostRole()',
    '[attr.aria-live]': 'hostAriaLive()',
    '[attr.data-variant]': 'hostDataVariant()',
    '[attr.data-icon-size]': 'hostDataIconSize()',
    '[attr.data-appearance]': 'hostDataAppearance()',
    '[attr.data-media-shape]': 'hostDataMediaShape()',
    '[attr.data-actions-align]': 'hostDataActionsAlign()',
    '[attr.data-center-content]': 'centerContent()',
    '[attr.data-actions-no-desc]': 'hasActionsNoDescription()',
  },
})
export class SolarisToastComponent {
  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly toastService = inject(SolarisToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly entry = input.required<SolarisToastEntry>();
  readonly dismiss = output<string>();

  protected readonly hostDataVariant = computed(
    () => this.entry().resolvedVariant,
  );
  protected readonly hostDataAppearance = computed(
    () => this.entry().resolvedAppearance,
  );
  protected readonly hostRole = computed(() => this.entry().resolvedRole);
  protected readonly hostAriaLive = computed(() => {
    const live = this.entry().resolvedAriaLive;
    return live === 'off' ? null : live;
  });
  protected readonly hostDataIconSize = computed(
    () => this.entry().resolvedIconSize,
  );
  protected readonly hostDataMediaShape = computed(
    () => this.entry().resolvedMediaShape,
  );
  protected readonly hostDataActionsAlign = computed(
    () => this.entry().resolvedActionsAlign,
  );

  protected readonly expanded = signal(false);
  protected readonly isExpandable = computed(() => {
    const e = this.entry();
    return e.resolvedExpandable && !!e.resolvedDescription;
  });

  protected toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  protected readonly expandButtonLabel = computed(() => {
    const e = this.entry();
    if (this.expanded()) {
      return (
        e.resolvedCollapseLabel || this.translate('solaris.toast.collapse')
      );
    }
    return e.resolvedExpandLabel || this.translate('solaris.toast.expand');
  });

  protected readonly isTruncated = computed(
    () => this.isExpandable() && !this.expanded(),
  );

  protected readonly countdownPercent = signal(100);
  protected readonly remainingSeconds = signal(0);

  private countdownTotalMs = 0;
  private countdownStartedAt = 0;
  private countdownRemainingMs = 0;
  private countdownStarted = false;
  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly isPaused = signal(false);
  private readonly isUserPaused = signal(false);

  protected readonly showProgressBar = computed(() => {
    const e = this.entry();
    if (e.resolvedProgress !== undefined && e.resolvedProgress !== null) {
      return true;
    }
    const showCountdown = this.shouldShowCountdown();
    return (
      showCountdown &&
      !e.resolvedPersistent &&
      e.resolvedDuration > 0 &&
      e.resolvedDuration < Infinity &&
      (e.resolvedCountdownMode === 'bar' || e.resolvedCountdownMode === 'both')
    );
  });

  protected readonly showCountdownText = computed(() => {
    const e = this.entry();
    const showCountdown = this.shouldShowCountdown();
    return (
      showCountdown &&
      !e.resolvedPersistent &&
      e.resolvedDuration > 0 &&
      e.resolvedDuration < Infinity &&
      (e.resolvedCountdownMode === 'text' || e.resolvedCountdownMode === 'both')
    );
  });

  private shouldShowCountdown(): boolean {
    const e = this.entry();
    return e.resolvedShowCountdown || e.resolvedShowProgress;
  }

  protected readonly progressValue = computed(() => {
    const e = this.entry();
    if (e.resolvedProgress !== undefined && e.resolvedProgress !== null) {
      return e.resolvedProgress;
    }
    return this.countdownPercent();
  });

  protected readonly isProcessProgress = computed(() => {
    const e = this.entry();
    return e.resolvedProgress !== undefined && e.resolvedProgress !== null;
  });

  protected readonly countdownText = computed(() => {
    const secs = this.remainingSeconds();
    if (secs <= 0) return '';
    return this.translate('solaris.toast.closesIn', { seconds: String(secs) });
  });

  protected readonly showTitle = computed(() => !!this.entry().resolvedTitle);
  protected readonly showDescription = computed(
    () => !!this.entry().resolvedDescription,
  );
  protected readonly showIcon = computed(() => {
    const e = this.entry();
    return e.resolvedIcon !== undefined && e.resolvedIcon !== null;
  });
  protected readonly showActions = computed(() => {
    const actions = this.entry().resolvedActions;
    return actions && actions.length > 0;
  });
  protected readonly showClose = computed(() => this.entry().resolvedCloseable);

  protected readonly centerContent = computed(
    () => !this.showDescription() && !this.showActions(),
  );

  protected readonly hasActionsNoDescription = computed(
    () => this.showActions() && !this.showDescription(),
  );

  constructor() {
    effect(() => {
      const e = this.entry();
      if (
        e.resolvedPersistent ||
        e.resolvedDuration <= 0 ||
        e.resolvedDuration >= Infinity
      ) {
        this.stopCountdown();
      } else {
        this.startCountdown(e.resolvedDuration);
      }
    });

    effect(() => {
      this.expanded.set(this.entry().resolvedDefaultExpanded);
    });

    this.destroyRef.onDestroy(() => {
      this.stopCountdown();
    });
  }

  private startCountdown(duration: number): void {
    this.stopCountdown();
    if (duration <= 0 || duration >= Infinity) return;

    this.countdownStarted = true;
    this.countdownTotalMs = duration;
    this.countdownStartedAt = Date.now();
    this.countdownRemainingMs = duration;
    this.countdownPercent.set(100);
    this.remainingSeconds.set(Math.ceil(duration / 1000));

    this.countdownIntervalId = setInterval(() => this.tickCountdown(), 50);
  }

  private stopCountdown(): void {
    this.clearCountdownInterval();
    this.countdownStarted = false;
  }

  private clearCountdownInterval(): void {
    if (this.countdownIntervalId !== null) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }

  private tickCountdown(): void {
    if (this.isPaused()) return;

    const elapsed = Date.now() - this.countdownStartedAt;
    const remaining = Math.max(0, this.countdownRemainingMs - elapsed);

    this.countdownPercent.set((remaining / this.countdownTotalMs) * 100);
    this.remainingSeconds.set(Math.ceil(remaining / 1000));

    if (remaining <= 0) {
      this.stopCountdown();
      this.handleDismiss();
    }
  }

  private captureCountdownRemaining(): void {
    if (!this.countdownStarted) return;
    const elapsed = Date.now() - this.countdownStartedAt;
    this.countdownRemainingMs = Math.max(
      0,
      this.countdownRemainingMs - elapsed,
    );
    this.clearCountdownInterval();
  }

  protected pause(): void {
    if (!this.countdownStarted || this.isPaused()) return;
    this.isPaused.set(true);
    this.captureCountdownRemaining();
  }

  protected resume(): void {
    if (!this.countdownStarted || !this.isPaused()) return;
    if (this.isUserPaused()) return;
    this.isPaused.set(false);
    this.countdownStartedAt = Date.now();
    this.countdownIntervalId = setInterval(() => this.tickCountdown(), 50);
  }

  protected togglePause(): void {
    if (this.isUserPaused()) {
      this.isUserPaused.set(false);
      this.resume();
    } else {
      this.isUserPaused.set(true);
      this.pause();
    }
  }

  protected readonly pauseButtonLabel = computed(() => {
    if (this.isUserPaused()) {
      return this.translate('solaris.toast.continue');
    }
    return this.translate('solaris.toast.pause');
  });

  @HostListener('mouseenter')
  protected onMouseEnter(): void {
    if (this.toastService.configSignal().pauseOnHover) {
      this.pause();
    }
  }

  @HostListener('mouseleave')
  protected onMouseLeave(): void {
    if (this.toastService.configSignal().pauseOnHover) {
      this.resume();
    }
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    if (this.toastService.configSignal().pauseOnFocus) {
      this.pause();
    }
  }

  @HostListener('focusout')
  protected onFocusOut(): void {
    if (this.toastService.configSignal().pauseOnFocus) {
      this.resume();
    }
  }

  protected handleDismiss(): void {
    this.stopCountdown();
    this.dismiss.emit(this.entry().id);
  }

  protected handleActionClick(action: SolarisToastAction): void {
    const ref = {
      id: this.entry().id,
      dismiss: () => this.handleDismiss(),
      update: (patch: never) => {
        this.toastService.update(this.entry().id, patch);
      },
    };
    action.action(ref);
    if (action.closeOnClick) {
      this.handleDismiss();
    }
  }

  protected translate(key: string, params?: Record<string, string>): string {
    if (this.translateService) {
      return this.translateService.translate(key, params);
    }

    return key;
  }
}
