// SECURITY_EXCEPTION_FILE: ElementRef.nativeElement is the standard Angular API to read the host element for scroll-parent lookup (parentElement traversal) and passive scroll listener for scrolled state. SSR-safe via isPlatformBrowser guard with DestroyRef cleanup. No alternative exists.
import {
  Component,
  input,
  booleanAttribute,
  ChangeDetectionStrategy,
  ElementRef,
  DestroyRef,
  signal,
  computed,
  AfterViewInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import type {
  SolarisDialogActionsAlign,
  SolarisDialogDensity,
} from '../../root/model/dialog.types';

@Component({
  selector: 'solaris-dialog-footer',
  standalone: true,
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'solaris-dialog-footer',
    '[attr.data-align]': 'align()',
    '[attr.data-separator]': "separator() ? '' : null",
    '[attr.data-density]': 'density()',
    '[attr.data-scrolled]': "effectiveScrolled() ? '' : null",
  },
})
export class SolarisDialogFooterComponent implements AfterViewInit {
  private readonly hostElement =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly align = input<SolarisDialogActionsAlign>('end');
  readonly separator = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  readonly density = input<SolarisDialogDensity>();
  readonly scrolled = input<boolean>();

  protected readonly internalScrolled = signal(false);
  protected readonly effectiveScrolled = computed(
    () => this.scrolled() ?? this.internalScrolled(),
  );

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.observeScrollParent();
  }

  private observeScrollParent(): void {
    const scrollParent = findScrollParent(this.hostElement);
    if (!scrollParent) {
      return;
    }
    const update = (): void => {
      this.internalScrolled.set(hasMoreBelow(scrollParent));
    };
    update();
    scrollParent.addEventListener('scroll', update, { passive: true });
    this.destroyRef.onDestroy(() => {
      scrollParent.removeEventListener('scroll', update);
    });
  }
}

function findScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;
  while (parent) {
    const overflowY = getComputedStyle(parent).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

function hasMoreBelow(element: HTMLElement): boolean {
  return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
}
