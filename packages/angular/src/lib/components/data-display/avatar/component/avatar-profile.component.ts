// SECURITY_EXCEPTION_FILE: nativeElement required as ResizeObserver/MutationObserver target to detect title/subtitle overflow for the automatic title tooltip. Standard DOM API with no Angular abstraction; SSR-safe via isPlatformBrowser guard and typeof checks.
// SECURITY_EXCEPTION_FILE: nativeElement.querySelector('.solaris-avatar-profile__title, .solaris-avatar-profile__subtitle') with read-only scrollWidth/clientWidth/textContent required to measure truncation overflow for the accessible title. Text is only read (never written via innerHTML, no XSS risk); SSR-safe via isPlatformBrowser guard.
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { SolarisTranslateService } from '../../../../services/translation';

import { SolarisBadgeComponent } from '../../badge/component/badge.component';
import { SolarisAvatarComponent } from './avatar.component';
import type {
  SolarisAvatarSize,
  SolarisAvatarStatus,
} from '../model/avatar.types';

@Component({
  selector: 'solaris-avatar-profile',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisAvatarComponent, SolarisBadgeComponent],
  templateUrl: './avatar-profile.component.html',
  styleUrls: ['./avatar-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-avatar-profile',
    '[attr.data-size]': 'size()',
    '[attr.data-compact]': 'compact() || undefined',
    '[attr.role]': 'hostRole()',
    '[attr.aria-label]': 'hostAriaLabel()',
  },
})
export class SolarisAvatarProfileComponent implements AfterViewInit, OnDestroy {
  readonly src = input<string | undefined>(undefined);
  readonly srcset = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly userId = input<string | undefined>(undefined);
  readonly size = input<SolarisAvatarSize>('md');

  readonly title = input<string | undefined>(undefined);
  readonly titleKey = input<string | undefined>(undefined);
  readonly subtitle = input<string | undefined>(undefined);
  readonly subtitleKey = input<string | undefined>(undefined);
  readonly badgeText = input<string | undefined>(undefined);
  readonly badgeTextKey = input<string | undefined>(undefined);

  readonly count = input<number | undefined>(undefined);
  readonly max = input<number>(99);
  readonly showZero = input<boolean>(false);
  readonly status = input<SolarisAvatarStatus | undefined>(undefined);
  readonly showStatus = input<boolean>(false);
  readonly verified = input<boolean>(false);
  readonly compact = input<boolean>(false);

  readonly href = input<string | undefined>(undefined);
  readonly target = input<string | undefined>(undefined);
  readonly rel = input<string | undefined>(undefined);
  readonly actionAriaLabel = input<string | undefined>(undefined);
  readonly actionAriaLabelKey = input<string | undefined>(undefined);

  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly profileClick = output<void>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly resolvedTitle = computed(
    () =>
      this.title() ??
      (this.titleKey() && this.translateService
        ? this.translateService.translate(this.titleKey() as string)
        : undefined) ??
      this.name(),
  );

  protected readonly resolvedSubtitle = computed(
    () =>
      this.subtitle() ??
      (this.subtitleKey() && this.translateService
        ? this.translateService.translate(this.subtitleKey() as string)
        : undefined),
  );

  protected readonly resolvedBadgeText = computed(
    () =>
      this.badgeText() ??
      (this.badgeTextKey() && this.translateService
        ? this.translateService.translate(this.badgeTextKey() as string)
        : undefined),
  );

  protected readonly resolvedAriaLabel = computed(
    () =>
      this.ariaLabel() ??
      (this.ariaLabelKey() && this.translateService
        ? this.translateService.translate(this.ariaLabelKey() as string)
        : undefined) ??
      this.resolvedTitle(),
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
      this.resolvedTitle(),
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

  private readonly titleOverflow = signal<string | undefined>(undefined);
  private readonly subtitleOverflow = signal<string | undefined>(undefined);

  protected readonly titleTooltip = computed(() => this.titleOverflow());
  protected readonly subtitleTooltip = computed(() => this.subtitleOverflow());

  private resizeObserver: ResizeObserver | null = null;
  private contentObserver: MutationObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.measureOverflow();
    this.setupOverflowObservers();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
  }

  protected onIdentityClick(): void {
    this.profileClick.emit();
  }

  private setupOverflowObservers(): void {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => this.measureOverflow());
      });
      this.resizeObserver.observe(nativeEl);
    }
    if (typeof MutationObserver !== 'undefined') {
      this.contentObserver = new MutationObserver(() => {
        this.ngZone.run(() => this.measureOverflow());
      });
      this.contentObserver.observe(nativeEl, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  private measureOverflow(): void {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    this.titleOverflow.set(
      this.overflowText(nativeEl, '.solaris-avatar-profile__title'),
    );
    this.subtitleOverflow.set(
      this.overflowText(nativeEl, '.solaris-avatar-profile__subtitle'),
    );
  }

  private overflowText(
    root: HTMLElement,
    selector: string,
  ): string | undefined {
    const target = root.querySelector(selector) as HTMLElement | null;
    if (!target) return undefined;
    const isOverflowing = target.scrollWidth > target.clientWidth + 1;
    return isOverflowing ? target.textContent?.trim() || undefined : undefined;
  }
}
