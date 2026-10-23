import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
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
import { SolarisTooltipDirective } from '../../../interaction/tooltip';

import { SolarisAvatarComponent } from './avatar.component';
import type {
  SolarisAvatarGroupMemberEvent,
  SolarisAvatarGroupUser,
  SolarisAvatarRadius,
  SolarisAvatarSize,
} from '../model/avatar.types';

const SOLARIS_AVATAR_GROUP_BADGE_DEFAULT_MAX = 3;

@Component({
  selector: 'solaris-avatar-group-badge',
  standalone: true,
  imports: [NgTemplateOutlet, SolarisAvatarComponent, SolarisTooltipDirective],
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
export class SolarisAvatarGroupBadgeComponent
  implements AfterViewInit, AfterViewChecked, OnDestroy
{
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
  readonly memberClick = output<SolarisAvatarGroupMemberEvent>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

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

  protected readonly hasInteractiveMembers = computed(() =>
    this.visibleUsers().some(
      (user) =>
        user.actionAriaLabel !== undefined ||
        user.actionAriaLabelKey !== undefined,
    ),
  );

  protected readonly membersInteractive = computed(
    () => !this.isInteractive() && this.hasInteractiveMembers(),
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

  protected onMemberClick(user: SolarisAvatarGroupUser, index: number): void {
    this.memberClick.emit({ user, index });
  }

  private readonly labelOverflow = signal<string | undefined>(undefined);

  protected readonly labelTooltip = computed(() => this.labelOverflow());

  private resizeObserver: ResizeObserver | null = null;
  private contentObserver: MutationObserver | null = null;

  ngAfterViewInit(): void {
    this.syncRovingTabindex();
    if (!isPlatformBrowser(this.platformId)) return;
    this.measureOverflow();
    this.setupOverflowObservers();
  }

  ngAfterViewChecked(): void {
    this.syncRovingTabindex();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
  }

  @HostListener('focusin', ['$event'])
  protected onBadgeFocusIn(event: FocusEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = event.target as HTMLElement | null;
    const items = this.focusableElements();
    if (target && items.includes(target)) {
      for (const el of items) {
        el.tabIndex = el === target ? 0 : -1;
      }
    }
  }

  @HostListener('keydown', ['$event'])
  protected onBadgeKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (
      key !== 'ArrowRight' &&
      key !== 'ArrowLeft' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return;
    }
    const items = this.focusableElements();
    const target = event.target as HTMLElement | null;
    const currentIndex = target ? items.indexOf(target) : -1;
    if (currentIndex < 0) return;
    event.preventDefault();
    let nextIndex: number;
    if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = items.length - 1;
    } else {
      const direction = key === 'ArrowRight' ? 1 : -1;
      const step = this.isRtl() ? -direction : direction;
      nextIndex = (currentIndex + step + items.length) % items.length;
    }
    const next = items[nextIndex];
    if (!next) return;
    for (const el of items) {
      el.tabIndex = el === next ? 0 : -1;
    }
    next.focus();
  }

  private focusableElements(): HTMLElement[] {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    return Array.from(
      nativeEl.querySelectorAll<HTMLElement>('button.solaris-avatar__action'),
    ).filter((el) => !el.hasAttribute('disabled'));
  }

  private syncRovingTabindex(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const items = this.focusableElements();
    if (items.length === 0) return;
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    const active = nativeEl.ownerDocument.activeElement as HTMLElement | null;
    const activeIndex = active ? items.indexOf(active) : -1;
    const rovingIndex = activeIndex >= 0 ? activeIndex : 0;
    items.forEach((el, index) => {
      el.tabIndex = index === rovingIndex ? 0 : -1;
    });
  }

  private isRtl(): boolean {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    return (
      nativeEl.closest('[dir]')?.getAttribute('dir')?.toLowerCase() === 'rtl' ||
      nativeEl.ownerDocument.dir.toLowerCase() === 'rtl'
    );
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
    const target = nativeEl.querySelector(
      '.solaris-avatar-group-badge__label',
    ) as HTMLElement | null;
    if (!target) {
      this.labelOverflow.set(undefined);
      return;
    }
    const isOverflowing = target.scrollWidth > target.clientWidth + 1;
    this.labelOverflow.set(
      isOverflowing ? target.textContent?.trim() || undefined : undefined,
    );
  }
}
