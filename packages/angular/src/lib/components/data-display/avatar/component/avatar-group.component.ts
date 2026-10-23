import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  computed,
  inject,
  input,
  output,
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

@Component({
  selector: 'solaris-avatar-group',
  standalone: true,
  imports: [SolarisAvatarComponent, SolarisTooltipDirective],
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
export class SolarisAvatarGroupComponent
  implements AfterViewInit, AfterViewChecked
{
  readonly users = input<readonly SolarisAvatarGroupUser[]>([]);
  readonly max = input<number>(4);
  readonly size = input<SolarisAvatarSize>('md');
  readonly radius = input<SolarisAvatarRadius>('full');
  readonly overlap = input<number | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelKey = input<string | undefined>(undefined);

  readonly overflowClick = output<void>();
  readonly memberClick = output<SolarisAvatarGroupMemberEvent>();

  private readonly translateService = inject(SolarisTranslateService, {
    optional: true,
  });
  private readonly elementRef = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

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

  protected onMemberClick(user: SolarisAvatarGroupUser, index: number): void {
    this.memberClick.emit({ user, index });
  }

  ngAfterViewInit(): void {
    this.syncRovingTabindex();
  }

  ngAfterViewChecked(): void {
    this.syncRovingTabindex();
  }

  @HostListener('focusin', ['$event'])
  protected onGroupFocusIn(event: FocusEvent): void {
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
  protected onGroupKeydown(event: KeyboardEvent): void {
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
      nativeEl.querySelectorAll<HTMLElement>(
        'button.solaris-avatar__action, button.solaris-avatar-group__overflow',
      ),
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
}
